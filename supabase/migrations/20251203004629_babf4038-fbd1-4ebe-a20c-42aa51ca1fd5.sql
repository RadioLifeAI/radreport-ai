-- =============================================
-- PLAN FEATURES SYSTEM
-- Master list of features + assignments per plan
-- =============================================

-- 1. Master list of all available features
CREATE TABLE public.plan_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_key VARCHAR(100) NOT NULL UNIQUE,
  display_name VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  display_order INTEGER DEFAULT 0,
  is_dynamic BOOLEAN DEFAULT false,
  dynamic_field VARCHAR(100),
  dynamic_suffix VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Feature assignments per plan (junction table)
CREATE TABLE public.plan_feature_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id uuid NOT NULL REFERENCES public.subscription_plans(id) ON DELETE CASCADE,
  feature_id uuid NOT NULL REFERENCES public.plan_features(id) ON DELETE CASCADE,
  is_included BOOLEAN DEFAULT true,
  custom_text VARCHAR(255),
  display_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(plan_id, feature_id)
);

-- 3. RLS Policies
ALTER TABLE public.plan_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_feature_assignments ENABLE ROW LEVEL SECURITY;

-- Public read for features
CREATE POLICY "Plan features are publicly readable"
  ON public.plan_features FOR SELECT
  USING (true);

-- Admin manage features
CREATE POLICY "Admins can manage plan features"
  ON public.plan_features FOR ALL
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- Public read for assignments
CREATE POLICY "Plan feature assignments are publicly readable"
  ON public.plan_feature_assignments FOR SELECT
  USING (true);

-- Admin manage assignments
CREATE POLICY "Admins can manage plan feature assignments"
  ON public.plan_feature_assignments FOR ALL
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- 4. Insert master features
INSERT INTO public.plan_features (feature_key, display_name, display_order, is_dynamic, dynamic_field, dynamic_suffix) VALUES
  ('ai_tokens', 'tokens IA/mês', 1, true, 'ai_tokens_monthly', 'tokens IA/mês'),
  ('whisper_credits', 'créditos Whisper/mês', 2, true, 'whisper_credits_monthly', 'créditos Whisper/mês'),
  ('voice_dictation', 'Ditado por voz nativo', 3, false, NULL, NULL),
  ('templates', 'Templates e frases modelo', 4, false, NULL, NULL),
  ('reference_tables', 'Tabelas de referência', 5, false, NULL, NULL),
  ('calculators', 'Calculadoras médicas', 6, false, NULL, NULL),
  ('ai_suggestions', 'IA Sugestões', 7, false, NULL, NULL),
  ('ai_conclusion', 'IA Conclusão', 8, false, NULL, NULL),
  ('ai_rads', 'Classificação RADS', 9, false, NULL, NULL),
  ('chat_ai', 'Chat IA Radiológico', 10, false, NULL, NULL),
  ('voice_corrector', 'Corretor IA de Voz', 11, false, NULL, NULL),
  ('onboarding', 'Onboarding dedicado', 12, false, NULL, NULL),
  ('support_email', 'Suporte por email', 13, false, NULL, NULL),
  ('support_priority', 'Suporte prioritário', 14, false, NULL, NULL),
  ('support_vip', 'Suporte VIP', 15, false, NULL, NULL);

-- 5. Insert feature assignments for each plan
-- Get plan IDs and feature IDs for assignments
DO $$
DECLARE
  v_free_id uuid;
  v_basico_id uuid;
  v_profissional_id uuid;
  v_premium_id uuid;
  v_feat_ai_tokens uuid;
  v_feat_whisper uuid;
  v_feat_voice uuid;
  v_feat_templates uuid;
  v_feat_tables uuid;
  v_feat_calc uuid;
  v_feat_suggestions uuid;
  v_feat_conclusion uuid;
  v_feat_rads uuid;
  v_feat_chat uuid;
  v_feat_corrector uuid;
  v_feat_onboarding uuid;
  v_feat_email uuid;
  v_feat_priority uuid;
  v_feat_vip uuid;
