import { Mic, Square } from 'lucide-react'

interface VoiceButtonProps {
  isActive: boolean
  status: 'idle' | 'waiting' | 'listening'
  onStart: () => void
  onStop: () => void
  disabled?: boolean
}

export default function VoiceButton({ 
  isActive, 
  status, 
  onStart, 
  onStop, 
  disabled = false 
}: VoiceButtonProps) {
  const toggle = () => {
    if (isActive) {
      onStop()
    } else {
      onStart()
    }
  }

  return (
    <button 
      className={`voice-button btn-toolbar ${isActive ? 'recording' : ''}`} 
      onClick={toggle} 
      aria-pressed={isActive} 
      title={
        isActive 
          ? (status === 'listening' ? 'Ditando…' : 'Aguardando fala…')
          : 'Iniciar ditado por voz'
      }
      disabled={disabled}
    >
      {isActive ? <Square size={16} /> : <Mic size={16} />}
      {isActive && (
        <span className="voice-status" style={{ marginLeft: 6, fontSize: 12 }}>
          {status === 'listening' ? 'Ditando…' : 'Aguardando fala…'}
        </span>
      )}
    </button>
  )
}
