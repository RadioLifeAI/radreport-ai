-- Create function to refund Whisper credits when transcription fails
CREATE OR REPLACE FUNCTION refund_whisper_credits(
  p_user_id UUID,
  p_credits_to_refund INTEGER,
  p_reason TEXT DEFAULT 'Transcription failed'
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_new_balance INTEGER;
BEGIN
  -- Validate input
  IF p_credits_to_refund <= 0 THEN
    RAISE EXCEPTION 'Credits to refund must be positive';
  END IF;

  -- Update balance atomically
  UPDATE user_whisper_balance
  SET 
    balance = balance + p_credits_to_refund,
    updated_at = now()
  WHERE user_id = p_user_id
  RETURNING balance INTO v_new_balance;

  -- If no row exists, create it with refunded amount
  IF NOT FOUND THEN
    INSERT INTO user_whisper_balance (user_id, balance)
    VALUES (p_user_id, p_credits_to_refund)
    RETURNING balance INTO v_new_balance;
  END IF;

  -- Log refund in immutable ledger
  INSERT INTO whisper_credits_ledger (
    user_id,
    transaction_type,
    credits,
    balance_after,
    description,
    metadata
  ) VALUES (
    p_user_id,
    'refund',
    p_credits_to_refund,
    v_new_balance,
    'Refund: ' || p_reason,
    jsonb_build_object(
      'reason', p_reason,
      'refunded_at', now()
    )
  );

  RETURN v_new_balance;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION refund_whisper_credits TO authenticated;