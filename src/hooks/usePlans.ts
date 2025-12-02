import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SubscriptionPlan {
  id: string;
  code: string;
  name: string;
  description: string | null;
  badge: string | null;
  is_highlighted: boolean;
  is_active: boolean;
  display_order: number;
  ai_tokens_monthly: number;
  whisper_credits_monthly: number;
  feature_ai_conclusion: boolean;
  feature_ai_suggestions: boolean;
  feature_ai_rads: boolean;
  feature_whisper: boolean;
  feature_priority_support: boolean;
  subscription_prices?: SubscriptionPrice[];
}

export interface SubscriptionPrice {
  id: string;
  plan_id: string;
  stripe_price_id: string | null;
  stripe_product_id: string | null;
  amount_cents: number;
  amount_cents_annual: number | null;
  currency: string;
  interval: string;
  interval_count: number;
  is_active: boolean;
  // Environment-specific Stripe IDs
  stripe_price_id_test: string | null;
  stripe_price_id_live: string | null;
  stripe_price_id_annual_test: string | null;
  stripe_price_id_annual_live: string | null;
}

export const usePlans = () => {
  return useQuery({
    queryKey: ['subscription-plans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select(`*, subscription_prices(*)`)
        .eq('is_active', true)
        .order('display_order');
      
      if (error) throw error;
      return (data || []) as unknown as SubscriptionPlan[];
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useAllPlans = () => {
  return useQuery({
    queryKey: ['subscription-plans-all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select(`*, subscription_prices(*)`)
        .order('display_order');
      
      if (error) throw error;
      return (data || []) as unknown as SubscriptionPlan[];
    },
  });
};

export const useStripeSettings = () => {
  return useQuery({
    queryKey: ['stripe-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stripe_settings' as any)
        .select('*');
      
      if (error) throw error;
      
      const settings: Record<string, string> = {};
      (data as any[])?.forEach((item) => {
        settings[item.setting_key] = item.setting_value || '';
      });
      
      return settings;
    },
  });
};
