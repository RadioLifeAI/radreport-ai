import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface SubscriptionStatus {
  subscribed: boolean;
  plan_code: string | null;
  plan_name: string | null;
  status: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  features: {
    ai_tokens_monthly: number;
    whisper_credits_monthly: number;
    feature_ai_conclusion: boolean;
    feature_ai_suggestions: boolean;
    feature_ai_rads: boolean;
    feature_ai_chat: boolean;
    feature_voice_dictation: boolean;
    feature_whisper: boolean;
    feature_templates: boolean;
    feature_export: boolean;
    feature_priority_support: boolean;
    max_user_templates?: number;
    max_user_frases?: number;
  } | null;
}

const FREE_PLAN: SubscriptionStatus = {
  subscribed: false,
  plan_code: 'free',
  plan_name: 'Gratuito',
  status: null,
  current_period_end: null,
  cancel_at_period_end: false,
  features: {
    ai_tokens_monthly: 20,
    whisper_credits_monthly: 0,
    feature_ai_conclusion: true,
    feature_ai_suggestions: true,
    feature_ai_rads: false,
    feature_ai_chat: false,
    feature_voice_dictation: true,
    feature_whisper: false,
    feature_templates: true,
    feature_export: true,
    feature_priority_support: false,
    max_user_templates: 5,
    max_user_frases: 10,
  },
};

export const useSubscription = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: subscription, isLoading, refetch } = useQuery({
    queryKey: ['subscription', user?.id],
    queryFn: async (): Promise<SubscriptionStatus> => {
      if (!user) return FREE_PLAN;
      
      try {
        const { data, error } = await supabase.functions.invoke('check-subscription');
        
        if (error) {
          console.error('Error checking subscription:', error);
          return FREE_PLAN;
        }
        
        return data as SubscriptionStatus;
      } catch (err) {
        console.error('Error invoking check-subscription:', err);
        return FREE_PLAN;
      }
    },
    enabled: !!user,
    staleTime: 60 * 1000, // 1 minuto
    refetchInterval: 5 * 60 * 1000, // Verificar a cada 5 minutos
  });

  const createCheckoutMutation = useMutation({
    mutationFn: async (priceId: string) => {
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { price_id: priceId }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      if (data?.url) {
        window.location.href = data.url;
      }
    },
    onError: (error) => {
      console.error('Checkout error:', error);
      toast.error('Erro ao criar sessão de checkout. Tente novamente.');
    },
  });

  const openPortalMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('create-portal-session');
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      if (data?.url) {
        window.location.href = data.url;
      }
    },
    onError: (error) => {
      console.error('Portal error:', error);
      toast.error('Erro ao abrir portal de assinatura. Tente novamente.');
    },
  });

  return {
    subscription: subscription || FREE_PLAN,
    isLoading,
    isSubscribed: subscription?.subscribed || false,
    planCode: subscription?.plan_code || 'free',
    planName: subscription?.plan_name || 'Gratuito',
    features: subscription?.features || FREE_PLAN.features,
    createCheckout: createCheckoutMutation.mutate,
    isCreatingCheckout: createCheckoutMutation.isPending,
    openPortal: openPortalMutation.mutate,
    isOpeningPortal: openPortalMutation.isPending,
    refetch,
  };
};
