-- Migration: Padronizar formato de técnica - Converter Array para Objeto
-- Afetados: 21 templates TC com tecnica em formato array
-- Regra: sem_contraste→SEM, com_contraste→EV

-- Converter templates que têm tecnica como array JSON válido
UPDATE system_templates
SET tecnica = (
  SELECT jsonb_object_agg(
    CASE 
      WHEN elem->>'tipo' = 'sem_contraste' THEN 'SEM'
      WHEN elem->>'tipo' = 'com_contraste' THEN 'EV'
      WHEN elem->>'tipo' ILIKE '%sem%' THEN 'SEM'
      WHEN elem->>'tipo' ILIKE '%com%' THEN 'EV'
      ELSE UPPER(REPLACE(COALESCE(elem->>'tipo', 'PADRAO'), '_', ' '))
    END,
    COALESCE(elem->>'descricao', '')
  )
  FROM jsonb_array_elements(tecnica) AS elem
)
WHERE tecnica IS NOT NULL 
  AND jsonb_typeof(tecnica) = 'array';