import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        navigate('/editor', { replace: true });
      } else {
        navigate('/login?error=auth_failed', { replace: true });
      }
    };

    const timer = setTimeout(checkSession, 500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center animate-fade-in">
        <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
        <p className="text-lg font-medium mb-2">Processando autenticação...</p>
        <p className="text-sm text-muted-foreground">
          Aguarde, estamos verificando suas credenciais...
        </p>
      </div>
    </div>
  );
}
