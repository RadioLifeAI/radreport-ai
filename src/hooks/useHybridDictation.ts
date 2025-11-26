import { useState, useRef, useCallback } from 'react'
import { Editor } from '@tiptap/react'
import { useDictation } from './useDictation'
import { whisperService } from '@/services/WhisperService'
import { VoiceCommandRecordingService } from '@/services/AudioRecordingService'

interface UseHybridDictationReturn {
  isActive: boolean
  status: 'idle' | 'waiting' | 'listening'
  isRecording: boolean
  startHybridDictation: () => Promise<void>
  stopHybridDictation: () => Promise<void>
}

/**
 * Hook híbrido otimizado que combina:
 * - Web Speech API (feedback instantâneo)
 * - Whisper (confirmação apenas de segmentos curtos com VAD)
 * 
 * Otimizações de custo:
 * - Envia apenas segmentos de 0.5-5s para Whisper (evita áudio longo)
 * - Usa VAD para filtrar silêncios
 * - Throttling de 500ms entre requisições
 * - Só usa Whisper quando necessário
 */
export function useHybridDictation(editor: Editor | null): UseHybridDictationReturn {
  const webSpeech = useDictation(editor)
  const [isRecording, setIsRecording] = useState(false)
  const recorderRef = useRef<VoiceCommandRecordingService | null>(null)
  const lastWhisperCallRef = useRef<number>(0)
  const isProcessingWhisperRef = useRef<boolean>(false)
  
  const processWhisperSegment = useCallback(async (blob: Blob, duration: number) => {
    // Validação de duração para reduzir custos
    if (duration < 0.5 || duration > 5.0) {
      console.log(`Skipping Whisper: duration ${duration}s out of range (0.5-5s)`)
      return
    }
    
    // Throttling: evitar múltiplas chamadas simultâneas
    const now = Date.now()
    if (now - lastWhisperCallRef.current < 500) {
      console.log('Throttling Whisper call')
      return
    }
    
    if (isProcessingWhisperRef.current) {
      console.log('Whisper already processing, skipping')
      return
    }
    
    try {
      isProcessingWhisperRef.current = true
      lastWhisperCallRef.current = now
      
      console.log(`Sending ${duration.toFixed(2)}s audio to Whisper for medical term validation`)
      
      const result = await whisperService.transcribe(blob)
      
      // Usar apenas se Whisper retornou algo válido
      if (result.text && result.text.trim().length > 0) {
        console.log('✓ Whisper validated:', result.text)
        
        // Aqui você pode implementar lógica de comparação/correção
        // com a transcrição do Web Speech se necessário
        // Por enquanto apenas logamos para validação
      }
    } catch (error) {
      console.error('Whisper transcription error:', error)
    } finally {
      isProcessingWhisperRef.current = false
    }
  }, [])
  
  const startHybridDictation = useCallback(async () => {
    if (!editor) return
    
    // Iniciar Web Speech para feedback imediato
    webSpeech.startDictation()
    
    // Iniciar gravação com VAD para segmentos curtos
    try {
      recorderRef.current = new VoiceCommandRecordingService({
        maxDuration: 5, // Máximo 5s por segmento (reduzir custos)
        audioBitsPerSecond: 32000, // Qualidade menor = arquivo menor = custo menor
        onStop: async (blob) => {
          console.log('VAD detected pause, stopping segment')
        }
      })
      
      await recorderRef.current.startCommandRecording(async (blob, duration) => {
        // Enviar apenas segmentos de fala válidos para Whisper
        await processWhisperSegment(blob, duration)
      })
      
      setIsRecording(true)
    } catch (error) {
      console.error('Failed to start hybrid dictation:', error)
    }
  }, [editor, webSpeech, processWhisperSegment])
  
  const stopHybridDictation = useCallback(async () => {
    // Parar Web Speech
    webSpeech.stopDictation()
    
    // Parar gravação e processar último segmento
    if (recorderRef.current?.isRecording()) {
      await recorderRef.current.stopRecording()
    }
    
    // Reset flags
    isProcessingWhisperRef.current = false
    lastWhisperCallRef.current = 0
    
    setIsRecording(false)
  }, [webSpeech])
  
  return {
    isActive: webSpeech.isActive,
    status: webSpeech.status,
    isRecording,
    startHybridDictation,
    stopHybridDictation
  }
}
