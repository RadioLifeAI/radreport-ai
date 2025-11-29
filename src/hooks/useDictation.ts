import { useCallback, useEffect, useRef, useState } from 'react'
import { Editor } from '@tiptap/react'
import { getSpeechRecognitionService, SpeechRecognitionService } from '@/services/SpeechRecognitionService'
import { VOICE_COMMANDS_CONFIG } from '@/lib/voiceCommandsConfig'
import { 
  processMedicalText, 
  shouldApplyWhisperRefinement,
  extractVoiceCommands,
  reinsertVoiceCommands 
} from '@/utils/medicalTextProcessor'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'
import { useWhisperCredits } from './useWhisperCredits'

interface UseDictationReturn {
  isActive: boolean
  status: 'idle' | 'waiting' | 'listening'
  startDictation: () => Promise<MediaStream | null>
  stopDictation: () => void
  
  // Whisper features integradas
  isWhisperEnabled: boolean
  toggleWhisper: () => void
  isTranscribing: boolean
  whisperStats: {
    total: number
    success: number
    failed: number
  }
}

interface TextSegment {
  id: string           // UUID único
  startPos: number     // Posição inicial no editor
  endPos: number       // Posição final no editor
  webSpeechText: string // Texto do Web Speech
  whisperText?: string // Texto do Whisper (quando retornar)
  status: 'pending' | 'processing' | 'refined'
}

// 🆕 FASE 3: Interface para isolamento de áudio por segmento
interface AudioSegment {
  id: string
  audioChunks: Blob[]
  startTimestamp: number
  endTimestamp: number
  webSpeechText: string
  startPos: number
  endPos: number
}

/**
 * Hook unificado para ditado por voz contínuo com refinamento Whisper
 * Camada 1: Web Speech API → preview em tempo real no TipTap
 * Camada 2: MediaRecorder → chunking temporal 3s → Whisper → substituição progressiva
 */
