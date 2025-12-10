-- =============================================================
-- FASE 1 + 2 + 3: Mobile Mic AAA Security Complete Migration
-- Autenticação herdada, Rate Limiting, Heartbeat, Accounting
-- =============================================================

-- Adicionar colunas para autenticação herdada e segurança
ALTER TABLE mobile_audio_sessions 
ADD COLUMN IF NOT EXISTS temp_jwt TEXT,
ADD COLUMN IF NOT EXISTS desktop_ip INET,
ADD COLUMN IF NOT EXISTS mobile_ip INET,
ADD COLUMN IF NOT EXISTS pairing_expires_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS paired_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS last_heartbeat TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS device_fingerprint TEXT,
ADD COLUMN IF NOT EXISTS bytes_transferred BIGINT DEFAULT 0,
ADD COLUMN IF NOT EXISTS error_count INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS user_email TEXT;

-- Tabela de rate limiting por IP
CREATE TABLE IF NOT EXISTS mobile_session_rate_limit (
  ip INET PRIMARY KEY,
  attempts INT DEFAULT 0,
  last_attempt TIMESTAMPTZ DEFAULT NOW(),
  blocked_until TIMESTAMPTZ
);

-- Índice para limpeza automática
CREATE INDEX IF NOT EXISTS idx_rate_limit_last_attempt ON mobile_session_rate_limit(last_attempt);

-- RLS para rate limiting (apenas service role)
ALTER TABLE mobile_session_rate_limit ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Rate limit managed by service role only"
  ON mobile_session_rate_limit FOR ALL
  USING (false)
  WITH CHECK (false);

-- Função atualizada para validar sessão com segurança AAA
CREATE OR REPLACE FUNCTION validate_mobile_session_secure(
  p_session_token TEXT,
  p_temp_jwt TEXT DEFAULT NULL,
  p_mobile_ip INET DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_session RECORD;
  v_rate_record RECORD;
  v_result JSONB;
  v_jwt_payload JSONB;
  v_current_time TIMESTAMPTZ := NOW();
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
    
    -- Buscar email do usuário
    SELECT email INTO v_result
    FROM auth.users
    WHERE id = v_session.user_id;
    
    RETURN jsonb_build_object(
      'valid', true,
      'session_id', v_session.id,
      'user_id', v_session.user_id,
      'user_email', v_result->>'email',
      'mode', v_session.mode,
      'status', 'paired',
      'expires_at', v_session.expires_at,
      'same_network', CASE 
        WHEN v_session.desktop_ip IS NOT NULL AND p_mobile_ip IS NOT NULL 
             AND masklen(v_session.desktop_ip) = masklen(p_mobile_ip)
             AND network(set_masklen(v_session.desktop_ip, 24)) = network(set_masklen(p_mobile_ip, 24))
        THEN true 
        ELSE false 
      END
    );
  END IF;
  
  -- Sessão válida sem JWT (modo legado para compatibilidade)
  UPDATE mobile_audio_sessions
  SET 
    mobile_ip = COALESCE(p_mobile_ip, mobile_ip),
    last_heartbeat = v_current_time
  WHERE id = v_session.id;
  
  RETURN jsonb_build_object(
    'valid', true,
    'session_id', v_session.id,
    'mode', v_session.mode,
    'status', v_session.status,
    'expires_at', v_session.expires_at
  );
END;
$$;

-- Função para atualizar heartbeat
CREATE OR REPLACE FUNCTION update_mobile_heartbeat(
  p_session_token TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_session RECORD;
  v_current_time TIMESTAMPTZ := NOW();
BEGIN
  UPDATE mobile_audio_sessions
  SET last_heartbeat = v_current_time
  WHERE session_token = p_session_token
    AND status IN ('paired', 'connected', 'connecting')
    AND expires_at > v_current_time
  RETURNING * INTO v_session;
  
  IF v_session IS NULL THEN
    RETURN jsonb_build_object('success', false, 'reason', 'session_not_found_or_expired');
  END IF;
  
  RETURN jsonb_build_object(
    'success', true,
    'remaining_seconds', EXTRACT(EPOCH FROM (v_session.expires_at - v_current_time))::INT
  );
END;
$$;

-- Função para limpar sessões órfãs (sem heartbeat há 2 min)
CREATE OR REPLACE FUNCTION cleanup_orphan_mobile_sessions()
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count INT;
BEGIN
  UPDATE mobile_audio_sessions
  SET status = 'disconnected', ended_at = NOW()
  WHERE status IN ('paired', 'connected', 'connecting')
    AND last_heartbeat IS NOT NULL
    AND last_heartbeat < NOW() - INTERVAL '2 minutes';
  
  GET DIAGNOSTICS v_count = ROW_COUNT;
  
  -- Também limpar rate limits antigos
  DELETE FROM mobile_session_rate_limit
  WHERE last_attempt < NOW() - INTERVAL '1 hour';
  
  RETURN v_count;
END;
$$;

-- Função para gerar token temporário (chamada pela Edge Function)
CREATE OR REPLACE FUNCTION prepare_mobile_session_auth(
  p_session_id UUID,
  p_temp_jwt TEXT,
  p_desktop_ip INET DEFAULT NULL,
  p_user_email TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE mobile_audio_sessions
  SET 
    temp_jwt = p_temp_jwt,
    pairing_expires_at = NOW() + INTERVAL '5 minutes',
    desktop_ip = p_desktop_ip,
    user_email = p_user_email
  WHERE id = p_session_id
    AND status = 'pending'
    AND expires_at > NOW();
  
  RETURN FOUND;
END;
$$;

-- Atualizar RPC existente para usar nova lógica
CREATE OR REPLACE FUNCTION validate_mobile_session(
  p_session_token TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Redirecionar para versão segura sem JWT (compatibilidade legada)
  RETURN validate_mobile_session_secure(p_session_token, NULL, NULL);
END;
$$;