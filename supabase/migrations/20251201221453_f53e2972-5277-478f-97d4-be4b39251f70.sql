-- Expandir tabela ai_models com metadados de suporte de parâmetros
ALTER TABLE ai_models
ADD COLUMN IF NOT EXISTS supports_temperature BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS supports_reasoning BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_legacy BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS api_name VARCHAR(100) DEFAULT NULL;

-- Adicionar comentários explicativos
COMMENT ON COLUMN ai_models.supports_temperature IS 'Indica se o modelo suporta o parâmetro temperature (modelos legados)';
COMMENT ON COLUMN ai_models.supports_reasoning IS 'Indica se o modelo suporta o parâmetro reasoning_effort (modelos GPT-5/O3/O4)';
COMMENT ON COLUMN ai_models.is_legacy IS 'Indica se é um modelo legado (GPT-4o, GPT-3.5, etc.)';
COMMENT ON COLUMN ai_models.api_name IS 'Nome alternativo para chamada da API se diferente do nome de exibição';

-- Atualizar modelos existentes com metadados corretos
-- Modelos legados (suportam temperature, não reasoning)
UPDATE ai_models SET 
  supports_temperature = true,
  supports_reasoning = false,
  is_legacy = true
WHERE name IN ('gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo', 'gpt-4-turbo');

-- Modelos de reasoning GPT-5 (suportam reasoning, não temperature)
UPDATE ai_models SET 
  supports_temperature = false,
  supports_reasoning = true,
  is_legacy = false
WHERE name LIKE 'gpt-5%' OR name LIKE 'gpt-4.1%';

-- Modelos O3/O4 (suportam reasoning, não temperature)
UPDATE ai_models SET 
  supports_temperature = false,
  supports_reasoning = true,
  is_legacy = false
WHERE name LIKE 'o3%' OR name LIKE 'o4%';

-- Garantir que novos modelos tenham valores padrão corretos
UPDATE ai_models SET 
  supports_temperature = COALESCE(supports_temperature, true),
  supports_reasoning = COALESCE(supports_reasoning, false),
  is_legacy = COALESCE(is_legacy, false)
WHERE supports_temperature IS NULL OR supports_reasoning IS NULL OR is_legacy IS NULL;