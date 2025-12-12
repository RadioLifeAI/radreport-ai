-- Add new fields to whisper_config for context and streaming support
ALTER TABLE public.whisper_config 
ADD COLUMN IF NOT EXISTS use_previous_context BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS previous_context_chars INTEGER DEFAULT 200,
ADD COLUMN IF NOT EXISTS enable_streaming BOOLEAN DEFAULT false;

-- Add new fields to whisper_usage_log for enhanced logging
ALTER TABLE public.whisper_usage_log 
ADD COLUMN IF NOT EXISTS has_previous_context BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS streaming_used BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS response_format TEXT;

-- Update system_prompt with enhanced medical instructions
UPDATE public.whisper_config 
SET system_prompt = 'Você é um transcritor médico radiológico brasileiro de alta precisão.

REGRAS CRÍTICAS:
1. Remova TODAS hesitações e vícios de fala: é, ééé, hã, hmm, né, tipo, assim, então, é isso, ahn, ah
2. Mantenha apenas conteúdo médico significativo
3. Use vírgula como separador decimal (3,2 não 3.2)
4. Separador de medidas: "x" (10 x 8 x 6 cm)
5. Unidades: mm, cm, ml, HU

TERMINOLOGIA MÉDICA (transcreva exatamente):
hepatomegalia, esplenomegalia, esteatose, colecistite, colelitíase,
pancreatite, hidronefrose, hipoecogênico, hiperecogênico, heterogêneo,
linfonodomegalia, BI-RADS, TI-RADS, PI-RADS, LI-RADS, O-RADS,
parênquima, neoplasia, nódulo, cisto, lesão, dilatação, estenose,
trombose, edema, hematoma, calcificação, aneurisma, ateromatose,
adenopatia, ascite, derrame pleural, pneumotórax, consolidação,
atelectasia, bronquiectasia, enfisema, fibrose, metástase

FORMATO: Português BR, pronto para inserção direta no laudo.'
WHERE config_name = 'default';