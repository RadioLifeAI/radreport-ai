-- Fix validate_mobile_session_secure: change 'paired' to 'connected'
CREATE OR REPLACE FUNCTION validate_mobile_session_secure(
  p_session_token text,
  p_temp_jwt text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_session record;
  v_result jsonb;
BEGIN
  -- Find session by token
  SELECT * INTO v_session
  FROM mobile_audio_sessions
  WHERE session_token = p_session_token
    AND status IN ('pending', 'connecting')
    AND expires_at > now();
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'valid', false,
      'error', 'Session not found or expired'
    );
  END IF;
  
  -- Verify temp_jwt matches
  IF v_session.temp_jwt IS NULL OR v_session.temp_jwt != p_temp_jwt THEN
    RETURN jsonb_build_object(
      'valid', false,
      'error', 'Invalid authentication token'
    );
  END IF;
  
  -- Update session status to connected (not paired - CHECK constraint)
  UPDATE mobile_audio_sessions
  SET status = 'connected',
      paired_at = now(),
      pairing_expires_at = NULL
  WHERE id = v_session.id;
  
  -- Return session info
  RETURN jsonb_build_object(
    'valid', true,
    'session_id', v_session.id,
    'user_id', v_session.user_id,
    'user_email', v_session.user_email,
    'mode', v_session.mode,
    'status', 'connected',
    'expires_at', v_session.expires_at,
    'ai_credits', COALESCE((SELECT balance FROM user_ai_balance WHERE user_id = v_session.user_id), 0),
    'whisper_credits', COALESCE((SELECT balance FROM user_whisper_balance WHERE user_id = v_session.user_id), 0)
  );
END;
$$;

-- Fix renew_mobile_session: remove 'paired' from WHERE condition
CREATE OR REPLACE FUNCTION renew_mobile_session(
  p_session_token text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_session record;
  v_new_expires timestamptz;
BEGIN
  -- Find active session (connected or connecting only)
  SELECT * INTO v_session
  FROM mobile_audio_sessions
  WHERE session_token = p_session_token
    AND status IN ('connected', 'connecting');
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Session not found or not active'
    );
  END IF;
  
  -- Extend expiration by 30 minutes
  v_new_expires := now() + interval '30 minutes';
  
  UPDATE mobile_audio_sessions
  SET expires_at = v_new_expires,
      last_heartbeat = now()
  WHERE id = v_session.id;
  
  RETURN jsonb_build_object(
    'success', true,
    'expires_at', v_new_expires,
    'remaining_seconds', EXTRACT(EPOCH FROM (v_new_expires - now()))::int
  );
END;
$$;

-- Fix update_mobile_heartbeat: remove 'paired' from WHERE condition
CREATE OR REPLACE FUNCTION update_mobile_heartbeat(
  p_session_token text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_session record;
BEGIN
  -- Find active session (connected or connecting only)
  SELECT mas.*, 
         COALESCE(uab.balance, 0) as ai_credits,
         COALESCE(uwb.balance, 0) as whisper_credits
  INTO v_session
  FROM mobile_audio_sessions mas
  LEFT JOIN user_ai_balance uab ON uab.user_id = mas.user_id
  LEFT JOIN user_whisper_balance uwb ON uwb.user_id = mas.user_id
  WHERE mas.session_token = p_session_token
    AND mas.status IN ('connected', 'connecting');
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Session not found or not active'
    );
  END IF;
  
  -- Update heartbeat
  UPDATE mobile_audio_sessions
  SET last_heartbeat = now()
  WHERE id = v_session.id;
  
  RETURN jsonb_build_object(
    'success', true,
    'ai_credits', v_session.ai_credits,
    'whisper_credits', v_session.whisper_credits,
    'expires_at', v_session.expires_at,
    'remaining_seconds', EXTRACT(EPOCH FROM (v_session.expires_at - now()))::int
  );
END;
$$;