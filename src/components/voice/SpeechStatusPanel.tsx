import React from 'react'
import { useAudioLevel } from '@/hooks/useAudioLevel'

type Props = { 
  className?: string
  mediaStream?: MediaStream | null
  isActive?: boolean
}

export default function SpeechStatusPanel({ className, mediaStream, isActive = false }: Props){
  const { level, startAnalysis, stopAnalysis } = useAudioLevel()
  const [error, setError] = React.useState<string | null>(null)
  
  React.useEffect(() => {
    if (mediaStream) {
      startAnalysis(mediaStream)
    }
    return () => stopAnalysis()
  }, [mediaStream, startAnalysis, stopAnalysis])

  const meter = Array.from({ length: 3 }).map((_, i) => {
    const threshold = (i + 1) * 25
    const active = level >= threshold
    return (
      <span key={i} className={`audio-bar ${active ? 'on' : ''}`} />
    )
  })

  const status = isActive ? 'listening' : 'idle'
  const statusDot = {
    idle: 'dot-idle',
    listening: 'dot-on',
    processing: 'dot-processing',
    error: 'dot-error',
  }[status]

  const errorLabel = error ? 'Erro no reconhecimento' : ''

  return (
    <div className={`speech-status-panel ${className || ''}`} aria-live="polite" title={errorLabel}>
      <span className={`status-dot ${statusDot}`} />
      <div className="audio-meter" aria-hidden>
        {meter}
      </div>
    </div>
  )
}
