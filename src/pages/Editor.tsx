import { useEffect } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { Loader2 } from 'lucide-react';
import { ProfessionalEditorPage } from '@/components/ProfessionalEditorPage';
import { toast } from 'sonner';

export default function Editor() {
  const { isAuthenticated, loading } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const { refetch: refetchSubscription } = useSubscription();

  // Handle checkout return
  useEffect(() => {
    const checkoutStatus = searchParams.get('checkout');
    const sessionId = searchParams.get('session_id');
    
    if (checkoutStatus === 'success' && sessionId) {
      toast.success('Assinatura confirmada!', {
        description: 'Seu plano foi ativado com sucesso. Aproveite todos os recursos!',
        duration: 5000,
      });
      refetchSubscription();
      setSearchParams({});
    } else if (checkoutStatus === 'canceled') {
      toast.info('Checkout cancelado', {
        description: 'Você pode tentar novamente a qualquer momento.',
      });
      setSearchParams({});
    }
  }, [searchParams, setSearchParams, refetchSubscription]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <ProfessionalEditorPage
        onGenerateConclusion={(conclusion) => {
          console.log('Conclusion generated:', conclusion);
        }}
      />
    </div>
  );
}
