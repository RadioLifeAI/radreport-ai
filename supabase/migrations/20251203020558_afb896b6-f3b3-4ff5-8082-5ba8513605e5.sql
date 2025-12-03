-- 1. Atualizar feature_ai_chat para planos pagos (professional e premium)
UPDATE subscription_plans 
SET feature_ai_chat = true 
WHERE code IN ('professional', 'premium');

-- 2. Recriar RPC renew_monthly_credits com logging de Whisper credits
CREATE OR REPLACE FUNCTION public.renew_monthly_credits(
  p_user_id UUID,
  p_plan_code TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_plan RECORD;
  v_ai_balance_before INTEGER := 0;
  v_ai_balance_after INTEGER := 0;
  v_whisper_balance_before INTEGER := 0;
  v_whisper_balance_after INTEGER := 0;
  v_result JSON;
BEGIN
  -- Buscar plano
  SELECT * INTO v_plan 
  FROM subscription_plans 
  WHERE code = p_plan_code AND is_active = true;
  
  IF NOT FOUND THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Plan not found: ' || p_plan_code
    );
  END IF;
  
  -- === AI CREDITS ===
  -- Obter saldo AI atual
  SELECT COALESCE(balance, 0) INTO v_ai_balance_before
  FROM user_ai_balance 
  WHERE user_id = p_user_id;
  
  -- Calcular novo saldo AI (reset para o valor do plano)
  v_ai_balance_after := v_plan.ai_credits_monthly;
  
  -- Upsert AI balance
  INSERT INTO user_ai_balance (user_id, balance, monthly_limit, plan_type, updated_at)
  VALUES (
    p_user_id, 
    v_ai_balance_after, 
    v_plan.ai_credits_monthly, 
    p_plan_code,
    NOW()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    balance = v_ai_balance_after,
    monthly_limit = v_plan.ai_credits_monthly,
    plan_type = p_plan_code,
    updated_at = NOW();
  
  -- Log AI credits no ledger
  INSERT INTO ai_credits_ledger (
    user_id, 
    amount, 
    balance_before, 
    balance_after, 
    transaction_type, 
    description,
    feature_used
  ) VALUES (
    p_user_id,
    v_plan.ai_credits_monthly,
    v_ai_balance_before,
    v_ai_balance_after,
    'renewal',
    'Renovação mensal plano ' || p_plan_code,
    'subscription_renewal'
  );
  
  -- === WHISPER CREDITS ===
  IF v_plan.whisper_credits_monthly > 0 THEN
    -- Obter saldo Whisper atual
    SELECT COALESCE(balance, 0) INTO v_whisper_balance_before
    FROM user_whisper_balance 
    WHERE user_id = p_user_id;
    
    -- Calcular novo saldo Whisper (acumula, não reseta)
    v_whisper_balance_after := v_whisper_balance_before + v_plan.whisper_credits_monthly;
    
    -- Upsert Whisper balance
    INSERT INTO user_whisper_balance (user_id, balance, updated_at)
    VALUES (p_user_id, v_whisper_balance_after, NOW())
    ON CONFLICT (user_id) DO UPDATE SET
      balance = v_whisper_balance_after,
      updated_at = NOW();
    
    -- Log Whisper credits no ledger (NOVO!)
    INSERT INTO whisper_credits_ledger (
      user_id, 
      amount, 
      balance_before, 
      balance_after, 
      transaction_type, 
      description
    ) VALUES (
      p_user_id,
      v_plan.whisper_credits_monthly,
      v_whisper_balance_before,
      v_whisper_balance_after,
      'renewal',
      'Renovação mensal plano ' || p_plan_code
    );
  END IF;
  
  -- Retornar resultado
  RETURN json_build_object(
    'success', true,
    'ai_credits_granted', v_plan.ai_credits_monthly,
    'ai_balance_before', v_ai_balance_before,
    'ai_balance_after', v_ai_balance_after,
    'whisper_credits_granted', COALESCE(v_plan.whisper_credits_monthly, 0),
    'whisper_balance_before', v_whisper_balance_before,
    'whisper_balance_after', v_whisper_balance_after,
    'plan_code', p_plan_code
  );
END;
$$;

-- Adicionar comentário documentando a função
COMMENT ON FUNCTION public.renew_monthly_credits(UUID, TEXT) IS 
'Renova créditos mensais de AI e Whisper para um usuário baseado no plano. 
AI credits são resetados para o valor do plano.
Whisper credits são acumulados (não resetam).
Ambos são logados nos respectivos ledgers para auditoria.';