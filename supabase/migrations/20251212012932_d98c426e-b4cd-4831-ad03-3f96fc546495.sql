-- Tabela de configuração dinâmica para transcrição Whisper
CREATE TABLE IF NOT EXISTS whisper_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_name VARCHAR(50) UNIQUE NOT NULL DEFAULT 'default',
  display_name VARCHAR(100) NOT NULL DEFAULT 'Configuração Padrão',
  
  -- Provider Selection
  provider VARCHAR(20) NOT NULL DEFAULT 'groq',
  model VARCHAR(50) NOT NULL DEFAULT 'whisper-large-v3-turbo',
  
  -- Prompt médico completo (sem limite para OpenAI gpt-4o-transcribe)
  system_prompt TEXT NOT NULL,
  
  -- Quality Parameters
  language VARCHAR(10) DEFAULT 'pt',
  temperature DECIMAL(3,2) DEFAULT 0.0,
  response_format VARCHAR(20) DEFAULT 'verbose_json',
  
  -- Filtering thresholds
  no_speech_prob_threshold DECIMAL(3,2) DEFAULT 0.5,
  avg_logprob_threshold DECIMAL(4,2) DEFAULT -0.5,
  
  -- Credit Costs
  credit_cost_per_minute INTEGER DEFAULT 1,
  max_credits_per_audio INTEGER DEFAULT 5,
  min_audio_seconds INTEGER DEFAULT 2,
  
  -- Feature Flags
  remove_fillers BOOLEAN DEFAULT true,
  normalize_measurements BOOLEAN DEFAULT true,
  
  -- Plan-based provider override
  provider_gratuito VARCHAR(20) DEFAULT 'groq',
  provider_basico VARCHAR(20) DEFAULT 'openai_mini', 
  provider_profissional VARCHAR(20) DEFAULT 'openai',
  provider_premium VARCHAR(20) DEFAULT 'openai',
  
  -- Metadata
  is_active BOOLEAN DEFAULT true,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE whisper_config ENABLE ROW LEVEL SECURITY;

-- Admin can manage config
CREATE POLICY "Admins can manage whisper config"
ON whisper_config
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Anyone can read active config
CREATE POLICY "Anyone can read active whisper config"
ON whisper_config
FOR SELECT
USING (is_active = true);

-- Insert default configuration with medical prompt
INSERT INTO whisper_config (config_name, display_name, system_prompt)
VALUES (
  'default',
  'Configuração Padrão Radiologia',
  'Você é um transcritor médico radiológico brasileiro de alta precisão.

REGRAS OBRIGATÓRIAS:
1. Transcreva exatamente o que é dito, aplicando correções formais da língua portuguesa e termos médicos.
2. Ortografia médica brasileira padronizada.
3. Nomes anatômicos e termos radiológicos na forma tradicional brasileira.
4. Medidas: substituir ponto por vírgula decimal e manter 1 casa (ex.: "3.2" → "3,2").
5. Unidades: "mm", "cm", "ml", "HU".
6. Nunca traduza nomes de métodos ou sequências (tomografia computadorizada, ressonância magnética).
7. Remova vícios de fala comuns (ééé, hã, né, tipo, é isso, hmm, ãh).
8. Não reescreva o sentido da frase; apenas normalize o texto.
9. Fragmentos incompletos devem ser mantidos como fragmentos.
10. Não invente informações.

TERMINOLOGIA MÉDICA OBRIGATÓRIA:
- Ecografia: hepatomegalia, esplenomegalia, esteatose, colecistite, colelitíase, hipoecogênico, hiperecogênico, heterogêneo, linfonodomegalia
- Tomografia: hipodensidade, hiperdensidade, realce, contraste, atenuação, consolidação, opacidade, derrame pleural
- Ressonância: hipossinal, hipersinal, T1, T2, FLAIR, DWI, ADC, ponderação, captação de contraste
- Classificações: BI-RADS, TI-RADS, PI-RADS, LI-RADS, O-RADS, LUNG-RADS
- Anatomia: parênquima, cápsula, hilo, pedículo, vascularização, ducto, fáscia
- Patologia: neoplasia, nódulo, cisto, lesão, massa, dilatação, estenose, trombose, edema, hematoma, calcificação

FORMATO MEDIDAS: Use vírgula como separador decimal (7,8 cm, não 7.8 cm). 
Separador de dimensões: "x" (10,2 x 8,5 x 6,3 cm).

Saída: sempre em português BR, formato final pronto para inserção no editor.'
);

-- Add provider column to whisper_usage_log
ALTER TABLE whisper_usage_log 
ADD COLUMN IF NOT EXISTS provider VARCHAR(20) DEFAULT 'groq',
ADD COLUMN IF NOT EXISTS config_version INTEGER DEFAULT 1;

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_whisper_config_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  NEW.version = OLD.version + 1;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS whisper_config_updated_at ON whisper_config;
CREATE TRIGGER whisper_config_updated_at
BEFORE UPDATE ON whisper_config
FOR EACH ROW
EXECUTE FUNCTION update_whisper_config_updated_at();