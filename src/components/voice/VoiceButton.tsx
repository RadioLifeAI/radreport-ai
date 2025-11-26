import React, { useEffect, useState } from 'react'
import { Mic, Square, Sparkles } from 'lucide-react'
import { parseCommand } from '@/lib/commands'
import { getSpeechRecognitionService } from '@/services/SpeechRecognitionService'

type Props = { 
  onText: (t: string) => void; 
  onCommand: (cmd: ReturnType<typeof parseCommand>) => void;
  onAIActivate?: () => void;
  aiMode?: boolean;
  busy?: boolean; // desabilitar durante chamadas IA
}

export default function VoiceButton({ onText, onCommand, onAIActivate, aiMode = false, busy = false }: Props){
  const [active, setActive] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<'idle'|'listening'|'waiting'|'processing'>('idle')
  const onTextRef = React.useRef(onText)
  const onCommandRef = React.useRef(onCommand)

  useEffect(() => { onTextRef.current = onText }, [onText])
  useEffect(() => { onCommandRef.current = onCommand }, [onCommand])

  useEffect(() => {
    const speechService = getSpeechRecognitionService();
    const supported = speechService.isSpeechRecognitionSupported();
    setIsSupported(supported);
    
    console.log('🎤 VoiceButton: Speech recognition supported:', supported);

    // Configurar callbacks
    speechService.setOnResult((result) => {
      console.log('🎤 VoiceButton: Processing result:', result);
      
      if (result.isFinal) {
        const cmd = parseCommand(result.transcript);
        console.log('🎤 VoiceButton: Parsed command:', cmd);
        
        if (cmd) {
          console.log('🎤 VoiceButton: Executing command:', cmd);
          onCommandRef.current(cmd);
        } else {
          console.log('🎤 VoiceButton: Inserting text:', result.transcript);
          onTextRef.current(result.transcript.trim() + ' ');
        }
        setStatus('waiting')
      } else {
        setStatus('listening')
      }
    });

    speechService.setOnError((error) => {
      console.error('🎤 VoiceButton: Speech recognition error:', error);
      setStatus('waiting')
    });

    speechService.setOnEnd((reason) => {
      console.log('🎤 VoiceButton: Speech recognition ended. reason=', reason);
      if (reason !== 'auto') {
        setActive(false);
        setStatus('idle');
      }
      // Em casos de auto-restart, onStatus irá atualizar para 'waiting' e manter ativo
    });

    speechService.setOnStatus((s) => {
      setStatus(s)
      setActive(s !== 'idle')
    })

    return () => {
      console.log('🎤 VoiceButton: Cleaning up');
      speechService.stopListening();
    };
  }, []);

  const startListening = async () => {
    console.log('🎤 VoiceButton: Starting listening...')
    
    if (!isSupported) {
      console.error('🎤 VoiceButton: Speech recognition not supported')
      alert('Reconhecimento de voz não suportado neste navegador')
      return;
    }

    setIsLoading(true);
    const speechService = getSpeechRecognitionService();
    
    try {
      // Solicitar permissão de microfone proativamente para evitar NotAllowedError
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          await navigator.mediaDevices.getUserMedia({ audio: true })
        } catch (permErr) {
          console.error('🎤 VoiceButton: Microphone permission error:', permErr)
          alert('Permissão de microfone negada. Habilite o acesso ao microfone.')
          return
        }
      }

      const success = speechService.startListening();
      console.log('🎤 VoiceButton: Start listening result:', success);
      
      if (success) {
        setActive(true);
        console.log('🎤 VoiceButton: Listening started successfully');
      } else {
        console.error('🎤 VoiceButton: Failed to start listening');
        alert('Erro ao iniciar reconhecimento de voz');
      }
    } catch (error) {
      console.error('🎤 VoiceButton: Error starting speech recognition:', error);
      alert('Erro ao iniciar ditado por voz');
    } finally {
      setIsLoading(false);
    }
  };

  const stopListening = () => {
    console.log('🎤 VoiceButton: Stopping listening...');
    const speechService = getSpeechRecognitionService();
    speechService.stopListening();
    setActive(false);
    console.log('🎤 VoiceButton: Listening stopped');
  };

  const toggle = () => {
    console.log('🎤 VoiceButton: Toggle called, active:', active);
    if (aiMode && onAIActivate) {
      onAIActivate();
      return;
    }
    if (active) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <button 
      className={`voice-button btn-toolbar ${active ? 'recording' : ''} ${(isLoading ? 'loading' : '')} ${aiMode ? 'ai-mode' : ''}`} 
      onClick={toggle} 
      aria-pressed={active} 
      title={
        isLoading ? 'Inicializando…' :
        active ? (status === 'listening' ? 'Ditando…' : 'Aguardando fala…') :
        (aiMode ? 'Ativar assistente IA por voz' : 'Iniciar ditado por voz')
      }
      disabled={isLoading || busy}
    >
      {aiMode ? <Sparkles size={16} /> : (active ? <Square size={16} /> : <Mic size={16} />)}
      {active && (
        <span className="voice-status" style={{ marginLeft: 6, fontSize: 12 }}>
          {status === 'listening' ? 'Ditando…' : 'Aguardando fala…'}
        </span>
      )}
    </button>
  )
}
