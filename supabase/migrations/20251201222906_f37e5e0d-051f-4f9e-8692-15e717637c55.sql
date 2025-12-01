-- =====================================================
-- CORREÇÕES CRÍTICAS DO SISTEMA MULTI-PROVEDOR
-- =====================================================

-- 1. Adicionar campo supports_thinking_budget se não existir
ALTER TABLE ai_models ADD COLUMN IF NOT EXISTS supports_thinking_budget BOOLEAN DEFAULT false;

-- 2. Completar model_family para modelos OpenAI existentes
UPDATE ai_models SET 
  model_family = 'gpt-4o',
  supports_temperature = true,
  supports_reasoning = false,
  is_legacy = true
WHERE name = 'gpt-4o' AND model_family IS NULL;

UPDATE ai_models SET 
  model_family = 'gpt-4o',
  supports_temperature = true,
  supports_reasoning = false,
  is_legacy = true
WHERE name = 'gpt-4o-mini' AND model_family IS NULL;

UPDATE ai_models SET 
  model_family = 'gpt-5',
  supports_temperature = false,
  supports_reasoning = true,
  is_legacy = false,
  context_window = 128000,
  max_output_tokens = 16384
WHERE name = 'gpt-5-nano-2025-08-07' AND model_family IS NULL;

-- 3. Inserir modelos OpenAI faltantes
INSERT INTO ai_models (
  name, provider, api_name, model_family, description, tier,
  context_window, max_output_tokens, default_max_tokens,
  supports_temperature, supports_reasoning, supports_streaming,
  supports_tools, supports_json_mode, supports_vision,
  supports_top_p, supports_frequency_penalty, supports_presence_penalty,
  supports_seed, supports_stop_sequences, supports_logprobs,
  is_legacy, is_active,
  input_cost_per_1m, output_cost_per_1m
) VALUES 
-- GPT-5 Flagship
(
  'gpt-5-2025-08-07', 'openai', 'gpt-5-2025-08-07', 'gpt-5',
  'GPT-5 flagship - máxima capacidade de raciocínio e qualidade', 'flagship',
  128000, 32768, 4000,
  false, true, true, true, true, true,
  true, false, false, true, true, false,
  false, true,
  5.00, 15.00
),
-- GPT-5 Mini
(
  'gpt-5-mini-2025-08-07', 'openai', 'gpt-5-mini-2025-08-07', 'gpt-5',
  'GPT-5 Mini - equilíbrio entre performance e custo', 'standard',
  128000, 16384, 2000,
  false, true, true, true, true, true,
  true, false, false, true, true, false,
  false, true,
  0.60, 2.40
),
-- O3 Mini
(
  'o3-mini', 'openai', 'o3-mini', 'o3',
  'O3 Mini - reasoning compacto e eficiente', 'economy',
  128000, 65536, 2000,
  false, true, true, true, true, false,
  true, false, false, true, true, false,
  false, true,
  1.10, 4.40
),
-- O4 Mini
(
  'o4-mini-2025-04-16', 'openai', 'o4-mini-2025-04-16', 'o4',
  'O4 Mini - nova geração de reasoning', 'standard',
  200000, 100000, 4000,
  false, true, true, true, true, true,
  true, false, false, true, true, true,
  false, true,
  1.10, 4.40
),
-- GPT-4.1
(
  'gpt-4.1-2025-04-14', 'openai', 'gpt-4.1-2025-04-14', 'gpt-4.1',
  'GPT-4.1 - coding e instrução aprimorados', 'standard',
  1047576, 32768, 4000,
  true, false, true, true, true, true,
  true, true, true, true, true, true,
  false, true,
  2.00, 8.00
),
-- GPT-4.1 Mini
(
  'gpt-4.1-mini-2025-04-14', 'openai', 'gpt-4.1-mini-2025-04-14', 'gpt-4.1',
  'GPT-4.1 Mini - versão econômica do 4.1', 'economy',
  1047576, 32768, 2000,
  true, false, true, true, true, true,
  true, true, true, true, true, true,
  false, true,
  0.40, 1.60
),
-- GPT-4.1 Nano
(
  'gpt-4.1-nano-2025-04-14', 'openai', 'gpt-4.1-nano-2025-04-14', 'gpt-4.1',
  'GPT-4.1 Nano - ultra-rápido e econômico', 'economy',
  1047576, 32768, 2000,
  true, false, true, true, true, true,
  true, true, true, true, true, true,
  false, true,
  0.10, 0.40
)
ON CONFLICT (name) DO NOTHING;

