-- =====================================================
-- FASE 3.1: RPC build_ai_request com Drop Params Inteligente
-- =====================================================

-- 1. Adicionar coluna user_prompt_template se não existir
ALTER TABLE ai_prompt_configs 
ADD COLUMN IF NOT EXISTS user_prompt_template TEXT;

-- 2. Atualizar user_prompt_template para cada função

-- ai-generate-conclusion
UPDATE ai_prompt_configs 
SET user_prompt_template = 'Modalidade: {{modality}}
Título do Exame: {{examTitle}}

=== ACHADOS DO LAUDO ===
{{findingsHtml}}
=== FIM DOS ACHADOS ===

Gere a impressão diagnóstica seguindo as regras do system prompt.'
WHERE function_name = 'ai-generate-conclusion';

-- ai-suggestion-review
UPDATE ai_prompt_configs 
SET user_prompt_template = '=== LAUDO PARA REVISÃO ===
{{reportContent}}
=== FIM DO LAUDO ===

Revise e melhore este laudo seguindo as regras do system prompt.'
WHERE function_name = 'ai-suggestion-review';

-- ai-dictation-polish
UPDATE ai_prompt_configs 
SET user_prompt_template = '=== TEXTO DITADO ===
{{text}}
=== FIM DO TEXTO ===

Corrija e formate este texto ditado seguindo as regras do system prompt.'
WHERE function_name = 'ai-dictation-polish';

-- ai-rads-classification
UPDATE ai_prompt_configs 
SET user_prompt_template = 'Modalidade: {{modality}}
Região Anatômica: {{region}}

=== ACHADOS ===
{{findingsHtml}}
=== FIM DOS ACHADOS ===

Classifique segundo o sistema RADS apropriado seguindo as regras do system prompt.'
WHERE function_name = 'ai-rads-classification';

-- ai-inline-edit
UPDATE ai_prompt_configs 
SET user_prompt_template = 'Comando do usuário: {{userInput}}

=== TEXTO SELECIONADO ===
{{selectedText}}
=== FIM DO TEXTO SELECIONADO ===

=== DOCUMENTO COMPLETO ===
{{fullDocument}}
=== FIM DO DOCUMENTO ===

Seção atual: {{section}}

Execute a edição solicitada seguindo as regras do system prompt.'
WHERE function_name = 'ai-inline-edit';

-- ai-voice-inline-edit
UPDATE ai_prompt_configs 
SET user_prompt_template = 'Campo selecionado: {{selectedField}}

=== TEXTO DITADO ===
{{voiceText}}
=== FIM DO TEXTO DITADO ===

=== CONTEXTO DA SEÇÃO ===
{{currentSectionText}}
=== FIM DO CONTEXTO ===

Formate o texto ditado para o campo especificado seguindo as regras do system prompt.'
WHERE function_name = 'ai-voice-inline-edit';

-- radreport-chat
UPDATE ai_prompt_configs 
SET user_prompt_template = '{{message}}'
WHERE function_name = 'radreport-chat';

