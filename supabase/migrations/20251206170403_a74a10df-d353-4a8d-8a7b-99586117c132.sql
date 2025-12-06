-- Fase 1: Adicionar coluna tecnica_config
ALTER TABLE system_templates 
ADD COLUMN IF NOT EXISTS tecnica_config JSONB DEFAULT '{"tipo": "auto"}'::jsonb;

-- Adicionar comentário
COMMENT ON COLUMN system_templates.tecnica_config IS 'Configuração do comportamento do campo técnica: tipo (alternativo/complementar/misto/unico), concatenar, separador, prefixo_label, ordem_exibicao';

-- Fase 2: Classificar Templates de RX como COMPLEMENTAR (posição, projeção, técnica)
UPDATE system_templates
SET tecnica_config = '{
  "tipo": "complementar",
  "concatenar": true,
  "separador": ". ",
  "prefixo_label": true
}'::jsonb
WHERE modalidade_codigo = 'RX' 
AND tecnica IS NOT NULL
AND jsonb_typeof(tecnica) = 'object'
AND (
  tecnica ? 'posição' OR tecnica ? 'projeção' OR tecnica ? 'técnica' 
  OR tecnica ? 'Posição' OR tecnica ? 'Projeção' OR tecnica ? 'Técnica'
  OR tecnica ? 'incidências' OR tecnica ? 'Incidências'
);

-- Fase 3: Classificar Templates de RM com contraste como ALTERNATIVO
UPDATE system_templates
SET tecnica_config = '{
  "tipo": "alternativo",
  "concatenar": false,
  "separador": " "
}'::jsonb
WHERE modalidade_codigo = 'RM'
AND tecnica IS NOT NULL
AND jsonb_typeof(tecnica) = 'object'
AND (tecnica ? 'EV' OR tecnica ? 'SEM' OR tecnica ? 'Primovist');

-- Fase 4: Classificar Templates de TC com contraste como ALTERNATIVO
UPDATE system_templates
SET tecnica_config = '{
  "tipo": "alternativo",
  "concatenar": false,
  "separador": " "
}'::jsonb
WHERE modalidade_codigo = 'TC'
AND tecnica IS NOT NULL
AND jsonb_typeof(tecnica) = 'object'
AND (tecnica ? 'EV' OR tecnica ? 'SEM' OR tecnica ? 'EV_VO');

-- Fase 5: Classificar Templates com técnica única como UNICO
UPDATE system_templates
SET tecnica_config = '{
  "tipo": "unico",
  "concatenar": false
}'::jsonb
WHERE tecnica IS NOT NULL
AND jsonb_typeof(tecnica) = 'object'
AND tecnica_config->>'tipo' = 'auto'
AND (SELECT COUNT(*) FROM jsonb_object_keys(tecnica) AS k) = 1;

-- Fase 6: Classificar Templates MG/US com técnicas mistas
UPDATE system_templates
SET tecnica_config = '{
  "tipo": "alternativo",
  "concatenar": false,
  "separador": " "
}'::jsonb
WHERE modalidade_codigo IN ('MG', 'US')
AND tecnica IS NOT NULL
AND jsonb_typeof(tecnica) = 'object'
AND tecnica_config->>'tipo' = 'auto'
AND (SELECT COUNT(*) FROM jsonb_object_keys(tecnica) AS k) > 1;

-- Fase 7: Marcar restantes como unico se ainda estão em auto
UPDATE system_templates
SET tecnica_config = '{
  "tipo": "unico",
  "concatenar": false
}'::jsonb
WHERE tecnica_config->>'tipo' = 'auto';