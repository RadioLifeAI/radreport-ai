
-- =====================================================
-- FASE 1: Atualizar RPC build_ai_request para OpenRouter + extra_headers
-- =====================================================

CREATE OR REPLACE FUNCTION public.build_ai_request(
  p_function_name TEXT,
  p_user_content TEXT,
  p_user_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  config RECORD;
  api_key TEXT;
  api_url TEXT;
  headers JSONB;
  payload JSONB;
  messages JSONB;
  system_msg JSONB;
  user_msg JSONB;
BEGIN
  -- Buscar configuração com extra_headers do modelo
  SELECT 
    pc.function_name,
    pc.system_prompt,
    pc.user_prompt_template,
    pc.max_tokens,
    pc.temperature,
    pc.top_p,
    pc.top_k,
    pc.frequency_penalty,
    pc.presence_penalty,
    pc.seed,
    pc.stop_sequences,
    pc.reasoning_effort,
    pc.thinking_budget,
    pc.response_format,
    pc.json_schema,
    pc.enable_streaming,
    pc.tools_enabled,
    COALESCE(m.api_name, m.name) AS model_name,
    COALESCE(m.api_base_url, p.api_base_url) AS api_base_url,
    COALESCE(m.api_key_secret_name, p.api_key_secret_name) AS api_key_secret_name,
    COALESCE(m.auth_header, p.auth_header, 'Authorization') AS auth_header,
    COALESCE(m.auth_prefix, p.auth_prefix, 'Bearer ') AS auth_prefix,
    COALESCE(m.extra_headers, p.extra_headers, '{}'::jsonb) AS extra_headers,
    LOWER(COALESCE(p.name, m.provider, 'openai')) AS provider,
    m.supports_temperature,
    m.supports_top_p,
    m.supports_top_k,
    m.supports_frequency_penalty,
    m.supports_presence_penalty,
    m.supports_seed,
    m.supports_stop_sequences,
    m.supports_reasoning,
    m.supports_thinking_budget,
    m.supports_json_mode,
    m.supports_tools,
    m.supports_streaming
  INTO config
  FROM ai_prompt_configs pc
  LEFT JOIN ai_models m ON m.id = pc.model_id
  LEFT JOIN ai_providers p ON p.id = COALESCE(pc.provider_id, m.provider_id)
  WHERE pc.function_name = p_function_name
    AND pc.is_active = true
  LIMIT 1;

  IF config IS NULL THEN
    RAISE EXCEPTION 'AI function configuration not found: %', p_function_name;
  END IF;

  -- Buscar API key do Vault
  SELECT decrypted_secret INTO api_key
  FROM vault.decrypted_secrets
  WHERE name = config.api_key_secret_name
  LIMIT 1;

  IF api_key IS NULL THEN
    RAISE EXCEPTION 'API key not found in vault: %', config.api_key_secret_name;
  END IF;

  -- Montar headers base
  headers := jsonb_build_object(
    config.auth_header, config.auth_prefix || api_key,
    'Content-Type', 'application/json'
  );

  -- Aplicar extra_headers do modelo/provider (merge)
  IF config.extra_headers IS NOT NULL AND config.extra_headers != '{}'::jsonb THEN
    headers := headers || config.extra_headers;
  END IF;

  -- Determinar URL base por provider
  api_url := config.api_base_url;

  -- Switch por provider para path específico
  IF config.provider = 'anthropic' THEN
    api_url := COALESCE(api_url, 'https://api.anthropic.com') || '/v1/messages';
    headers := headers || jsonb_build_object('anthropic-version', '2023-06-01');
  ELSIF config.provider = 'google' OR config.provider = 'gemini' THEN
    api_url := COALESCE(api_url, 'https://generativelanguage.googleapis.com') 
      || '/v1beta/models/' || config.model_name || ':generateContent?key=' || api_key;
    -- Google usa key na URL, remove do header
    headers := headers - config.auth_header;
  ELSIF config.provider = 'groq' THEN
    api_url := COALESCE(api_url, 'https://api.groq.com') || '/openai/v1/chat/completions';
  ELSIF config.provider = 'openrouter' THEN
    api_url := COALESCE(api_url, 'https://openrouter.ai/api/v1') || '/chat/completions';
    -- Adicionar headers extras para ranking se não existirem
    IF NOT (headers ? 'HTTP-Referer') THEN
      headers := headers || jsonb_build_object('HTTP-Referer', 'https://radreport.app');
    END IF;
    IF NOT (headers ? 'X-Title') THEN
      headers := headers || jsonb_build_object('X-Title', 'RadReport');
    END IF;
  ELSE
    -- OpenAI e compatíveis
    api_url := COALESCE(api_url, 'https://api.openai.com') || '/v1/chat/completions';
  END IF;

  -- Montar mensagens
  system_msg := jsonb_build_object('role', 'system', 'content', config.system_prompt);
  user_msg := jsonb_build_object('role', 'user', 'content', 
    COALESCE(
      REPLACE(config.user_prompt_template, '{{user_content}}', p_user_content),
      p_user_content
    )
  );
  messages := jsonb_build_array(system_msg, user_msg);

  -- Montar payload base
  payload := jsonb_build_object(
    'model', config.model_name,
    'messages', messages
  );

  -- Adicionar parâmetros condicionalmente baseado em suporte do modelo
  IF config.max_tokens IS NOT NULL THEN
    -- Usar max_completion_tokens para modelos reasoning
    IF config.supports_reasoning = true THEN
      payload := payload || jsonb_build_object('max_completion_tokens', config.max_tokens);
    ELSE
      payload := payload || jsonb_build_object('max_tokens', config.max_tokens);
    END IF;
  END IF;

  IF config.temperature IS NOT NULL AND COALESCE(config.supports_temperature, true) THEN
    payload := payload || jsonb_build_object('temperature', config.temperature);
  END IF;

  IF config.top_p IS NOT NULL AND COALESCE(config.supports_top_p, true) THEN
    payload := payload || jsonb_build_object('top_p', config.top_p);
  END IF;

  IF config.top_k IS NOT NULL AND COALESCE(config.supports_top_k, false) THEN
    payload := payload || jsonb_build_object('top_k', config.top_k);
  END IF;

  IF config.frequency_penalty IS NOT NULL AND COALESCE(config.supports_frequency_penalty, false) THEN
    payload := payload || jsonb_build_object('frequency_penalty', config.frequency_penalty);
  END IF;

  IF config.presence_penalty IS NOT NULL AND COALESCE(config.supports_presence_penalty, false) THEN
    payload := payload || jsonb_build_object('presence_penalty', config.presence_penalty);
  END IF;

  IF config.seed IS NOT NULL AND COALESCE(config.supports_seed, false) THEN
    payload := payload || jsonb_build_object('seed', config.seed);
  END IF;

  IF config.stop_sequences IS NOT NULL AND COALESCE(config.supports_stop_sequences, true) THEN
    payload := payload || jsonb_build_object('stop', to_jsonb(config.stop_sequences));
  END IF;

  IF config.reasoning_effort IS NOT NULL AND COALESCE(config.supports_reasoning, false) THEN
    payload := payload || jsonb_build_object('reasoning_effort', config.reasoning_effort);
  END IF;

  IF config.thinking_budget IS NOT NULL AND COALESCE(config.supports_thinking_budget, false) THEN
    payload := payload || jsonb_build_object('thinking', jsonb_build_object('budget_tokens', config.thinking_budget));
  END IF;

  IF config.enable_streaming = true AND COALESCE(config.supports_streaming, true) THEN
    payload := payload || jsonb_build_object('stream', true);
  END IF;

  -- Retornar configuração completa
  RETURN jsonb_build_object(
    'url', api_url,
    'headers', headers,
    'payload', payload,
    'provider', config.provider,
    'function_name', config.function_name
  );
END;
$$;

-- =====================================================
-- FASE 2: Atualizar extra_headers nos modelos OpenRouter
-- =====================================================

UPDATE ai_models 
SET extra_headers = '{"HTTP-Referer": "https://radreport.app", "X-Title": "RadReport"}'::jsonb
WHERE provider = 'openrouter'
  AND (extra_headers IS NULL OR extra_headers = '{}'::jsonb);

-- =====================================================
-- FASE 3: Validar e corrigir api_name dos modelos OpenRouter
-- =====================================================

-- Garantir que api_name está correto (sem prefixo openrouter/)
UPDATE ai_models SET api_name = 'openai/gpt-5' WHERE name = 'openrouter/openai/gpt-5' AND (api_name IS NULL OR api_name = 'openrouter/openai/gpt-5');
UPDATE ai_models SET api_name = 'anthropic/claude-sonnet-4' WHERE name = 'openrouter/anthropic/claude-sonnet-4' AND (api_name IS NULL OR api_name = 'openrouter/anthropic/claude-sonnet-4');
UPDATE ai_models SET api_name = 'google/gemini-2.5-flash' WHERE name = 'openrouter/google/gemini-2.5-flash' AND (api_name IS NULL OR api_name = 'openrouter/google/gemini-2.5-flash');
UPDATE ai_models SET api_name = 'google/gemini-2.5-pro' WHERE name = 'openrouter/google/gemini-2.5-pro' AND (api_name IS NULL OR api_name = 'openrouter/google/gemini-2.5-pro');
UPDATE ai_models SET api_name = 'meta-llama/llama-3.3-70b-instruct' WHERE name = 'openrouter/meta-llama/llama-3.3-70b' AND (api_name IS NULL OR api_name = 'openrouter/meta-llama/llama-3.3-70b');
UPDATE ai_models SET api_name = 'mistralai/mistral-large-latest' WHERE name = 'openrouter/mistralai/mistral-large' AND (api_name IS NULL OR api_name = 'openrouter/mistralai/mistral-large');
UPDATE ai_models SET api_name = 'qwen/qwen-2.5-72b-instruct' WHERE name = 'openrouter/qwen/qwen-2.5-72b' AND (api_name IS NULL OR api_name = 'openrouter/qwen/qwen-2.5-72b');
UPDATE ai_models SET api_name = 'deepseek/deepseek-chat' WHERE name = 'openrouter/deepseek/deepseek-v3' AND (api_name IS NULL OR api_name = 'openrouter/deepseek/deepseek-v3');

-- =====================================================
-- FASE 4: Vincular modelos órfãos ao provider_id correto
-- =====================================================

-- Vincular modelos OpenAI órfãos ao provider OpenAI
UPDATE ai_models m
SET provider_id = (SELECT id FROM ai_providers WHERE name = 'openai' LIMIT 1)
WHERE m.provider = 'openai' 
  AND m.provider_id IS NULL
  AND EXISTS (SELECT 1 FROM ai_providers WHERE name = 'openai');

-- Vincular modelos OpenRouter ao provider OpenRouter  
UPDATE ai_models m
SET provider_id = (SELECT id FROM ai_providers WHERE name = 'openrouter' LIMIT 1)
WHERE m.provider = 'openrouter'
  AND m.provider_id IS NULL
  AND EXISTS (SELECT 1 FROM ai_providers WHERE name = 'openrouter');
