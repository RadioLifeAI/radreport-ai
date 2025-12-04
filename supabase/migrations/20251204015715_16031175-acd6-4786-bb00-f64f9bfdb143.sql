-- Migration: Corrigir 39 templates RX - impressão e categorias
-- Afetados: 34 normais sem impressão, 3 categoria incorreta, 2 alterados sem impressão

-- Etapa 1: Preencher impressão dos 34 templates RX normais
UPDATE system_templates
SET impressao = 'Estudo radiográfico sem alterações significativas.'
WHERE modalidade_codigo = 'RX'
AND categoria = 'normal'
AND (impressao IS NULL OR LENGTH(TRIM(impressao)) < 5);

-- Etapa 2: Corrigir categoria dos 3 templates RX (alterado → normal)
UPDATE system_templates
SET categoria = 'normal'
WHERE codigo IN (
  'RX_ENEMA_OPACO',
  'RX_ESOFAGO_ESTOMAGO_DUODENO',
  'RX_MEMBROS_INFERIORES_PANORAMICA'
);

-- Etapa 3: Preencher impressão dos 2 templates RX alterados
UPDATE system_templates
SET impressao = 'Colangiografia transparieto-hepática realizada conforme técnica.'
WHERE codigo = 'RX_COLANGIOGRAFIA_TRANSPARIETO';

UPDATE system_templates
SET impressao = 'Escoliose toracolombar. Demais estruturas sem alterações significativas.'
WHERE codigo = 'RX_COLUNA_PANORAMICA';