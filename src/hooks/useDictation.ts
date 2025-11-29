import { useCallback, useEffect, useRef, useState } from 'react'
import { Editor } from '@tiptap/react'
import { processVoiceInput } from '@/services/dictation/voiceCommandProcessor'
import { blobToBase64, convertNewlinesToHTML } from '@/utils/textFormatter'
import { useWhisperCredits } from './useWhisperCredits'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'

// Lista de comandos que devem silenciar a gravação (com variações naturais)
const AUDIO_MUTE_COMMANDS = [
  // Estruturais - variações
  'nova linha', 'próxima linha', 'linha', 'quebra de linha', 'linha nova',
  'novo parágrafo', 'próximo parágrafo', 'parágrafo', 'quebra de parágrafo',
  // Pontuação
  'ponto de interrogação', 'ponto de exclamação', 'ponto e vírgula',
  'ponto parágrafo', 'ponto final', 'dois pontos', 'vírgula', 'ponto',
  'reticências', 'abre parênteses', 'fecha parênteses', 'hífen', 'travessão',
  // Edição
  'apagar isso', 'apague isso', 'desfazer', 'desfaz', 'refazer',
]

/**
 * Detecta se transcript contém comando de voz
 */
function containsVoiceCommand(text: string): boolean {
  const lower = text.toLowerCase().trim()
  return AUDIO_MUTE_COMMANDS.some(cmd => lower.includes(cmd))
}

interface UseDictationReturn {
  isActive: boolean
  status: 'idle' | 'waiting' | 'listening'
  startDictation: () => Promise<MediaStream | null>
  stopDictation: () => Promise<void>
  isWhisperEnabled: boolean
  toggleWhisper: () => void
  isTranscribing: boolean
  whisperStats: { total: number; success: number; failed: number }
  isAICorrectorEnabled: boolean
  toggleAICorrector: () => void
}

export function useDictation(editor: Editor | null): UseDictationReturn {
  const [isActive, setIsActive] = useState(false)
  const [status, setStatus] = useState<'idle' | 'waiting' | 'listening'>('idle')
  const [isWhisperEnabled, setIsWhisperEnabled] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [stats, setStats] = useState({ total: 0, success: 0, failed: 0 })
  const [isAICorrectorEnabled, setIsAICorrectorEnabled] = useState(false)

  const { balance, hasEnoughCredits, checkQuota } = useWhisperCredits()

  // Refs
  const editorRef = useRef<Editor | null>(null)
  const recognitionRef = useRef<InstanceType<typeof window.SpeechRecognition | typeof window.webkitSpeechRecognition> | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const audioTrackRef = useRef<MediaStreamTrack | null>(null)
  const anchorRef = useRef<number | null>(null)
  const interimLengthRef = useRef<number>(0)
  const dictationStartRef = useRef<number | null>(null)
  const rawTranscriptRef = useRef<string>('')  // ← RAW transcript para Corretor AI

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
        const confidence = result[0].confidence
        const isFinal = result.isFinal

        // DETECÇÃO ANTECIPADA - funciona em interim E final
        const hasCommand = containsVoiceCommand(transcript)
        
        // Silenciar/reativar baseado em detecção de comando (antecipado)
        if (audioTrackRef.current) {
          if (hasCommand && audioTrackRef.current.enabled) {
            audioTrackRef.current.enabled = false
            console.log('🔇 Audio muted (command pattern detected)', transcript)
          } else if (!hasCommand && !audioTrackRef.current.enabled) {
            audioTrackRef.current.enabled = true
            console.log('🔊 Audio unmuted (no command)')
          }
        }

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

          // Acumular RAW transcript para Corretor AI (ANTES de processVoiceInput)
          rawTranscriptRef.current += (rawTranscriptRef.current ? ' ' : '') + transcript

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
      
      // Reset RAW transcript
      rawTranscriptRef.current = ''

      // Start MediaRecorder para Whisper (SEM timeslice)
      if (isWhisperEnabled) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        streamRef.current = stream

        // Salvar audioTrack para controle de silenciamento
        const audioTrack = stream.getAudioTracks()[0]
        if (audioTrack) {
          audioTrackRef.current = audioTrack
        }

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

    // 2. Parar MediaRecorder e obter blob ÚNICO (Whisper)
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      await new Promise<void>((resolve) => {
        const mr = mediaRecorderRef.current!
        
        mr.ondataavailable = async (e) => {
          if (e.data.size > 0 && isWhisperEnabled && editorRef.current) {
            console.log('📦 Audio blob:', Math.round(e.data.size / 1024), 'KB')
            
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

    // 3. Aplicar Corretor AI (se ativo e não estiver usando Whisper)
    if (isAICorrectorEnabled && !isWhisperEnabled && editorRef.current && dictationStartRef.current !== null) {
      const startPos = dictationStartRef.current
      const endPos = editorRef.current.state.selection.from
      
      // Usar RAW transcript (texto ANTES de processVoiceInput) ← CRÍTICO
      const rawText = rawTranscriptRef.current.trim()
      
      if (rawText.length > 10) {
        console.log('🪄 Enviando RAW text para Corretor AI:', rawText.substring(0, 100))
        setIsTranscribing(true)
        
        try {
          const { data, error } = await supabase.functions.invoke('ai-dictation-polish', {
            body: { text: rawText }
          })
          
          if (!error && data?.corrected) {
            // Converter \n para HTML estruturado ← NOVO
            const htmlContent = convertNewlinesToHTML(data.corrected)
            
            // Substituir texto pelo corrigido com HTML
            editorRef.current.chain()
              .deleteRange({ from: startPos, to: endPos })
              .insertContent(htmlContent)
              .run()
            
            console.log('✅ Corretor AI aplicado com HTML:', htmlContent.substring(0, 80) + '...')
            toast.success('Texto corrigido com IA')
          } else if (error) {
            console.error('❌ Erro no Corretor AI:', error)
            toast.error('Erro ao corrigir texto')
          }
        } catch (err) {
          console.error('❌ Erro ao processar Corretor AI:', err)
          toast.error('Erro ao corrigir texto')
        } finally {
          setIsTranscribing(false)
        }
      }
    }

    // 4. Parar stream de áudio
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }

    // 5. Reset estados
    audioTrackRef.current = null
    setIsActive(false)
    setStatus('idle')
    anchorRef.current = null
    interimLengthRef.current = 0
    dictationStartRef.current = null
    rawTranscriptRef.current = ''  // ← Resetar RAW

    console.log('🛑 Dictation stopped')
  }, [isWhisperEnabled, isAICorrectorEnabled])

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

  /**
   * Toggle AI Corrector
   */
  const toggleAICorrector = useCallback(() => {
    if (!isAICorrectorEnabled) {
      setIsAICorrectorEnabled(true)
      toast.success('Corretor AI ativado')
    } else {
      setIsAICorrectorEnabled(false)
      toast.info('Corretor AI desativado')
    }
  }, [isAICorrectorEnabled])

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
    isAICorrectorEnabled,
    toggleAICorrector,
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
