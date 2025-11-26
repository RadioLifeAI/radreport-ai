import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Mic, MicOff, Loader2, AlertCircle, Volume2, VolumeX, Settings } from 'lucide-react';
import { SpeechRecognitionService, MedicalCommandParser } from '@/services/SpeechRecognitionService';
import { whisperService } from '@/services/WhisperService';
import { VoiceCommandRecordingService } from '@/services/AudioRecordingService';

interface SpeechAIComponentProps {
  onAICommand: (command: string, parameters: Record<string, string>) => Promise<void>;
  onTranscription?: (text: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  onStatusChange?: (status: SpeechAIStatus) => void;
  className?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

interface SpeechAIStatus {
  isListening: boolean;
  isProcessing: boolean;
  lastCommand: string | null;
  lastTranscription: string;
  error: string | null;
  confidence: number;
  method: 'web-speech' | 'whisper' | null;
}

interface SpeechAISettings {
  autoStopSilence: boolean;
  silenceThreshold: number;
  useWhisperFallback: boolean;
  confidenceThreshold: number;
  language: string;
}

export const SpeechAIComponent: React.FC<SpeechAIComponentProps> = ({
  onAICommand,
  onTranscription,
  onError,
  onStatusChange,
  className = '',
  position = 'bottom'
}) => {
  const [status, setStatus] = useState<SpeechAIStatus>({
    isListening: false,
    isProcessing: false,
    lastCommand: null,
    lastTranscription: '',
    error: null,
    confidence: 0,
    method: null
  });

  const [settings, setSettings] = useState<SpeechAISettings>({
    autoStopSilence: true,
    silenceThreshold: 1000,
    useWhisperFallback: true,
    confidenceThreshold: 0.7,
    language: 'pt-BR'
  });

  const [showSettings, setShowSettings] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isSupported, setIsSupported] = useState(true);

  // Service refs
  const speechService = useRef<SpeechRecognitionService | null>(null);
  const whisperService = useRef<WhisperService | null>(null);
  const commandParser = useRef<MedicalCommandParser | null>(null);
  const voiceRecorder = useRef<VoiceCommandRecordingService | null>(null);

  // Initialize services
  useEffect(() => {
    try {
      // Check browser support
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setIsSupported(false);
        setStatus(prev => ({ ...prev, error: 'Reconhecimento de voz não suportado neste navegador' }));
        return;
      }

      // Initialize services
      speechService.current = new SpeechRecognitionService();
      whisperService.current = new WhisperService();
      commandParser.current = new MedicalCommandParser();
      voiceRecorder.current = new VoiceCommandRecordingService({
        maxDuration: 10,
        mimeType: 'audio/webm;codecs=opus',
        audioBitsPerSecond: 64000
      });

      // Set up speech recognition callbacks
      speechService.current.onResult((transcript, isFinal) => {
        setStatus(prev => ({ ...prev, lastTranscription: transcript }));
        if (onTranscription) {
          onTranscription(transcript, isFinal);
        }
      });

      speechService.current.onError((error) => {
        setStatus(prev => ({ ...prev, error, isListening: false, isProcessing: false }));
        if (onError) {
          onError(error);
        }
      });

      // Check microphone permission
      checkMicrophonePermission();

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao inicializar serviços de voz';
      setStatus(prev => ({ ...prev, error: errorMessage }));
      if (onError) {
        onError(errorMessage);
      }
    }

    return () => {
      // Cleanup
      speechService.current?.destroy();
      voiceRecorder.current?.destroy();
    };
  }, []);

  // Notify status changes
  useEffect(() => {
    if (onStatusChange) {
      onStatusChange(status);
    }
  }, [status, onStatusChange]);

  const checkMicrophonePermission = async () => {
    try {
      const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      setHasPermission(permission.state === 'granted');
      
      if (permission.state === 'denied') {
        setStatus(prev => ({ ...prev, error: 'Permissão de microfone negada. Por favor, habilite o microfone nas configurações do navegador.' }));
      }
    } catch (error) {
      // Fallback for browsers that don't support permissions API
      setHasPermission(null);
    }
  };