-- 4. Atualizar Gemini com suporte a thinking_budget
UPDATE ai_models SET 
  supports_thinking_budget = true,
  supports_top_k = true
WHERE provider = 'google' AND (model_family = 'gemini-2.5' OR name LIKE 'gemini-2.5%');

-- 5. Atualizar Anthropic com suporte a extended_thinking
UPDATE ai_models SET 
  supports_extended_thinking = true,
  supports_top_k = true
WHERE provider = 'anthropic' AND (name LIKE 'claude-3.7%' OR name LIKE 'claude-4%');

-- 6. Vincular ai_prompt_configs.provider_id aos provedores corretos
UPDATE ai_prompt_configs SET provider_id = (
  SELECT id FROM ai_providers WHERE name = 'openai'
) WHERE (model_name LIKE 'gpt-%' OR model_name LIKE 'o3%' OR model_name LIKE 'o4%')
  AND provider_id IS NULL;

-- 7. Adicionar campos reservados para funcionalidades futuras
ALTER TABLE ai_models ADD COLUMN IF NOT EXISTS supports_web_search BOOLEAN DEFAULT false;
ALTER TABLE ai_models ADD COLUMN IF NOT EXISTS supports_code_execution BOOLEAN DEFAULT false;
ALTER TABLE ai_models ADD COLUMN IF NOT EXISTS supports_file_upload BOOLEAN DEFAULT false;
ALTER TABLE ai_models ADD COLUMN IF NOT EXISTS supports_image_generation BOOLEAN DEFAULT false;
ALTER TABLE ai_models ADD COLUMN IF NOT EXISTS modalities TEXT[] DEFAULT '{"text"}';

-- 8. Adicionar comentários de documentação
COMMENT ON COLUMN ai_models.supports_thinking_budget IS 'Gemini 2.5: thinkingConfig.thinkingBudget parameter';
COMMENT ON COLUMN ai_models.supports_extended_thinking IS 'Anthropic Claude 3.7+: extended thinking mode';
COMMENT ON COLUMN ai_models.modalities IS 'Supported input/output modalities: text, image, audio, video';
COMMENT ON COLUMN ai_models.supports_web_search IS 'Reserved for future web search capability';
COMMENT ON COLUMN ai_models.supports_code_execution IS 'Reserved for future code execution capability';

-- 9. Criar tabela de rate limits por tier (preparação futura)
CREATE TABLE IF NOT EXISTS ai_model_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id UUID REFERENCES ai_models(id) ON DELETE CASCADE,
  tier VARCHAR(50) NOT NULL DEFAULT 'free',
  requests_per_minute INTEGER,
  tokens_per_minute INTEGER,
  tokens_per_day INTEGER,
  concurrent_requests INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(model_id, tier)
);

-- Enable RLS
ALTER TABLE ai_model_rate_limits ENABLE ROW LEVEL SECURITY;

-- Admin-only policy
CREATE POLICY "Admin full access to rate limits"
  ON ai_model_rate_limits FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.id IN (SELECT user_id FROM user_roles WHERE role = 'admin')
    )
  );

-- 10. Atualizar custos dos modelos existentes
UPDATE ai_models SET 
  input_cost_per_1m = 2.50,
  output_cost_per_1m = 10.00
WHERE name = 'gpt-4o' AND input_cost_per_1m IS NULL;

UPDATE ai_models SET 
  input_cost_per_1m = 0.15,
  output_cost_per_1m = 0.60
WHERE name = 'gpt-4o-mini' AND input_cost_per_1m IS NULL;

UPDATE ai_models SET 
  input_cost_per_1m = 0.10,
  output_cost_per_1m = 0.40
WHERE name = 'gpt-5-nano-2025-08-07' AND input_cost_per_1m IS NULL;