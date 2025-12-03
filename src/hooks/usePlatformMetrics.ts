import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PlatformMetrics {
  templates_count: number;
  frases_count: number;
  tables_count: number;
  calculators_count: number;
  dictionary_terms_count: number;
  modalities_count: number;
}

export interface PlanPriceData {
  id: string;
  amount_cents: number;
  amount_cents_annual: number | null;
  currency: string;
  interval: string;
}

export interface PlanData {
  id: string;
  code: string;
  name: string;
  description: string | null;
  badge: string | null;
  is_highlighted: boolean;
  display_order: number;
  ai_tokens_monthly: number;
  whisper_credits_monthly: number;
  feature_ai_conclusion: boolean;
  feature_ai_suggestions: boolean;
  feature_ai_rads: boolean;
  feature_whisper: boolean;
  feature_priority_support: boolean;
  prices: PlanPriceData[] | null;
}

export interface PlatformData {
  metrics: PlatformMetrics;
  plans: PlanData[];
  last_updated: string;
}

export const usePlatformMetrics = () => {
  return useQuery({
    queryKey: ['platform-metrics'],
    queryFn: async (): Promise<PlatformData> => {
      const { data, error } = await supabase.rpc('get_platform_metrics');
      if (error) throw error;
      return data as unknown as PlatformData;
    },
    staleTime: 60 * 60 * 1000, // 1 hour cache
  });
};
