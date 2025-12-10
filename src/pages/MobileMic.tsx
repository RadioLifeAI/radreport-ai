import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Mic, MicOff, Wifi, WifiOff, Loader2, AlertCircle, Volume2, Clock, User, Shield, Globe } from 'lucide-react';
import { useMobileAudioCapture } from '@/hooks/useMobileAudioCapture';

export default function MobileMic() {
  const [searchParams] = useSearchParams();
  const sessionToken = searchParams.get('session') || '';
  const authToken = searchParams.get('auth') || '';
  
  const {
    connectionState,
    isCapturing,
    audioLevel,
    currentMode,
    sessionValid,
    userEmail,
    sameNetwork,
    remainingSeconds,
    validateSession,
    startCapture,
    stopCapture,
    changeMode,
  } = useMobileAudioCapture();

  const [validating, setValidating] = useState(true);
  const [displayTime, setDisplayTime] = useState('');

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

  const handleStartCapture = () => {
    startCapture(sessionToken);
  };

  const getModeDescription = (mode: string) => {
    switch (mode) {
      case 'webspeech':
        return 'Transcrição gratuita via navegador. Boa qualidade, requer conexão estável.';
      case 'whisper':
        return 'Transcrição premium com IA. Melhor precisão, consome créditos.';
      case 'corrector':
        return 'Web Speech + correção IA. Corrige pontuação e formatação automaticamente.';
      default:
        return '';
    }
  };

  const progressValue = (remainingSeconds / 3600) * 100;
  const isLowTime = remainingSeconds < 300; // 5 minutes

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
            <CardDescription>
              O link de conexão é inválido ou expirou. Por favor, gere um novo QR Code no desktop.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Main UI
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto space-y-4">
        {/* Header */}
        <div className="text-center py-4">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-3">
            <Mic className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-xl font-bold">RadReport</h1>
          <p className="text-sm text-muted-foreground">Microfone Mobile</p>
        </div>

        {/* User Info Card */}
        {userEmail && (
          <Card className="border-green-500/30 bg-green-500/5">
            <CardContent className="py-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{userEmail}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant="outline" className="text-xs bg-green-500/10 text-green-600 border-green-500/30">
                      <Shield className="w-2.5 h-2.5 mr-1" />
                      Autenticado
                    </Badge>
                    {sameNetwork && (
                      <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-600 border-blue-500/30">
                        <Globe className="w-2.5 h-2.5 mr-1" />
                        Mesma rede
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Status Card */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Status da Conexão</CardTitle>
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
                  <><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Conectando...</>
                ) : (
                  <><WifiOff className="w-3 h-3 mr-1" /> Desconectado</>
                )}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-3">
            {/* Audio Level Meter */}
            {isCapturing && (
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Volume2 className="w-4 h-4" />
                  <span>Nível de áudio</span>
                </div>
                <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all duration-75"
                    style={{ width: `${audioLevel}%` }}
                  />
                </div>
              </div>
            )}

            {/* Session Timer */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Tempo restante</span>
                </div>
                <Badge 
                  variant="outline" 
                  className={`font-mono ${isLowTime ? 'bg-orange-500/10 text-orange-600 border-orange-500/30' : ''}`}
                >
                  {displayTime}
                </Badge>
              </div>
              <Progress value={progressValue} className={`h-1.5 ${isLowTime ? '[&>div]:bg-orange-500' : ''}`} />
            </div>
          </CardContent>
        </Card>

        {/* Mode Selection */}
        {!isCapturing && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Modo de Transcrição</CardTitle>
              <CardDescription className="text-xs">Escolha como o áudio será processado</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={currentMode}
                onValueChange={(value) => changeMode(value as 'webspeech' | 'whisper' | 'corrector')}
                className="space-y-2"
              >
                <div className="flex items-start space-x-3 p-2.5 rounded-lg border hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="webspeech" id="webspeech" className="mt-0.5" />
                  <div className="flex-1">
                    <Label htmlFor="webspeech" className="text-sm font-medium cursor-pointer">
                      Web Speech
                      <Badge variant="outline" className="ml-2 text-xs">Gratuito</Badge>
                    </Label>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {getModeDescription('webspeech')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-2.5 rounded-lg border hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="whisper" id="whisper" className="mt-0.5" />
                  <div className="flex-1">
                    <Label htmlFor="whisper" className="text-sm font-medium cursor-pointer">
                      Whisper AI
                      <Badge variant="secondary" className="ml-2 text-xs">Premium</Badge>
                    </Label>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {getModeDescription('whisper')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-2.5 rounded-lg border hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="corrector" id="corrector" className="mt-0.5" />
                  <div className="flex-1">
                    <Label htmlFor="corrector" className="text-sm font-medium cursor-pointer">
                      Web Speech + Corretor AI
                      <Badge variant="secondary" className="ml-2 text-xs">1 crédito</Badge>
                    </Label>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {getModeDescription('corrector')}
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        )}

        {/* Action Button */}
        <Button
          size="lg"
          className={`w-full h-14 text-base ${isCapturing ? 'bg-destructive hover:bg-destructive/90' : ''}`}
          onClick={isCapturing ? stopCapture : handleStartCapture}
        >
          {isCapturing ? (
            <>
              <MicOff className="w-5 h-5 mr-2" />
              Parar Captação
            </>
          ) : (
            <>
              <Mic className="w-5 h-5 mr-2" />
              Iniciar Captação
            </>
          )}
        </Button>

        {/* Footer */}
        <p className="text-xs text-center text-muted-foreground">
          Mantenha esta página aberta durante o ditado.
        </p>
      </div>
    </div>
  );
}
