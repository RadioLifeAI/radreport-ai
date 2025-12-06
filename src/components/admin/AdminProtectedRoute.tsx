import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import { Loader2, ShieldAlert, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AdminProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'moderator';
}

const LOADING_TIMEOUT_MS = 15000; // 15 segundos

export const AdminProtectedRoute = ({ 
  children, 
  requiredRole = 'admin' 
}: AdminProtectedRouteProps) => {
  const { isAdmin, isModerator, loading, error, emergencyMode, retry } = useAdmin();
  const location = useLocation();
  const [timedOut, setTimedOut] = useState(false);

  // Timeout de loading
  useEffect(() => {
    if (!loading) {
      setTimedOut(false);
      return;
    }

    const timer = setTimeout(() => {
      setTimedOut(true);
    }, LOADING_TIMEOUT_MS);

    return () => clearTimeout(timer);
  }, [loading]);

  // Loading com timeout
  if (loading && !timedOut) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  // Timeout ou erro
  if (timedOut || error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 text-center p-8 max-w-md">
          <AlertTriangle className="h-16 w-16 text-yellow-500" />
          <h1 className="text-2xl font-bold text-foreground">
            {timedOut ? 'Tempo Esgotado' : 'Erro de Verificação'}
          </h1>
          <p className="text-muted-foreground">
            {timedOut 
              ? 'A verificação de permissões demorou mais que o esperado.' 
              : error || 'Não foi possível verificar suas permissões.'}
          </p>
          <Button onClick={retry} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  const hasRequiredRole = requiredRole === 'admin' ? isAdmin : (isAdmin || isModerator);

  if (!hasRequiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 text-center p-8">
          <ShieldAlert className="h-16 w-16 text-destructive" />
          <h1 className="text-2xl font-bold text-foreground">Acesso Negado</h1>
          <p className="text-muted-foreground max-w-md">
            Você não tem permissão para acessar esta área. 
            Entre em contato com o administrador se acredita que isso é um erro.
          </p>
          <Navigate to="/" state={{ from: location }} replace />
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Banner de modo emergência */}
      {emergencyMode && (
        <Alert variant="destructive" className="fixed top-0 left-0 right-0 z-50 rounded-none border-x-0 border-t-0">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>
              <strong>Modo Emergência:</strong> Acesso via fallback. Verifique a conexão com o banco de dados.
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={retry}
              className="ml-4 bg-background/20 hover:bg-background/40"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Reconectar
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      {/* Adiciona padding-top se banner visível */}
      <div className={emergencyMode ? 'pt-14' : ''}>
        {children}
      </div>
    </>
  );
};
