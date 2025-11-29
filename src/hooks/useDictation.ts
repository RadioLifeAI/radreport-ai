import { useCallback, useEffect, useRef, useState } from 'react'
import { Editor } from '@tiptap/react'
import { processVoiceInput } from '@/services/dictation/voiceCommandProcessor'
import { blobToBase64 } from '@/utils/textFormatter'
import { useWhisperCredits } from './useWhisperCredits'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'

interface UseDictationReturn {
  isActive: boolean
  status: 'idle' | 'waiting' | 'listening'
  startDictation: () => Promise<MediaStream | null>
  stopDictation: () => Promise<void>
  isWhisperEnabled: boolean
  toggleWhisper: () => void
  isTranscribing: boolean
  whisperStats: { total: number; success: number; failed: number }
}

export function useDictation(editor: Editor | null): UseDictationReturn {
  const [isActive, setIsActive] = useState(false)
  const [status, setStatus] = useState<'idle' | 'waiting' | 'listening'>('idle')
  const [isWhisperEnabled, setIsWhisperEnabled] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [stats, setStats] = useState({ total: 0, success: 0, failed: 0 })

  const { balance, hasEnoughCredits, checkQuota } = useWhisperCredits()

  // Refs
  const editorRef = useRef<Editor | null>(null)
  const recognitionRef = useRef<InstanceType<typeof window.SpeechRecognition | typeof window.webkitSpeechRecognition> | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const anchorRef = useRef<number | null>(null)
  const interimLengthRef = useRef<number>(0)
  const dictationStartRef = useRef<number | null>(null)

  // Sync editor ref
  useEffect(() => {
    editorRef.current = editor
  }, [editor])

  // Auto-disable Whisper when credits run out
  useEffect(() => {
    if (isWhisperEnabled && !hasEnoughCredits) {
      setIsWhisperEnabled(false)
      toast.info('Whisper AI desativado - sem créditos disponíveis')
    }
  }, [hasEnoughCredits, isWhisperEnabled])

  /**
   * Start dictation
   */
  const startDictation = useCallback(async (): Promise<MediaStream | null> => {
    if (!editorRef.current) return null

    try {
      setStatus('waiting')

      // Check credits for Whisper
      if (isWhisperEnabled && !checkQuota(1)) {
        setIsWhisperEnabled(false)
        toast.warning('Créditos insuficientes. Usando transcrição básica.')
      }

      // Initialize SpeechRecognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (!SpeechRecognition) {
        throw new Error('SpeechRecognition não suportado')
      }

      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'pt-BR'

      recognition.onresult = (event) => {
        if (!editorRef.current) return

        const result = event.results[event.results.length - 1]
        const transcript = result[0].transcript
        const isFinal = result.isFinal

        if (!isFinal) {
          // INTERIM: preview em tempo real
          if (anchorRef.current === null) {
            anchorRef.current = editorRef.current.state.selection.from
          }

          const anchor = anchorRef.current
          const prevLength = interimLengthRef.current

          if (prevLength > 0) {
            editorRef.current.view.dispatch(
              editorRef.current.state.tr.delete(anchor, anchor + prevLength)
            )
          }

          editorRef.current.view.dispatch(
            editorRef.current.state.tr.insertText(transcript, anchor)
          )

          interimLengthRef.current = transcript.length
        } else {
          // FINAL: processar e inserir
          if (anchorRef.current !== null && interimLengthRef.current > 0) {
            editorRef.current.view.dispatch(
              editorRef.current.state.tr.delete(
                anchorRef.current,
                anchorRef.current + interimLengthRef.current
              )
            )
          }

          processVoiceInput(transcript, editorRef.current)

          // Reset anchor
          anchorRef.current = null
          interimLengthRef.current = 0
        }
      }

      recognition.onerror = (event) => {
        console.error('❌ Recognition error:', event.error)
        if (event.error === 'no-speech') {
          recognition.stop()
          recognition.start()
        }
      }

      recognition.onend = () => {
        if (isActive) {
          recognition.start()
        }
      }

      recognition.start()
      recognitionRef.current = recognition

      // Salvar posição inicial do ditado
      dictationStartRef.current = editorRef.current.state.selection.from

      // Start MediaRecorder para Whisper (SEM timeslice)
      if (isWhisperEnabled) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        streamRef.current = stream

        const mimeTypes = [
          'audio/webm;codecs=opus',
          'audio/webm',
          'audio/ogg;codecs=opus'
        ]
        const mimeType = mimeTypes.find(type => MediaRecorder.isTypeSupported(type))
        
        if (!mimeType) throw new Error('No supported audio format')

        const mediaRecorder = new MediaRecorder(stream, { mimeType })
        
        // ondataavailable será configurado em stopDictation
        mediaRecorder.start()  // ← SEM timeslice = blob ÚNICO ao parar
        mediaRecorderRef.current = mediaRecorder
      }

      setIsActive(true)
      setStatus('listening')
      console.log('🎙️ Dictation started')

      return streamRef.current
    } catch (error) {
      console.error('❌ Failed to start:', error)
      toast.error('Erro ao iniciar ditado')
      setStatus('idle')
      return null
    }
  }, [isWhisperEnabled, checkQuota, isActive])

  /**
   * Stop dictation
   */
  const stopDictation = useCallback(async (): Promise<void> => {
    console.log('🛑 Stopping dictation')

    // 1. Parar Web Speech (preview descartável)
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }

    // 2. Parar MediaRecorder e obter blob ÚNICO
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      await new Promise<void>((resolve) => {
        const mr = mediaRecorderRef.current!
        
        mr.ondataavailable = async (e) => {
          if (e.data.size > 0 && isWhisperEnabled && editorRef.current) {
            console.log('📦 Audio blob:', Math.round(e.data.size / 1024), 'KB')
            
            // Validar tamanho mínimo (5s * 8KB/s = 40KB)
            if (e.data.size < 40000) {
              console.log('⏭️ Audio too short, keeping WebSpeech text')
              resolve()
              return
            }
            
            // Enviar para Whisper
            setIsTranscribing(true)
            try {
              const base64 = await blobToBase64(e.data)
              
              const { data, error } = await supabase.functions.invoke('transcribe-audio', {
                body: { audio: base64, language: 'pt' }
              })
              
              if (!error && data?.text && dictationStartRef.current !== null) {
                // SUBSTITUIR texto do WebSpeech pelo texto do Whisper
                const startPos = dictationStartRef.current
                const endPos = editorRef.current!.state.selection.from
                
                editorRef.current!.chain()
                  .deleteRange({ from: startPos, to: endPos })
                  .insertContent(data.text)  // ← Texto do Whisper DIRETO (já formatado)
                  .run()
                
                console.log('✅ Whisper text applied:', data.text.substring(0, 80) + '...')
                setStats(prev => ({ ...prev, total: prev.total + 1, success: prev.success + 1 }))
              } else if (error) {
                console.error('❌ Whisper error:', error)
                setStats(prev => ({ ...prev, total: prev.total + 1, failed: prev.failed + 1 }))
              }
            } catch (err) {
              console.error('❌ Whisper processing error:', err)
              setStats(prev => ({ ...prev, total: prev.total + 1, failed: prev.failed + 1 }))
            } finally {
              setIsTranscribing(false)
            }
          }
          resolve()
        }
        
        mr.stop()
      })
      
      mediaRecorderRef.current = null
    }

    // 3. Parar stream de áudio
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }

    // 4. Reset estados
    setIsActive(false)
    setStatus('idle')
    anchorRef.current = null
    interimLengthRef.current = 0
    dictationStartRef.current = null

    console.log('🛑 Dictation stopped')
  }, [isWhisperEnabled])

  /**
   * Toggle Whisper
   */
  const toggleWhisper = useCallback(() => {
    if (!isWhisperEnabled) {
      if (!checkQuota(1)) {
        toast.warning('Créditos insuficientes')
        return
      }
      setIsWhisperEnabled(true)
      toast.success('Whisper AI ativado')
    } else {
      setIsWhisperEnabled(false)
      toast.info('Whisper AI desativado')
    }
  }, [isWhisperEnabled, checkQuota])

  // Privacy: stop on tab hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isActive) {
        stopDictation()
        toast.info('Ditado pausado (aba oculta)')
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [isActive, stopDictation])

  return {
    isActive,
    status,
    startDictation,
    stopDictation,
    isWhisperEnabled,
    toggleWhisper,
    isTranscribing,
    whisperStats: stats,
  }
}

