import { useEffect, useRef, useState, useCallback } from 'react'

interface UseAudioLevelReturn {
  level: number // 0-100
  isAnalyzing: boolean
  startAnalysis: (stream: MediaStream) => void
  stopAnalysis: () => void
}

export function useAudioLevel(): UseAudioLevelReturn {
  const [level, setLevel] = useState(0)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const dataArrayRef = useRef<Uint8Array | null>(null)

  const startAnalysis = useCallback((stream: MediaStream) => {
    try {
      audioContextRef.current = new AudioContext()
      const source = audioContextRef.current.createMediaStreamSource(stream)
      
      analyserRef.current = audioContextRef.current.createAnalyser()
      analyserRef.current.fftSize = 256
      analyserRef.current.smoothingTimeConstant = 0.8
      
      dataArrayRef.current = new Uint8Array(analyserRef.current.frequencyBinCount)
      source.connect(analyserRef.current)
      
      setIsAnalyzing(true)
      
      const analyze = () => {
        if (!analyserRef.current || !dataArrayRef.current) return
        
        analyserRef.current.getByteFrequencyData(dataArrayRef.current as Uint8Array<ArrayBuffer>)
        
        // Calcular nível médio (0-100)
        let sum = 0
        for (let i = 0; i < dataArrayRef.current.length; i++) {
          sum += dataArrayRef.current[i]
        }
        const average = sum / dataArrayRef.current.length
        const normalizedLevel = Math.min(100, Math.round((average / 128) * 100))
        
        setLevel(normalizedLevel)
        animationFrameRef.current = requestAnimationFrame(analyze)
      }
      
      analyze()
    } catch (error) {
      console.error('Failed to start audio analysis:', error)
    }
  }, [])

  const stopAnalysis = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
    if (audioContextRef.current) {
      audioContextRef.current.close()
    }
    setLevel(0)
    setIsAnalyzing(false)
  }, [])

  useEffect(() => {
    return () => {
      stopAnalysis()
    }
  }, [stopAnalysis])

  return { level, isAnalyzing, startAnalysis, stopAnalysis }
}
