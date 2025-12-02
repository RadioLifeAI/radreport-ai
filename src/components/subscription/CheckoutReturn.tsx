import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSubscription } from '@/hooks/useSubscription';

export const CheckoutReturn = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refetch } = useSubscription();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      // Refresh subscription status
      refetch().then(() => {
        setStatus('success');
        // Auto-redirect after 3 seconds
        setTimeout(() => {
          navigate('/editor');
        }, 3000);
      }).catch(() => {
        setStatus('error');
      });
    } else {
      setStatus('error');
    }
  }, [sessionId, refetch, navigate]);

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground">Verificando pagamento...</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-center">
        <XCircle className="w-16 h-16 text-destructive" />
        <h2 className="text-2xl font-bold text-foreground">Algo deu errado</h2>
        <p className="text-muted-foreground max-w-md">
          Não foi possível verificar seu pagamento. Se você foi cobrado, entre em contato conosco.
        </p>
        <div className="flex gap-4 mt-4">
          <Button variant="outline" onClick={() => navigate('/assinaturas')}>
            Tentar Novamente
          </Button>
          <Button onClick={() => navigate('/contato')}>
            Contato
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-center">
      <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center animate-scale-in">
        <CheckCircle className="w-12 h-12 text-green-500" />
      </div>
      <h2 className="text-2xl font-bold gradient-text-medical">Assinatura Confirmada!</h2>
      <p className="text-muted-foreground max-w-md">
        Obrigado por assinar o RadReport. Você será redirecionado para o editor em instantes.
      </p>
      <Button onClick={() => navigate('/editor')} className="btn-premium mt-4">
        Ir para o Editor
      </Button>
    </div>
  );
};
