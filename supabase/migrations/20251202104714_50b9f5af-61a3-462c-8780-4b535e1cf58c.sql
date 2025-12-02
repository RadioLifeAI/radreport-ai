-- Aumentar max_tokens para funções AI que usam modelos de raciocínio
-- Modelos como gpt-5-nano consomem tokens extras para raciocínio interno
-- 2000 tokens é muito restritivo, pode truncar respostas

-- ai-suggestion-review: 2000 → 6000 (resposta complexa com <improved> e <notes>)
UPDATE ai_prompt_configs 
SET max_tokens = 6000,
    updated_at = now()
WHERE function_name = 'ai-suggestion-review';

-- ai-generate-conclusion: 2000 → 4000 (conclusão + raciocínio)
UPDATE ai_prompt_configs 
SET max_tokens = 4000,
    updated_at = now()
WHERE function_name = 'ai-generate-conclusion';

-- ai-rads-classification: 2000 → 4000 (classificação + recomendação)
UPDATE ai_prompt_configs 
SET max_tokens = 4000,
    updated_at = now()
WHERE function_name = 'ai-rads-classification';

-- ai-dictation-polish: 2000 → 3000 (correção de texto)
UPDATE ai_prompt_configs 
SET max_tokens = 3000,
    updated_at = now()
WHERE function_name = 'ai-dictation-polish';

-- ai-inline-edit: 1500 → 2500 (edição inline)
UPDATE ai_prompt_configs 
SET max_tokens = 2500,
    updated_at = now()
WHERE function_name = 'ai-inline-edit';

-- ai-voice-inline-edit: 500 → 1500 (muito baixo para raciocínio)
UPDATE ai_prompt_configs 
SET max_tokens = 1500,
    updated_at = now()
WHERE function_name = 'ai-voice-inline-edit';