-- 3. Criar função RPC build_ai_request
CREATE OR REPLACE FUNCTION build_ai_request(
  fn_name TEXT,
  user_data JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, vault
AS $$
DECLARE
  config RECORD;
  api_key TEXT;
  user_prompt TEXT;
  messages JSONB;
  body JSONB;
  headers JSONB;
  api_url TEXT;
  key_name TEXT;
  placeholder TEXT;
  placeholder_value TEXT;
BEGIN
  -- 1. Buscar configuração completa (JOIN entre ai_prompt_configs e ai_models)
  SELECT 
    pc.system_prompt,
    pc.user_prompt_template,
    pc.max_tokens,
    pc.temperature,
    pc.reasoning_effort,
    pc.top_p,
    pc.frequency_penalty,
    pc.presence_penalty,
    pc.response_format,
    pc.json_schema,
    pc.stop_sequences,
    pc.seed,
    m.name AS model_name,
    m.api_name AS model_api_name,
    m.provider,
    m.api_base_url,
    m.api_key_secret_name,
    m.auth_header,
    m.auth_prefix,
    m.supports_temperature,
    m.supports_reasoning,
    m.supports_top_p,
    m.supports_frequency_penalty,
    m.supports_presence_penalty,
    m.supports_json_mode,
    m.supports_seed,
    m.supports_stop_sequences,
    m.supports_streaming,
    m.supports_tools
  INTO config
  FROM ai_prompt_configs pc
  LEFT JOIN ai_models m ON pc.model_id = m.id
  WHERE pc.function_name = fn_name
    AND pc.is_active = true;

  IF config IS NULL THEN
    RAISE EXCEPTION 'Configuração não encontrada para função: %', fn_name;
  END IF;

  -- 2. Buscar API key do Vault
  IF config.api_key_secret_name IS NOT NULL THEN
    SELECT decrypted_secret INTO api_key
    FROM vault.decrypted_secrets
    WHERE name = config.api_key_secret_name
    LIMIT 1;
    
    IF api_key IS NULL THEN
      RAISE EXCEPTION 'API key não encontrada no Vault: %', config.api_key_secret_name;
    END IF;
  ELSE
    RAISE EXCEPTION 'api_key_secret_name não configurado para modelo';
  END IF;

  -- 3. Processar user_prompt_template substituindo placeholders {{key}}
  user_prompt := COALESCE(config.user_prompt_template, '{{message}}');
  
  -- Substituir cada placeholder pelos valores de user_data
  FOR placeholder IN SELECT jsonb_object_keys(user_data) LOOP
    placeholder_value := user_data->>placeholder;
    user_prompt := REPLACE(user_prompt, '{{' || placeholder || '}}', COALESCE(placeholder_value, ''));
  END LOOP;

  -- 4. Montar messages array
  messages := jsonb_build_array(
    jsonb_build_object('role', 'system', 'content', config.system_prompt),
    jsonb_build_object('role', 'user', 'content', user_prompt)
  );

  -- 5. Montar body com DROP PARAMS INTELIGENTE
  -- Iniciar com campos obrigatórios
  body := jsonb_build_object(
    'model', COALESCE(config.model_api_name, config.model_name),
    'messages', messages
  );

  -- max_tokens: sempre incluir se não nulo (todos modelos suportam)
  IF config.max_tokens IS NOT NULL THEN
    -- GPT-5 usa max_completion_tokens, outros usam max_tokens
    IF config.provider = 'openai' AND config.model_name LIKE 'gpt-5%' THEN
      body := body || jsonb_build_object('max_completion_tokens', config.max_tokens);
    ELSE
      body := body || jsonb_build_object('max_tokens', config.max_tokens);
    END IF;
  END IF;

  -- temperature: só incluir se suportado E não nulo
  IF config.supports_temperature = true AND config.temperature IS NOT NULL THEN
    body := body || jsonb_build_object('temperature', config.temperature);
  END IF;

  -- reasoning_effort: só incluir se suportado E não nulo (modelos de raciocínio)
  IF config.supports_reasoning = true AND config.reasoning_effort IS NOT NULL THEN
    body := body || jsonb_build_object('reasoning_effort', config.reasoning_effort);
  END IF;

  -- top_p: só incluir se suportado E não nulo
  IF config.supports_top_p = true AND config.top_p IS NOT NULL THEN
    body := body || jsonb_build_object('top_p', config.top_p);
  END IF;

  -- frequency_penalty: só incluir se suportado E não nulo
  IF config.supports_frequency_penalty = true AND config.frequency_penalty IS NOT NULL THEN
    body := body || jsonb_build_object('frequency_penalty', config.frequency_penalty);
  END IF;

  -- presence_penalty: só incluir se suportado E não nulo
  IF config.supports_presence_penalty = true AND config.presence_penalty IS NOT NULL THEN
    body := body || jsonb_build_object('presence_penalty', config.presence_penalty);
  END IF;

  -- response_format: só incluir se suportado E configurado
  IF config.supports_json_mode = true AND config.response_format IS NOT NULL THEN
    IF config.response_format = 'json_object' THEN
      body := body || jsonb_build_object('response_format', jsonb_build_object('type', 'json_object'));
    ELSIF config.response_format = 'json_schema' AND config.json_schema IS NOT NULL THEN
      body := body || jsonb_build_object('response_format', jsonb_build_object('type', 'json_schema', 'json_schema', config.json_schema));
    END IF;
  END IF;

  -- seed: só incluir se suportado E não nulo
  IF config.supports_seed = true AND config.seed IS NOT NULL THEN
    body := body || jsonb_build_object('seed', config.seed);
  END IF;

  -- stop_sequences: só incluir se suportado E não nulo/vazio
  IF config.supports_stop_sequences = true AND config.stop_sequences IS NOT NULL AND array_length(config.stop_sequences, 1) > 0 THEN
    body := body || jsonb_build_object('stop', to_jsonb(config.stop_sequences));
  END IF;

  -- 6. Montar headers com autenticação dinâmica
  headers := jsonb_build_object(
    'Content-Type', 'application/json',
    COALESCE(config.auth_header, 'Authorization'), 
    COALESCE(config.auth_prefix, 'Bearer ') || api_key
  );

  -- 7. Montar URL da API
  api_url := config.api_base_url;
  
  -- Ajustar URL baseado no provider
  IF config.provider = 'openai' THEN
    api_url := COALESCE(api_url, 'https://api.openai.com') || '/v1/chat/completions';
  ELSIF config.provider = 'anthropic' THEN
    api_url := COALESCE(api_url, 'https://api.anthropic.com') || '/v1/messages';
    -- Anthropic requer headers adicionais
    headers := headers || jsonb_build_object(
      'anthropic-version', '2023-06-01',
      'x-api-key', api_key
    );
    -- Remover Authorization header padrão para Anthropic
    headers := headers - 'Authorization';
  ELSIF config.provider = 'google' THEN
    api_url := COALESCE(api_url, 'https://generativelanguage.googleapis.com') || 
               '/v1beta/models/' || COALESCE(config.model_api_name, config.model_name) || 
               ':generateContent?key=' || api_key;
    -- Google não usa header de auth, usa query param
    headers := headers - 'Authorization';
  ELSIF config.provider = 'groq' THEN
    api_url := COALESCE(api_url, 'https://api.groq.com') || '/openai/v1/chat/completions';
  ELSIF config.provider = 'lovable' THEN
    api_url := COALESCE(api_url, 'https://ai.gateway.lovable.dev') || '/v1/chat/completions';
  ELSE
    -- Provider genérico OpenAI-compatible
    api_url := COALESCE(api_url, 'https://api.openai.com') || '/v1/chat/completions';
  END IF;

  -- 8. Retornar configuração completa pronta para fetch
  RETURN jsonb_build_object(
    'api_url', api_url,
    'headers', headers,
    'body', body,
    'config', jsonb_build_object(
      'function_name', fn_name,
      'model_name', config.model_name,
      'provider', config.provider,
      'supports_streaming', config.supports_streaming,
      'supports_tools', config.supports_tools
    )
  );
END;
$$;

-- 4. Conceder permissões para service_role (Edge Functions)
GRANT EXECUTE ON FUNCTION build_ai_request(TEXT, JSONB) TO service_role;

-- 5. Comentário de documentação
COMMENT ON FUNCTION build_ai_request IS 'RPC que monta request completo para AI providers com drop_params inteligente baseado em supports_* do modelo. Retorna {api_url, headers, body} pronto para fetch().';

-- 6. Criar índice para performance (se não existir)
CREATE INDEX IF NOT EXISTS idx_ai_prompt_configs_function_name 
ON ai_prompt_configs(function_name) 
WHERE is_active = true;