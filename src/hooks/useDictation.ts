import { useCallback, useEffect, useRef, useState } from 'react'
import { Editor } from '@tiptap/react'
import { processVoiceInput } from '@/services/dictation/voiceCommandProcessor'
import { blobToBase64, convertNewlinesToHTML } from '@/utils/textFormatter'
import { useWhisperCredits } from './useWhisperCredits'
import { useAICredits } from './useAICredits'
import { invokeEdgeFunction } from '@/services/edgeFunctionClient'
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

interface UseDictationOptions {
  remoteStream?: MediaStream | null;
}

interface RemoteTranscriptData {
  text: string;
  isFinal: boolean;
  confidence?: number;
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
  setRemoteStream: (stream: MediaStream | null) => void
  processRemoteTranscript: (data: RemoteTranscriptData) => void
  isRemoteDictationActive: boolean
  setRemoteDictationActive: (active: boolean) => void
  handleRemoteStop: () => Promise<void>
  handleRemoteDisconnect: () => void
}

// Constantes para controle de reinício
const MAX_RESTARTS = 15  // Máximo de reinícios em sequência sem fala
const MAX_DICTATION_TIME_MS = 5 * 60 * 1000  // 5 minutos

export function useDictation(editor: Editor | null, options?: UseDictationOptions): UseDictationReturn {
  const [isActive, setIsActive] = useState(false)
  const [status, setStatus] = useState<'idle' | 'waiting' | 'listening'>('idle')
  const [isWhisperEnabled, setIsWhisperEnabled] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [stats, setStats] = useState({ total: 0, success: 0, failed: 0 })
  const [isAICorrectorEnabled, setIsAICorrectorEnabled] = useState(false)
  const [isRemoteDictationActive, setIsRemoteDictationActive] = useState(false)

  const { balance, hasEnoughCredits, checkQuota } = useWhisperCredits()
  const { hasEnoughCredits: hasEnoughAICredits, refreshBalance: refreshAIBalance } = useAICredits()

  // Remote stream from mobile mic
  const [remoteStreamState, setRemoteStreamState] = useState<MediaStream | null>(options?.remoteStream || null)
  const remoteStreamRef = useRef<MediaStream | null>(options?.remoteStream || null)

  // Sync remote stream ref
  const setRemoteStream = useCallback((stream: MediaStream | null) => {
    remoteStreamRef.current = stream
    setRemoteStreamState(stream)
  }, [])

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
  
  // Refs para controle de reinício robusto
  const isActiveRef = useRef(false)  // ← CRÍTICO: ref para callback closures
  const restartCountRef = useRef(0)
  const dictationStartTimeRef = useRef<number | null>(null)

  // Sync editor ref
  useEffect(() => {
    editorRef.current = editor
  }, [editor])
  
  // Sync isActive ref com state (CRÍTICO para callbacks)
  useEffect(() => {
    isActiveRef.current = isActive
  }, [isActive])

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

    // Block local dictation when mobile is active
    if (isRemoteDictationActive) {
      toast.info('Ditado via celular ativo. Pare o celular para usar localmente.')
      return null
    }

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

        // Resetar contador de reinícios - usuário está falando ativamente
        restartCountRef.current = 0

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
        console.warn('⚠️ Recognition error:', event.error)
        
        switch (event.error) {
          case 'no-speech':
            // Silêncio detectado - reiniciar com contador
            restartCountRef.current++
            if (restartCountRef.current <= MAX_RESTARTS && isActiveRef.current) {
              setTimeout(() => {
                if (isActiveRef.current && recognitionRef.current) {
                  try {
                    recognitionRef.current.start()
                    console.log('🔄 Reiniciando após silêncio', restartCountRef.current + '/' + MAX_RESTARTS)
                  } catch (e) {
                    console.warn('⚠️ Falha ao reiniciar:', e)
                  }
                }
              }, 150)
            } else if (restartCountRef.current > MAX_RESTARTS) {
              console.log('⏸️ Muitas pausas consecutivas, aguardando fala...')
            }
            break
            
          case 'network':
            // Erro de rede - esperar mais antes de tentar
            toast.warning('Conexão instável. Reconectando...')
            setTimeout(() => {
              if (isActiveRef.current && recognitionRef.current) {
                try { recognitionRef.current.start() } catch (e) { /* ignore */ }
              }
            }, 1000)
            break
            
          case 'aborted':
            // Cancelado pelo usuário ou sistema - não reiniciar
            console.log('🛑 Recognition aborted')
            break
            
          case 'audio-capture':
            // Problema com microfone
            toast.error('Erro no microfone. Verifique as permissões.')
            break
            
          case 'not-allowed':
            // Permissão negada
            toast.error('Permissão de microfone negada.')
            break
            
          default:
            // Outros erros - tentar reiniciar uma vez
            setTimeout(() => {
              if (isActiveRef.current && recognitionRef.current) {
                try { recognitionRef.current.start() } catch (e) { /* ignore */ }
              }
            }, 500)
        }
      }

      recognition.onend = () => {
        console.log('🔄 Recognition ended, isActive:', isActiveRef.current)
        
        if (isActiveRef.current) {
          // Verificar limite de 5 minutos
          const elapsed = Date.now() - (dictationStartTimeRef.current || Date.now())
          if (elapsed >= MAX_DICTATION_TIME_MS) {
            toast.info('Ditado encerrado após 5 minutos. Clique para reiniciar.')
            // Chamar stopDictation via timeout para evitar recursão
            setTimeout(() => {
              if (recognitionRef.current) {
                setIsActive(false)
                setStatus('idle')
              }
            }, 0)
            return
          }
          
          // Reiniciar com delay para evitar race condition
          setTimeout(() => {
            if (isActiveRef.current && recognitionRef.current) {
              try {
                recognitionRef.current.start()
                console.log('🎙️ Recognition restarted')
              } catch (e) {
                console.warn('⚠️ Failed to restart:', e)
              }
            }
          }, 100)
        }
      }

      recognition.start()
      recognitionRef.current = recognition

      // Salvar posição inicial do ditado
      dictationStartRef.current = editorRef.current.state.selection.from
      
      // Reset RAW transcript e contadores
      rawTranscriptRef.current = ''
      restartCountRef.current = 0
      dictationStartTimeRef.current = Date.now()

      // Start MediaRecorder para Whisper (SEM timeslice)
      if (isWhisperEnabled) {
        // Use remote stream from mobile if available, otherwise get local mic
        const stream = remoteStreamRef.current || await navigator.mediaDevices.getUserMedia({ audio: true })
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
        
        console.log('🎙️ MediaRecorder started with', remoteStreamRef.current ? 'REMOTE stream' : 'LOCAL mic')
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
  }, [isWhisperEnabled, checkQuota, isRemoteDictationActive])

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
              
              const data = await invokeEdgeFunction<{ text: string; language?: string; duration?: number }>(
                'transcribe-audio',
                { audio: base64, language: 'pt' }
              )
              
              if (data?.text && dictationStartRef.current !== null) {
                // SUBSTITUIR texto do WebSpeech pelo texto do Whisper
                const startPos = dictationStartRef.current
                const endPos = editorRef.current!.state.selection.from
                const textLength = data.text.length
                
                editorRef.current!.chain()
                  .deleteRange({ from: startPos, to: endPos })
                  .insertContent(data.text)
                  .setTextSelection({ from: startPos, to: startPos + textLength })
                  .setColor('var(--highlight-whisper)')
                  .setTextSelection(startPos + textLength)
                  .run()
                
                console.log('✅ Whisper text applied with highlight:', data.text.substring(0, 80) + '...')
                setStats(prev => ({ ...prev, total: prev.total + 1, success: prev.success + 1 }))
              } else {
                console.warn('⚠️ Whisper returned empty text')
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
          // Obter user_id para logging
          const { data: { user } } = await supabase.auth.getUser()
          
          const data = await invokeEdgeFunction<{ corrected: string; fallback?: boolean; reason?: string }>(
            'ai-dictation-polish',
            { text: rawText, user_id: user?.id }
          )
          
          if (data?.corrected !== undefined) {
            // Tratar fallback (texto mantido sem alterações)
            if (data.fallback) {
              console.log('ℹ️ Usando texto original (fallback):', data.reason)
              toast.info('Texto mantido (sem alterações necessárias)')
              setIsTranscribing(false)
              return
            }
            
            // Converter \n para HTML estruturado
            const htmlContent = convertNewlinesToHTML(data.corrected)
            const textLength = data.corrected.length
            
            // Substituir texto pelo corrigido com HTML e aplicar cor
            editorRef.current.chain()
              .deleteRange({ from: startPos, to: endPos })
              .insertContent(htmlContent)
              .setTextSelection({ from: startPos, to: startPos + textLength })
              .setColor('var(--highlight-ai-corrector)')
              .setTextSelection(startPos + textLength)
              .run()
            
            console.log('✅ Corretor AI aplicado com highlight:', htmlContent.substring(0, 80) + '...')
            toast.success('Texto corrigido com IA')
          }
        } catch (err: any) {
          console.error('❌ Erro ao processar Corretor AI:', err)
          // Tratar erro 402 (créditos insuficientes)
          if (err?.message?.includes('INSUFFICIENT_CREDITS') || err?.status === 402) {
            toast.error('Créditos AI insuficientes', {
              description: 'Faça upgrade do seu plano para usar o Corretor AI.'
            })
            setIsAICorrectorEnabled(false) // Desativar automaticamente
            refreshAIBalance()
          } else {
            toast.error('Erro ao corrigir texto')
          }
        } finally {
          setIsTranscribing(false)
          refreshAIBalance() // Atualizar saldo após execução
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
    restartCountRef.current = 0
    dictationStartTimeRef.current = null

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
      // Verificar créditos AI antes de ativar
      if (!hasEnoughAICredits(1)) {
        toast.warning('Créditos AI insuficientes para Corretor', {
          description: 'Faça upgrade do seu plano para usar o Corretor AI.'
        })
        return
      }
      setIsAICorrectorEnabled(true)
      toast.success('Corretor AI ativado (1 crédito por correção)')
    } else {
      setIsAICorrectorEnabled(false)
      toast.info('Corretor AI desativado')
    }
  }, [isAICorrectorEnabled, hasEnoughAICredits])

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

  /**
   * Process remote transcript from mobile (WebSpeech via Realtime)
   */
  const processRemoteTranscript = useCallback((data: RemoteTranscriptData) => {
    if (!editorRef.current || !isRemoteDictationActive) return

    const { text: transcript, isFinal, confidence } = data

    // Inicializar âncora se necessário
    if (anchorRef.current === null) {
      anchorRef.current = editorRef.current.state.selection.from
      // Salvar posição inicial para Corretor AI
      if (dictationStartRef.current === null) {
        dictationStartRef.current = anchorRef.current
      }
    }

    if (!isFinal) {
      // INTERIM: preview em tempo real
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

      // Acumular RAW transcript para Corretor AI
      rawTranscriptRef.current += (rawTranscriptRef.current ? ' ' : '') + transcript

      // Processar comandos de voz
      processVoiceInput(transcript, editorRef.current)

      // Reset anchor
      anchorRef.current = null
      interimLengthRef.current = 0
      
      console.log('[Dictation] Remote transcript processed:', transcript.substring(0, 50))
    }
  }, [isRemoteDictationActive])

  /**
   * Handle remote stop - trigger Corretor AI if enabled, but KEEP session active
   */
  const handleRemoteStop = useCallback(async (): Promise<void> => {
    console.log('[Dictation] Remote stop received - raw transcript:', rawTranscriptRef.current.substring(0, 100))
    
    // Apply Corretor AI if enabled and we have transcript
    if (isAICorrectorEnabled && editorRef.current && dictationStartRef.current !== null) {
      const startPos = dictationStartRef.current
      const endPos = editorRef.current.state.selection.from
      const rawText = rawTranscriptRef.current.trim()
      
      if (rawText.length > 10) {
        console.log('🪄 [Remote] Aplicando Corretor AI:', rawText.substring(0, 100))
        setIsTranscribing(true)
        
        try {
          const { data: { user } } = await supabase.auth.getUser()
          
          const data = await invokeEdgeFunction<{ corrected: string; fallback?: boolean; reason?: string }>(
            'ai-dictation-polish',
            { text: rawText, user_id: user?.id }
          )
          
          if (data?.corrected !== undefined && !data.fallback) {
            const htmlContent = convertNewlinesToHTML(data.corrected)
            const textLength = data.corrected.length
            
            editorRef.current.chain()
              .deleteRange({ from: startPos, to: endPos })
              .insertContent(htmlContent)
              .setTextSelection({ from: startPos, to: startPos + textLength })
              .setColor('var(--highlight-ai-corrector)')
              .setTextSelection(startPos + textLength)
              .run()
            
            console.log('✅ [Remote] Corretor AI aplicado:', htmlContent.substring(0, 80))
            toast.success('Texto corrigido com IA')
          } else if (data?.fallback) {
            toast.info('Texto mantido (sem alterações necessárias)')
          }
        } catch (err: any) {
          console.error('❌ [Remote] Erro no Corretor AI:', err)
          if (err?.message?.includes('INSUFFICIENT_CREDITS') || err?.status === 402) {
            toast.error('Créditos AI insuficientes')
            setIsAICorrectorEnabled(false)
          } else {
            toast.error('Erro ao corrigir texto')
          }
        } finally {
          setIsTranscribing(false)
          refreshAIBalance()
        }
      }
    }
    
    // Reset states for next dictation - BUT KEEP SESSION ACTIVE
    anchorRef.current = null
    interimLengthRef.current = 0
    dictationStartRef.current = null
    rawTranscriptRef.current = ''
    
    // ✅ NÃO desconecta isRemoteDictationActive - sessão continua!
    console.log('[Dictation] Remote dictation stopped - session still active, ready for next line')
  }, [isAICorrectorEnabled, refreshAIBalance])

  /**
   * Handle remote disconnect - ends the session completely
   */
  const handleRemoteDisconnect = useCallback(() => {
    console.log('[Dictation] Remote disconnect - ending session')
    
    // Reset all states
    anchorRef.current = null
    interimLengthRef.current = 0
    dictationStartRef.current = null
    rawTranscriptRef.current = ''
    
    // End the remote session
    setIsRemoteDictationActive(false)
    
    toast.info('Sessão mobile encerrada')
  }, [])

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
    setRemoteStream,
    processRemoteTranscript,
    isRemoteDictationActive,
    setRemoteDictationActive: setIsRemoteDictationActive,
    handleRemoteStop,
    handleRemoteDisconnect,
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
