-- =====================================================
-- FASE 1: Correção refund_whisper_credits + RLS
-- =====================================================

-- 1. DROP e recriar função refund_whisper_credits com search_path
DROP FUNCTION IF EXISTS public.refund_whisper_credits(uuid, integer, text);

CREATE FUNCTION public.refund_whisper_credits(
  p_user_id uuid,
  p_credits_to_refund integer,
  p_reason text DEFAULT 'Reembolso de créditos Whisper'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_current_balance integer;
  v_new_balance integer;
BEGIN
  -- Obter saldo atual com lock
  SELECT balance INTO v_current_balance
  FROM user_whisper_balance
  WHERE user_id = p_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'User balance record not found'
    );
  END IF;

  v_new_balance := v_current_balance + p_credits_to_refund;

  -- Atualizar saldo
  UPDATE user_whisper_balance
  SET balance = v_new_balance,
      updated_at = now()
  WHERE user_id = p_user_id;

  -- Registrar no ledger
  INSERT INTO whisper_credits_ledger (
    user_id,
    transaction_type,
    amount,
    balance_before,
    balance_after,
    description
  ) VALUES (
    p_user_id,
    'refund',
    p_credits_to_refund,
    v_current_balance,
    v_new_balance,
    p_reason
  );

  RETURN jsonb_build_object(
    'success', true,
    'previous_balance', v_current_balance,
    'new_balance', v_new_balance,
    'refunded', p_credits_to_refund
  );
END;
$$;