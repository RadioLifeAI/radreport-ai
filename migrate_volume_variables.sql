-- Migration: Convert volume-related variables to tipo='volume'
-- Enables special UI with X/Y/Z measurement inputs + auto-calculation
-- 
-- EXECUTE THIS VIA SUPABASE DASHBOARD SQL EDITOR

-- Step 1: Update variables with unidade cm³/ml to tipo='volume'
-- This affects templates with volume measurements (testicular, prostatic, uterine, cardiac volumes)

UPDATE system_templates
SET variaveis = (
  SELECT jsonb_agg(
    CASE 
      -- Convert to volume type when:
      -- 1. Has unit cm³, cm3, ml, mL, cc OR
      -- 2. Name contains 'volume' or starts with 'vol_'
      WHEN (
        (v->>'unidade' IN ('cm³', 'cm3', 'ml', 'mL', 'cc'))
        OR (v->>'nome' ILIKE '%volume%')
        OR (v->>'nome' ILIKE 'vol_%')
      ) AND (v->>'tipo' = 'numero' OR v->>'tipo' = 'number')
      THEN jsonb_set(v, '{tipo}', '"volume"')
      ELSE v
    END
  )
  FROM jsonb_array_elements(variaveis::jsonb) v
)
WHERE variaveis IS NOT NULL 
  AND variaveis != '[]'::jsonb
  AND EXISTS (
    SELECT 1 
    FROM jsonb_array_elements(variaveis::jsonb) v
    WHERE (
      (v->>'unidade' IN ('cm³', 'cm3', 'ml', 'mL', 'cc'))
      OR (v->>'nome' ILIKE '%volume%')
      OR (v->>'nome' ILIKE 'vol_%')
    )
  );

-- Step 2: Add unidade='cm³' to volume variables missing unit
UPDATE system_templates
SET variaveis = (
  SELECT jsonb_agg(
    CASE 
      WHEN v->>'tipo' = 'volume' AND (v->>'unidade' IS NULL OR v->>'unidade' = '')
      THEN jsonb_set(v, '{unidade}', '"cm³"')
      ELSE v
    END
  )
  FROM jsonb_array_elements(variaveis::jsonb) v
)
WHERE variaveis IS NOT NULL 
  AND variaveis != '[]'::jsonb
  AND EXISTS (
    SELECT 1 
    FROM jsonb_array_elements(variaveis::jsonb) v
    WHERE v->>'tipo' = 'volume' AND (v->>'unidade' IS NULL OR v->>'unidade' = '')
  );

-- Step 3: Verify affected templates and variables
-- Run this query to see what was updated:
/*
SELECT 
  codigo,
  titulo,
  jsonb_array_elements(variaveis::jsonb)->>'nome' as variable_nome,
  jsonb_array_elements(variaveis::jsonb)->>'tipo' as variable_tipo,
  jsonb_array_elements(variaveis::jsonb)->>'unidade' as variable_unidade
FROM system_templates
WHERE variaveis IS NOT NULL 
  AND variaveis != '[]'::jsonb
  AND EXISTS (
    SELECT 1 
    FROM jsonb_array_elements(variaveis::jsonb) v
    WHERE v->>'tipo' = 'volume'
  )
ORDER BY codigo;
*/

-- Expected templates to be affected:
-- USG Bolsa Testicular: volume_dir_cm3, volume_esq_cm3
-- RM Pelve Feminina: vol_utero_cm3, vol_ovario_dir_cm3, vol_ovario_esq_cm3
-- RM Pelve Masculina: vol_prostata_cm3
-- RM Próstata: vol_prostata_cm3
-- RM Cardíaco: ivdfvd, ivsfvd, ivdfve, ivsfve, ivae
-- TC Veias Pulmonares: atrio_esquerdo_cm3, apendice_atrial_cm3
