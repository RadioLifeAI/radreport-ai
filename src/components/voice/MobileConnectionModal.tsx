import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Copy, Check, X, Wifi, WifiOff, Loader2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useMobileAudioSession } from '@/hooks/useMobileAudioSession';
import { formatRemainingTime } from '@/utils/webrtcConfig';
import { useToast } from '@/hooks/use-toast';

interface MobileConnectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConnected?: (stream: MediaStream) => void;
}

export function MobileConnectionModal({ open, onOpenChange, onConnected }: MobileConnectionModalProps) {
  const { toast } = useToast();
  const { 
    session, 
    connectionState, 
    remoteStream, 
    currentMode,
    createSession, 
    endSession, 
    getConnectionUrl 
  } = useMobileAudioSession();
  
  const [copied, setCopied] = useState(false);
  const [remainingTime, setRemainingTime] = useState('60:00');

  // Create session when modal opens
  useEffect(() => {
    if (open && !session) {
      createSession();
    }
  }, [open, session, createSession]);

  // Update remaining time
  useEffect(() => {
    if (!session) return;
    
    const interval = setInterval(() => {
      setRemainingTime(formatRemainingTime(session.expiresAt));
    }, 1000);

    return () => clearInterval(interval);
  }, [session]);

  // Notify parent when connected
  useEffect(() => {
    if (remoteStream && onConnected) {
      onConnected(remoteStream);
    }
  }, [remoteStream, onConnected]);

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

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <span className="text-sm text-muted-foreground">Expira em:</span>
              <Badge variant="outline" className="font-mono">{remainingTime}</Badge>
            </div>
          </div>

          {/* Right: QR Code */}
          <div className="flex flex-col items-center justify-center space-y-4">
            {session ? (
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
              <div className="flex items-center justify-center h-[180px]">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
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
