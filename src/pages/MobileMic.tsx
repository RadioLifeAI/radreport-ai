import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Mic, MicOff, Wifi, WifiOff, Loader2, AlertCircle, Volume2, Clock, 
  User, Shield, Pause, Play, RefreshCw, Sparkles, Wand2, Coins, Unplug
} from 'lucide-react';
import { useMobileAudioCapture } from '@/hooks/useMobileAudioCapture';

// Type for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

export default function MobileMic() {
  const [searchParams] = useSearchParams();
  const sessionToken = searchParams.get('session') || '';
  const authToken = searchParams.get('auth') || '';
  
  const {
    connectionState,
    isRealtimeConnected,
    isWebRTCConnected,
    isDictating,
    isPaused,
    audioLevel,
    sessionValid,
    userEmail,
    remainingSeconds,
    aiCredits,
    whisperCredits,
    isWhisperEnabled,
    isCorrectorEnabled,
    currentMode,
    validateSession,
    connectRealtime,
    disconnectSession,
    startDictation,
    stopDictation,
    pauseDictation,
    resumeDictation,
    renewSession,
    toggleWhisper,
    toggleCorrector,
    sendTranscript,
    setSimulatedAudioLevel,
  } = useMobileAudioCapture();

  const [validating, setValidating] = useState(true);
  const [displayTime, setDisplayTime] = useState('');
  const [isRenewing, setIsRenewing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  // Web Speech API refs
  const recognitionRef = useRef<any>(null);
  const isActiveRef = useRef(false);
  const lastTranscriptTimeRef = useRef(0);

  // Validate session on mount and auto-connect ONLY Realtime (not WebRTC)
  useEffect(() => {
    const validateAndConnect = async () => {
      if (sessionToken) {
        const valid = await validateSession(sessionToken, authToken || undefined);
        if (valid) {
          // Auto-connect Realtime channel only (for text-based modes)
          await connectRealtime(sessionToken);
        }
      }
      setValidating(false);
    };
    validateAndConnect();
  }, [sessionToken, authToken, validateSession, connectRealtime]);

  // Web Speech Recognition for webspeech/corrector modes
  const startWebSpeech = useCallback(() => {
    if (currentMode !== 'webspeech' && currentMode !== 'corrector') return;
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('[MobileMic] Web Speech API not supported');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'pt-BR';

    recognition.onresult = (event: any) => {
      const result = event.results[event.results.length - 1];
      const transcript = result[0].transcript;
      const confidence = result[0].confidence;
      const isFinal = result.isFinal;

      // Throttle interim transcripts (100ms minimum between sends)
      const now = Date.now();
      if (!isFinal && now - lastTranscriptTimeRef.current < 100) {
        // Update visual audio level even if we skip sending
        setSimulatedAudioLevel(60 + Math.random() * 30);
        return;
      }
      lastTranscriptTimeRef.current = now;

      // Simulate audio level based on speech activity
      if (isFinal) {
        setSimulatedAudioLevel(0);
      } else {
        setSimulatedAudioLevel(60 + Math.random() * 30);
      }

      // Send transcript to desktop via Realtime
      sendTranscript(transcript, isFinal, confidence);
      console.log('[MobileMic] Transcript:', isFinal ? 'FINAL' : 'interim', transcript.substring(0, 50));
    };

    recognition.onspeechstart = () => {
      setSimulatedAudioLevel(70);
    };

    recognition.onspeechend = () => {
      setSimulatedAudioLevel(0);
    };

    recognition.onerror = (event: any) => {
      console.warn('[MobileMic] Speech error:', event.error);
      if (event.error === 'no-speech' && isActiveRef.current) {
        setTimeout(() => {
          if (isActiveRef.current && recognitionRef.current) {
            try { recognitionRef.current.start(); } catch (e) { /* ignore */ }
          }
        }, 150);
      }
    };

    recognition.onend = () => {
      setSimulatedAudioLevel(0);
      if (isActiveRef.current) {
        setTimeout(() => {
          if (isActiveRef.current && recognitionRef.current) {
            try { recognitionRef.current.start(); } catch (e) { /* ignore */ }
          }
        }, 100);
      }
    };

    recognition.start();
    recognitionRef.current = recognition;
    isActiveRef.current = true;
    setIsListening(true);
    console.log('[MobileMic] Web Speech started');
  }, [currentMode, sendTranscript, setSimulatedAudioLevel]);

  const stopWebSpeech = useCallback(() => {
    isActiveRef.current = false;
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
    setSimulatedAudioLevel(0);
    console.log('[MobileMic] Web Speech stopped');
  }, [setSimulatedAudioLevel]);

  // Update display time
  useEffect(() => {
    const updateTime = () => {
      const mins = Math.floor(remainingSeconds / 60);
      const secs = remainingSeconds % 60;
      setDisplayTime(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
    };
    updateTime();
    
    const interval = setInterval(() => {
      setDisplayTime(prev => {
        const [mins, secs] = prev.split(':').map(Number);
        if (mins === 0 && secs === 0) return '00:00';
        const totalSecs = mins * 60 + secs - 1;
        const newMins = Math.floor(totalSecs / 60);
        const newSecs = totalSecs % 60;
        return `${newMins.toString().padStart(2, '0')}:${newSecs.toString().padStart(2, '0')}`;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [remainingSeconds]);

  // Start/stop Web Speech when dictating starts/stops (only for text-based modes)
  useEffect(() => {
    if (isDictating && isRealtimeConnected && !isPaused && (currentMode === 'webspeech' || currentMode === 'corrector')) {
      startWebSpeech();
    } else {
      stopWebSpeech();
    }
    return () => stopWebSpeech();
  }, [isDictating, isRealtimeConnected, currentMode, isPaused, startWebSpeech, stopWebSpeech]);

  const handleStartDictation = () => {
    startDictation();
  };

  const handleStopDictation = () => {
    stopDictation();
  };
  
  const handleRenewSession = async () => {
    setIsRenewing(true);
    await renewSession();
    setIsRenewing(false);
  };

  const progressValue = (remainingSeconds / 3600) * 100;
  const isLowTime = remainingSeconds < 300;

  // Can start dictation? For text modes, only need Realtime
  const canStartDictation = currentMode === 'whisper' 
    ? isWebRTCConnected 
    : isRealtimeConnected;

  // Loading state
  if (validating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Validando e conectando...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Invalid session
  if (!sessionValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <CardTitle>Sessão Inválida</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              O link de conexão é inválido ou expirou. Gere um novo QR Code no desktop.
            </p>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto space-y-4">
        {/* Header with Credits */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Mic className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold">RadReport</h1>
              <p className="text-xs text-muted-foreground">Microfone Mobile</p>
            </div>
          </div>
          
          {/* Credits Display */}
          <div className="flex gap-2">
            <Badge variant="outline" className="gap-1.5 px-2 py-1">
              <Coins className="w-3 h-3 text-cyan-500" />
              <span className="text-xs font-medium">{aiCredits}</span>
            </Badge>
            <Badge variant="outline" className="gap-1.5 px-2 py-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span className="text-xs font-medium">{whisperCredits}</span>
            </Badge>
          </div>
        </div>

        {/* User Info */}
        {userEmail && (
          <Card className="border-green-500/30 bg-green-500/5">
            <CardContent className="py-2.5 px-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium truncate flex-1">{userEmail}</span>
                <Badge variant="outline" className="text-xs bg-green-500/10 text-green-600 border-green-500/30">
                  <Shield className="w-2.5 h-2.5 mr-1" />
                  Autenticado
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Status & Timer Card */}
        <Card>
          <CardHeader className="pb-2 pt-3 px-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <Badge 
                variant="outline" 
                className={
                  isRealtimeConnected 
                    ? 'bg-green-500/10 text-green-600 border-green-500/30'
                    : connectionState === 'connecting'
                    ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30'
                    : 'bg-muted text-muted-foreground'
                }
              >
                {isRealtimeConnected ? (
                  <><Wifi className="w-3 h-3 mr-1" /> Conectado</>
                ) : connectionState === 'connecting' ? (
                  <><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Conectando</>
                ) : (
                  <><WifiOff className="w-3 h-3 mr-1" /> Desconectado</>
                )}
              </Badge>
            </div>
            {/* Feedback visual: conectando */}
            {sessionValid && !isRealtimeConnected && connectionState === 'connecting' && (
              <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" />
                Estabelecendo conexão...
              </div>
            )}
          </CardHeader>
          
          <CardContent className="space-y-3 px-4 pb-3">
            {/* Audio Level */}
            {isDictating && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Nível de áudio</span>
                  {isPaused && <Badge variant="secondary" className="text-xs py-0 px-1.5">Pausado</Badge>}
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-75 ${isPaused ? 'bg-muted-foreground/30' : 'bg-gradient-to-r from-green-500 via-yellow-500 to-red-500'}`}
                    style={{ width: `${isPaused ? 0 : audioLevel}%` }}
                  />
                </div>
              </div>
            )}

            {/* Session Timer */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Tempo restante</span>
                </div>
                <Badge 
                  variant="outline" 
                  className={`font-mono text-xs ${isLowTime ? 'bg-orange-500/10 text-orange-600 border-orange-500/30' : ''}`}
                >
                  {displayTime}
                </Badge>
              </div>
              <Progress value={progressValue} className={`h-1 ${isLowTime ? '[&>div]:bg-orange-500' : ''}`} />
            </div>
          </CardContent>
        </Card>

        {/* Mode Toggles */}
        <Card>
          <CardContent className="py-3 px-4 space-y-3">
            {/* Whisper Toggle - Disabled until WebRTC audio streaming is implemented */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <Label htmlFor="whisper-toggle" className="text-sm font-medium cursor-pointer">
                  Whisper AI
                </Label>
                <Badge variant="outline" className="text-xs py-0">{whisperCredits} créditos</Badge>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Switch 
                        id="whisper-toggle"
                        checked={isWhisperEnabled}
                        onCheckedChange={toggleWhisper}
                        disabled={whisperCredits < 1 || isDictating}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[200px]">
                    <p className="text-xs">
                      {whisperCredits < 1 
                        ? 'Sem créditos Whisper disponíveis.' 
                        : 'Transcrição premium via IA. Consome 1 crédito/minuto.'}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            {/* Corretor AI Toggle - Works with text-based modes */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-cyan-500" />
                <Label htmlFor="corrector-toggle" className="text-sm font-medium cursor-pointer">
                  Corretor AI
                </Label>
                <Badge variant="outline" className="text-xs py-0">{aiCredits} créditos</Badge>
              </div>
              <Switch 
                id="corrector-toggle"
                checked={isCorrectorEnabled}
                onCheckedChange={toggleCorrector}
                disabled={aiCredits < 1 || isDictating}
              />
            </div>
          </CardContent>
        </Card>

        {/* Control Buttons */}
        <div className="space-y-2">
          {/* Main Action Button - Iniciar/Parar Ditado */}
          {!isDictating ? (
            <Button
              size="lg"
              className="w-full h-14"
              onClick={handleStartDictation}
              disabled={!canStartDictation}
            >
              <Mic className="w-5 h-5 mr-2" />
              Iniciar Ditado
            </Button>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {/* Pause/Resume */}
              <Button
                variant="secondary"
                size="lg"
                className="h-12"
                onClick={isPaused ? resumeDictation : pauseDictation}
              >
                {isPaused ? (
                  <><Play className="w-4 h-4 mr-2" /> Retomar</>
                ) : (
                  <><Pause className="w-4 h-4 mr-2" /> Pausar</>
                )}
              </Button>
              
              {/* Stop Dictation */}
              <Button
                variant="destructive"
                size="lg"
                className="h-12"
                onClick={handleStopDictation}
              >
                <MicOff className="w-4 h-4 mr-2" />
                Parar Ditado
              </Button>
            </div>
          )}
          
          {/* Renew Session */}
          {isLowTime && (
            <Button
              variant="outline"
              className="w-full"
              onClick={handleRenewSession}
              disabled={isRenewing}
            >
              {isRenewing ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Renovar Sessão (+60 min)
            </Button>
          )}

          {/* Disconnect Button - Always visible when session is valid */}
          {sessionValid && (
            <Button
              variant="outline"
              className="w-full text-muted-foreground hover:text-destructive hover:border-destructive"
              onClick={disconnectSession}
            >
              <Unplug className="w-4 h-4 mr-2" />
              {isRealtimeConnected ? 'Desconectar' : 'Cancelar Sessão'}
            </Button>
          )}
        </div>

        {/* Footer */}
        <p className="text-xs text-center text-muted-foreground pt-2">
          Mantenha esta página aberta durante o ditado
        </p>
      </div>
    </div>
  );
}