BEGIN
  -- Get plan IDs
  SELECT id INTO v_free_id FROM subscription_plans WHERE code = 'free';
  SELECT id INTO v_basico_id FROM subscription_plans WHERE code = 'basico';
  SELECT id INTO v_profissional_id FROM subscription_plans WHERE code = 'profissional';
  SELECT id INTO v_premium_id FROM subscription_plans WHERE code = 'premium';
  
  -- Get feature IDs
  SELECT id INTO v_feat_ai_tokens FROM plan_features WHERE feature_key = 'ai_tokens';
  SELECT id INTO v_feat_whisper FROM plan_features WHERE feature_key = 'whisper_credits';
  SELECT id INTO v_feat_voice FROM plan_features WHERE feature_key = 'voice_dictation';
  SELECT id INTO v_feat_templates FROM plan_features WHERE feature_key = 'templates';
  SELECT id INTO v_feat_tables FROM plan_features WHERE feature_key = 'reference_tables';
  SELECT id INTO v_feat_calc FROM plan_features WHERE feature_key = 'calculators';
  SELECT id INTO v_feat_suggestions FROM plan_features WHERE feature_key = 'ai_suggestions';
  SELECT id INTO v_feat_conclusion FROM plan_features WHERE feature_key = 'ai_conclusion';
  SELECT id INTO v_feat_rads FROM plan_features WHERE feature_key = 'ai_rads';
  SELECT id INTO v_feat_chat FROM plan_features WHERE feature_key = 'chat_ai';
  SELECT id INTO v_feat_corrector FROM plan_features WHERE feature_key = 'voice_corrector';
  SELECT id INTO v_feat_onboarding FROM plan_features WHERE feature_key = 'onboarding';
  SELECT id INTO v_feat_email FROM plan_features WHERE feature_key = 'support_email';
  SELECT id INTO v_feat_priority FROM plan_features WHERE feature_key = 'support_priority';
  SELECT id INTO v_feat_vip FROM plan_features WHERE feature_key = 'support_vip';

  -- FREE plan assignments
  IF v_free_id IS NOT NULL THEN
    INSERT INTO plan_feature_assignments (plan_id, feature_id, is_included) VALUES
      (v_free_id, v_feat_ai_tokens, true),
      (v_free_id, v_feat_whisper, false),
      (v_free_id, v_feat_voice, true),
      (v_free_id, v_feat_templates, true),
      (v_free_id, v_feat_tables, true),
      (v_free_id, v_feat_calc, true),
      (v_free_id, v_feat_suggestions, true),
      (v_free_id, v_feat_conclusion, false),
      (v_free_id, v_feat_rads, false),
      (v_free_id, v_feat_chat, false),
      (v_free_id, v_feat_corrector, false),
      (v_free_id, v_feat_onboarding, false),
      (v_free_id, v_feat_email, true),
      (v_free_id, v_feat_priority, false),
      (v_free_id, v_feat_vip, false);
  END IF;

  -- BASICO plan assignments
  IF v_basico_id IS NOT NULL THEN
    INSERT INTO plan_feature_assignments (plan_id, feature_id, is_included) VALUES
      (v_basico_id, v_feat_ai_tokens, true),
      (v_basico_id, v_feat_whisper, false),
      (v_basico_id, v_feat_voice, true),
      (v_basico_id, v_feat_templates, true),
      (v_basico_id, v_feat_tables, true),
      (v_basico_id, v_feat_calc, true),
      (v_basico_id, v_feat_suggestions, true),
      (v_basico_id, v_feat_conclusion, true),
      (v_basico_id, v_feat_rads, false),
      (v_basico_id, v_feat_chat, false),
      (v_basico_id, v_feat_corrector, false),
      (v_basico_id, v_feat_onboarding, false),
      (v_basico_id, v_feat_email, true),
      (v_basico_id, v_feat_priority, false),
      (v_basico_id, v_feat_vip, false);
  END IF;

  -- PROFISSIONAL plan assignments
  IF v_profissional_id IS NOT NULL THEN
    INSERT INTO plan_feature_assignments (plan_id, feature_id, is_included) VALUES
      (v_profissional_id, v_feat_ai_tokens, true),
      (v_profissional_id, v_feat_whisper, true),
      (v_profissional_id, v_feat_voice, true),
      (v_profissional_id, v_feat_templates, true),
      (v_profissional_id, v_feat_tables, true),
      (v_profissional_id, v_feat_calc, true),
      (v_profissional_id, v_feat_suggestions, true),
      (v_profissional_id, v_feat_conclusion, true),
      (v_profissional_id, v_feat_rads, true),
      (v_profissional_id, v_feat_chat, true),
      (v_profissional_id, v_feat_corrector, true),
      (v_profissional_id, v_feat_onboarding, false),
      (v_profissional_id, v_feat_email, true),
      (v_profissional_id, v_feat_priority, true),
      (v_profissional_id, v_feat_vip, false);
  END IF;

  -- PREMIUM plan assignments
  IF v_premium_id IS NOT NULL THEN
    INSERT INTO plan_feature_assignments (plan_id, feature_id, is_included) VALUES
      (v_premium_id, v_feat_ai_tokens, true),
      (v_premium_id, v_feat_whisper, true),
      (v_premium_id, v_feat_voice, true),
      (v_premium_id, v_feat_templates, true),
      (v_premium_id, v_feat_tables, true),
      (v_premium_id, v_feat_calc, true),
      (v_premium_id, v_feat_suggestions, true),
      (v_premium_id, v_feat_conclusion, true),
      (v_premium_id, v_feat_rads, true),
      (v_premium_id, v_feat_chat, true),
      (v_premium_id, v_feat_corrector, true),
      (v_premium_id, v_feat_onboarding, true),
      (v_premium_id, v_feat_email, true),
      (v_premium_id, v_feat_priority, true),
      (v_premium_id, v_feat_vip, true);
  END IF;
END $$;

-- 6. Update get_platform_metrics RPC to include features
CREATE OR REPLACE FUNCTION public.get_platform_metrics()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
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
            WHERE spr.plan_id = sp.id
          ),
          'features', (
            SELECT jsonb_agg(
              jsonb_build_object(
                'id', pf.id,
                'feature_key', pf.feature_key,
                'display_name', COALESCE(pfa.custom_text, pf.display_name),
                'is_included', COALESCE(pfa.is_included, false),
                'is_dynamic', pf.is_dynamic,
                'dynamic_field', pf.dynamic_field,
                'dynamic_suffix', pf.dynamic_suffix,
                'dynamic_value', CASE 
                  WHEN pf.dynamic_field = 'ai_tokens_monthly' THEN sp.ai_tokens_monthly
                  WHEN pf.dynamic_field = 'whisper_credits_monthly' THEN sp.whisper_credits_monthly
                  ELSE NULL
                END
              ) ORDER BY COALESCE(pfa.display_order, pf.display_order)
            )
            FROM plan_features pf
            LEFT JOIN plan_feature_assignments pfa ON pfa.feature_id = pf.id AND pfa.plan_id = sp.id
            WHERE pf.is_active = true
          )
        ) ORDER BY sp.display_order
      )
      FROM subscription_plans sp
      WHERE sp.is_active = true
    ),
    'last_updated', now()
  ) INTO result;
  
  RETURN result;
END;
$$;