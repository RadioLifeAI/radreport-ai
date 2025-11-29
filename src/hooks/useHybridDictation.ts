import { useState, useEffect, useCallback, useRef } from 'react'
import { Editor } from '@tiptap/react'
import { useDictation } from './useDictation'
import { supabase } from '@/integrations/supabase/client'
import { processMedicalText } from '@/utils/medicalTextProcessor'
import { toast } from 'sonner'

export interface UseHybridDictationReturn {
  // Passthrough do useDictation original
  isActive: boolean
  status: 'idle' | 'waiting' | 'listening'
  startDictation: () => Promise<MediaStream | null>
  stopDictation: () => void
  
  // Novos do sistema híbrido Whisper
  isWhisperEnabled: boolean
  toggleWhisper: () => void
  isTranscribing: boolean
  whisperStats: {
    total: number
    success: number
    failed: number
  }
}

/**
 * Hook orquestrador do sistema híbrido de ditado médico
 * 
 * Camada 1: Web Speech API → useDictation → preview em tempo real no TipTap
 * Camada 2: MediaRecorder → áudio paralelo → Whisper no silêncio → substituição de alta precisão
 */
export function useHybridDictation(editor: Editor | null): UseHybridDictationReturn {
  // 🎤 Camada 1: Ditado em tempo real (Web Speech API)
  const dictation = useDictation(editor)

  // 🎙️ Camada 2: Gravação de áudio para Whisper
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  
  // Estado Whisper
  const [isWhisperEnabled, setIsWhisperEnabled] = useState(true)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [whisperStats, setWhisperStats] = useState({
    total: 0,
    success: 0,
    failed: 0,
  })

  // Refs para posicionamento e debounce
  const editorRef = useRef<Editor | null>(null)
  const lastStatusRef = useRef<'idle' | 'waiting' | 'listening'>('idle')
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Sincronizar ref do editor
  useEffect(() => {
    editorRef.current = editor
  }, [editor])

  /**
   * Converte Blob de áudio para base64
   */
  const blobToBase64 = useCallback((blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        // Remove o prefixo "data:audio/webm;base64,"
        const base64Data = base64.split(',')[1]
        resolve(base64Data)
      }
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }, [])

  /**
   * Inicia gravação de áudio paralela usando stream do Web Speech
   */
  const startAudioRecording = useCallback(async (stream: MediaStream) => {
    if (!isWhisperEnabled) return

    try {
      // Validar MimeType suportado
      const SUPPORTED_MIMETYPES = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/ogg;codecs=opus',
        'audio/mp4'
      ]

      const mimeType = SUPPORTED_MIMETYPES.find(type => 
        MediaRecorder.isTypeSupported(type)
      )

      if (!mimeType) {
        throw new Error('Nenhum formato de áudio suportado')
      }

      const mediaRecorder = new MediaRecorder(stream, { mimeType })
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.start(100) // Capturar a cada 100ms
      mediaRecorderRef.current = mediaRecorder

      console.log('🎙️ Audio recording started for Whisper with', mimeType)
    } catch (error) {
      console.error('❌ Failed to start audio recording:', error)
      toast.error('Erro ao iniciar gravação de áudio')
    }
  }, [isWhisperEnabled])

  /**
   * Para gravação de áudio
   */
  const stopAudioRecording = useCallback(() => {
    // Limpar timer de debounce se existir
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current)
      silenceTimerRef.current = null
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current = null
      console.log('🎙️ Audio recording stopped')
    }
  }, [])

  /**
   * Envia áudio para Whisper e substitui preview Web Speech
   */
  const sendToWhisper = useCallback(async () => {
    const currentEditor = editorRef.current
    if (!currentEditor || audioChunksRef.current.length === 0 || isTranscribing) {
      return
    }

    // Validar tamanho do áudio
    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
    
    // Não enviar se áudio muito curto (< 0.5s = ~50KB)
    const MIN_AUDIO_SIZE = 50 * 1024 // 50KB
    if (audioBlob.size < MIN_AUDIO_SIZE) {
      console.log('⚠️ Audio too short, skipping Whisper')
      audioChunksRef.current = []
      return
    }
    
    // Não enviar se áudio muito longo (max 25MB)
    const MAX_AUDIO_SIZE = 25 * 1024 * 1024 // 25MB
    if (audioBlob.size > MAX_AUDIO_SIZE) {
      console.warn('⚠️ Audio too large:', Math.round(audioBlob.size / 1024 / 1024), 'MB')
      toast.error('Áudio muito longo. Pause e continue ditando.')
      audioChunksRef.current = []
      return
    }

    setIsTranscribing(true)
    setWhisperStats(prev => ({ ...prev, total: prev.total + 1 }))

    // USAR âncora do useDictation em vez de refs próprios
    const anchorInfo = dictation.getAnchorInfo()
    const anchor = anchorInfo.anchor
    const previewLength = anchorInfo.interimLength

    try {
      const base64Audio = await blobToBase64(audioBlob)
      console.log('🎤 Sending audio to Whisper (', Math.round(audioBlob.size / 1024), 'KB )')

      const { data, error } = await supabase.functions.invoke('transcribe-audio', {
        body: { 
          audio: base64Audio,
          language: 'pt'
        }
      })

      if (error) throw error

      if (data?.text) {
        const processedText = processMedicalText(data.text)
        console.log('✅ Whisper transcription:', processedText.substring(0, 50) + '...')

        // Substituição inteligente: deletar preview Web Speech e inserir texto Whisper
        if (anchor !== null && previewLength > 0) {
          currentEditor
            .chain()
            .focus()
            .deleteRange({ from: anchor, to: anchor + previewLength })
            .insertContentAt(anchor, ' ' + processedText)
            .run()
          
          console.log('🔄 Replaced Web Speech preview with Whisper text')
        } else {
          // Fallback: inserir no cursor atual
          currentEditor
            .chain()
            .focus()
            .insertContent(' ' + processedText)
            .run()
        }

        setWhisperStats(prev => ({ ...prev, success: prev.success + 1 }))
      }

      audioChunksRef.current = []

    } catch (error) {
      console.error('❌ Whisper transcription error:', error)
      setWhisperStats(prev => ({ ...prev, failed: prev.failed + 1 }))
      toast.error('Erro na transcrição Whisper')
    } finally {
      setIsTranscribing(false)
    }
  }, [blobToBase64, isTranscribing])

  /**
   * Detectar silêncio com debounce de 1.5s
   */
  useEffect(() => {
    if (!isWhisperEnabled || !dictation.isActive) return

    const currentStatus = dictation.status
    const lastStatus = lastStatusRef.current

    // Transição para silêncio: iniciar timer de debounce
    if (lastStatus === 'listening' && currentStatus === 'waiting') {
      console.log('🔇 Silence detected - starting 2.0s debounce timer')
      
      silenceTimerRef.current = setTimeout(() => {
        console.log('⏰ Debounce complete - sending to Whisper')
        sendToWhisper()
      }, 2000)
    } 
    // Voltou a falar: cancelar timer
    else if (currentStatus === 'listening' && silenceTimerRef.current) {
      console.log('🎤 Speech resumed - cancelling debounce timer')
      clearTimeout(silenceTimerRef.current)
      silenceTimerRef.current = null
    }

    lastStatusRef.current = currentStatus
  }, [dictation.status, dictation.isActive, isWhisperEnabled, sendToWhisper])

  /**
   * Wrapper para iniciar ditado com Whisper
   */
  const startHybridDictation = useCallback(async () => {
    const stream = await dictation.startDictation()
    
    if (stream && isWhisperEnabled) {
      // Reutilizar MediaStream do Web Speech para MediaRecorder
      await startAudioRecording(stream)
    }
    
    return stream
  }, [dictation, isWhisperEnabled, startAudioRecording])

  /**
   * Parar ditado e enviar áudio final
   */
  const stopHybridDictation = useCallback(() => {
    dictation.stopDictation()
    stopAudioRecording()
    
    // Se tem áudio acumulado, enviar para Whisper
    if (audioChunksRef.current.length > 0) {
      sendToWhisper()
    }
  }, [dictation, stopAudioRecording, sendToWhisper])

  /**
   * Cleanup ao desmontar
   */
  useEffect(() => {
    return () => {
      stopAudioRecording()
    }
  }, [stopAudioRecording])

  /**
   * Toggle de Whisper
   */
  const toggleWhisper = useCallback(() => {
    setIsWhisperEnabled(prev => {
      const newState = !prev
      toast.info(newState ? 'Whisper ativado' : 'Whisper desativado')
      return newState
    })
  }, [])

  return {
    // Métodos modificados para híbrido
    isActive: dictation.isActive,
    status: dictation.status,
    startDictation: startHybridDictation,
    stopDictation: stopHybridDictation,
    
    // Novos do sistema híbrido Whisper
    isWhisperEnabled,
    toggleWhisper,
    isTranscribing,
    whisperStats,
  }
}
