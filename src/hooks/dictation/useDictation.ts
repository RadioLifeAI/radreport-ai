import { useCallback, useEffect, useRef, useState } from 'react'
import { Editor } from '@tiptap/react'
import { getSpeechRecognitionService, SpeechRecognitionService } from '@/services/SpeechRecognitionService'
import { processVoiceInput } from '@/services/dictation/voiceCommandProcessor'
import { useAudioRecorder } from './useAudioRecorder'
import { useTranscriptBuffer } from './useTranscriptBuffer'
import { useWhisperQueue } from './useWhisperQueue'
import { useWhisperCredits } from '../useWhisperCredits'
import { toast } from 'sonner'

interface UseDictationReturn {
  isActive: boolean
  status: 'idle' | 'waiting' | 'listening'
  startDictation: () => Promise<MediaStream | null>
  stopDictation: () => Promise<void>
  isWhisperEnabled: boolean
  toggleWhisper: () => void
  isTranscribing: boolean
  whisperStats: {
    total: number
    success: number
    failed: number
  }
}

const MIN_BUFFER_DURATION = 10000 // 10s
const MAX_BUFFER_DURATION = 25000 // 25s
const SILENCE_THRESHOLD = 1500 // 1.5s

/**
 * Hook principal para ditado por voz contínuo com refinamento Whisper
 * Arquitetura modular: orquestra AudioRecorder, TranscriptBuffer e WhisperQueue
 */
