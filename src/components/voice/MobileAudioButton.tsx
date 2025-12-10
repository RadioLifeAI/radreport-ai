import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Wifi } from 'lucide-react';
import { MobileConnectionModal } from './MobileConnectionModal';

interface MobileAudioButtonProps {
  isConnected?: boolean;
  onStreamReceived?: (stream: MediaStream) => void;
  className?: string;
}

export function MobileAudioButton({ 
  isConnected = false, 
  onStreamReceived,
  className 
}: MobileAudioButtonProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setModalOpen(true)}
        className={`relative ${className}`}
      >
        <Smartphone className="w-4 h-4 mr-2" />
        {isConnected ? 'Celular conectado' : 'Conectar celular'}
        
        {isConnected && (
          <Badge 
            variant="outline" 
            className="absolute -top-2 -right-2 h-5 px-1.5 bg-green-500/10 text-green-600 border-green-500/30"
          >
            <Wifi className="w-3 h-3" />
          </Badge>
        )}
      </Button>

      <MobileConnectionModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onConnected={onStreamReceived}
      />
    </>
  );
}
