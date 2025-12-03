-- =====================================================
-- AI Credits System: consume_ai_credits e check_ai_credits RPCs
-- =====================================================

-- Função para consumir créditos AI com lock pessimista
CREATE OR REPLACE FUNCTION public.consume_ai_credits(
  p_user_id UUID,
  p_credits_to_consume INTEGER,
  p_feature_used TEXT DEFAULT 'unknown',
  p_description TEXT DEFAULT 'AI operation',
  p_metadata JSONB DEFAULT '{}'::JSONB
)
RETURNS TABLE(success BOOLEAN, balance_after INTEGER, message TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_current_balance INTEGER;
  v_new_balance INTEGER;
BEGIN
  -- Lock pessimista para evitar race conditions
  SELECT balance INTO v_current_balance
  FROM user_ai_balance
  WHERE user_id = p_user_id
  FOR UPDATE;

  -- Se usuário não tem registro, criar com saldo 0
  IF v_current_balance IS NULL THEN
    INSERT INTO user_ai_balance (user_id, balance, monthly_limit, plan_type)
    VALUES (p_user_id, 0, 500, 'free')
    ON CONFLICT (user_id) DO NOTHING;
    
    RETURN QUERY SELECT false::BOOLEAN, 0::INTEGER, 'Saldo insuficiente'::TEXT;
    RETURN;
  END IF;

  -- Verificar saldo suficiente
  IF v_current_balance < p_credits_to_consume THEN
    RETURN QUERY SELECT false::BOOLEAN, v_current_balance::INTEGER, 'Saldo insuficiente'::TEXT;
    RETURN;
  END IF;

  v_new_balance := v_current_balance - p_credits_to_consume;

  -- Atualizar saldo
  UPDATE user_ai_balance
  SET balance = v_new_balance, updated_at = NOW()
  WHERE user_id = p_user_id;

  -- Inserir no ledger (registro imutável para auditoria)
  INSERT INTO ai_credits_ledger (
    user_id, 
    transaction_type, 
    amount, 
    balance_before, 
    balance_after, 
    description, 
    feature_used, 
    metadata
  ) VALUES (
    p_user_id, 
    'consumption', 
    -p_credits_to_consume,
    v_current_balance, 
    v_new_balance,
    p_description, 
    p_feature_used, 
    p_metadata
  );

  RETURN QUERY SELECT true::BOOLEAN, v_new_balance::INTEGER, 'Créditos consumidos com sucesso'::TEXT;
END;
$$;

-- Função para verificar créditos AI disponíveis
CREATE OR REPLACE FUNCTION public.check_ai_credits(p_user_id UUID)
RETURNS TABLE(balance INTEGER, monthly_limit INTEGER, plan_type TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT b.balance::INTEGER, b.monthly_limit::INTEGER, b.plan_type::TEXT
  FROM user_ai_balance b
  WHERE b.user_id = p_user_id;
  
  -- Se não encontrou registro, retornar valores padrão
  IF NOT FOUND THEN
    RETURN QUERY SELECT 0::INTEGER, 500::INTEGER, 'free'::TEXT;
  END IF;
END;
$$;

-- Conceder permissões para usuários autenticados chamarem as funções
GRANT EXECUTE ON FUNCTION public.consume_ai_credits(UUID, INTEGER, TEXT, TEXT, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_ai_credits(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.consume_ai_credits(UUID, INTEGER, TEXT, TEXT, JSONB) TO service_role;
GRANT EXECUTE ON FUNCTION public.check_ai_credits(UUID) TO service_role;