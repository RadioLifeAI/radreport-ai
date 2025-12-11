import { Mic, Square, Smartphone } from 'lucide-react'

interface VoiceButtonProps {
  isActive: boolean
  status: 'idle' | 'waiting' | 'listening'
  onStart: () => void
  onStop: () => void
  disabled?: boolean
  isTranscribing?: boolean
  isRemoteDictating?: boolean
}

export default function VoiceButton({ 
  isActive, 
  status, 
  onStart, 
  onStop, 
  disabled = false,
  isTranscribing = false,
  isRemoteDictating = false
}: VoiceButtonProps) {
  const toggle = () => {
    // Block local dictation when mobile is active
    if (isRemoteDictating) {
      return
    }
    if (isActive) {
      onStop()
    } else {
      onStart()
    }
  }

  const isListening = isActive || isRemoteDictating

  return (
    <button 
      className={`voice-button btn-toolbar ${isListening ? 'recording' : ''}`} 
      onClick={toggle} 
      aria-pressed={isListening} 
      title={
        isRemoteDictating
          ? 'Ditando via celular'
          : isActive 
            ? (status === 'listening' ? 'Ditando…' : 'Aguardando fala…')
            : 'Iniciar ditado por voz'
      }
      disabled={disabled || isRemoteDictating}
    >
      {isRemoteDictating ? (
        <Smartphone size={16} className="text-cyan-500 animate-pulse" />
      ) : isActive ? (
        <Square size={16} />
      ) : (
        <Mic size={16} />
      )}
      {isListening && (
        <span className="voice-status" style={{ marginLeft: 6, fontSize: 12 }}>
          {isTranscribing 
            ? '🎯 Refinando...' 
            : isRemoteDictating 
              ? '📱 Mobile' 
              : (status === 'listening' ? 'Ditando…' : 'Aguardando fala…')
          }
        </span>
      )}
    </button>
  )
}
