-- Migration: Add placeholders to templates with variables
-- Phase 1: TC Extremities - Add {{lado}} placeholder

UPDATE system_templates 
SET achados = achados || E'\n\nExame realizado {{lado}}.'
WHERE codigo IN (
  'TC_BRACO_NORMAL', 'TC_COTOVELO_NORMAL', 'TC_COXA_NORMAL', 
  'TC_JOELHO_NORMAL', 'TC_MAO_NORMAL', 'TC_OMBRO_NORMAL', 
  'TC_PE_NORMAL', 'TC_PERNA_NORMAL', 'TC_PUNHO_NORMAL', 
  'TC_QUADRIL_NORMAL', 'TC_TORNOZELO_NORMAL'
)
AND achados NOT LIKE '%{{lado}}%';

-- Phase 2: RM Colangio - Add {{calibre_hepatocoledoco_cm}} placeholder
UPDATE system_templates 
SET achados = REPLACE(achados, 'calibre de 0,5 cm', 'calibre de {{calibre_hepatocoledoco_cm}} cm')
WHERE codigo = 'RM_ABDOME_SUPERIOR_COLANGIO'
AND achados LIKE '%calibre de 0,5 cm%';

-- Phase 3: AngioTC Coronárias - Add {{escore_agatston}} placeholder
UPDATE system_templates 
SET achados = REPLACE(achados, 'Score de cálcio zero', 'Score de cálcio: {{escore_agatston}} unidades Agatston')
WHERE codigo IN ('ANGIOTC_ESCORE_CALCIO_CORONARIAS_NORMAL', 'ANGIOTC_ESCORE_CALCIO_CORONARIAS_DETALHADO_NORMAL')
AND achados LIKE '%Score de cálcio zero%';

-- Phase 3b: AngioTC Coronárias - Add {{dominancia}} placeholder
UPDATE system_templates 
SET achados = achados || E'\nDominância coronariana {{dominancia}}.'
WHERE codigo IN ('ANGIOTC_ESCORE_CALCIO_CORONARIAS_NORMAL', 'ANGIOTC_ESCORE_CALCIO_CORONARIAS_DETALHADO_NORMAL')
AND achados NOT LIKE '%{{dominancia}}%';

-- Phase 4: Mamografia - Add {{equipamento}} in tecnica JSON (with explicit cast)
UPDATE system_templates 
SET tecnica = jsonb_set(
  tecnica,
  '{padrao}',
  '"Mamografia bilateral em equipamento {{equipamento}}, com incidências médio-lateral oblíquas e crânio-caudais bilaterais."'::jsonb
)
WHERE codigo = 'MG_MAMOGRAFIA_BILATERAL_COMPLETA'
AND tecnica->>'padrao' NOT LIKE '%{{equipamento}}%';