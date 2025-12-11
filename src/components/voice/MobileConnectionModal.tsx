import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Smartphone, Copy, Check, X, Wifi, WifiOff, Loader2, Shield, Clock } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useMobileAudioSession } from '@/hooks/useMobileAudioSession';
import { formatRemainingTime, getExpirationProgress, EXPIRATION_WARNING_THRESHOLD, getRemainingTime } from '@/utils/webrtcConfig';
import { useToast } from '@/hooks/use-toast';

interface TranscriptData {
  text: string;
  isFinal: boolean;
  confidence?: number;
}

interface MobileConnectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConnected?: (stream: MediaStream) => void;
  onTranscript?: (data: TranscriptData) => void;
  onRemoteStop?: () => void;
  onRemoteDisconnect?: () => void;
  onRemoteStart?: (mode: string) => void;
}

export function MobileConnectionModal({ open, onOpenChange, onConnected, onTranscript, onRemoteStop, onRemoteDisconnect, onRemoteStart }: MobileConnectionModalProps) {
  const { toast } = useToast();
  const { 
    session, 
    connectionState, 
    remoteStream, 
    currentMode,
    createSession, 
    endSession, 
    getConnectionUrl,
    isGeneratingToken,
    onRemoteTranscript,
    onRemoteStop: registerRemoteStop,
    onRemoteDisconnect: registerRemoteDisconnect,
    onRemoteStart: registerRemoteStart,
  } = useMobileAudioSession();
  
  const [copied, setCopied] = useState(false);
  const [remainingTime, setRemainingTime] = useState('60:00');
  const [progress, setProgress] = useState(100);
  const [isLowTime, setIsLowTime] = useState(false);

  // Create session when modal opens
  useEffect(() => {
    if (open && !session) {
      createSession();
    }
  }, [open, session, createSession]);

  // Update remaining time and progress
  useEffect(() => {
    if (!session) return;
    
    const updateTimer = () => {
      const { totalSeconds } = getRemainingTime(session.expiresAt);
      setRemainingTime(formatRemainingTime(session.expiresAt));
      setProgress(getExpirationProgress(session.expiresAt));
      setIsLowTime(totalSeconds < EXPIRATION_WARNING_THRESHOLD);
      
      // Show warning toast when time is low
      if (totalSeconds === EXPIRATION_WARNING_THRESHOLD) {
        toast({
          title: 'Sessão expirando',
          description: 'A sessão expira em 5 minutos.',
          variant: 'destructive',
        });
      }
    };
    
    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [session, toast]);

  // Notify parent when connected
  useEffect(() => {
    if (remoteStream && onConnected) {
      onConnected(remoteStream);
    }
  }, [remoteStream, onConnected]);

  // Register transcript callback
  useEffect(() => {
    if (onTranscript) {
      onRemoteTranscript(onTranscript);
    }
  }, [onTranscript, onRemoteTranscript]);

  // Register stop callback (triggers Corretor AI, session continues)
  useEffect(() => {
    if (onRemoteStop) {
      registerRemoteStop(onRemoteStop);
    }
  }, [onRemoteStop, registerRemoteStop]);

  // Register disconnect callback (ends session)
  useEffect(() => {
    if (onRemoteDisconnect) {
      registerRemoteDisconnect(onRemoteDisconnect);
    }
  }, [onRemoteDisconnect, registerRemoteDisconnect]);

  // Register start callback (activates remote dictation)
  useEffect(() => {
    if (onRemoteStart) {
      registerRemoteStart(onRemoteStart);
    }
  }, [onRemoteStart, registerRemoteStart]);

  const handleCopyLink = async () => {
    const url = getConnectionUrl();
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast({ title: 'Link copiado!', description: 'Cole no navegador do celular.' });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    if (connectionState === 'connected') {
      endSession();
    }
    onOpenChange(false);
  };

  const connectionUrl = getConnectionUrl();

  const getStatusBadge = () => {
    if (isGeneratingToken) {
      return (
        <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/30">
          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
          Gerando token seguro...
        </Badge>
      );
    }
    
    switch (connectionState) {
      case 'connecting':
        return (
          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/30">
            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            Aguardando conexão...
          </Badge>
        );
      case 'connected':
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">
            <Wifi className="w-3 h-3 mr-1" />
            Conectado
          </Badge>
        );
      case 'error':
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/30">
            <WifiOff className="w-3 h-3 mr-1" />
            Erro na conexão
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-muted text-muted-foreground">
            <WifiOff className="w-3 h-3 mr-1" />
            Desconectado
          </Badge>
        );
    }
  };

  const getModeLabel = (mode: string) => {
    switch (mode) {
      case 'webspeech': return 'Web Speech (gratuito)';
      case 'whisper': return 'Whisper AI';
      case 'corrector': return 'Corretor AI';
      default: return mode;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-primary" />
            Conectar Celular como Microfone
          </DialogTitle>
          <DialogDescription>
            Use seu celular como microfone externo para ditado de laudos
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          {/* Left: Instructions */}
          <div className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Como conectar:</h4>
              <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                <li>Abra a câmera do celular</li>
                <li>Escaneie o QR Code ao lado</li>
                <li>Permita acesso ao microfone</li>
                <li>Selecione o modo de transcrição</li>
                <li>Toque em "Iniciar Captação"</li>
              </ol>
            </div>

            {/* Security Badge */}
            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/5 border border-green-500/20">
              <Shield className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-700">Conexão autenticada e segura</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <span className="text-sm text-muted-foreground">Status:</span>
              {getStatusBadge()}
            </div>

            {connectionState === 'connected' && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5">
                <span className="text-sm text-muted-foreground">Modo:</span>
                <Badge variant="secondary">{getModeLabel(currentMode)}</Badge>
              </div>
            )}

            {/* Timer with Progress */}
            <div className="space-y-2 p-3 rounded-lg bg-muted/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Expira em:</span>
                </div>
                <Badge 
                  variant="outline" 
                  className={`font-mono ${isLowTime ? 'bg-orange-500/10 text-orange-600 border-orange-500/30' : ''}`}
                >
                  {remainingTime}
                </Badge>
              </div>
              <Progress value={progress} className={`h-1.5 ${isLowTime ? '[&>div]:bg-orange-500' : ''}`} />
            </div>
          </div>

          {/* Right: QR Code */}
          <div className="flex flex-col items-center justify-center space-y-4">
            {session && !isGeneratingToken ? (
              <>
                <div className="p-4 bg-white rounded-xl shadow-sm">
                  <QRCodeSVG 
                    value={connectionUrl} 
                    size={180}
                    level="M"
                    includeMargin={false}
                  />
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCopyLink}
                  className="w-full"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2 text-green-600" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copiar link
                    </>
                  )}
                </Button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-[180px] gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {isGeneratingToken ? 'Gerando token seguro...' : 'Criando sessão...'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          {connectionState === 'connected' ? (
            <Button variant="destructive" onClick={endSession}>
              <X className="w-4 h-4 mr-2" />
              Encerrar sessão
            </Button>
          ) : (
            <Button variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
