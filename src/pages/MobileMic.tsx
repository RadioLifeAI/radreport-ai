import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Mic, MicOff, Wifi, WifiOff, Loader2, AlertCircle, Volume2 } from 'lucide-react';
import { useMobileAudioCapture } from '@/hooks/useMobileAudioCapture';

export default function MobileMic() {
  const [searchParams] = useSearchParams();
  const sessionToken = searchParams.get('session') || '';
  
  const {
    connectionState,
    isCapturing,
    audioLevel,
    currentMode,
    sessionValid,
    validateSession,
    startCapture,
    stopCapture,
    changeMode,
  } = useMobileAudioCapture();

  const [validating, setValidating] = useState(true);

  // Validate session on mount
  useEffect(() => {
    const validate = async () => {
      if (sessionToken) {
        await validateSession(sessionToken);
      }
      setValidating(false);
    };
    validate();
  }, [sessionToken, validateSession]);

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

  // Loading state
  if (validating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Validando sessão...</p>
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
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Mic className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">RadReport</h1>
          <p className="text-muted-foreground">Microfone Mobile</p>
        </div>

        {/* Status Card */}
        <Card>
          <CardHeader className="pb-3">
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
          
          {isCapturing && (
            <CardContent>
              {/* Audio Level Meter */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Volume2 className="w-4 h-4" />
                  <span>Nível de áudio</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all duration-75"
                    style={{ width: `${audioLevel}%` }}
                  />
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Mode Selection */}
        {!isCapturing && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Modo de Transcrição</CardTitle>
              <CardDescription>Escolha como o áudio será processado</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={currentMode}
                onValueChange={(value) => changeMode(value as 'webspeech' | 'whisper' | 'corrector')}
                className="space-y-3"
              >
                <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="webspeech" id="webspeech" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="webspeech" className="font-medium cursor-pointer">
                      Web Speech
                      <Badge variant="outline" className="ml-2 text-xs">Gratuito</Badge>
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      {getModeDescription('webspeech')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="whisper" id="whisper" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="whisper" className="font-medium cursor-pointer">
                      Whisper AI
                      <Badge variant="secondary" className="ml-2 text-xs">Premium</Badge>
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      {getModeDescription('whisper')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="corrector" id="corrector" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="corrector" className="font-medium cursor-pointer">
                      Web Speech + Corretor AI
                      <Badge variant="secondary" className="ml-2 text-xs">1 crédito</Badge>
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
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
          className={`w-full h-16 text-lg ${isCapturing ? 'bg-destructive hover:bg-destructive/90' : ''}`}
          onClick={isCapturing ? stopCapture : handleStartCapture}
        >
          {isCapturing ? (
            <>
              <MicOff className="w-6 h-6 mr-3" />
              Parar Captação
            </>
          ) : (
            <>
              <Mic className="w-6 h-6 mr-3" />
              Iniciar Captação
            </>
          )}
        </Button>

        {/* Footer */}
        <p className="text-xs text-center text-muted-foreground">
          Mantenha esta página aberta durante o ditado.
          O áudio é enviado diretamente para o desktop.
        </p>
      </div>
    </div>
  );
}