export function useDictation(editor: Editor | null): UseDictationReturn {
  const [isActive, setIsActive] = useState(false)
  const [status, setStatus] = useState<'idle' | 'waiting' | 'listening'>('idle')
  const [isWhisperEnabled, setIsWhisperEnabled] = useState(false)

  // Hooks modulares
  const audioRecorder = useAudioRecorder()
  const transcriptBuffer = useTranscriptBuffer()
  const whisperQueue = useWhisperQueue()
  const { balance, hasEnoughCredits, checkQuota, refreshBalance } = useWhisperCredits()

  // Refs essenciais
  const editorRef = useRef<Editor | null>(null)
  const speechServiceRef = useRef<SpeechRecognitionService | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const anchorRef = useRef<number | null>(null)
  const interimLengthRef = useRef<number>(0)
  const lastSpeechTimestampRef = useRef<number>(Date.now())
  const bufferCheckIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Auto-desativar Whisper quando créditos acabam
  useEffect(() => {
    if (isWhisperEnabled && !hasEnoughCredits) {
      setIsWhisperEnabled(false)
      toast.info('Whisper AI desativado - sem créditos disponíveis. Usando transcrição básica.', {
        duration: 5000,
      })
    }
  }, [hasEnoughCredits, isWhisperEnabled])

  // Sincronizar ref do editor
  useEffect(() => {
    editorRef.current = editor
  }, [editor])

  /**
   * Verifica se deve enviar buffer para Whisper
   */
  const checkBufferTrigger = useCallback((): boolean => {
    if (!editorRef.current || audioRecorder.chunks.length === 0) return false

    const now = Date.now()
    const silenceDuration = now - lastSpeechTimestampRef.current
    const snapshot = transcriptBuffer.snapshot(editorRef.current)

    // Trigger 1: Silêncio natural
    if (silenceDuration >= SILENCE_THRESHOLD && snapshot.duration >= MIN_BUFFER_DURATION) {
      console.log('🎯 Trigger: Natural pause (', silenceDuration, 'ms silence)')
      return true
    }

    // Trigger 2: Buffer máximo
    if (snapshot.duration >= MAX_BUFFER_DURATION) {
      console.log('🎯 Trigger: Max buffer duration (', snapshot.duration, 'ms)')
      return true
    }

    return false
  }, [audioRecorder.chunks, transcriptBuffer])

  /**
   * Envia chunk atual para Whisper
   */
  const sendCurrentChunk = useCallback(async (): Promise<void> => {
    const currentEditor = editorRef.current
    if (!currentEditor || !isWhisperEnabled) return

    const chunks = audioRecorder.getChunks()
    if (chunks.length === 0) return

    const audioBlob = new Blob(chunks, { type: 'audio/webm;codecs=opus' })
    const snapshot = transcriptBuffer.snapshot(currentEditor)

    console.log('📤 Sending current chunk to Whisper:', Math.round(audioBlob.size / 1024) + 'KB')

    // Enfileirar para processamento
    whisperQueue.enqueue({
      audioBlob,
      startPos: snapshot.startPos,
      endPos: snapshot.endPos,
      webSpeechText: snapshot.text,
      editor: currentEditor,
    })

    // Resetar para novo período
    transcriptBuffer.reset()
    audioRecorder.clearChunks()

    // Reiniciar MediaRecorder para novo segmento
    if (streamRef.current) {
      await audioRecorder.restart(streamRef.current)
    }
  }, [isWhisperEnabled, audioRecorder, transcriptBuffer, whisperQueue])

  /**
   * Envia chunk final ao parar
   */
  const sendFinalChunk = useCallback(async (): Promise<void> => {
    const currentEditor = editorRef.current
    if (!currentEditor || !isWhisperEnabled) return

    const chunks = audioRecorder.getChunks()
    if (chunks.length === 0) return

    const audioBlob = new Blob(chunks, { type: 'audio/webm;codecs=opus' })
    const snapshot = transcriptBuffer.snapshot(currentEditor)

    console.log('📤 Sending FINAL chunk to Whisper:', Math.round(audioBlob.size / 1024) + 'KB')

    whisperQueue.enqueue({
      audioBlob,
      startPos: snapshot.startPos,
      endPos: snapshot.endPos,
      webSpeechText: snapshot.text,
      editor: currentEditor,
    })

    transcriptBuffer.reset()
    audioRecorder.clearChunks()
  }, [isWhisperEnabled, audioRecorder, transcriptBuffer, whisperQueue])

  /**
   * Verifica se há comando estrutural que deve enviar buffer imediatamente
   */
  const hasStructuralCommandTrigger = useCallback((text: string): boolean => {
    const triggers = ['ponto parágrafo', 'novo parágrafo', 'fim de laudo', 'encerrar laudo']
    return triggers.some(t => text.toLowerCase().includes(t))
  }, [])

  /**
   * Handler unificado para transcrições (Web Speech) - estabilizado via ref
   */
  const handleTranscriptRef = useRef<(result: { transcript: string; isFinal: boolean }) => void>()
  
  handleTranscriptRef.current = useCallback((result: { transcript: string; isFinal: boolean }) => {
    const currentEditor = editorRef.current
    if (!currentEditor || !result.transcript) return

    lastSpeechTimestampRef.current = Date.now()

    if (!result.isFinal) {
      // INTERIM: preview provisório
      // Capturar âncora se for primeiro interim
      if (anchorRef.current === null) {
        const { from } = currentEditor.state.selection
        anchorRef.current = from
      }

      const anchor = anchorRef.current
      const currentInterimLength = interimLengthRef.current

      // Deletar interim anterior se existir
      if (currentInterimLength > 0) {
        currentEditor.view.dispatch(
          currentEditor.state.tr.delete(anchor, anchor + currentInterimLength)
        )
      }

      // Inserir novo interim
      currentEditor.view.dispatch(
        currentEditor.state.tr.insertText(result.transcript, anchor)
      )

      interimLengthRef.current = result.transcript.length
    } else {
      // FINAL: processar e inserir definitivamente
      // Deletar texto interim se existir
      if (anchorRef.current !== null && interimLengthRef.current > 0) {
        currentEditor.view.dispatch(
          currentEditor.state.tr.delete(
            anchorRef.current,
            anchorRef.current + interimLengthRef.current
          )
        )
      }

      // Processar e inserir texto final com comandos
      processVoiceInput(result.transcript, currentEditor)

      // Acumular texto processado no buffer (se Whisper ativo)
      if (isWhisperEnabled) {
        const processedEndPos = currentEditor.state.selection.from
        const bufferStartPos = transcriptBuffer.getStartPos()
        const processedText = currentEditor.state.doc.textBetween(
          bufferStartPos ?? 0,
          processedEndPos,
          ' ',
          ' '
        ).trim()

        transcriptBuffer.append(processedText, currentEditor)

        // Trigger: comando estrutural envia buffer imediatamente
        if (hasStructuralCommandTrigger(result.transcript)) {
          console.log('🎯 Trigger: Structural command detected')
          sendCurrentChunk()
        }
        // Verificar trigger normal (silêncio ou buffer máximo)
        else if (checkBufferTrigger()) {
          sendCurrentChunk()
        }
      }

      // Resetar âncora
      anchorRef.current = null
      interimLengthRef.current = 0
    }
  }, [isWhisperEnabled, transcriptBuffer, checkBufferTrigger, sendCurrentChunk, hasStructuralCommandTrigger])


  /**
   * Inicia ditado
   */
  const startDictation = useCallback(async (): Promise<MediaStream | null> => {
    if (!editorRef.current) {
      console.warn('⚠️ Editor not ready')
      return null
    }

    try {
      setStatus('waiting')

      // Inicializar Speech Service
      if (!speechServiceRef.current) {
        speechServiceRef.current = getSpeechRecognitionService()
      }

      const speechService = speechServiceRef.current
      speechService.setOnResult((result) => handleTranscriptRef.current?.(result))

      // Verificar créditos Whisper
      if (isWhisperEnabled) {
        const hasCredits = checkQuota(1)
        if (!hasCredits) {
          setIsWhisperEnabled(false)
          toast.warning('Créditos Whisper insuficientes. Usando transcrição básica.')
        }
      }

      // Iniciar reconhecimento de voz
      const result = await speechService.startListeningWithAudio()
      
      if (!result.started) {
        throw new Error('Falha ao iniciar reconhecimento de voz')
      }
      
      streamRef.current = result.stream || null

      // Iniciar gravação de áudio se Whisper ativo
      if (isWhisperEnabled && result.stream) {
        await audioRecorder.start(result.stream)

        // Verificação periódica de buffer
        bufferCheckIntervalRef.current = setInterval(() => {
          if (checkBufferTrigger()) {
            sendCurrentChunk()
          }
        }, 1000)
      }

      setIsActive(true)
      setStatus('listening')
      console.log('🎙️ Dictation started')

      return streamRef.current
    } catch (error) {
      console.error('❌ Failed to start dictation:', error)
      toast.error('Erro ao iniciar ditado')
      setStatus('idle')
      return null
    }
  }, [
    isWhisperEnabled,
    checkQuota,
    audioRecorder,
    checkBufferTrigger,
    sendCurrentChunk,
  ])

  /**
   * Para ditado
   */
  const stopDictation = useCallback(async (): Promise<void> => {
    console.log('🛑 Stopping dictation...')

    // Limpar interval de verificação
    if (bufferCheckIntervalRef.current) {
      clearInterval(bufferCheckIntervalRef.current)
      bufferCheckIntervalRef.current = null
    }

    // Parar reconhecimento de voz
    if (speechServiceRef.current) {
      speechServiceRef.current.stopListening()
    }

    // Parar gravação e enviar chunk final
    if (isWhisperEnabled && audioRecorder.isRecording) {
      await audioRecorder.stop()
      await sendFinalChunk()
    }

    // Parar stream de mídia
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }

    // Resetar estados
    setIsActive(false)
    setStatus('idle')
    anchorRef.current = null
    interimLengthRef.current = 0
    transcriptBuffer.reset()

    console.log('🛑 Dictation stopped')
  }, [
    isWhisperEnabled,
    audioRecorder,
    sendFinalChunk,
    transcriptBuffer,
  ])

  /**
   * Toggle Whisper
   */
  const toggleWhisper = useCallback(async (): Promise<void> => {
    if (!isWhisperEnabled) {
      const hasCredits = checkQuota(1)
      if (!hasCredits) {
        toast.warning('Créditos Whisper insuficientes')
        return
      }
      setIsWhisperEnabled(true)
      toast.success('Whisper AI ativado')
    } else {
      setIsWhisperEnabled(false)
      whisperQueue.abort()
      toast.info('Whisper AI desativado')
    }
  }, [isWhisperEnabled, checkQuota, whisperQueue])

  // Pausar ditado quando aba fica oculta (privacidade)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isActive) {
        console.log('🔒 Tab hidden - pausing dictation for privacy')
        stopDictation()
        toast.info('Ditado pausado (aba em segundo plano)')
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [isActive, stopDictation])

  // Cleanup na desmontagem
  useEffect(() => {
    return () => {
      if (isActive) {
        stopDictation()
      }
      whisperQueue.abort()
    }
  }, [isActive, stopDictation, whisperQueue])

  return {
    isActive,
    status,
    startDictation,
    stopDictation,
    isWhisperEnabled,
    toggleWhisper,
    isTranscribing: whisperQueue.isProcessing,
    whisperStats: whisperQueue.stats,
  }
}
