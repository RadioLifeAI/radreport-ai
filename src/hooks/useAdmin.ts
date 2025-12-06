import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { logger } from '@/utils/logger';

export type AppRole = 'admin' | 'moderator' | 'user';

// Configuração de resiliência
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1s
const TIMEOUT_MS = 10000; // 10s

interface UseAdminResult {
  isAdmin: boolean;
  isModerator: boolean;
  loading: boolean;
  error: string | null;
  retryCount: number;
  hasRole: (role: AppRole) => Promise<boolean>;
  retry: () => void;
}

/**
 * Hook seguro para verificação de permissões administrativas
 * Implementa 3 camadas de verificação com fallback:
 * 1. RPC has_role (método principal)
 * 2. Retry com backoff exponencial
 * 3. Query direta em user_roles
 * 
 * Se todas falharem, admin deve acessar via Supabase Dashboard
 */
export const useAdmin = (): UseAdminResult => {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModerator, setIsModerator] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Delay com backoff exponencial
  const delay = (attempt: number) => 
    new Promise(resolve => setTimeout(resolve, INITIAL_RETRY_DELAY * Math.pow(2, attempt)));

  // Camada 1 & 2: RPC com retry
  const checkRoleViaRPC = async (userId: string, role: AppRole): Promise<boolean | null> => {
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

        const { data, error: rpcError } = await supabase.rpc('has_role', {
          _user_id: userId,
          _role: role
        });

        clearTimeout(timeoutId);

        if (!rpcError) {
          return data === true;
        }

        logger.warn(`RPC has_role tentativa ${attempt + 1}/${MAX_RETRIES} falhou:`, rpcError.message);
        
        if (attempt < MAX_RETRIES - 1) {
          await delay(attempt);
        }
      } catch (err) {
        logger.warn(`RPC has_role tentativa ${attempt + 1}/${MAX_RETRIES} erro:`, err);
        if (attempt < MAX_RETRIES - 1) {
          await delay(attempt);
        }
      }
    }
    return null; // Todas tentativas falharam
  };

  // Camada 3: Query direta em user_roles
  const checkRoleViaDirect = async (userId: string, role: AppRole): Promise<boolean | null> => {
    try {
      const { data, error: queryError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', role)
        .maybeSingle();

      if (!queryError) {
        return data !== null;
      }

      logger.warn('Query direta user_roles falhou:', queryError.message);
      return null;
    } catch (err) {
      logger.warn('Query direta user_roles erro:', err);
      return null;
    }
  };

  // Verificação multi-camada completa
  const checkRoleWithFallback = async (userId: string, role: AppRole): Promise<{
    hasRole: boolean;
    attempts: number;
  }> => {
    let attempts = 0;

    // Camada 1 & 2: RPC com retry
    attempts++;
    const rpcResult = await checkRoleViaRPC(userId, role);
    if (rpcResult !== null) {
      return { hasRole: rpcResult, attempts };
    }

    // Camada 3: Query direta
    attempts++;
    const directResult = await checkRoleViaDirect(userId, role);
    if (directResult !== null) {
      return { hasRole: directResult, attempts };
    }

    // Todas camadas falharam
    return { hasRole: false, attempts };
  };

  // Função pública para verificar role (usada externamente)
  const hasRole = async (role: AppRole): Promise<boolean> => {
    if (!user?.id) return false;
    
    const result = await checkRoleWithFallback(user.id, role);
    return result.hasRole;
  };

  // Função de retry manual
  const retry = useCallback(() => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    setRetryCount(prev => prev + 1);
  }, [user?.id]);

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
          checkRoleWithFallback(user.id, 'admin'),
          checkRoleWithFallback(user.id, 'moderator')
        ]);

        setIsAdmin(adminResult.hasRole);
        setIsModerator(moderatorResult.hasRole);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido na verificação';
        setError(errorMessage);
        logger.error('Erro fatal na verificação de permissões:', err);
        setIsAdmin(false);
        setIsModerator(false);
      } finally {
        setLoading(false);
      }
    };

    checkRoles();
  }, [user?.id, authLoading, retryCount]);

  return {
    isAdmin,
    isModerator,
    loading: loading || authLoading,
    error,
    retryCount,
    hasRole,
    retry
  };
};
