import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export type AppRole = 'admin' | 'moderator' | 'user';

interface UseAdminResult {
  isAdmin: boolean;
  isModerator: boolean;
  loading: boolean;
  error: string | null;
  hasRole: (role: AppRole) => Promise<boolean>;
}

/**
 * Hook seguro para verificação de permissões administrativas
 * Usa RPC para chamar função SECURITY DEFINER no banco
 * NUNCA confie em verificações client-side para autorização real
 */
export const useAdmin = (): UseAdminResult => {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModerator, setIsModerator] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Verificação de role via RPC (SECURITY DEFINER function)
  const hasRole = async (role: AppRole): Promise<boolean> => {
    if (!user?.id) return false;
    
    try {
      const { data, error: rpcError } = await supabase.rpc('has_role', {
        _user_id: user.id,
        _role: role
      });
      
      if (rpcError) {
        console.error('Erro ao verificar role:', rpcError);
        return false;
      }
      
      return data === true;
    } catch (err) {
      console.error('Erro na verificação de role:', err);
      return false;
    }
  };

  useEffect(() => {
    const checkRoles = async () => {
      if (authLoading) return;
      
      if (!user?.id) {
        setIsAdmin(false);
        setIsModerator(false);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Verificar admin e moderator em paralelo
        const [adminResult, moderatorResult] = await Promise.all([
          hasRole('admin'),
          hasRole('moderator')
        ]);

        setIsAdmin(adminResult);
        setIsModerator(moderatorResult);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
        setError(errorMessage);
        console.error('Erro ao verificar permissões:', err);
      } finally {
        setLoading(false);
      }
    };

    checkRoles();
  }, [user?.id, authLoading]);

  return {
    isAdmin,
    isModerator,
    loading: loading || authLoading,
    error,
    hasRole
  };
};
