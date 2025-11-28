-- =====================================================
-- CORREÇÃO COMPLETA DAS INCONSISTÊNCIAS RESTANTES
-- =====================================================
-- Este script corrige as ~35 frases restantes em 4 fases:
-- 1. Corrigir 20 frases: tipo "number" → "numero"
-- 2. Converter 15 frases: formato objeto → array
-- 3. Converter 7 variáveis: segmento texto → select
-- 4. Padronizar 1-2 frases: "valores" → "opcoes"
-- =====================================================

-- FASE 1: Corrigir tipo "number" → "numero" (20 frases)
-- ========================================================

UPDATE frases_modelo 
SET variaveis = REPLACE(REPLACE(variaveis::text, '"tipo": "number"', '"tipo": "numero"'), '"tipo":"number"', '"tipo":"numero"')::jsonb
WHERE codigo IN (
  'US_ESC_TESTICULOS_NORMAL_001',
  'US_ESC_TESTICULOS_AUMENTADO_001',
  'US_ESC_TESTICULOS_DIMINUIDO_001',
  'US_ESC_EPIDIMIOS_NORMAL_001',
  'US_ESC_EPIDIMIOS_AUMENTADO_001',
  'US_ESC_VARICOCELE_001',
  'US_ESC_HIDROCELE_001',
  'US_ESC_CISTO_EPIDIDIMO_001',
  'US_ESC_CISTO_TESTICULO_001',
  'US_ESC_NODULO_SOLIDO_001',
  'US_ESC_MICROLITÍASE_001',
  'US_ABD_RINS_CISTOS_SIMPLES_BILATERAIS_001',
  'US_ABD_RINS_CISTO_SIMPLES_UNILATERAL_001',
  'US_ABD_RINS_CISTO_CORTICAL_001',
  'US_ABD_RINS_CISTO_SINUSAL_001',
  'US_ABD_RINS_ANGIOMIOLIPOMA_001',
  'US_ABD_RINS_CALCULO_001',
  'US_ABD_RINS_NEFROSTOMIA_001',
  'US_ABD_RINS_ATROFIA_001',
  'US_ABD_RINS_PIELONEFRITE_001'
);


-- FASE 2: Converter formato objeto → array (15 frases)
-- =====================================================

-- Grupo 1: Frases de fígado com segmento
UPDATE frases_modelo 
SET variaveis = jsonb_build_array(
  jsonb_build_object(
    'nome', 'segmento',
    'tipo', 'texto',
    'obrigatorio', true,
    'descricao', 'Segmento hepático afetado'
  ),
  jsonb_build_object(
    'nome', 'medida',
    'tipo', 'numero',
    'minimo', (variaveis->'medida'->>'minimo')::numeric,
    'maximo', (variaveis->'medida'->>'maximo')::numeric,
    'obrigatorio', (variaveis->'medida'->>'obrigatorio')::boolean,
    'unidade', variaveis->'medida'->>'unidade',
    'descricao', variaveis->'medida'->>'descricao'
  )
)
WHERE codigo IN (
  'USG_ABD_FIG_CISTO_SIMPLES_001',
  'USG_ABD_FIG_HEMANGIOMA_001',
  'USG_ABD_FIG_HIPERPLASIA_NODULAR_FOCAL_001'
) AND variaveis IS NOT NULL AND jsonb_typeof(variaveis) = 'object';

-- Grupo 2: Frases de fígado com segmento_maior
UPDATE frases_modelo 
SET variaveis = jsonb_build_array(
  jsonb_build_object(
    'nome', 'segmento_maior',
    'tipo', 'texto',
    'obrigatorio', true,
    'descricao', 'Segmento de maior cisto'
  ),
  jsonb_build_object(
    'nome', 'medida_maior',
    'tipo', 'numero',
    'minimo', (variaveis->'medida_maior'->>'minimo')::numeric,
    'maximo', (variaveis->'medida_maior'->>'maximo')::numeric,
    'obrigatorio', (variaveis->'medida_maior'->>'obrigatorio')::boolean,
    'unidade', variaveis->'medida_maior'->>'unidade',
    'descricao', variaveis->'medida_maior'->>'descricao'
  )
)
WHERE codigo IN (
  'USG_ABD_FIG_CISTOS_MULTIPLOS_001',
  'USG_ABD_FIG_HEMANGIOMAS_MULTIPLOS_001'
) AND variaveis IS NOT NULL AND jsonb_typeof(variaveis) = 'object';

