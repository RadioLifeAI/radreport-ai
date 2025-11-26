import { useState, useEffect, useCallback, useRef } from 'react'
import { supabaseService } from '../services/supabaseService'
import { getSpeechRecognitionService } from '../services/SpeechRecognitionService'

export interface VoiceCommand {
  id: string
  command: string
  action: 'insert' | 'replace' | 'correct' | 'suggest' | 'complete' | 'navigate' | 'format'
  text?: string
  range?: { from: number; to: number }
  suggestion?: string
  confidence: number
  timestamp: number
}

export interface UseVoiceCommandsReturn {
  isListening: boolean
  isSupported: boolean
  lastCommand: VoiceCommand | null
  audioLevel: number
  error: string | null
  startListening: () => void
  stopListening: () => void
  processVoiceCommand: (command: string, context?: any) => Promise<VoiceCommand | null>
  clearLastCommand: () => void
}

export function useVoiceCommands(): UseVoiceCommandsReturn {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [lastCommand, setLastCommand] = useState<VoiceCommand | null>(null)
  const [audioLevel, setAudioLevel] = useState(0)
  const [error, setError] = useState<string | null>(null)
  
  const speechServiceRef = useRef<any>(null)
  const recognitionRef = useRef<any>(null)

  // Initialize speech recognition service
  useEffect(() => {
    const initializeSpeechService = async () => {
      try {
        const service = getSpeechRecognitionService()
        speechServiceRef.current = service
        
        const supported = await service.isSpeechRecognitionSupported()
        setIsSupported(supported)

        if (supported) {
          // Set up event listeners
          service.setOnAudioLevel((level: number) => {
            setAudioLevel(level)
          })

          service.setOnResult(async ({ transcript, isFinal }) => {
            await processVoiceCommand(transcript)
          })

          service.setOnError((error: string) => {
            setError(error)
            setIsListening(false)
          })

          service.setOnEnd((reason) => {
            if (reason === 'user') setIsListening(false)
          })
        }
      } catch (err) {
        console.error('Error initializing speech service:', err)
        setError('Failed to initialize speech recognition')
      }
    }

    initializeSpeechService()

    return () => {
      if (speechServiceRef.current) {
        speechServiceRef.current.stopListening()
      }
    }
  }, [])

  const startListening = useCallback(() => {
    if (!speechServiceRef.current || !isSupported) {
      setError('Speech recognition not supported')
      return
    }

    try {
      speechServiceRef.current.startListening()
      setIsListening(true)
      setError(null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start listening'
      setError(errorMessage)
    }
  }, [isSupported])

  const stopListening = useCallback(() => {
    if (!speechServiceRef.current) return

    try {
      speechServiceRef.current.stopListening()
      setIsListening(false)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to stop listening'
      setError(errorMessage)
    }
  }, [])

  const processVoiceCommand = useCallback(async (command: string, context?: any): Promise<VoiceCommand | null> => {
    try {
      setError(null)
      
      // Process command through Supabase
      const response = await supabaseService.processVoiceCommand(command, context)
      
      if (response) {
        const voiceCommand: VoiceCommand = {
          id: `cmd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          command,
          action: response.action as VoiceCommand['action'],
          text: response.text,
          range: response.range,
          suggestion: response.suggestion,
          confidence: response.confidence,
          timestamp: Date.now(),
        }
        
        setLastCommand(voiceCommand)
        return voiceCommand
      }
      
      return null
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process voice command'
      setError(errorMessage)
      return null
    }
  }, [])

  const clearLastCommand = useCallback(() => {
    setLastCommand(null)
  }, [])

  // Medical voice command shortcuts
  useEffect(() => {
    const handleMedicalShortcuts = (event: KeyboardEvent) => {
      // Ctrl/Cmd + M to start/stop voice listening
      if ((event.ctrlKey || event.metaKey) && event.key === 'm') {
        event.preventDefault()
        if (isListening) {
          stopListening()
        } else {
          startListening()
        }
      }
      
      // Ctrl/Cmd + Shift + M to clear last command
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'M') {
        event.preventDefault()
        clearLastCommand()
      }
    }

    document.addEventListener('keydown', handleMedicalShortcuts)
    return () => document.removeEventListener('keydown', handleMedicalShortcuts)
  }, [isListening, startListening, stopListening, clearLastCommand])

  return {
    isListening,
    isSupported,
    lastCommand,
    audioLevel,
    error,
    startListening,
    stopListening,
    processVoiceCommand,
    clearLastCommand,
  }
}