// Global type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: {
      new(): {
        continuous: boolean
        interimResults: boolean
        lang: string
        start(): void
        stop(): void
        abort(): void
        onaudiostart: ((ev: Event) => any) | null
        onaudioend: ((ev: Event) => any) | null
        onend: ((ev: Event) => any) | null
        onerror: ((ev: any) => any) | null
        onnomatch: ((ev: any) => any) | null
        onresult: ((ev: any) => any) | null
        onsoundstart: ((ev: Event) => any) | null
        onsoundend: ((ev: Event) => any) | null
        onspeechstart: ((ev: Event) => any) | null
        onspeechend: ((ev: Event) => any) | null
        onstart: ((ev: Event) => any) | null
      }
    }
    webkitSpeechRecognition: {
      new(): {
        continuous: boolean
        interimResults: boolean
        lang: string
        start(): void
        stop(): void
        abort(): void
        onaudiostart: ((ev: Event) => any) | null
        onaudioend: ((ev: Event) => any) | null
        onend: ((ev: Event) => any) | null
        onerror: ((ev: any) => any) | null
        onnomatch: ((ev: any) => any) | null
        onresult: ((ev: any) => any) | null
        onsoundstart: ((ev: Event) => any) | null
        onsoundend: ((ev: Event) => any) | null
        onspeechstart: ((ev: Event) => any) | null
        onspeechend: ((ev: Event) => any) | null
        onstart: ((ev: Event) => any) | null
      }
    }
  }
}
