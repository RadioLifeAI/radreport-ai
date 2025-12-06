-- Fase 1: Corrigir conteudo_template (105 templates com \n literal)
UPDATE system_templates
SET conteudo_template = REPLACE(REPLACE(conteudo_template, E'\\n\\n', E'\n\n'), E'\\n', E'\n')
WHERE conteudo_template LIKE E'%\\\\n%';

-- Fase 2: Corrigir tecnica JSONB (1 template)
-- Template: Laudo de Radiografia de Tórax (Perícia)
UPDATE system_templates
SET tecnica = (
  SELECT jsonb_object_agg(
    key, 
    REPLACE(REPLACE(value::text, E'\\\\n', E'\n'), '"', '')
  )::jsonb
  FROM jsonb_each_text(tecnica)
)
WHERE id = 'f95e7e39-a846-4e12-ac01-71c102a86bb1'
  AND tecnica IS NOT NULL;

-- Fase 3: Corrigir tecnica_config JSONB caso tenha problemas
UPDATE system_templates
SET tecnica_config = (
  SELECT jsonb_object_agg(
    key,
    CASE 
      WHEN jsonb_typeof(value) = 'string' THEN 
        to_jsonb(REPLACE(REPLACE(value::text, E'\\\\n', E'\n'), '"', ''))
      ELSE value
    END
  )
  FROM jsonb_each(tecnica_config)
)
WHERE tecnica_config IS NOT NULL 
  AND tecnica_config::text LIKE E'%\\\\n%';

-- Fase 4: Corrigir indicacao_clinica
UPDATE system_templates
SET indicacao_clinica = REPLACE(REPLACE(indicacao_clinica, E'\\n\\n', E'\n\n'), E'\\n', E'\n')
WHERE indicacao_clinica IS NOT NULL AND indicacao_clinica LIKE E'%\\\\n%';