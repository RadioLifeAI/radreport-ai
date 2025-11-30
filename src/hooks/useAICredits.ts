import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface AIBalance {
  balance: number;
  monthly_limit: number;
  plan_type: string;
  plan_expires_at: string | null;
}

export const useAICredits = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState<number>(0);
  const [monthlyLimit, setMonthlyLimit] = useState<number>(500);
  const [planType, setPlanType] = useState<string>('free');
  const [planExpiresAt, setPlanExpiresAt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('user_ai_balance')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          const { data: newBalance, error: insertError } = await supabase
            .from('user_ai_balance')
            .insert({ user_id: user.id, balance: 20, monthly_limit: 500, plan_type: 'free' })
            .select()
            .single();

          if (insertError) throw insertError;
          if (newBalance) {
            setBalance(newBalance.balance);
            setMonthlyLimit(newBalance.monthly_limit);
            setPlanType(newBalance.plan_type);
            setPlanExpiresAt(newBalance.plan_expires_at);
          }
        } else {
          throw error;
        }
      } else if (data) {
        setBalance(data.balance);
        setMonthlyLimit(data.monthly_limit);
        setPlanType(data.plan_type);
        setPlanExpiresAt(data.plan_expires_at);
      }
      setError(null);
    } catch (err: any) {
      console.error('Error fetching AI balance:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshBalance = useCallback(() => {
    fetchBalance();
  }, [user?.id]);

  const hasEnoughCredits = useCallback((creditsNeeded: number) => {
    return balance >= creditsNeeded;
  }, [balance]);

  useEffect(() => {
    fetchBalance();
  }, [user?.id]);

  return {
    balance,
    monthlyLimit,
    planType,
    planExpiresAt,
    isLoading,
    error,
    hasEnoughCredits,
    refreshBalance,
  };
};
