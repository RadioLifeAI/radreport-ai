-- =====================================================
-- UNIFORMIZAÇÃO COMPLETA DO BANCO DE DADOS
-- =====================================================
-- Este script aplica 4 correções críticas para uniformizar
-- dados em frases_modelo e system_templates
-- Total estimado: ~93 registros afetados
-- =====================================================

-- =====================================================
-- CORREÇÃO 1: Converter \n Literal para Newline Real
-- =====================================================
-- Afeta: 3 frases em frases_modelo
-- =====================================================

UPDATE frases_modelo
SET 
  texto = REPLACE(texto, '\n', E'\n'),
  conclusao = REPLACE(conclusao, '\n', E'\n'),
  updated_at = NOW()
WHERE codigo IN (
  'US_MAMA_ABSCESSOS_002',
  'US_CERV_TIREOIDE_NODULOS_TIRADS_ENUM_003',
  'US_ABD_LINFONODOS_LINFONODOMEGALIA_NECROSE_002'
);


-- =====================================================
-- CORREÇÃO 2: Padronizar Regiões para Minúsculo
-- =====================================================
-- Afeta: ~70 templates em system_templates
-- =====================================================

-- Converter todas as regiões para minúsculo
UPDATE system_templates
SET regiao_codigo = LOWER(regiao_codigo),
    updated_at = NOW()
WHERE ativo = true 
  AND regiao_codigo != LOWER(regiao_codigo);

-- Corrigir erro de digitação CALCANE0 -> calcaneo
UPDATE system_templates
SET regiao_codigo = 'calcaneo',
    updated_at = NOW()
WHERE regiao_codigo = 'calcane0';


-- =====================================================
-- CORREÇÃO 3: Converter Objeto para Array (15 frases)
-- =====================================================
-- Afeta: 15 frases em frases_modelo
-- =====================================================

-- Converter variaveis de formato objeto para array
UPDATE frases_modelo
SET variaveis = (
  SELECT jsonb_agg(
    jsonb_build_object(
      'nome', key,
      'tipo', value->>'tipo',
      'descricao', value->>'descricao',
      'obrigatorio', COALESCE((value->>'obrigatorio')::boolean, true),
      'minimo', (value->>'minimo')::numeric,
      'maximo', (value->>'maximo')::numeric,
      'unidade', value->>'unidade'
    )
  )
  FROM jsonb_each(variaveis)
),
updated_at = NOW()
WHERE ativa = true 
  AND jsonb_typeof(variaveis) = 'object'
  AND variaveis != '{}'::jsonb;

-- Tratar 2 frases com objeto vazio {} -> array vazio []
UPDATE frases_modelo
SET variaveis = '[]'::jsonb,
    updated_at = NOW()
WHERE ativa = true 
  AND variaveis = '{}'::jsonb;


-- =====================================================
-- CORREÇÃO 4: Converter "text" para "texto" (5 frases)
-- =====================================================
-- Afeta: 5 frases em frases_modelo
-- =====================================================

UPDATE frases_modelo
SET variaveis = (
  SELECT jsonb_agg(
    CASE 
      WHEN elem->>'tipo' = 'text' 
      THEN jsonb_set(elem, '{tipo}', '"texto"')
      ELSE elem
    END
  )
  FROM jsonb_array_elements(variaveis) AS elem
),
updated_at = NOW()
WHERE codigo IN (
  'US_TV_CISTO_FUNCIONAL_OVARIANO_001',
  'US_TV_CISTO_HEMORRAGICO_OVARIANO_001',
  'US_TV_CISTO_OVARIANO_001',
  'US_TV_CISTOS_OVARIANOS_002',
  'USG_ABD_FIG_DOENCA_DEPOSITO_001'
);