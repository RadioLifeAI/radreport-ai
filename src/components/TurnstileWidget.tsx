import { useEffect, useRef } from 'react';

interface TurnstileWidgetProps {
  onSuccess: (token: string) => void;
  onError: (error: string) => void;
}

export default function TurnstileWidget({ onSuccess, onError }: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Cloudflare Turnstile implementation would go here
    // For now, we'll simulate a successful verification after 1 second
    const timer = setTimeout(() => {
      onSuccess('mock-turnstile-token');
    }, 1000);

    return () => clearTimeout(timer);
  }, [onSuccess]);

  return (
    <div ref={containerRef} className="flex justify-center py-4">
      <div className="w-full max-w-sm h-16 bg-muted/20 border border-border rounded-lg flex items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Verificação de segurança...
        </p>
      </div>
    </div>
  );
}