-- Grupo 3: Frases com apenas medida (veia porta, vesícula, vias biliares)
UPDATE frases_modelo 
SET variaveis = jsonb_build_array(
  jsonb_build_object(
    'nome', 'medida',
    'tipo', 'numero',
    'minimo', (variaveis->'medida'->>'minimo')::numeric,
    'maximo', (variaveis->'medida'->>'maximo')::numeric,
    'obrigatorio', COALESCE((variaveis->'medida'->>'obrigatorio')::boolean, true),
    'unidade', variaveis->'medida'->>'unidade',
    'descricao', COALESCE(variaveis->'medida'->>'descricao', 'Medida')
  )
)
WHERE codigo IN (
  'USG_ABD_VEIA_PORTA_DILATADA_001',
  'USG_ABD_VEIA_PORTA_TROMBOSE_001',
  'USG_ABD_VESICULA_PAREDE_ESPESSADA_001',
  'USG_ABD_VESICULA_CALCULO_UNICO_001',
  'USG_ABD_VESICULA_CALCULO_MULTIPLOS_001',
  'USG_ABD_VESICULA_BARRO_BILIAR_001',
  'USG_ABD_VESICULA_POLIPO_001',
  'USG_ABD_VIAS_BILIARES_CALCULO_COLEDOCO_001',
  'USG_ABD_VIAS_BILIARES_DILAT_INTRA_EXTRA_001'
) AND variaveis IS NOT NULL AND jsonb_typeof(variaveis) = 'object';

-- Grupo 4: Frase com quantidade e espessura_parede
UPDATE frases_modelo 
SET variaveis = jsonb_build_array(
  jsonb_build_object(
    'nome', 'quantidade',
    'tipo', 'select',
    'opcoes', ARRAY['pequena', 'moderada', 'grande'],
    'obrigatorio', (variaveis->'quantidade'->>'obrigatorio')::boolean,
    'descricao', variaveis->'quantidade'->>'descricao'
  ),
  jsonb_build_object(
    'nome', 'espessura_parede_cm',
    'tipo', 'numero',
    'minimo', (variaveis->'espessura_parede_cm'->>'minimo')::numeric,
    'maximo', (variaveis->'espessura_parede_cm'->>'maximo')::numeric,
    'obrigatorio', (variaveis->'espessura_parede_cm'->>'obrigatorio')::boolean,
    'unidade', variaveis->'espessura_parede_cm'->>'unidade',
    'descricao', variaveis->'espessura_parede_cm'->>'descricao'
  )
)
WHERE codigo = 'USG_ABD_FIG_COLECAO_VARIAVEL_001'
  AND variaveis IS NOT NULL 
  AND jsonb_typeof(variaveis) = 'object';


-- FASE 3: Converter segmento "texto" → "select" (7 variáveis)
-- ============================================================

UPDATE frases_modelo 
SET variaveis = (
  SELECT jsonb_agg(
    CASE 
      WHEN elem->>'nome' IN ('segmento', 'segmento_maior') 
        AND elem->>'tipo' = 'texto' 
      THEN jsonb_set(
        jsonb_set(elem, '{tipo}', '"select"'::jsonb),
        '{opcoes}',
        '["I", "II", "III", "IVa", "IVb", "V", "VI", "VII", "VIII"]'::jsonb
      )
      ELSE elem
    END
  )
  FROM jsonb_array_elements(variaveis) elem
)
WHERE codigo IN (
  'USG_ABD_FIG_CISTO_SIMPLES_001',
  'USG_ABD_FIG_HEMANGIOMA_001',
  'USG_ABD_FIG_HIPERPLASIA_NODULAR_FOCAL_001',
  'USG_ABD_FIG_CISTOS_MULTIPLOS_001',
  'USG_ABD_FIG_HEMANGIOMAS_MULTIPLOS_001'
) 
AND variaveis IS NOT NULL 
AND jsonb_typeof(variaveis) = 'array';


-- FASE 4: Padronizar "valores" → "opcoes" (1-2 frases)
-- =====================================================

UPDATE frases_modelo 
SET variaveis = (
  SELECT jsonb_agg(
    CASE 
      WHEN elem ? 'valores' THEN 
        elem - 'valores' || jsonb_build_object('opcoes', elem->'valores')
      ELSE elem
    END
  )
  FROM jsonb_array_elements(variaveis) elem
)
WHERE variaveis::text LIKE '%"valores"%'
  AND variaveis IS NOT NULL 
  AND jsonb_typeof(variaveis) = 'array';


-- =====================================================
-- FIM DA CORREÇÃO
-- =====================================================
-- Total estimado de registros afetados: ~35
-- Tempo estimado de execução: <2 segundos
-- =====================================================