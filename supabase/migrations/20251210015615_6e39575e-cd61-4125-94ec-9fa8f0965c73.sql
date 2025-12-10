-- Tabela para gerenciar sessões de áudio mobile
CREATE TABLE public.mobile_audio_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_token TEXT NOT NULL UNIQUE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'connecting', 'connected', 'completed', 'expired', 'error')),
  mode TEXT DEFAULT 'webspeech' CHECK (mode IN ('webspeech', 'whisper', 'corrector')),
  device_info JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  connected_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '60 minutes')
);

-- Índices para performance
CREATE INDEX idx_mobile_sessions_user ON mobile_audio_sessions(user_id);
CREATE INDEX idx_mobile_sessions_token ON mobile_audio_sessions(session_token);
CREATE INDEX idx_mobile_sessions_status ON mobile_audio_sessions(status) WHERE status IN ('pending', 'connected');

-- RLS
ALTER TABLE mobile_audio_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sessions"
ON mobile_audio_sessions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own sessions"
ON mobile_audio_sessions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
ON mobile_audio_sessions FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions"
ON mobile_audio_sessions FOR DELETE
USING (auth.uid() = user_id);

-- RPC para validar sessão (público para mobile acessar)
CREATE OR REPLACE FUNCTION public.validate_mobile_session(p_session_token TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  session_record RECORD;
BEGIN
  SELECT * INTO session_record
  FROM mobile_audio_sessions
  WHERE session_token = p_session_token
  AND expires_at > NOW()
  AND status IN ('pending', 'connecting', 'connected')
  LIMIT 1;

  IF session_record IS NULL THEN
    RETURN jsonb_build_object(
      'valid', false,
      'reason', 'Sessão não encontrada ou expirada'
    );
  END IF;

  RETURN jsonb_build_object(
    'valid', true,
    'session_id', session_record.id,
    'user_id', session_record.user_id,
    'mode', session_record.mode,
    'status', session_record.status,
    'expires_at', session_record.expires_at
  );
END;
$$;

-- Permitir acesso anônimo para validação (mobile sem auth)
GRANT EXECUTE ON FUNCTION public.validate_mobile_session(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.validate_mobile_session(TEXT) TO authenticated;

-- RPC para atualizar status da sessão
CREATE OR REPLACE FUNCTION public.update_mobile_session_status(
  p_session_token TEXT,
  p_status TEXT,
  p_device_info JSONB DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  session_record RECORD;
BEGIN
  UPDATE mobile_audio_sessions
  SET 
    status = p_status,
    device_info = COALESCE(p_device_info, device_info),
    connected_at = CASE WHEN p_status = 'connected' THEN NOW() ELSE connected_at END,
    ended_at = CASE WHEN p_status IN ('completed', 'expired', 'error') THEN NOW() ELSE ended_at END
  WHERE session_token = p_session_token
  AND expires_at > NOW()
  RETURNING * INTO session_record;

  IF session_record IS NULL THEN
    RETURN jsonb_build_object('success', false, 'reason', 'Sessão não encontrada');
  END IF;

  RETURN jsonb_build_object('success', true, 'status', session_record.status);
END;
$$;

GRANT EXECUTE ON FUNCTION public.update_mobile_session_status(TEXT, TEXT, JSONB) TO anon;
GRANT EXECUTE ON FUNCTION public.update_mobile_session_status(TEXT, TEXT, JSONB) TO authenticated;