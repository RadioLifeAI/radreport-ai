import { useCallback, useRef, useState } from 'react'
import { toast } from 'sonner'

interface UseAudioRecorderReturn {
  isRecording: boolean
  chunks: Blob[]
  start: (stream: MediaStream) => Promise<void>
  stop: () => Promise<void>
  restart: (stream: MediaStream) => Promise<void>
  getChunks: () => Blob[]
  clearChunks: () => void
}

/**
 * Hook para gerenciar gravação de áudio via MediaRecorder
 */
export function useAudioRecorder(): UseAudioRecorderReturn {
  const [isRecording, setIsRecording] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const SUPPORTED_MIMETYPES = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/ogg;codecs=opus',
    'audio/mp4'
  ]

  /**
   * Inicia gravação de áudio
   */
  const start = useCallback(async (stream: MediaStream): Promise<void> => {
    try {
      const mimeType = SUPPORTED_MIMETYPES.find(type => 
        MediaRecorder.isTypeSupported(type)
      )

      if (!mimeType) {
        throw new Error('Nenhum formato de áudio suportado')
      }

      const mediaRecorder = new MediaRecorder(stream, { mimeType })
      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.start(500) // 500ms timeslice
      mediaRecorderRef.current = mediaRecorder
      setIsRecording(true)

      console.log('🎙️ Audio recording started with', mimeType)
    } catch (error) {
      console.error('❌ Failed to start audio recording:', error)
      toast.error('Erro ao iniciar gravação de áudio')
      throw error
    }
  }, [])

  /**
   * Para gravação de áudio de forma assíncrona (aguarda último chunk)
   */
  const stop = useCallback(async (): Promise<void> => {
    return new Promise<void>((resolve) => {
      const mr = mediaRecorderRef.current
      if (!mr || mr.state === 'inactive') {
        setIsRecording(false)
        resolve()
        return
      }

      const onData = (event: BlobEvent) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      const onStop = () => {
        try {
          if (mr) {
            mr.ondataavailable = null
            mr.onstop = null
          }
        } catch (e) {
          console.error('Error cleaning up MediaRecorder:', e)
        }
        mediaRecorderRef.current = null
        setIsRecording(false)
        resolve()
      }

      mr.ondataavailable = onData
      mr.onstop = onStop
      
      try {
        mr.stop()
      } catch (e) {
        mediaRecorderRef.current = null
        setIsRecording(false)
        resolve()
      }
    })
  }, [])

  /**
   * Reinicia gravação (para novo segmento com header WebM)
   */
  const restart = useCallback(async (stream: MediaStream): Promise<void> => {
    await stop()
    await start(stream)
    console.log('🔄 MediaRecorder restarted for new segment')
  }, [start, stop])

  /**
   * Retorna chunks acumulados
   */
  const getChunks = useCallback((): Blob[] => {
    return [...chunksRef.current]
  }, [])

  /**
   * Limpa chunks
   */
  const clearChunks = useCallback((): void => {
    chunksRef.current = []
  }, [])

  return {
    isRecording,
    chunks: chunksRef.current,
    start,
    stop,
    restart,
    getChunks,
    clearChunks,
  }
}
