import { useCallback, useRef, useState } from 'react'
import { Editor } from '@tiptap/react'
import { transcribeAudio, validateAudioBlob, detectAudioActivity } from '@/services/dictation/whisperClient'
import { shouldApplyWhisperRefinement, extractVoiceCommands, reinsertVoiceCommands } from '@/utils/medicalTextProcessor'
import { processVoiceInput } from '@/services/dictation/voiceCommandProcessor'
import { toast } from 'sonner'

interface WhisperTask {
  audioBlob: Blob
  startPos: number
  endPos: number
  webSpeechText: string
  editor: Editor
}

interface UseWhisperQueueReturn {
  isProcessing: boolean
  queueLength: number
  stats: {
    total: number
    success: number
    failed: number
  }
  enqueue: (task: WhisperTask) => void
  abort: () => void
}

/**
 * Hook para gerenciar fila de processamento Whisper com mutex
 */
export function useWhisperQueue(): UseWhisperQueueReturn {
  const [isProcessing, setIsProcessing] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    success: 0,
    failed: 0,
  })

  const queueRef = useRef<Array<() => Promise<void>>>([])
  const isProcessingRef = useRef<boolean>(false)
  const abortControllerRef = useRef<AbortController | null>(null)
  const fallbackToastShownRef = useRef<boolean>(false)

  /**
   * Processa próximo item da fila com mutex
   */
  const processNext = useCallback(async (): Promise<void> => {
    // Mutex: se já está processando ou fila vazia, retorna
    if (isProcessingRef.current || queueRef.current.length === 0) {
      return
    }

    isProcessingRef.current = true
    setIsProcessing(true)

    const task = queueRef.current.shift()

    if (task) {
      try {
        await task()
      } catch (error) {
        console.error('❌ Error processing queued task:', error)
      } finally {
        isProcessingRef.current = false
        setIsProcessing(false)
        
        // Processar próximo item
        if (queueRef.current.length > 0) {
          processNext()
        }
      }
    } else {
      isProcessingRef.current = false
      setIsProcessing(false)
    }
  }, [])

  /**
   * Enfileira tarefa de processamento Whisper
   */
  const enqueue = useCallback((params: WhisperTask): void => {
    const { audioBlob, startPos, endPos, webSpeechText, editor } = params

    const task = async () => {
      setStats(prev => ({ ...prev, total: prev.total + 1 }))

      try {
        abortControllerRef.current = new AbortController()

        // Validação de áudio (tamanho, formato)
        const validation = validateAudioBlob(audioBlob)
        if (!validation.valid) {
          console.log('⏭️ Skipping audio:', validation.reason)
          setStats(prev => ({ ...prev, failed: prev.failed + 1 }))
          return
        }

        // VAD: Voice Activity Detection (filtrar áudio silencioso)
        const hasActivity = await detectAudioActivity(audioBlob)
        if (!hasActivity) {
          console.log('⏭️ Skipping silent audio (no speech detected)')
          setStats(prev => ({ ...prev, failed: prev.failed + 1 }))
          return
        }

        // Extrair comandos de voz antes de enviar
        const { cleanText, commands } = extractVoiceCommands(webSpeechText)

        // Transcrever com Whisper
        const result = await transcribeAudio(audioBlob, {
          maxRetries: 3,
          onRetry: (attempt, error) => {
            console.log(`⏳ Retry attempt ${attempt}: ${error.message}`)
          }
        })

        let whisperText = result.text

        // Reinserir comandos de voz
        whisperText = reinsertVoiceCommands(whisperText, commands)

        console.log('✅ Whisper refined:', whisperText.substring(0, 50) + '...')

        // Verificar se deve aplicar refinamento
        const currentEditorText = editor.state.doc.textBetween(startPos, endPos, ' ', ' ')

        if (shouldApplyWhisperRefinement(webSpeechText, currentEditorText, whisperText)) {
          // Deletar texto antigo
          editor.view.dispatch(editor.state.tr.delete(startPos, endPos))
          
          // Posicionar cursor
          editor.commands.setTextSelection(startPos)
          
          // Processar texto Whisper com comandos
          processVoiceInput(whisperText, editor)

          console.log('🔄 Whisper APLICADO')
        } else {
          console.log('🚫 Whisper BLOQUEADO - preservando edição manual')
        }

        setStats(prev => ({ ...prev, success: prev.success + 1 }))

        // Atualizar saldo de créditos se disponível
        if (result.creditsRemaining !== undefined && result.creditsRemaining < 10) {
          toast.warning(`⚡ Saldo baixo: ${result.creditsRemaining} créditos restantes`)
        }

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        console.error('❌ Whisper processing error:', errorMessage)

        // Toast único de fallback
        if (!fallbackToastShownRef.current) {
          fallbackToastShownRef.current = true
          toast.info('Usando transcrição básica. Ative o Whisper AI para termos médicos mais precisos.', {
            duration: 6000,
          })
        }

        setStats(prev => ({ ...prev, failed: prev.failed + 1 }))
      } finally {
        abortControllerRef.current = null
      }
    }

    queueRef.current.push(task)
    processNext()
  }, [processNext])

  /**
   * Aborta processamento em andamento
   */
  const abort = useCallback((): void => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    queueRef.current = []
    isProcessingRef.current = false
    setIsProcessing(false)
    fallbackToastShownRef.current = false
  }, [])

  return {
    isProcessing,
    queueLength: queueRef.current.length,
    stats,
    enqueue,
    abort,
  }
}
