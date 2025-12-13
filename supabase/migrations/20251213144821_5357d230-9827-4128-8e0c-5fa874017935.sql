-- ==================================================================
-- FASE 1: Inserir features dinâmicas para user_templates e user_frases
-- ==================================================================

-- Verificar se as features já existem antes de inserir
INSERT INTO plan_features (feature_key, display_name, is_dynamic, dynamic_field, dynamic_suffix, display_order, category, is_active, show_in_card, is_primary)
SELECT 'user_templates', 'Templates personalizados', true, 'max_user_templates', 'templates personalizados', 14, 'Conteúdo', true, true, false
WHERE NOT EXISTS (SELECT 1 FROM plan_features WHERE feature_key = 'user_templates');

INSERT INTO plan_features (feature_key, display_name, is_dynamic, dynamic_field, dynamic_suffix, display_order, category, is_active, show_in_card, is_primary)
SELECT 'user_frases', 'Frases personalizadas', true, 'max_user_frases', 'frases personalizadas', 15, 'Conteúdo', true, true, false
WHERE NOT EXISTS (SELECT 1 FROM plan_features WHERE feature_key = 'user_frases');

-- ==================================================================
-- FASE 2: Criar assignments para cada plano
-- ==================================================================

-- Inserir assignments para user_templates
INSERT INTO plan_feature_assignments (plan_id, feature_id, is_included, display_order)
SELECT sp.id, pf.id, true, 14
FROM subscription_plans sp
CROSS JOIN plan_features pf
WHERE pf.feature_key = 'user_templates'
AND NOT EXISTS (
  SELECT 1 FROM plan_feature_assignments pfa 
  WHERE pfa.plan_id = sp.id AND pfa.feature_id = pf.id
);

-- Inserir assignments para user_frases
INSERT INTO plan_feature_assignments (plan_id, feature_id, is_included, display_order)
SELECT sp.id, pf.id, true, 15
FROM subscription_plans sp
CROSS JOIN plan_features pf
WHERE pf.feature_key = 'user_frases'
AND NOT EXISTS (
  SELECT 1 FROM plan_feature_assignments pfa 
  WHERE pfa.plan_id = sp.id AND pfa.feature_id = pf.id
);

-- ==================================================================
-- FASE 3: Atualizar a RPC get_platform_metrics para incluir novos campos
-- ==================================================================

CREATE OR REPLACE FUNCTION public.get_platform_metrics()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result jsonb;
  v_metrics jsonb;
  v_plans jsonb;
BEGIN
  -- Calcular métricas da plataforma
  SELECT jsonb_build_object(
    'templates_count', (SELECT COUNT(*) FROM system_templates WHERE ativo = true),
    'frases_count', (SELECT COUNT(*) FROM frases_modelo WHERE ativa = true),
    'tables_count', (SELECT COUNT(*) FROM (SELECT DISTINCT codigo FROM rads_text_options WHERE ativo = true) t),
    'calculators_count', 25,
    'dictionary_terms_count', 5000,
    'modalities_count', (SELECT COUNT(*) FROM modalidades WHERE ativa = true)
  ) INTO v_metrics;

  -- Buscar planos com preços e features
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
      'max_user_templates', COALESCE(sp.max_user_templates, 5),
      'max_user_frases', COALESCE(sp.max_user_frases, 10),
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
            'display_name', pf.display_name,
            'is_included', COALESCE(pfa.is_included, false),
            'is_primary', COALESCE(pf.is_primary, false),
            'show_in_card', COALESCE(pf.show_in_card, true),
            'category', pf.category,
            'is_dynamic', COALESCE(pf.is_dynamic, false),
            'dynamic_field', pf.dynamic_field,
            'dynamic_suffix', pf.dynamic_suffix,
            'dynamic_value', CASE 
              WHEN pf.dynamic_field = 'ai_tokens_monthly' THEN sp.ai_tokens_monthly
              WHEN pf.dynamic_field = 'whisper_credits_monthly' THEN sp.whisper_credits_monthly
              WHEN pf.dynamic_field = 'max_user_templates' THEN COALESCE(sp.max_user_templates, 5)
              WHEN pf.dynamic_field = 'max_user_frases' THEN COALESCE(sp.max_user_frases, 10)
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
  INTO v_plans
  FROM subscription_plans sp
  WHERE sp.is_active = true;

  -- Montar resultado final
  v_result := jsonb_build_object(
    'metrics', v_metrics,
    'plans', COALESCE(v_plans, '[]'::jsonb),
    'last_updated', NOW()
  );

  RETURN v_result;
END;
$$;