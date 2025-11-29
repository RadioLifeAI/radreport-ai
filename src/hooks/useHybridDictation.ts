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
  const mediaStreamRef = useRef<MediaStream | null>(null)
  
  // Estado Whisper
  const [isWhisperEnabled, setIsWhisperEnabled] = useState(true)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [whisperStats, setWhisperStats] = useState({
    total: 0,
    success: 0,
    failed: 0,
  })

  // Refs para posicionamento
  const whisperAnchorRef = useRef<number | null>(null)
  const previewLengthRef = useRef<number>(0)
  const editorRef = useRef<Editor | null>(null)
  const lastStatusRef = useRef<'idle' | 'waiting' | 'listening'>('idle')

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
   * Inicia gravação de áudio paralela
   */
  const startAudioRecording = useCallback(async () => {
    if (!isWhisperEnabled) return

    try {
      // Usar o mesmo MediaStream do Web Speech se disponível
      let stream = mediaStreamRef.current
      
      if (!stream) {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        mediaStreamRef.current = stream
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })

      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.start(100) // Capturar a cada 100ms
      mediaRecorderRef.current = mediaRecorder

      console.log('🎙️ Audio recording started for Whisper')
    } catch (error) {
      console.error('❌ Failed to start audio recording:', error)
      toast.error('Erro ao iniciar gravação de áudio')
    }
  }, [isWhisperEnabled])

  /**
   * Para gravação de áudio
   */
  const stopAudioRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current = null
      console.log('🎙️ Audio recording stopped')
    }

    // Não parar o MediaStream aqui, pois pode ser usado pelo Web Speech
  }, [])

  /**
   * Envia áudio para Whisper e substitui preview
   */
  const sendToWhisper = useCallback(async () => {
    const currentEditor = editorRef.current
    if (!currentEditor || audioChunksRef.current.length === 0 || isTranscribing) {
      return
    }

    setIsTranscribing(true)
    setWhisperStats(prev => ({ ...prev, total: prev.total + 1 }))

    try {
      // Criar blob do áudio acumulado
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
      const base64Audio = await blobToBase64(audioBlob)

      console.log('🎤 Sending audio to Whisper (', Math.round(audioBlob.size / 1024), 'KB )')

      // Enviar para Whisper
      const { data, error } = await supabase.functions.invoke('transcribe-audio', {
        body: { 
          audio: base64Audio,
          language: 'pt'
        }
      })

      if (error) {
        throw error
      }

      if (data?.text) {
        // Aplicar correções médicas locais
        const processedText = processMedicalText(data.text)

        console.log('✅ Whisper transcription:', processedText.substring(0, 50) + '...')

        // Substituir preview Web Speech pelo texto Whisper (mais preciso)
        // TODO: Implementar lógica de substituição inteligente
        // Por enquanto, apenas adicionar ao final
        currentEditor
          .chain()
          .focus()
          .insertContent(' ' + processedText)
          .run()

        setWhisperStats(prev => ({ ...prev, success: prev.success + 1 }))
      }

      // Limpar buffer de áudio
      audioChunksRef.current = []

    } catch (error) {
      console.error('❌ Whisper transcription error:', error)
      setWhisperStats(prev => ({ ...prev, failed: prev.failed + 1 }))
    } finally {
      setIsTranscribing(false)
    }
  }, [blobToBase64, isTranscribing])

  /**
   * Detectar silêncio (status muda de 'listening' → 'waiting')
   */
  useEffect(() => {
    if (!isWhisperEnabled || !dictation.isActive) return

    const currentStatus = dictation.status
    const lastStatus = lastStatusRef.current

    // Detectar transição para silêncio
    if (lastStatus === 'listening' && currentStatus === 'waiting') {
      console.log('🔇 Silence detected - sending to Whisper')
      sendToWhisper()
    }

    lastStatusRef.current = currentStatus
  }, [dictation.status, dictation.isActive, isWhisperEnabled, sendToWhisper])

  /**
   * Iniciar/parar gravação de áudio quando ditado inicia/para
   */
  useEffect(() => {
    if (dictation.isActive && isWhisperEnabled) {
      startAudioRecording()
    } else {
      stopAudioRecording()
      
      // Se parou e ainda tem áudio, enviar para Whisper
      if (audioChunksRef.current.length > 0) {
        sendToWhisper()
      }
    }

    // Cleanup ao desmontar
    return () => {
      stopAudioRecording()
    }
  }, [dictation.isActive, isWhisperEnabled, startAudioRecording, stopAudioRecording, sendToWhisper])

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
    // Passthrough completo do useDictation (Web Speech preview)
    ...dictation,
    
    // Novos do sistema híbrido Whisper
    isWhisperEnabled,
    toggleWhisper,
    isTranscribing,
    whisperStats,
  }
}
