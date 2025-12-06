-- Corrigir TODOS templates com \n literal armazenado como texto
-- Converter para quebras de linha reais em achados, impressao e adicionais

-- Fase 1: Corrigir campo achados
UPDATE system_templates
SET achados = REPLACE(REPLACE(achados, E'\\n\\n', E'\n\n'), E'\\n', E'\n')
WHERE achados LIKE E'%\\\\n%';

-- Fase 2: Corrigir campo impressao  
UPDATE system_templates
SET impressao = REPLACE(REPLACE(impressao, E'\\n\\n', E'\n\n'), E'\\n', E'\n')
WHERE impressao LIKE E'%\\\\n%';

-- Fase 3: Corrigir campo adicionais
UPDATE system_templates
SET adicionais = REPLACE(REPLACE(adicionais, E'\\n\\n', E'\n\n'), E'\\n', E'\n')
WHERE adicionais IS NOT NULL AND adicionais LIKE E'%\\\\n%';