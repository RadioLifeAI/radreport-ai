-- =====================================================
-- FASE 1: Corrigir validate_mobile_session_secure
-- Bug: v_result JSONB recebe TEXT (email)
-- Adiciona: retorno de créditos AI e Whisper
-- =====================================================

CREATE OR REPLACE FUNCTION public.validate_mobile_session_secure(
  p_session_token text, 
  p_temp_jwt text DEFAULT NULL::text, 
  p_mobile_ip inet DEFAULT NULL::inet
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_session RECORD;
  v_rate_record RECORD;
  v_current_time TIMESTAMPTZ := NOW();
  v_user_email TEXT;
  v_ai_credits INTEGER;
  v_whisper_credits INTEGER;
BEGIN
  -- Rate limit check (usando IP se fornecido)
  IF p_mobile_ip IS NOT NULL THEN
    SELECT * INTO v_rate_record
    FROM mobile_session_rate_limit
    WHERE ip = p_mobile_ip;
    
    IF v_rate_record IS NOT NULL THEN
      -- Verificar se está bloqueado
      IF v_rate_record.blocked_until IS NOT NULL AND v_rate_record.blocked_until > v_current_time THEN
        RETURN jsonb_build_object(
          'valid', false,
          'reason', 'rate_limited',
          'blocked_until', v_rate_record.blocked_until,
          'message', 'Muitas tentativas. Aguarde alguns minutos.'
        );
      END IF;
      
      -- Reset se último attempt foi há mais de 1 minuto
      IF v_rate_record.last_attempt < v_current_time - INTERVAL '1 minute' THEN
        UPDATE mobile_session_rate_limit
        SET attempts = 0, last_attempt = v_current_time, blocked_until = NULL
        WHERE ip = p_mobile_ip;
      END IF;
    END IF;
  END IF;
  
  -- Buscar sessão
  SELECT * INTO v_session
  FROM mobile_audio_sessions
  WHERE session_token = p_session_token;
  
  -- Sessão não encontrada
  IF v_session IS NULL THEN
    -- Incrementar rate limit
    IF p_mobile_ip IS NOT NULL THEN
      INSERT INTO mobile_session_rate_limit (ip, attempts, last_attempt)
      VALUES (p_mobile_ip, 1, v_current_time)
      ON CONFLICT (ip) DO UPDATE SET
        attempts = mobile_session_rate_limit.attempts + 1,
        last_attempt = v_current_time,
        blocked_until = CASE 
          WHEN mobile_session_rate_limit.attempts >= 4 THEN v_current_time + INTERVAL '5 minutes'
          ELSE NULL
        END;
    END IF;
    
    RETURN jsonb_build_object(
      'valid', false,
      'reason', 'not_found',
      'message', 'Sessão não encontrada. Gere um novo QR Code.'
    );
  END IF;
  
  -- Verificar expiração
  IF v_session.expires_at < v_current_time THEN
    RETURN jsonb_build_object(
      'valid', false,
      'reason', 'expired',
      'message', 'Sessão expirada. Gere um novo QR Code.'
    );
  END IF;
  
  -- Verificar status
  IF v_session.status IN ('completed', 'error') THEN
    RETURN jsonb_build_object(
      'valid', false,
      'reason', 'invalid_status',
      'message', 'Esta sessão já foi encerrada.'
    );
  END IF;
  
  -- Verificar pairing expirado (se JWT necessário)
  IF v_session.temp_jwt IS NOT NULL AND v_session.pairing_expires_at < v_current_time THEN
    -- Limpar JWT expirado
    UPDATE mobile_audio_sessions
    SET temp_jwt = NULL
    WHERE id = v_session.id;
    
    RETURN jsonb_build_object(
      'valid', false,
      'reason', 'pairing_expired',
      'message', 'Tempo de pareamento expirado. Gere um novo QR Code.'
    );
  END IF;
  
  -- Buscar email do usuário (CORRIGIDO: usa variável TEXT separada)
  SELECT email INTO v_user_email
  FROM auth.users
  WHERE id = v_session.user_id;
  
  -- Buscar créditos AI do usuário
  SELECT balance INTO v_ai_credits
  FROM user_ai_balance
  WHERE user_id = v_session.user_id;
  
  -- Buscar créditos Whisper do usuário
  SELECT balance INTO v_whisper_credits
  FROM user_whisper_balance
  WHERE user_id = v_session.user_id;
  
  -- Verificar JWT se fornecido e requerido
  IF v_session.temp_jwt IS NOT NULL THEN
    IF p_temp_jwt IS NULL OR p_temp_jwt <> v_session.temp_jwt THEN
      -- Incrementar rate limit
      IF p_mobile_ip IS NOT NULL THEN
        INSERT INTO mobile_session_rate_limit (ip, attempts, last_attempt)
        VALUES (p_mobile_ip, 1, v_current_time)
        ON CONFLICT (ip) DO UPDATE SET
          attempts = mobile_session_rate_limit.attempts + 1,
          last_attempt = v_current_time,
          blocked_until = CASE 
            WHEN mobile_session_rate_limit.attempts >= 4 THEN v_current_time + INTERVAL '5 minutes'
            ELSE NULL
          END;
      END IF;
      
      RETURN jsonb_build_object(
        'valid', false,
        'reason', 'invalid_jwt',
        'message', 'Autenticação inválida. Escaneie novamente o QR Code.'
      );
    END IF;
    
    -- JWT válido - limpar (one-time use) e marcar como pareado
    UPDATE mobile_audio_sessions
    SET 
      temp_jwt = NULL,
      paired_at = v_current_time,
      mobile_ip = p_mobile_ip,
      status = 'paired',
      last_heartbeat = v_current_time
    WHERE id = v_session.id;
    
    -- Limpar rate limit após sucesso
    IF p_mobile_ip IS NOT NULL THEN
      DELETE FROM mobile_session_rate_limit WHERE ip = p_mobile_ip;
    END IF;
    
    RETURN jsonb_build_object(
      'valid', true,
      'session_id', v_session.id,
      'user_id', v_session.user_id,
      'user_email', COALESCE(v_user_email, v_session.user_email),
      'mode', v_session.mode,
      'status', 'paired',
      'expires_at', v_session.expires_at,
      'ai_credits', COALESCE(v_ai_credits, 0),
      'whisper_credits', COALESCE(v_whisper_credits, 0),
      'same_network', CASE 
        WHEN v_session.desktop_ip IS NOT NULL AND p_mobile_ip IS NOT NULL 
             AND masklen(v_session.desktop_ip) = masklen(p_mobile_ip)
             AND network(set_masklen(v_session.desktop_ip, 24)) = network(set_masklen(p_mobile_ip, 24))
        THEN true 
        ELSE false 
      END
    );
  END IF;
  
  -- Sessão válida sem JWT (modo legado ou sessão já pareada)
  UPDATE mobile_audio_sessions
  SET 
    mobile_ip = COALESCE(p_mobile_ip, mobile_ip),
    last_heartbeat = v_current_time
  WHERE id = v_session.id;
  
  RETURN jsonb_build_object(
    'valid', true,
    'session_id', v_session.id,
    'user_id', v_session.user_id,
    'user_email', COALESCE(v_user_email, v_session.user_email),
    'mode', v_session.mode,
    'status', v_session.status,
    'expires_at', v_session.expires_at,
    'ai_credits', COALESCE(v_ai_credits, 0),
    'whisper_credits', COALESCE(v_whisper_credits, 0),
    'same_network', false
  );
END;
$function$;

-- =====================================================
-- FASE 2: Criar RPC renew_mobile_session
-- Permite mobile renovar sessão sem auth tradicional
-- =====================================================

CREATE OR REPLACE FUNCTION public.renew_mobile_session(p_session_token text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_session RECORD;
  v_new_expires TIMESTAMPTZ;
  v_current_time TIMESTAMPTZ := NOW();
  v_ai_credits INTEGER;
  v_whisper_credits INTEGER;
BEGIN
  v_new_expires := v_current_time + INTERVAL '60 minutes';
  
  -- Atualizar e retornar sessão
  UPDATE mobile_audio_sessions
  SET 
    expires_at = v_new_expires,
    last_heartbeat = v_current_time
  WHERE session_token = p_session_token
    AND status IN ('paired', 'connected', 'connecting')
    AND expires_at > v_current_time
  RETURNING * INTO v_session;
  
  IF v_session IS NULL THEN
    RETURN jsonb_build_object(
      'success', false, 
      'reason', 'session_not_found_or_expired',
      'message', 'Sessão não encontrada ou expirada. Gere um novo QR Code.'
    );
  END IF;
  
  -- Buscar créditos atualizados
  SELECT balance INTO v_ai_credits
  FROM user_ai_balance
  WHERE user_id = v_session.user_id;
  
  SELECT balance INTO v_whisper_credits
  FROM user_whisper_balance
  WHERE user_id = v_session.user_id;
  
  RETURN jsonb_build_object(
    'success', true,
    'expires_at', v_new_expires,
    'remaining_seconds', 3600,
    'ai_credits', COALESCE(v_ai_credits, 0),
    'whisper_credits', COALESCE(v_whisper_credits, 0)
  );
END;
$function$;

-- =====================================================
-- FASE 3: Atualizar update_mobile_heartbeat para retornar créditos
-- =====================================================

CREATE OR REPLACE FUNCTION public.update_mobile_heartbeat(p_session_token text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_session RECORD;
  v_current_time TIMESTAMPTZ := NOW();
  v_ai_credits INTEGER;
  v_whisper_credits INTEGER;
BEGIN
  UPDATE mobile_audio_sessions
  SET last_heartbeat = v_current_time
  WHERE session_token = p_session_token
    AND status IN ('paired', 'connected', 'connecting')
    AND expires_at > v_current_time
  RETURNING * INTO v_session;
  
  IF v_session IS NULL THEN
    RETURN jsonb_build_object(
      'success', false, 
      'reason', 'session_not_found_or_expired'
    );
  END IF;
  
  -- Buscar créditos atualizados
  SELECT balance INTO v_ai_credits
  FROM user_ai_balance
  WHERE user_id = v_session.user_id;
  
  SELECT balance INTO v_whisper_credits
  FROM user_whisper_balance
  WHERE user_id = v_session.user_id;
  
  RETURN jsonb_build_object(
    'success', true,
    'remaining_seconds', EXTRACT(EPOCH FROM (v_session.expires_at - v_current_time))::INT,
    'ai_credits', COALESCE(v_ai_credits, 0),
    'whisper_credits', COALESCE(v_whisper_credits, 0)
  );
END;
$function$;