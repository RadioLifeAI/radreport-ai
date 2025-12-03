-- 1. Adicionar UNIQUE constraint em user_subscriptions.user_id para garantir um plano por usuário
ALTER TABLE user_subscriptions
ADD CONSTRAINT user_subscriptions_user_id_unique UNIQUE (user_id);

-- 2. Adicionar campos de logging de créditos na tabela subscription_events_log
ALTER TABLE subscription_events_log
ADD COLUMN IF NOT EXISTS credits_renewed BOOLEAN,
ADD COLUMN IF NOT EXISTS credits_error TEXT,
ADD COLUMN IF NOT EXISTS ai_tokens_granted INTEGER,
ADD COLUMN IF NOT EXISTS whisper_credits_granted INTEGER;

-- 3. Criar índice para consultas de auditoria de créditos
CREATE INDEX IF NOT EXISTS idx_subscription_events_credits 
ON subscription_events_log (credits_renewed, processed_at DESC)
WHERE credits_renewed IS NOT NULL;