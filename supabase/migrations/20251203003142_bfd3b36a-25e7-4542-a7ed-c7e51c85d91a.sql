-- =============================================
-- Platform Metrics System
-- Automated metrics tracking for subscription features
-- =============================================

-- 1. Create platform_metrics table
CREATE TABLE IF NOT EXISTS public.platform_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_key VARCHAR(100) NOT NULL UNIQUE,
  metric_value INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  source VARCHAR(50) NOT NULL DEFAULT 'database', -- 'database' | 'static' | 'calculated'
  last_calculated_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.platform_metrics ENABLE ROW LEVEL SECURITY;

-- Public read access (metrics are public information)
CREATE POLICY "Platform metrics are publicly readable"
  ON public.platform_metrics
  FOR SELECT
  USING (true);

-- Only service role can modify
CREATE POLICY "Only service role can modify metrics"
  ON public.platform_metrics
  FOR ALL
  USING (false)
  WITH CHECK (false);

-- 2. Insert initial metrics
INSERT INTO public.platform_metrics (metric_key, metric_value, description, source) VALUES
  ('templates_count', 149, 'Templates de laudo ativos', 'database'),
  ('frases_count', 474, 'Frases modelo ativas', 'database'),
  ('tables_count', 100, 'Tabelas de referência RADS', 'static'),
  ('calculators_count', 25, 'Calculadoras médicas', 'static'),
  ('dictionary_terms_count', 4300, 'Termos no dicionário médico', 'static'),
  ('modalities_count', 5, 'Modalidades de exame', 'database')
ON CONFLICT (metric_key) DO UPDATE SET
  metric_value = EXCLUDED.metric_value,
  description = EXCLUDED.description,
  updated_at = now();

-- 3. Create refresh_platform_metrics function
CREATE OR REPLACE FUNCTION public.refresh_platform_metrics()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update templates count
  UPDATE platform_metrics 
  SET metric_value = (SELECT COUNT(*) FROM system_templates WHERE ativo = true),
      last_calculated_at = now(),
      updated_at = now()
  WHERE metric_key = 'templates_count';
  
  -- Update frases count
  UPDATE platform_metrics 
  SET metric_value = (SELECT COUNT(*) FROM frases_modelo WHERE ativa = true),
      last_calculated_at = now(),
      updated_at = now()
  WHERE metric_key = 'frases_count';
  
  -- Update modalities count
  UPDATE platform_metrics 
  SET metric_value = (SELECT COUNT(*) FROM modalidades WHERE ativa = true),
      last_calculated_at = now(),
      updated_at = now()
  WHERE metric_key = 'modalities_count';
END;
$$;

-- 4. Create get_platform_metrics function
CREATE OR REPLACE FUNCTION public.get_platform_metrics()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'metrics', (
      SELECT jsonb_object_agg(metric_key, metric_value)
      FROM platform_metrics
    ),
    'plans', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', sp.id,
          'code', sp.code,
          'name', sp.name,
          'description', sp.description,
          'badge', sp.badge,
          'is_highlighted', sp.is_highlighted,
          'display_order', sp.display_order,
          'ai_tokens_monthly', sp.ai_tokens_monthly,
          'whisper_credits_monthly', sp.whisper_credits_monthly,
          'feature_ai_conclusion', sp.feature_ai_conclusion,
          'feature_ai_suggestions', sp.feature_ai_suggestions,
          'feature_ai_rads', sp.feature_ai_rads,
          'feature_whisper', sp.feature_whisper,
          'feature_priority_support', sp.feature_priority_support,
          'prices', (
            SELECT jsonb_agg(
              jsonb_build_object(
                'id', spr.id,
                'amount_cents', spr.amount_cents,
                'amount_cents_annual', spr.amount_cents_annual,
                'currency', spr.currency,
                'interval', spr.interval
              )
            )
            FROM subscription_prices spr
            WHERE spr.plan_id = sp.id AND spr.is_active = true
          )
        ) ORDER BY sp.display_order
      )
      FROM subscription_plans sp
      WHERE sp.is_active = true
    ),
    'last_updated', (SELECT MAX(last_calculated_at) FROM platform_metrics)
  ) INTO result;
  
  RETURN result;
END;
$$;

-- 5. Grant execute permissions
GRANT EXECUTE ON FUNCTION public.refresh_platform_metrics() TO service_role;
GRANT EXECUTE ON FUNCTION public.get_platform_metrics() TO anon, authenticated;

-- 6. Run initial refresh
SELECT public.refresh_platform_metrics();