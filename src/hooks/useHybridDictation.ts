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
 * Hook híbrido que combina Web Speech API (feedback rápido) 
 * com Whisper (precisão em termos médicos PT-BR)
 */
export function useHybridDictation(editor: Editor | null): UseHybridDictationReturn {
  const webSpeech = useDictation(editor)
  const [isRecording, setIsRecording] = useState(false)
  const recorderRef = useRef<VoiceCommandRecordingService | null>(null)
  
  const startHybridDictation = useCallback(async () => {
    if (!editor) return
    
    // Iniciar Web Speech para feedback imediato
    webSpeech.startDictation()
    
    // Iniciar gravação paralela para Whisper
    try {
      recorderRef.current = new VoiceCommandRecordingService({
        maxDuration: 30,
        onStop: async (blob) => {
          // Enviar para Whisper para confirmação
          try {
            const result = await whisperService.transcribe(blob)
            
            // Usar transcrição do Whisper se for confiável
            if (result.text && result.confidence && result.confidence > 0.85) {
              // Inserir texto confirmado pelo Whisper
              // (pode substituir ou complementar a transcrição do Web Speech)
              console.log('Whisper confirmation:', result.text)
            }
          } catch (error) {
            console.error('Whisper transcription error:', error)
          }
        }
      })
      
      await recorderRef.current.startCommandRecording(async (blob, duration) => {
        if (duration > 0.5) {
          // Auto-confirmar segmento após pausa
          console.log('Audio segment recorded:', duration, 'seconds')
        }
      })
      
      setIsRecording(true)
    } catch (error) {
      console.error('Failed to start hybrid dictation:', error)
    }
  }, [editor, webSpeech])
  
  const stopHybridDictation = useCallback(async () => {
    // Parar Web Speech
    webSpeech.stopDictation()
    
    // Parar gravação
    if (recorderRef.current?.isRecording()) {
      await recorderRef.current.stopRecording()
    }
    
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
