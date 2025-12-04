import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';
import { useRef } from 'react';

interface TurnstileWidgetProps {
  onSuccess: (token: string) => void;
  onError: (error: string) => void;
  onExpire?: () => void;
}

export default function TurnstileWidget({ onSuccess, onError, onExpire }: TurnstileWidgetProps) {
  const turnstileRef = useRef<TurnstileInstance>(null);
  
  // Use test key for development, real key for production
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA';

  return (
    <div className="flex justify-center py-2">
      <Turnstile
        ref={turnstileRef}
        siteKey={siteKey}
        onSuccess={onSuccess}
        onError={() => onError('Falha na verificação de segurança. Tente novamente.')}
        onExpire={() => {
          onExpire?.();
          turnstileRef.current?.reset();
        }}
        options={{
          theme: 'dark',
          language: 'pt-br',
          size: 'normal',
        }}
      />
    </div>
  );
}
