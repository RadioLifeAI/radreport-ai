-- ====================================================================
-- SISTEMA DE CRÉDITOS WHISPER - LEDGER PATTERN
-- ====================================================================

-- 1. Tabela de saldo do usuário (estado atual)
CREATE TABLE IF NOT EXISTS public.user_whisper_balance (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  balance INTEGER NOT NULL DEFAULT 0 CHECK (balance >= 0),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. Tabela ledger (registro imutável de transações)
CREATE TABLE IF NOT EXISTS public.whisper_credits_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('debit', 'credit', 'purchase', 'refund', 'admin_adjustment')),
  amount INTEGER NOT NULL CHECK (amount > 0),
  balance_before INTEGER NOT NULL CHECK (balance_before >= 0),
  balance_after INTEGER NOT NULL CHECK (balance_after >= 0),
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. Tabela de auditoria de uso (log detalhado)
CREATE TABLE IF NOT EXISTS public.whisper_usage_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  audio_duration_seconds NUMERIC(10, 2) NOT NULL CHECK (audio_duration_seconds > 0),
  credits_consumed INTEGER NOT NULL CHECK (credits_consumed > 0),
  audio_size_bytes INTEGER,
  transcription_status TEXT NOT NULL CHECK (transcription_status IN ('success', 'error', 'insufficient_credits')),
  error_message TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ====================================================================
-- ÍNDICES PARA PERFORMANCE
-- ====================================================================

CREATE INDEX IF NOT EXISTS idx_whisper_ledger_user_id ON public.whisper_credits_ledger(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_whisper_usage_user_id ON public.whisper_usage_log(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_whisper_ledger_transaction_type ON public.whisper_credits_ledger(transaction_type);

-- ====================================================================
-- FUNÇÃO: CONSUMIR CRÉDITOS (ATÔMICA COM LOCK PESSIMISTA)
-- ====================================================================

CREATE OR REPLACE FUNCTION public.consume_whisper_credits(
  p_user_id UUID,
  p_credits_to_consume INTEGER,
  p_description TEXT DEFAULT 'Whisper transcription',
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS TABLE(success BOOLEAN, balance_after INTEGER, message TEXT) AS $$
DECLARE
  v_current_balance INTEGER;
  v_balance_after INTEGER;
BEGIN
  -- Lock pessimista para evitar race conditions
  SELECT balance INTO v_current_balance
  FROM public.user_whisper_balance
  WHERE user_id = p_user_id
  FOR UPDATE;

  -- Se usuário não tem registro, criar com saldo 0
  IF NOT FOUND THEN
    INSERT INTO public.user_whisper_balance (user_id, balance)
    VALUES (p_user_id, 0)
    RETURNING balance INTO v_current_balance;
  END IF;

  -- Verificar se tem saldo suficiente
  IF v_current_balance < p_credits_to_consume THEN
    RETURN QUERY SELECT FALSE, v_current_balance, 'Insufficient credits'::TEXT;
    RETURN;
  END IF;

  -- Calcular novo saldo
  v_balance_after := v_current_balance - p_credits_to_consume;

  -- Atualizar saldo
  UPDATE public.user_whisper_balance
  SET balance = v_balance_after,
      updated_at = now()
  WHERE user_id = p_user_id;

  -- Registrar no ledger (imutável)
  INSERT INTO public.whisper_credits_ledger (
    user_id,
    transaction_type,
    amount,
    balance_before,
    balance_after,
    description,
    metadata
  ) VALUES (
    p_user_id,
    'debit',
    p_credits_to_consume,
    v_current_balance,
    v_balance_after,
    p_description,
    p_metadata
  );

  RETURN QUERY SELECT TRUE, v_balance_after, 'Credits consumed successfully'::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ====================================================================
-- FUNÇÃO: ADICIONAR CRÉDITOS (COMPRA/ADMIN)
-- ====================================================================

CREATE OR REPLACE FUNCTION public.add_whisper_credits(
  p_user_id UUID,
  p_credits_to_add INTEGER,
  p_transaction_type TEXT DEFAULT 'purchase',
  p_description TEXT DEFAULT 'Credits purchase',
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS TABLE(success BOOLEAN, balance_after INTEGER, message TEXT) AS $$
DECLARE
  v_current_balance INTEGER;
  v_balance_after INTEGER;
BEGIN
  -- Lock pessimista
  SELECT balance INTO v_current_balance
  FROM public.user_whisper_balance
  WHERE user_id = p_user_id
  FOR UPDATE;

  -- Se usuário não tem registro, criar
  IF NOT FOUND THEN
    INSERT INTO public.user_whisper_balance (user_id, balance)
    VALUES (p_user_id, 0)
    RETURNING balance INTO v_current_balance;
  END IF;

  -- Calcular novo saldo
  v_balance_after := v_current_balance + p_credits_to_add;

  -- Atualizar saldo
  UPDATE public.user_whisper_balance
  SET balance = v_balance_after,
      updated_at = now()
  WHERE user_id = p_user_id;

  -- Registrar no ledger
  INSERT INTO public.whisper_credits_ledger (
    user_id,
    transaction_type,
    amount,
    balance_before,
    balance_after,
    description,
    metadata
  ) VALUES (
    p_user_id,
    p_transaction_type,
    p_credits_to_add,
    v_current_balance,
    v_balance_after,
    p_description,
    p_metadata
  );

  RETURN QUERY SELECT TRUE, v_balance_after, 'Credits added successfully'::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ====================================================================
-- ROW LEVEL SECURITY (RLS)
-- ====================================================================

ALTER TABLE public.user_whisper_balance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whisper_credits_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whisper_usage_log ENABLE ROW LEVEL SECURITY;

-- Políticas para user_whisper_balance
CREATE POLICY "Users can view their own balance"
  ON public.user_whisper_balance FOR SELECT
  USING (auth.uid() = user_id);

-- Políticas para whisper_credits_ledger (somente leitura para usuários)
CREATE POLICY "Users can view their own ledger"
  ON public.whisper_credits_ledger FOR SELECT
  USING (auth.uid() = user_id);

-- Políticas para whisper_usage_log (somente leitura para usuários)
CREATE POLICY "Users can view their own usage log"
  ON public.whisper_usage_log FOR SELECT
  USING (auth.uid() = user_id);

-- ====================================================================
-- TRIGGER PARA ATUALIZAR updated_at
-- ====================================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_whisper_balance_updated_at
  BEFORE UPDATE ON public.user_whisper_balance
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ====================================================================
-- DADOS INICIAIS (OPCIONAL - DAR 100 CRÉDITOS PARA TESTE)
-- ====================================================================

-- Descomentar a linha abaixo para dar 100 créditos para todos os usuários existentes
-- INSERT INTO public.user_whisper_balance (user_id, balance)
-- SELECT id, 100 FROM auth.users
-- ON CONFLICT (user_id) DO NOTHING;