export function useDictation(editor: Editor | null): UseDictationReturn {
  const [isActive, setIsActive] = useState(false)
  const [status, setStatus] = useState<'idle' | 'waiting' | 'listening'>('idle')
  
  // Whisper credits hook
  const { balance, hasEnoughCredits, checkQuota, refreshBalance } = useWhisperCredits()

  // Refs para sistema de âncora dinâmica (Web Speech)
  const editorRef = useRef<Editor | null>(null)
  const speechServiceRef = useRef<SpeechRecognitionService | null>(null)
  const anchorRef = useRef<number | null>(null)      // Posição inicial do ditado
  const selectionEndRef = useRef<number | null>(null) // Posição final da seleção (se houver)
  const interimLengthRef = useRef<number>(0)          // Tamanho do texto provisório
  const whisperFallbackToastShownRef = useRef<boolean>(false) // Flag para toast único

  // 🎙️ Refs para sistema Whisper integrado
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const accumulatedAudioRef = useRef<Blob[]>([]) // 🆕 Buffer acumulado durante sessão
  const chunkIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastSegmentEndRef = useRef<number>(0)
  const textSegmentsRef = useRef<TextSegment[]>([])
  const isProcessingRef = useRef<boolean>(false) // 🔒 Mutex para evitar race conditions
  const processingQueueRef = useRef<Array<() => Promise<void>>>([]) // 📋 Fila de processamento
  const abortControllerRef = useRef<AbortController | null>(null) // 🛑 Cancelamento de requests
  const whisperDebounceRef = useRef<NodeJS.Timeout | null>(null) // 🆕 Debounce timer
  const lastFinalTranscriptRef = useRef<string>('') // 🆕 Track last transcript
  
  // 🆕 FASE 3: Mapa de segmentos de áudio isolados
  const audioSegmentsRef = useRef<Map<string, AudioSegment>>(new Map())
  const currentSegmentIdRef = useRef<string | null>(null)
  
  // 🆕 FASE 2: Flag para detectar edição manual pelo usuário
  const userEditedRef = useRef<boolean>(false)
  
  // Estados Whisper
  const [isWhisperEnabled, setIsWhisperEnabled] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [whisperStats, setWhisperStats] = useState({
    total: 0,
    success: 0,
    failed: 0,
  })

  // Auto-desativar Whisper quando créditos acabam
  useEffect(() => {
    if (isWhisperEnabled && !hasEnoughCredits) {
      setIsWhisperEnabled(false)
      toast.info('Whisper AI desativado - sem créditos disponíveis. Usando transcrição básica.', {
        duration: 5000,
      })
    }
  }, [hasEnoughCredits, isWhisperEnabled])

  // Sincronizar ref do editor sempre que mudar
  useEffect(() => {
    editorRef.current = editor
  }, [editor])

  /**
   * Escapa caracteres especiais para uso em regex
   */
  const escapeRegex = (str: string): string => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }

  /**
   * Converte Blob de áudio para base64
   */
  const blobToBase64 = useCallback((blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        const base64Data = base64.split(',')[1]
        resolve(base64Data)
      }
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }, [])

  /**
   * 🆕 VAD: Detecta atividade de áudio (filtrar silêncio)
   */
  const detectAudioActivity = useCallback(async (blob: Blob): Promise<boolean> => {
    try {
      const arrayBuffer = await blob.arrayBuffer()
      const audioContext = new AudioContext()
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
      
      const channelData = audioBuffer.getChannelData(0)
      const rms = Math.sqrt(channelData.reduce((sum, val) => sum + val * val, 0) / channelData.length)
      
      await audioContext.close()
      
      const SILENCE_THRESHOLD = 0.01
      const hasActivity = rms > SILENCE_THRESHOLD
      
      if (!hasActivity) {
        console.log('🔇 Silent audio detected, skipping (RMS:', rms.toFixed(4), ')')
      }
      
      return hasActivity
    } catch (error) {
      console.warn('⚠️ VAD check failed, assuming active:', error)
      return true // Fallback: assume audio is active
    }
  }, [])

  /**
   * 🆕 Envia áudio acumulado para Whisper (chamado apenas em stop ou após debounce)
   */
  const sendChunkToWhisper = useCallback(async (params: {
    audioBlob: Blob
    startPos: number
    endPos: number
    webSpeechText: string
  }) => {
    const currentEditor = editorRef.current
    if (!currentEditor) return

    const { audioBlob, startPos, endPos, webSpeechText } = params
    
    // 🆕 Tamanho mínimo otimizado para ~10s (alinhado com cobrança mínima Groq)
    const MIN_AUDIO_DURATION_SECONDS = 10
    const MIN_AUDIO_SIZE = MIN_AUDIO_DURATION_SECONDS * 16000 // ~160KB para 10s @ 16KB/s
    
    if (audioBlob.size < MIN_AUDIO_SIZE) {
      console.log('⏭️ Audio too short for Whisper (', Math.round(audioBlob.size / 1024), 'KB, need', Math.round(MIN_AUDIO_SIZE / 1024), 'KB), skipping')
      return
    }
    
    // 🆕 VAD: Filtrar áudio silencioso
    const hasActivity = await detectAudioActivity(audioBlob)
    if (!hasActivity) {
      console.log('⏭️ Skipping silent audio chunk')
      return
    }
    
    const MAX_AUDIO_SIZE = 25 * 1024 * 1024 // 25MB
    if (audioBlob.size > MAX_AUDIO_SIZE) {
      console.warn('⚠️ Audio too large:', Math.round(audioBlob.size / 1024 / 1024), 'MB')
      return
    }

    setIsTranscribing(true)
    setWhisperStats(prev => ({ ...prev, total: prev.total + 1 }))

    const segmentId = `segment-${Date.now()}`
    
    textSegmentsRef.current.push({
      id: segmentId,
      startPos,
      endPos,
      webSpeechText,
      status: 'processing'
    })

    const MAX_RETRIES = 3
    let attempt = 0
    let whisperSucceeded = false
    
    while (attempt < MAX_RETRIES) {
      try {
        abortControllerRef.current = new AbortController()
        
        // 🆕 FASE 5: Extrair comandos de voz antes de enviar para Whisper
        const { cleanText, commands } = extractVoiceCommands(webSpeechText)
        
        const base64Audio = await blobToBase64(audioBlob)
        console.log(`🎤 Sending to Whisper (attempt ${attempt + 1}/${MAX_RETRIES},`, Math.round(audioBlob.size / 1024), 'KB)')

        const { data, error } = await supabase.functions.invoke('transcribe-audio', {
          body: { 
            audio: base64Audio,
            language: 'pt'
          }
        })

        if (error) throw error

        // Refresh balance after consumption
        if (data?.credits_remaining !== undefined) {
          await refreshBalance()
          
          // Show low balance warning
          if (data.credits_remaining < 10) {
            toast.warning(`⚡ Saldo baixo: ${data.credits_remaining} créditos restantes`)
          }
        }

        if (data?.text) {
          let whisperText = processMedicalText(data.text)
          
          // 🆕 FASE 5: Reinserir comandos de voz após Whisper
          whisperText = reinsertVoiceCommands(whisperText, commands)
          
          console.log('✅ Whisper refined:', whisperText.substring(0, 50) + '...')

          const segment = textSegmentsRef.current.find(s => s.id === segmentId)
          if (segment) {
            segment.whisperText = whisperText
            segment.status = 'refined'

            // 🆕 FASE 1: RECONCILIADOR INTELIGENTE
            // Pegar texto atual do editor nas posições originais
            const currentEditorText = currentEditor.state.doc.textBetween(startPos, endPos, ' ', ' ')
            
            // Verificar se usuário editou manualmente
            if (shouldApplyWhisperRefinement(webSpeechText, currentEditorText, whisperText)) {
              // 🆕 FASE 2: Usar transaction do TipTap para operação atômica
              currentEditor.view.dispatch(
                currentEditor.state.tr
                  .delete(startPos, endPos)
                  .insertText(whisperText + ' ', startPos)
              )
              
              console.log('🔄 Whisper APLICADO:', webSpeechText.substring(0, 30), '→', whisperText.substring(0, 30))

              // Ajustar offsets dos segmentos seguintes
              const lengthDiff = (whisperText.length + 1) - (endPos - startPos)
              if (lengthDiff !== 0) {
                textSegmentsRef.current.forEach(s => {
                  if (s.startPos > endPos) {
                    s.startPos += lengthDiff
                    s.endPos += lengthDiff
                  }
                })
              }
            } else {
              console.log('🚫 Whisper BLOQUEADO - preservando edição manual do usuário')
            }
          }

          setWhisperStats(prev => ({ ...prev, success: prev.success + 1 }))
          whisperSucceeded = true
          break
        }

      } catch (error) {
        attempt++
        console.error(`❌ Whisper error (attempt ${attempt}/${MAX_RETRIES}):`, error)
        
        if (attempt < MAX_RETRIES) {
          const backoffMs = Math.pow(2, attempt) * 1000
          console.log(`⏳ Retrying in ${backoffMs}ms...`)
          await new Promise(resolve => setTimeout(resolve, backoffMs))
        }
      }
    }
    
    // 🆕 FASE 4: FALLBACK AUTOMÁTICO
    if (!whisperSucceeded) {
      console.log('⚠️ Whisper failed after all retries - keeping Web Speech text')
      
      // Toast único por sessão de ditado
      if (!whisperFallbackToastShownRef.current) {
        whisperFallbackToastShownRef.current = true
        toast.info('Usando transcrição básica. Ative o Whisper AI para termos médicos mais precisos.', {
          duration: 6000,
        })
      }
      
      setWhisperStats(prev => ({ ...prev, failed: prev.failed + 1 }))
      // Texto Web Speech já está no editor, não fazer nada
    }
    
    setIsTranscribing(false)
    abortControllerRef.current = null
  }, [blobToBase64])

  /**
   * 🆕 FASE 2: Enfileira processamento Whisper para evitar race conditions
   */
  const enqueueWhisperProcessing = useCallback((params: {
    audioBlob: Blob
    startPos: number
    endPos: number
    webSpeechText: string
  }) => {
    const task = async () => {
      await sendChunkToWhisper(params)
    }
    
    processingQueueRef.current.push(task)
    processNextInQueue()
  }, [sendChunkToWhisper])

  /**
   * 🆕 FASE 2: Processa próximo item da fila com mutex
   */
  const processNextInQueue = useCallback(async () => {
    // 🔒 Mutex: se já está processando, não inicia outro
    if (isProcessingRef.current || processingQueueRef.current.length === 0) {
      return
    }
    
    isProcessingRef.current = true
    const task = processingQueueRef.current.shift()
    
    if (task) {
      try {
        await task()
      } catch (error) {
        console.error('❌ Error processing queued task:', error)
      } finally {
        isProcessingRef.current = false
        // Processar próximo item da fila
        processNextInQueue()
      }
    } else {
      isProcessingRef.current = false
    }
  }, [])

  /**
   * Apaga a última palavra digitada (comando de voz "apagar isso")
   */
  const deleteLastWord = (editor: Editor) => {
    const { state } = editor
    const { from, to } = state.selection
    const textBefore = state.doc.textBetween(0, from, ' ', ' ')
    
    // Encontrar início da última palavra
    const match = textBefore.match(/\s*(\S+)\s*$/)
    if (match) {
      const wordLength = match[0].length
      const deleteFrom = from - wordLength
      editor.commands.deleteRange({ from: deleteFrom, to })
    }
  }

  /**
   * Verifica se a próxima palavra deve começar com maiúscula
   * baseado no contexto do editor
   */
  const shouldCapitalizeNext = (editor: Editor, position: number): boolean => {
    // Se posição é 0 ou 1, é início do documento
    if (position <= 1) return true
    
    // Pegar texto antes da posição atual
    const textBefore = editor.state.doc.textBetween(0, position, ' ', ' ')
    if (!textBefore.trim()) return true
    
    // Verificar se termina com pontuação de fim de frase
    const trimmed = textBefore.trim()
    const lastChar = trimmed.charAt(trimmed.length - 1)
    
    return ['.', '!', '?', '\n'].includes(lastChar)
  }

  /**
   * Aplica capitalização inteligente ao texto
   * - Primeira letra maiúscula no início
   * - Primeira letra maiúscula após . ! ?
   */
  const applyCapitalization = (text: string, isStartOfDocument: boolean): string => {
    if (!text.trim()) return text
    
    let result = text
    
    // Capitalizar primeira letra se início de documento ou parágrafo
    if (isStartOfDocument) {
      result = result.charAt(0).toUpperCase() + result.slice(1)
    }
    
    // Capitalizar após pontuação de fim de frase (. ! ?)
    result = result.replace(/([.!?]\s+)([a-záàâãéèêíìîóòôõúùûç])/gi, (match, punct, letter) => {
      return punct + letter.toUpperCase()
    })
    
    // Capitalizar após quebra de linha
    result = result.replace(/(\n\s*)([a-záàâãéèêíìîóòôõúùûç])/gi, (match, newline, letter) => {
      return newline + letter.toUpperCase()
    })
    
    return result
  }

  /**
   * Divide texto por comandos estruturais (linha/parágrafo)
   * Retorna array de segmentos para processamento separado
   */
  interface VoiceSegment {
    type: 'text' | 'hard_break' | 'split_block';
    content?: string;
  }

  const splitByStructuralCommands = (text: string): VoiceSegment[] => {
    const segments: VoiceSegment[] = []
    
    // Comandos estruturais ordenados por tamanho (maior primeiro)
    const structuralCommands = VOICE_COMMANDS_CONFIG
      .filter(cmd => cmd.action === 'hard_break' || cmd.action === 'split_block')
      .sort((a, b) => b.command.length - a.command.length)
    
    let remaining = text
    
    while (remaining.length > 0) {
      let foundCommand = false
      
      for (const cmd of structuralCommands) {
        const regex = new RegExp(`(^|\\s)(${escapeRegex(cmd.command)})(\\s|$)`, 'i')
        const match = remaining.match(regex)
        
        if (match && match.index !== undefined) {
          // Texto antes do comando
          const beforeText = remaining.substring(0, match.index + match[1].length)
          if (beforeText.trim()) {
            segments.push({ type: 'text', content: beforeText.trim() })
          }
          
          // Comando estrutural
          segments.push({ 
            type: cmd.action as 'hard_break' | 'split_block'
          })
          
          // Continuar processando o restante
          remaining = remaining.substring(match.index + match[0].length)
          foundCommand = true
          break
        }
      }
      
      if (!foundCommand) {
        // Não encontrou mais comandos, adicionar texto restante
        if (remaining.trim()) {
          segments.push({ type: 'text', content: remaining.trim() })
        }
        break
      }
    }
    
    return segments
  }

  /**
   * Substitui comandos de pontuação (não estruturais) no texto
   */
  const replacePunctuationCommands = (text: string): string => {
    let replaced = text
    
    // Comandos de pontuação ordenados por tamanho
    const punctuationCommands = VOICE_COMMANDS_CONFIG
      .filter(cmd => cmd.action === 'insert_text' && !cmd.followedBy)
      .sort((a, b) => b.command.length - a.command.length)
    
    for (const cmd of punctuationCommands) {
      const regex = new RegExp(escapeRegex(cmd.command), 'gi')
      
      if (regex.test(replaced)) {
        regex.lastIndex = 0
        
        if (cmd.parameters?.text) {
          replaced = replaced.replace(regex, cmd.parameters.text)
        }
      }
    }

    // Normalizar espaços
    replaced = replaced.replace(/\s+([.,;:!?])/g, '$1')
    replaced = replaced.replace(/([.,;:!?])(?=[^\s])/g, '$1 ')
    replaced = replaced.replace(/  +/g, ' ')

    return replaced
  }

  /**
   * Processa entrada de voz usando comandos nativos do TipTap
   */
  const processVoiceInput = (transcript: string, currentEditor: Editor) => {
    const segments = splitByStructuralCommands(transcript)
    
    for (const segment of segments) {
      if (segment.type === 'text' && segment.content) {
        // Processar pontuação
        let processedText = replacePunctuationCommands(segment.content)
        
        // 🆕 APLICAR CORREÇÕES MÉDICAS EM TEMPO REAL
        processedText = processMedicalText(processedText)
        
        // Verificar capitalização baseado na posição atual do cursor
        const shouldCapitalize = shouldCapitalizeNext(currentEditor, currentEditor.state.selection.from)
        processedText = applyCapitalization(processedText, shouldCapitalize)
        
        // Inserir texto
        currentEditor.chain().focus().insertContent(processedText + ' ').run()
        
      } else if (segment.type === 'hard_break') {
        // Comando nativo TipTap para quebra de linha
        currentEditor.chain().focus().setHardBreak().run()
        
      } else if (segment.type === 'split_block') {
        // Comando nativo TipTap para novo parágrafo
        currentEditor.chain().focus().splitBlock().run()
      }
    }
    
    // Processar comandos compostos (ex: "ponto parágrafo")
    const compositeCmd = VOICE_COMMANDS_CONFIG.find(
      cmd => cmd.followedBy && transcript.toLowerCase().includes(cmd.command.toLowerCase())
    )
    
    if (compositeCmd?.followedBy === 'split_block') {
      currentEditor.chain().focus().splitBlock().run()
    }
  }

  /**
   * 🆕 FASE 6: Handlers estáveis usando useRef para evitar re-registros
   */
  const handleInterimTranscriptRef = useRef<(transcript: string) => void>(() => {})
  const handleFinalTranscriptRef = useRef<(transcript: string) => void>(() => {})

  /**
   * Handler para transcrições provisórias (em tempo real)
   * Mostra preview com marcadores visuais para comandos estruturais
   */
  handleInterimTranscriptRef.current = useCallback((transcript: string) => {
    const currentEditor = editorRef.current
    if (!currentEditor || !transcript.trim()) return

    // Se não tem âncora ainda, verificar se há seleção
    if (anchorRef.current === null) {
      const { from, to } = currentEditor.state.selection
      anchorRef.current = from
      
      if (from !== to) {
        selectionEndRef.current = to
        currentEditor.commands.deleteRange({ from, to })
        console.log('🗑️ Selection deleted:', { from, to })
      }
    }

    const anchor = anchorRef.current
    const currentInterimLength = interimLengthRef.current

    // Processar texto para preview (com marcadores visuais)
    let previewText = transcript
    
    // 🆕 APLICAR CORREÇÕES MÉDICAS NO PREVIEW TAMBÉM (tempo real)
    previewText = processMedicalText(previewText)
    
    // Substituir comandos estruturais por marcadores visuais
    previewText = previewText.replace(/nova linha|próxima linha|linha/gi, ' [↵] ')
    previewText = previewText.replace(/novo parágrafo|próximo parágrafo|parágrafo/gi, ' [¶] ')
    
    // Processar pontuação
    previewText = replacePunctuationCommands(previewText)
    
    // Verificar se deve capitalizar
    const shouldCapitalize = shouldCapitalizeNext(currentEditor, anchor)
    const capitalizedText = applyCapitalization(previewText, shouldCapitalize)

    // Substituir texto provisório anterior pelo novo
    if (currentInterimLength > 0) {
      currentEditor.commands.deleteRange({ 
        from: anchor, 
        to: anchor + currentInterimLength 
      })
    }
    
    currentEditor.commands.insertContentAt(anchor, capitalizedText, {
      updateSelection: true,
    })

    // Atualizar comprimento do texto provisório
    interimLengthRef.current = capitalizedText.length

    console.log('📝 Interim with markers:', capitalizedText)
  }, [])

  /**
   * Handler para transcrições finais (confirmadas)
   * 🆕 FASE 2: Correção de posicionamento - capturar ANTES de processVoiceInput
   * 🆕 FASE 3: Isolamento de áudio por segmento
   */
  handleFinalTranscriptRef.current = useCallback((transcript: string) => {
    const currentEditor = editorRef.current
    console.log('✅ Final transcript:', transcript)
    
    if (!currentEditor || !transcript.trim()) return

    // Se não tem âncora ainda, verificar se há seleção
    if (anchorRef.current === null) {
      const { from, to } = currentEditor.state.selection
      anchorRef.current = from
      
      if (from !== to) {
        selectionEndRef.current = to
        currentEditor.commands.deleteRange({ from, to })
        console.log('🗑️ Selection deleted on final:', { from, to })
      }
    }

    const anchor = anchorRef.current ?? currentEditor.state.selection.from
    const currentInterimLength = interimLengthRef.current

    const lowerTranscript = transcript.toLowerCase().trim()
    
    // Verificar comandos especiais primeiro
    for (const cmd of VOICE_COMMANDS_CONFIG) {
      if (lowerTranscript === cmd.command && 
          !['insert_text', 'hard_break', 'split_block'].includes(cmd.action)) {
        if (currentInterimLength > 0) {
          currentEditor.commands.deleteRange({ 
            from: anchor, 
            to: anchor + currentInterimLength 
          })
        }
        anchorRef.current = null
        interimLengthRef.current = 0
        
        switch (cmd.action) {
          case 'delete_word':
            deleteLastWord(currentEditor)
            return
          case 'undo':
            currentEditor.commands.undo()
            return
          case 'redo':
            currentEditor.commands.redo()
            return
          case 'toggle_bold':
            currentEditor.commands.toggleBold()
            return
          case 'toggle_italic':
            currentEditor.commands.toggleItalic()
            return
          case 'toggle_underline':
            currentEditor.commands.toggleUnderline()
            return
        }
      }
    }

    // Remover texto provisório
    if (currentInterimLength > 0) {
      currentEditor.commands.deleteRange({ 
        from: anchor, 
        to: anchor + currentInterimLength 
      })
    }

    // 🆕 FASE 2: CORREÇÃO - Capturar posição ANTES de processVoiceInput
    const webSpeechStartPos = anchor
    
    currentEditor.commands.setTextSelection(anchor)
    
    // Processar usando comandos nativos do TipTap
    processVoiceInput(transcript, currentEditor)

    // 🆕 FASE 2: Capturar posição DEPOIS (corrigido)
    const webSpeechEndPos = currentEditor.state.selection.from
    
    // 🆕 Acumular áudio durante ditado (não enviar ainda)
    if (isWhisperEnabled && audioChunksRef.current.length > 0) {
      // Adicionar chunks atuais ao buffer acumulado
      accumulatedAudioRef.current.push(...audioChunksRef.current)
      audioChunksRef.current = []
      
      // 🆕 Resetar e iniciar timer de debounce (5s de silêncio)
      if (whisperDebounceRef.current) {
        clearTimeout(whisperDebounceRef.current)
      }
      
      lastFinalTranscriptRef.current = transcript
      
      // Não enviar agora - esperar 5s de silêncio ou stopDictation
      console.log('📦 Audio accumulated, waiting for silence or stop...')
    }

    // Resetar estado
    anchorRef.current = null
    selectionEndRef.current = null
    interimLengthRef.current = 0

    console.log('✏️ Final processed:', webSpeechStartPos, '->', webSpeechEndPos)
  }, [isWhisperEnabled, enqueueWhisperProcessing])

  /**
   * Inicia gravação de áudio para Whisper
   * 🆕 FASE 3: Timeslice aumentado de 100ms para 500ms
   */
  const startAudioRecording = useCallback(async (stream: MediaStream) => {
    if (!isWhisperEnabled) return

    try {
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

      // 🆕 FASE 3: Timeslice otimizado de 100ms → 500ms (menos overhead)
      mediaRecorder.start(500)
      mediaRecorderRef.current = mediaRecorder

      console.log('🎙️ Audio recording started for Whisper with', mimeType)
    } catch (error) {
      console.error('❌ Failed to start audio recording:', error)
      toast.error('Erro ao iniciar gravação de áudio')
    }
  }, [isWhisperEnabled])

  /**
   * Para gravação de áudio Whisper
   * 🆕 FASE 4: Cancela requests em andamento e limpa fila
   */
  const stopAudioRecording = useCallback(() => {
    if (chunkIntervalRef.current) {
      clearInterval(chunkIntervalRef.current)
      chunkIntervalRef.current = null
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current = null
      console.log('🎙️ Audio recording stopped')
    }
    
    // 🆕 FASE 4: Cancelar request Whisper em andamento
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    
    // Limpar fila de processamento
    processingQueueRef.current = []
    isProcessingRef.current = false
    
    audioChunksRef.current = []
    textSegmentsRef.current = []
    lastSegmentEndRef.current = 0
  }, [])

  /**
   * ❌ REMOVIDO: Chunking temporal substituído por sincronização em handleFinalTranscript
   * A lógica agora captura posições exatas quando Web Speech confirma o texto
   */

  /**
   * Inicia o ditado por voz com captura de audio stream e Whisper
   * 🆕 Sem chunking temporal - sincronização acontece em handleFinalTranscript
   */
  const startDictation = useCallback(async (): Promise<MediaStream | null> => {
    const currentEditor = editorRef.current
    if (!currentEditor || !speechServiceRef.current) {
      console.error('❌ Cannot start dictation: editor or speechService not ready')
      return null
    }

    console.log('🎤 Starting unified dictation (Web Speech + Whisper)...')
    
    const result = await speechServiceRef.current.startListeningWithAudio()
    if (result.started) {
      setIsActive(true)
      
      const stream = result.stream
      if (stream && isWhisperEnabled) {
        // Iniciar gravação de áudio para Whisper
        await startAudioRecording(stream)
        // ❌ Chunking temporal removido - agora sincronizado com handleFinalTranscript
      }
      
      console.log('✓ Dictation started successfully with Whisper integration')
      return stream || null
    }
    
    console.error('✗ Failed to start dictation')
    return null
  }, [isWhisperEnabled, startAudioRecording])

  /**
   * Para o ditado por voz e envia áudio acumulado final para Whisper
   */
  const stopDictation = useCallback(() => {
    if (!speechServiceRef.current) return

    speechServiceRef.current.stopListening()
    setIsActive(false)
    setStatus('idle')
    
    // 🆕 Enviar todo áudio acumulado ao parar
    if (isWhisperEnabled && accumulatedAudioRef.current.length > 0) {
      const finalAudioBlob = new Blob(accumulatedAudioRef.current)
      const currentEditor = editorRef.current
      
      if (currentEditor && lastFinalTranscriptRef.current) {
        console.log('📤 Sending accumulated audio on stop (', Math.round(finalAudioBlob.size / 1024), 'KB)')
        
        // Capturar posições aproximadas do conteúdo ditado
        const endPos = currentEditor.state.selection.from
        const textLength = lastFinalTranscriptRef.current.length
        const startPos = Math.max(0, endPos - textLength - 50) // Aproximação
        
        enqueueWhisperProcessing({
          audioBlob: finalAudioBlob,
          startPos,
          endPos,
          webSpeechText: lastFinalTranscriptRef.current
        })
      }
      
      accumulatedAudioRef.current = []
    }
    
    // Limpar debounce timer
    if (whisperDebounceRef.current) {
      clearTimeout(whisperDebounceRef.current)
      whisperDebounceRef.current = null
    }
    
    // Para gravação de áudio e limpa fila
    stopAudioRecording()
    
    // Resetar estado de âncora
    anchorRef.current = null
    selectionEndRef.current = null
    interimLengthRef.current = 0
    whisperFallbackToastShownRef.current = false
    lastFinalTranscriptRef.current = ''
    
    console.log('🛑 Dictation stopped and final audio sent')
  }, [stopAudioRecording, isWhisperEnabled, enqueueWhisperProcessing])

  /**
   * 🆕 FASE 6: Callbacks estabilizados - sem dependências no array
   */
  useEffect(() => {
    const speechService = getSpeechRecognitionService()
    speechServiceRef.current = speechService

    const statusCallback = (status: 'idle' | 'waiting' | 'listening') => {
      console.log('🔊 Status changed:', status)
      setStatus(status)
    }
    
    const resultCallback = (result: { transcript: string; isFinal: boolean; alternatives?: string[] }) => {
      console.log('🎯 Result received:', { 
        transcript: result.transcript, 
        isFinal: result.isFinal,
        hasEditor: !!editorRef.current 
      })
      // 🆕 FASE 6: Usar refs estáveis
      if (result.isFinal) {
        handleFinalTranscriptRef.current(result.transcript)
      } else {
        handleInterimTranscriptRef.current(result.transcript)
      }
    }

    speechService.setOnStatus(statusCallback)
    speechService.setOnResult(resultCallback)
    
    console.log('✓ Voice callbacks configured for useDictation')

    return () => {
      speechService.removeOnStatus(statusCallback)
      speechService.removeOnResult(resultCallback)
      speechService.stopListening()
    }
  }, []) // 🆕 FASE 6: Array de dependências vazio - callbacks estabilizados

  /**
   * 🆕 Privacidade - parar microfone quando aba não está visível
   */
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isActive) {
        console.log('🔒 Tab hidden - stopping dictation for privacy')
        stopDictation()
        // Limpar áudio da memória
        audioChunksRef.current = []
        accumulatedAudioRef.current = []
        toast.info('Ditado pausado (aba em segundo plano)')
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [isActive, stopDictation])

  /**
   * Toggle Whisper
   */
  const toggleWhisper = useCallback(() => {
    // Check if user has enough credits before enabling
    if (!isWhisperEnabled && !hasEnoughCredits) {
      toast.error('✨ Ative o Whisper AI para transcrição médica precisa. Termos como "hepatomegalia" e "BI-RADS" são refinados automaticamente.', {
        duration: 6000,
      })
      return
    }
    
    setIsWhisperEnabled(prev => {
      const newState = !prev
      toast.info(newState ? 'Whisper AI ativado ✅' : 'Whisper AI desativado ⏸️')
      return newState
    })
  }, [isWhisperEnabled, hasEnoughCredits])

  /**
   * Cleanup ao desmontar
   */
  useEffect(() => {
    return () => {
      stopAudioRecording()
    }
  }, [stopAudioRecording])

  return {
    isActive,
    status,
    startDictation,
    stopDictation,
    
    // Whisper features integradas
    isWhisperEnabled,
    toggleWhisper,
    isTranscribing,
    whisperStats,
  }
}
