import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { 
  Mic, MicOff, Wifi, WifiOff, Loader2, AlertCircle, Volume2, Clock, 
  User, Shield, Pause, Play, RefreshCw, Sparkles, Wand2, Coins
} from 'lucide-react';
import { useMobileAudioCapture } from '@/hooks/useMobileAudioCapture';

export default function MobileMic() {
  const [searchParams] = useSearchParams();
  const sessionToken = searchParams.get('session') || '';
  const authToken = searchParams.get('auth') || '';
  
  const {
    connectionState,
    isCapturing,
    isPaused,
    audioLevel,
    sessionValid,
    userEmail,
    remainingSeconds,
    aiCredits,
    whisperCredits,
    isWhisperEnabled,
    isCorrectorEnabled,
    validateSession,
    startCapture,
    stopCapture,
    pauseCapture,
    resumeCapture,
    renewSession,
    toggleWhisper,
    toggleCorrector,
  } = useMobileAudioCapture();

  const [validating, setValidating] = useState(true);
  const [displayTime, setDisplayTime] = useState('');
  const [isRenewing, setIsRenewing] = useState(false);

  // Validate session on mount
  useEffect(() => {
    const validate = async () => {
      if (sessionToken) {
        await validateSession(sessionToken, authToken || undefined);
      }
      setValidating(false);
    };
    validate();
  }, [sessionToken, authToken, validateSession]);

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

  const handleStartCapture = () => startCapture(sessionToken);
  
  const handleRenewSession = async () => {
    setIsRenewing(true);
    await renewSession();
    setIsRenewing(false);
  };

  const progressValue = (remainingSeconds / 3600) * 100;
  const isLowTime = remainingSeconds < 300;

  // Loading state
  if (validating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Validando sessão segura...</p>
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
                  connectionState === 'connected' 
                    ? 'bg-green-500/10 text-green-600 border-green-500/30'
                    : connectionState === 'connecting'
                    ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30'
                    : 'bg-muted text-muted-foreground'
                }
              >
                {connectionState === 'connected' ? (
                  <><Wifi className="w-3 h-3 mr-1" /> Conectado</>
                ) : connectionState === 'connecting' ? (
                  <><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Conectando</>
                ) : (
                  <><WifiOff className="w-3 h-3 mr-1" /> Desconectado</>
                )}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-3 px-4 pb-3">
            {/* Audio Level */}
            {isCapturing && (
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <Label htmlFor="whisper-toggle" className="text-sm font-medium cursor-pointer">
                  Whisper AI
                </Label>
                <Badge variant="outline" className="text-xs py-0">{whisperCredits} créditos</Badge>
              </div>
              <Switch 
                id="whisper-toggle"
                checked={isWhisperEnabled}
                onCheckedChange={toggleWhisper}
                disabled={whisperCredits < 1}
              />
            </div>
            
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
                disabled={aiCredits < 1 || isWhisperEnabled}
              />
            </div>
          </CardContent>
        </Card>

        {/* Control Buttons */}
        <div className="space-y-2">
          {/* Main Action Button */}
          {!isCapturing ? (
            <Button
              size="lg"
              className="w-full h-14"
              onClick={handleStartCapture}
            >
              <Mic className="w-5 h-5 mr-2" />
              Iniciar Gravação
            </Button>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {/* Pause/Resume */}
              <Button
                variant="secondary"
                size="lg"
                className="h-12"
                onClick={isPaused ? resumeCapture : pauseCapture}
              >
                {isPaused ? (
                  <><Play className="w-4 h-4 mr-2" /> Retomar</>
                ) : (
                  <><Pause className="w-4 h-4 mr-2" /> Pausar</>
                )}
              </Button>
              
              {/* Stop */}
              <Button
                variant="destructive"
                size="lg"
                className="h-12"
                onClick={stopCapture}
              >
                <MicOff className="w-4 h-4 mr-2" />
                Parar
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
        </div>

        {/* Footer */}
        <p className="text-xs text-center text-muted-foreground pt-2">
          Mantenha esta página aberta durante o ditado
        </p>
      </div>
    </div>
  );
}