  const requestMicrophonePermission = async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setHasPermission(true);
      setStatus(prev => ({ ...prev, error: null }));
      return true;
    } catch (error) {
      setHasPermission(false);
      const errorMessage = 'Permissão de microfone negada. Por favor, permita o acesso ao microfone.';
      setStatus(prev => ({ ...prev, error: errorMessage }));
      if (onError) {
        onError(errorMessage);
      }
      return false;
    }
  };

  const processVoiceCommand = useCallback(async (audioBlob: Blob, duration: number) => {
    if (!whisperService.current || !commandParser.current) return;

    setStatus(prev => ({ ...prev, isProcessing: true, error: null }));

    try {
      // First, try Web Speech API for real-time processing
      const webSpeechText = status.lastTranscription;
      if (webSpeechText) {
        const webCommand = commandParser.current.parseCommand(webSpeechText);
        
        if (webCommand.confidence >= settings.confidenceThreshold) {
          await executeCommand(webCommand.action, webCommand.parameters, 'web-speech', webCommand.confidence);
          return;
        }
      }

      // Fallback to Whisper for higher accuracy
      if (settings.useWhisperFallback && whisperService.current.isConfigured()) {
        try {
          const whisperResult = await whisperService.current.transcribeWithMedicalContext(
            audioBlob,
            status.lastTranscription
          );
          
          const whisperCommand = commandParser.current.parseCommand(whisperResult.text);
          
          if (whisperCommand.confidence >= settings.confidenceThreshold * 0.8) { // Lower threshold for Whisper
            await executeCommand(whisperCommand.action, whisperCommand.parameters, 'whisper', whisperCommand.confidence);
            return;
          }
        } catch (whisperError) {
          console.warn('Whisper processing failed:', whisperError);
          // Continue with Web Speech result if available
        }
      }

      // If no command recognized, show feedback
      setStatus(prev => ({ 
        ...prev, 
        error: 'Comando não reconhecido. Tente: "corrigir", "sugerir", "melhorar", ou "validar".' 
      }));

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro no processamento de voz';
      setStatus(prev => ({ ...prev, error: errorMessage }));
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setStatus(prev => ({ ...prev, isProcessing: false }));
    }
  }, [status.lastTranscription, settings, onError]);

  const executeCommand = async (command: string, parameters: Record<string, string>, method: 'web-speech' | 'whisper', confidence: number) => {
    setStatus(prev => ({ 
      ...prev, 
      lastCommand: command,
      method,
      confidence
    }));

    try {
      await onAICommand(command, parameters);
      
      // Show success feedback
      const commandNames: Record<string, string> = {
        'correct_report': 'Correção de laudo',
        'correct_text': 'Correção de texto',
        'suggest_term': 'Sugestão de termo',
        'suggest_diagnosis': 'Sugestão de diagnóstico',
        'improve_text': 'Melhoria de texto',
        'validate_term': 'Validação de termo',
        'check_cid': 'Verificação CID'
      };
      
      const commandName = commandNames[command] || command;
      setStatus(prev => ({ 
        ...prev, 
        lastTranscription: `✅ ${commandName} executada com sucesso`,
        error: null
      }));

      // Clear success message after 3 seconds
      setTimeout(() => {
        setStatus(prev => ({ ...prev, lastTranscription: '' }));
      }, 3000);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao executar comando';
      setStatus(prev => ({ ...prev, error: errorMessage }));
      if (onError) {
        onError(errorMessage);
      }
    }
  };

  const toggleListening = async () => {
    if (!speechService.current || !voiceRecorder.current) return;

    if (status.isListening) {
      // Stop listening
      speechService.current.stopListening();
      voiceRecorder.current.destroy();
      setStatus(prev => ({ ...prev, isListening: false }));
    } else {
      // Check permission first
      if (hasPermission === false) {
        const granted = await requestMicrophonePermission();
        if (!granted) return;
      }

      try {
        // Start voice recording with command processing
        await voiceRecorder.current.startCommandRecording(processVoiceCommand);
        speechService.current.startListening();
        
        setStatus(prev => ({ 
          ...prev, 
          isListening: true, 
          error: null,
          lastTranscription: '🎤 Diga um comando: "corrigir", "sugerir", "melhorar", ou "validar"'
        }));

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro ao iniciar gravação';
        setStatus(prev => ({ ...prev, error: errorMessage }));
        if (onError) {
          onError(errorMessage);
        }
      }
    }
  };

  const getStatusIcon = () => {
    if (status.isProcessing) {
      return <Loader2 className="w-4 h-4 animate-spin" />;
    }
    if (status.isListening) {
      return <Volume2 className="w-4 h-4 text-red-500 animate-pulse" />;
    }
    return <Mic className="w-4 h-4" />;
  };

  const getStatusText = () => {
    if (status.isProcessing) {
      return 'Processando comando...';
    }
    if (status.isListening) {
      return 'Ouvindo comandos de voz';
    }
    return 'Ativar comando de voz';
  };

  const getContainerClasses = () => {
    const baseClasses = 'speech-ai-component bg-white border rounded-lg shadow-sm p-4';
    const positionClasses = {
      top: 'absolute top-4 left-4 right-4 z-50',
      bottom: 'fixed bottom-4 left-4 right-4 z-50',
      left: 'fixed left-4 top-1/2 transform -translate-y-1/2 z-50',
      right: 'fixed right-4 top-1/2 transform -translate-y-1/2 z-50'
    };
    
    return `${baseClasses} ${positionClasses[position]} ${className}`;
  };

  if (!isSupported) {
    return (
      <div className={getContainerClasses()}>
        <div className="flex items-center space-x-3">
          <VolumeX className="w-5 h-5 text-red-500" />
          <div>
            <p className="text-sm font-medium text-gray-900">Reconhecimento de voz não suportado</p>
            <p className="text-xs text-gray-500">Use Chrome, Edge ou Safari para este recurso</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={getContainerClasses()}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleListening}
            disabled={status.isProcessing}
            className={`p-2 rounded-lg border transition-colors ${
              status.isListening 
                ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' 
                : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            title={getStatusText()}
          >
            {getStatusIcon()}
          </button>
          
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">
              {getStatusText()}
            </p>
            {status.method && (
              <p className="text-xs text-gray-500">
                Método: {status.method === 'web-speech' ? 'Web Speech API' : 'Whisper AI'}
                {status.confidence > 0 && ` • Confiança: ${(status.confidence * 100).toFixed(0)}%`}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
          title="Configurações"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Status Messages */}
      {status.lastTranscription && (
        <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">{status.lastTranscription}</p>
        </div>
      )}

      {status.error && (
        <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-800">{status.error}</p>
        </div>
      )}

      {status.lastCommand && (
        <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            Último comando: <span className="font-medium">{status.lastCommand}</span>
          </p>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className="mb-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Configurações de Voz</h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700">Auto-parar em silêncio</label>
              <input
                type="checkbox"
                checked={settings.autoStopSilence}
                onChange={(e) => setSettings(prev => ({ ...prev, autoStopSilence: e.target.checked }))}
                className="rounded border-gray-300"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700">Usar Whisper como fallback</label>
              <input
                type="checkbox"
                checked={settings.useWhisperFallback}
                onChange={(e) => setSettings(prev => ({ ...prev, useWhisperFallback: e.target.checked }))}
                className="rounded border-gray-300"
              />
            </div>
            
            <div>
              <label className="text-sm text-gray-700 block mb-1">
                Limiar de confiança: {(settings.confidenceThreshold * 100).toFixed(0)}%
              </label>
              <input
                type="range"
                min="0.5"
                max="1"
                step="0.1"
                value={settings.confidenceThreshold}
                onChange={(e) => setSettings(prev => ({ ...prev, confidenceThreshold: parseFloat(e.target.value) }))}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="border-t pt-3">
        <p className="text-xs text-gray-500 mb-2">Comandos disponíveis:</p>
        <div className="grid grid-cols-2 gap-1 text-xs text-gray-600">
          <span className="bg-gray-100 px-2 py-1 rounded">"corrigir"</span>
          <span className="bg-gray-100 px-2 py-1 rounded">"sugerir"</span>
          <span className="bg-gray-100 px-2 py-1 rounded">"melhorar"</span>
          <span className="bg-gray-100 px-2 py-1 rounded">"validar"</span>
        </div>
      </div>
    </div>
  );
};

export default SpeechAIComponent;