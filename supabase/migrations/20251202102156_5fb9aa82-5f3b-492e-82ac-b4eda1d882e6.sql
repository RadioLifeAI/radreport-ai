-- Corrigir api_base_url para usar apenas BASE URL (sem paths)
-- O RPC build_ai_request adiciona o path correto por provider

-- OpenAI (10 modelos)
UPDATE ai_models 
SET api_base_url = 'https://api.openai.com' 
WHERE provider = 'openai';

-- Anthropic (3 modelos)
UPDATE ai_models 
SET api_base_url = 'https://api.anthropic.com' 
WHERE provider = 'anthropic';

-- Google (3 modelos)
UPDATE ai_models 
SET api_base_url = 'https://generativelanguage.googleapis.com' 
WHERE provider = 'google';

-- Groq (2 modelos)
UPDATE ai_models 
SET api_base_url = 'https://api.groq.com' 
WHERE provider = 'groq';