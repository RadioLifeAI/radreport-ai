import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import { Loader2, ShieldAlert } from 'lucide-react';

interface AdminProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'moderator';
}

export const AdminProtectedRoute = ({ 
  children, 
  requiredRole = 'admin' 
}: AdminProtectedRouteProps) => {
  const { isAdmin, isModerator, loading } = useAdmin();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Verificando permissões...</p>
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

  return <>{children}</>;
};
