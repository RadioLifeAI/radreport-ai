-- 1. Adicionar campos na tabela plan_features
ALTER TABLE plan_features ADD COLUMN IF NOT EXISTS is_primary BOOLEAN DEFAULT false;
ALTER TABLE plan_features ADD COLUMN IF NOT EXISTS show_in_card BOOLEAN DEFAULT true;
ALTER TABLE plan_features ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT 'Geral';

-- 2. Marcar features principais (sempre destacadas nos cards)
UPDATE plan_features SET is_primary = true WHERE feature_key IN ('ai_tokens', 'whisper_credits');

-- 3. Definir categorias para tabela de comparação
UPDATE plan_features SET category = 'Inteligência Artificial' WHERE feature_key IN ('ai_tokens', 'ai_suggestions', 'ai_conclusion', 'ai_rads', 'chat_ai');
UPDATE plan_features SET category = 'Transcrição' WHERE feature_key IN ('voice_dictation', 'whisper_credits', 'voice_corrector');
UPDATE plan_features SET category = 'Conteúdo' WHERE feature_key IN ('templates', 'reference_tables', 'calculators');
UPDATE plan_features SET category = 'Suporte' WHERE feature_key IN ('support_email', 'support_priority', 'support_vip', 'onboarding');

-- 4. Ocultar algumas features dos cards (só aparecem na tabela de comparação)
UPDATE plan_features SET show_in_card = false WHERE feature_key IN ('support_email', 'onboarding');

-- 5. Criar feature agrupada para conteúdo base (substituindo 3 features separadas)
UPDATE plan_features SET display_name = 'Templates, tabelas e calculadoras', display_order = 4 WHERE feature_key = 'templates';
UPDATE plan_features SET show_in_card = false WHERE feature_key IN ('reference_tables', 'calculators');

-- 6. Buscar IDs dos planos
DO $$
DECLARE
  free_plan_id UUID;
  basic_plan_id UUID;
  pro_plan_id UUID;
  premium_plan_id UUID;
BEGIN
  SELECT id INTO free_plan_id FROM subscription_plans WHERE code = 'free';
  SELECT id INTO basic_plan_id FROM subscription_plans WHERE code = 'basic';
  SELECT id INTO pro_plan_id FROM subscription_plans WHERE code = 'professional';
  SELECT id INTO premium_plan_id FROM subscription_plans WHERE code = 'premium';

  -- 7. Completar plan_feature_assignments para TODOS os planos
  -- Limpar assignments existentes para recriar com dados completos
  DELETE FROM plan_feature_assignments;

  -- FREE plan assignments
  INSERT INTO plan_feature_assignments (plan_id, feature_id, is_included, display_order)
  SELECT free_plan_id, id, 
    CASE 
      WHEN feature_key IN ('ai_tokens', 'ai_suggestions', 'voice_dictation', 'templates', 'reference_tables', 'calculators', 'support_email') THEN true
      ELSE false
    END,
    display_order
  FROM plan_features WHERE is_active = true;

  -- BASIC plan assignments
  INSERT INTO plan_feature_assignments (plan_id, feature_id, is_included, display_order)
  SELECT basic_plan_id, id,
    CASE 
      WHEN feature_key IN ('ai_tokens', 'ai_suggestions', 'ai_conclusion', 'ai_rads', 'voice_dictation', 'templates', 'reference_tables', 'calculators', 'support_email') THEN true
      ELSE false
    END,
    display_order
  FROM plan_features WHERE is_active = true;

  -- PROFESSIONAL plan assignments
  INSERT INTO plan_feature_assignments (plan_id, feature_id, is_included, display_order)
  SELECT pro_plan_id, id,
    CASE 
      WHEN feature_key IN ('ai_tokens', 'ai_suggestions', 'ai_conclusion', 'ai_rads', 'chat_ai', 'voice_dictation', 'whisper_credits', 'voice_corrector', 'templates', 'reference_tables', 'calculators', 'support_email', 'support_priority') THEN true
      ELSE false
    END,
    display_order
  FROM plan_features WHERE is_active = true;

  -- PREMIUM plan assignments
  INSERT INTO plan_feature_assignments (plan_id, feature_id, is_included, display_order)
  SELECT premium_plan_id, id,
    CASE 
      WHEN feature_key NOT IN ('support_email') THEN true -- Premium tem tudo exceto suporte básico (tem VIP)
      ELSE false
    END,
    display_order
  FROM plan_features WHERE is_active = true;

END $$;

-- 8. Atualizar RPC get_platform_metrics para incluir novos campos
CREATE OR REPLACE FUNCTION get_platform_metrics()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'metrics', jsonb_build_object(
      'templates_count', (SELECT COUNT(*) FROM system_templates WHERE ativo = true),
      'frases_count', (SELECT COUNT(*) FROM frases_modelo WHERE ativa = true),
      'tables_count', 100,
      'calculators_count', 25,
      'dictionary_terms_count', 4300,
      'modalities_count', (SELECT COUNT(*) FROM modalidades WHERE ativa = true)
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
          ),
          'features', (
            SELECT jsonb_agg(
              jsonb_build_object(
                'id', pf.id,
                'feature_key', pf.feature_key,
                'display_name', COALESCE(pfa.custom_text, pf.display_name),
                'is_included', COALESCE(pfa.is_included, false),
                'is_primary', COALESCE(pf.is_primary, false),
                'show_in_card', COALESCE(pf.show_in_card, true),
                'category', COALESCE(pf.category, 'Geral'),
                'is_dynamic', pf.is_dynamic,
                'dynamic_field', pf.dynamic_field,
                'dynamic_suffix', pf.dynamic_suffix,
                'dynamic_value', CASE 
                  WHEN pf.dynamic_field = 'ai_tokens_monthly' THEN sp.ai_tokens_monthly
                  WHEN pf.dynamic_field = 'whisper_credits_monthly' THEN sp.whisper_credits_monthly
                  ELSE NULL
                END
              )
              ORDER BY COALESCE(pfa.display_order, pf.display_order)
            )
            FROM plan_features pf
            LEFT JOIN plan_feature_assignments pfa ON pfa.feature_id = pf.id AND pfa.plan_id = sp.id
            WHERE pf.is_active = true
          )
        )
        ORDER BY sp.display_order
      )
      FROM subscription_plans sp
      WHERE sp.is_active = true
    ),
    'last_updated', now()
  ) INTO result;
  
  RETURN result;
END;
$$;