-- Add provider-specific prompt columns to whisper_config
ALTER TABLE whisper_config
ADD COLUMN IF NOT EXISTS prompt_groq TEXT,
ADD COLUMN IF NOT EXISTS prompt_openai TEXT,
ADD COLUMN IF NOT EXISTS prompt_openai_mini TEXT;

-- Prompt otimizado para GROQ (hints curtos, ~850 char limit)
UPDATE whisper_config SET prompt_groq = 
'Laudo radiológico brasileiro. Terminologia: hepatomegalia, esplenomegalia, esteatose, colecistite, colelitíase, pancreatite, hidronefrose, hipoecogênico, hiperecogênico, heterogêneo, linfonodomegalia, BI-RADS, TI-RADS, PI-RADS, LI-RADS, O-RADS, parênquima, neoplasia, nódulo, cisto, lesão, calcificação, aneurisma, ateromatose, dilatação, estenose, trombose, ascite, derrame, consolidação, atelectasia, bronquiectasia.'
WHERE config_name = 'default';

-- Prompt completo para GPT-4o-transcribe (instruções detalhadas, sem limite)
UPDATE whisper_config SET prompt_openai = 
'Você é um transcritor médico radiológico brasileiro de alta precisão.

REGRAS OBRIGATÓRIAS:
1. REMOVA todas hesitações: é, ééé, hã, hmm, né, tipo, assim, então, é isso, ahn, ah
2. Use VÍRGULA como decimal: 3,2 (não 3.2)
3. Medidas: use "x" como separador (10 x 8 x 6 cm)
4. Unidades: mm, cm, ml, HU
5. Mantenha apenas conteúdo médico significativo

TERMINOLOGIA MÉDICA (transcreva exatamente):
hepatomegalia, esplenomegalia, esteatose, colecistite, colelitíase, pancreatite, hidronefrose, hipoecogênico, hiperecogênico, heterogêneo, linfonodomegalia, BI-RADS, TI-RADS, PI-RADS, LI-RADS, O-RADS, parênquima, neoplasia, nódulo, cisto, lesão, dilatação, estenose, trombose, edema, hematoma, calcificação, aneurisma, ateromatose, adenopatia, ascite, derrame pleural, pneumotórax, consolidação, atelectasia, bronquiectasia, enfisema, fibrose, metástase

FORMATO: Texto em português BR, pronto para inserção direta no laudo médico.'
WHERE config_name = 'default';

-- Prompt intermediário para Mini
UPDATE whisper_config SET prompt_openai_mini = 
'Transcritor médico radiológico brasileiro. Remova hesitações (é, hã, né). Use vírgula decimal (3,2). Medidas: 10 x 8 x 6 cm.

Terminologia: hepatomegalia, esplenomegalia, esteatose, colecistite, colelitíase, pancreatite, hidronefrose, hipoecogênico, hiperecogênico, heterogêneo, linfonodomegalia, BI-RADS, TI-RADS, PI-RADS, parênquima, neoplasia, nódulo, cisto, lesão, calcificação, aneurisma, ateromatose.'
WHERE config_name = 'default';

-- Add comment for documentation
COMMENT ON COLUMN whisper_config.prompt_groq IS 'Prompt otimizado para Groq (~850 chars max, apenas terminologia como hints)';
COMMENT ON COLUMN whisper_config.prompt_openai IS 'Prompt completo para OpenAI GPT-4o-transcribe (sem limite, instruções detalhadas)';
COMMENT ON COLUMN whisper_config.prompt_openai_mini IS 'Prompt intermediário para OpenAI Mini (instruções simplificadas)';