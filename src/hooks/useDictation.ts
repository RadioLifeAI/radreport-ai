import { useCallback, useEffect, useRef, useState } from 'react'
import { Editor } from '@tiptap/react'
import { processVoiceInput } from '@/services/dictation/voiceCommandProcessor'
import { processMedicalText } from '@/utils/medicalTextProcessor'
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
  const audioChunksRef = useRef<Blob[]>([])
  const anchorRef = useRef<number | null>(null)
  const interimLengthRef = useRef<number>(0)
  const bufferTextRef = useRef<string>('')
  const bufferStartTimeRef = useRef<number>(0)
  const processingRef = useRef<boolean>(false)

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
   * Send audio to Whisper Edge Function
   */
  const sendToWhisper = useCallback(async () => {
    if (!editorRef.current || !isWhisperEnabled || audioChunksRef.current.length === 0) return
    if (processingRef.current) return

    const chunks = [...audioChunksRef.current]
    const text = bufferTextRef.current
    const editor = editorRef.current

    // Reset for next batch
    audioChunksRef.current = []
    bufferTextRef.current = ''
    bufferStartTimeRef.current = Date.now()
    processingRef.current = true
    setIsTranscribing(true)

    try {
      const audioBlob = new Blob(chunks, { type: 'audio/webm;codecs=opus' })
      
      // Validate size
      const MIN_SIZE = 40000 // 5s * 8000 bytes/s
      if (audioBlob.size < MIN_SIZE) {
        console.log('⏭️ Audio too short, skipping Whisper')
        return
      }

      const base64Audio = await blobToBase64(audioBlob)
      console.log('📤 Sending to Whisper:', Math.round(audioBlob.size / 1024) + 'KB')

      const { data, error } = await supabase.functions.invoke('transcribe-audio', {
        body: { audio: base64Audio, language: 'pt' }
      })

      if (error || !data?.text) {
        setStats(prev => ({ ...prev, total: prev.total + 1, failed: prev.failed + 1 }))
        console.error('❌ Whisper error:', error)
        return
      }

      const whisperText = processMedicalText(data.text)
      
      // Simple reconciliation: only apply if different
      if (whisperText.toLowerCase() !== text.toLowerCase()) {
        const currentPos = editor.state.selection.from
        const startPos = currentPos - text.length
        
        if (startPos >= 0) {
          editor.chain()
            .deleteRange({ from: startPos, to: currentPos })
            .insertContent(whisperText + ' ')
            .run()
          
          console.log('✅ Whisper refinement applied')
        }
      }

      setStats(prev => ({ ...prev, total: prev.total + 1, success: prev.success + 1 }))
    } catch (err) {
      console.error('❌ Whisper processing error:', err)
      setStats(prev => ({ ...prev, total: prev.total + 1, failed: prev.failed + 1 }))
    } finally {
      processingRef.current = false
      setIsTranscribing(false)
    }
  }, [isWhisperEnabled])

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
          // INTERIM: preview
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
          // FINAL: process and insert
          if (anchorRef.current !== null && interimLengthRef.current > 0) {
            editorRef.current.view.dispatch(
              editorRef.current.state.tr.delete(
                anchorRef.current,
                anchorRef.current + interimLengthRef.current
              )
            )
          }

          processVoiceInput(transcript, editorRef.current)
          
          // Acumular texto processado no buffer para o Whisper
          const processedText = editorRef.current.state.doc.textBetween(
            anchorRef.current || 0,
            editorRef.current.state.selection.from,
            ' ',
            ' '
          )
          bufferTextRef.current = processedText

          // Reset anchor
          anchorRef.current = null
          interimLengthRef.current = 0

          // Send to Whisper after 10 seconds
          const elapsed = Date.now() - bufferStartTimeRef.current
          if (isWhisperEnabled && elapsed >= 10000) {
            sendToWhisper()
          }
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

      // Start MediaRecorder for Whisper
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
        
        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            audioChunksRef.current.push(e.data)
          }
        }

        mediaRecorder.start(500)
        mediaRecorderRef.current = mediaRecorder
        bufferStartTimeRef.current = Date.now()
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
  }, [isWhisperEnabled, checkQuota, isActive, sendToWhisper])

  /**
   * Stop dictation
   */
  const stopDictation = useCallback(async (): Promise<void> => {
    console.log('🛑 Stopping dictation')

    // Stop recognition
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }

    // Stop MediaRecorder and send final chunk
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
      
      // Wait for final chunk
      await new Promise<void>((resolve) => {
        const mr = mediaRecorderRef.current
        if (!mr) {
          resolve()
          return
        }
        mr.onstop = () => {
          if (isWhisperEnabled && audioChunksRef.current.length > 0) {
            sendToWhisper()
          }
          resolve()
        }
      })
      
      mediaRecorderRef.current = null
    }

    // Stop stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }

    // Reset states
    setIsActive(false)
    setStatus('idle')
    anchorRef.current = null
    interimLengthRef.current = 0
    bufferTextRef.current = ''

    console.log('🛑 Stopped')
  }, [isWhisperEnabled, sendToWhisper])

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
