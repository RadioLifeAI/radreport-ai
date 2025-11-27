import React from 'react'
import { getSpeechRecognitionService } from '@/services/SpeechRecognitionService'
import { useAudioLevel } from '@/hooks/useAudioLevel'

type Props = { 
  className?: string
  mediaStream?: MediaStream | null
}

export default function SpeechStatusPanel({ className, mediaStream }: Props){
  const { level, startAnalysis, stopAnalysis } = useAudioLevel()
  const [status, setStatus] = React.useState<'idle'|'listening'|'processing'|'error'>('idle')
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const svc = getSpeechRecognitionService()
    setStatus(svc.isCurrentlyListening() ? 'listening' : 'idle')
    
    const errorCallback = (code: string) => {
      setError(code)
      setStatus('error')
    }
    const endCallback = () => {
      setStatus('idle')
      setError(null)
      stopAnalysis()
    }
    const resultCallback = (res: any) => {
      if (!res.isFinal) setStatus('processing')
      else setStatus('listening')
    }
    
    svc.setOnError(errorCallback)
    svc.setOnEnd(endCallback)
    svc.setOnResult(resultCallback)
    
    // ✅ Cleanup - remover callbacks ao desmontar
    return () => {
      svc.removeOnError(errorCallback)
      svc.removeOnEnd(endCallback)
      svc.removeOnResult(resultCallback)
    }
  }, [stopAnalysis])
  
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

  const statusDot = {
    idle: 'dot-idle',
    listening: 'dot-on',
    processing: 'dot-processing',
    error: 'dot-error',
  }[status]

  const errorLabel = error ? localizeError(error) : ''

  return (
    <div className={`speech-status-panel ${className || ''}`} aria-live="polite" title={errorLabel}>
      <span className={`status-dot ${statusDot}`} />
      <div className="audio-meter" aria-hidden>
        {meter}
      </div>
    </div>
  )
}

function localizeError(code: string): string {
  if (code === 'not-allowed') return 'Permissão negada para microfone'
  if (code === 'audio-capture') return 'Microfone não detectado'
  if (code === 'network') return 'Erro de rede'
  if (code === 'no-speech') return 'Nenhuma fala detectada'
  if (code === 'service-not-allowed') return 'Serviço não permitido'
  if (code === 'language-unavailable') return 'Idioma indisponível'
  if (code === 'language-not-supported') return 'Idioma não suportado'
  return 'Erro no reconhecimento de voz'
}