
-- Fase 1: Correções Críticas do Sistema de Variáveis das Frases Modelo
-- 4 migrações para garantir consistência e exibição correta no modal

-- 1.1 Corrigir USG_ABD_COLEDOCOLITIASE_001 (formato de objeto incorreto)
UPDATE frases_modelo
SET variaveis = '[
  {"nome": "medida", "tipo": "numero", "maximo": 3.0, "minimo": 0.2, "unidade": "cm", "descricao": "Medida do cálculo em centímetros", "obrigatorio": true},
  {"nome": "grau_dilatacao", "tipo": "select", "opcoes": ["leve", "moderada", "acentuada"], "descricao": "Grau de dilatação", "obrigatorio": true}
]'::jsonb,
    updated_at = now()
WHERE codigo = 'USG_ABD_COLEDOCOLITIASE_001';

-- 1.2 Converter todos os tipos 'text' para 'texto' (27 variáveis em 21 frases)
UPDATE frases_modelo
SET variaveis = (
  SELECT jsonb_agg(
    CASE 
      WHEN elem->>'tipo' = 'text' THEN jsonb_set(elem, '{tipo}', '"texto"')
      ELSE elem
    END
  )
  FROM jsonb_array_elements(variaveis) as elem
),
    updated_at = now()
WHERE variaveis IS NOT NULL 
  AND variaveis != '[]'::jsonb
  AND EXISTS (
    SELECT 1 FROM jsonb_array_elements(variaveis) v
    WHERE v->>'tipo' = 'text'
  );

-- 1.3 Converter variáveis de volume de 'numero' para 'volume' e definir unidade 'cm³'
UPDATE frases_modelo
SET variaveis = (
  SELECT jsonb_agg(
    CASE 
      WHEN (elem->>'tipo' = 'numero' OR elem->>'tipo' = 'number')
        AND (
          elem->>'nome' ILIKE '%vol%' 
          OR elem->>'nome' ILIKE '%volume%'
          OR elem->>'unidade' IN ('cm³', 'cm3', 'ml', 'mL', 'cc')
        )
      THEN jsonb_set(jsonb_set(elem, '{tipo}', '"volume"'), '{unidade}', '"cm³"')
      ELSE elem
    END
  )
  FROM jsonb_array_elements(variaveis) as elem
),
    updated_at = now()
WHERE variaveis IS NOT NULL 
  AND variaveis != '[]'::jsonb
  AND EXISTS (
    SELECT 1 FROM jsonb_array_elements(variaveis) v
    WHERE (v->>'tipo' = 'numero' OR v->>'tipo' = 'number')
      AND (
        v->>'nome' ILIKE '%vol%' 
        OR v->>'nome' ILIKE '%volume%'
        OR v->>'unidade' IN ('cm³', 'cm3', 'ml', 'mL', 'cc')
      )
  );

-- 1.4 Adicionar unidade 'cm' para variáveis numéricas terminando em '_cm' sem unidade definida
UPDATE frases_modelo
SET variaveis = (
  SELECT jsonb_agg(
    CASE 
      WHEN (elem->>'tipo' = 'numero' OR elem->>'tipo' = 'number')
        AND elem->>'nome' LIKE '%\_cm'
        AND (elem->>'unidade' IS NULL OR elem->>'unidade' = '')
      THEN jsonb_set(elem, '{unidade}', '"cm"')
      ELSE elem
    END
  )
  FROM jsonb_array_elements(variaveis) as elem
),
    updated_at = now()
WHERE variaveis IS NOT NULL 
  AND variaveis != '[]'::jsonb
  AND EXISTS (
    SELECT 1 FROM jsonb_array_elements(variaveis) v
    WHERE (v->>'tipo' = 'numero' OR v->>'tipo' = 'number')
      AND v->>'nome' LIKE '%\_cm'
      AND (v->>'unidade' IS NULL OR v->>'unidade' = '')
  );

-- 1.5 Adicionar unidade 'cm³' para variáveis numéricas terminando em '_cm3' sem unidade definida
UPDATE frases_modelo
SET variaveis = (
  SELECT jsonb_agg(
    CASE 
      WHEN (elem->>'tipo' = 'numero' OR elem->>'tipo' = 'number')
        AND elem->>'nome' LIKE '%\_cm3'
        AND (elem->>'unidade' IS NULL OR elem->>'unidade' = '')
      THEN jsonb_set(elem, '{unidade}', '"cm³"')
      ELSE elem
    END
  )
  FROM jsonb_array_elements(variaveis) as elem
),
    updated_at = now()
WHERE variaveis IS NOT NULL 
  AND variaveis != '[]'::jsonb
  AND EXISTS (
    SELECT 1 FROM jsonb_array_elements(variaveis) v
    WHERE (v->>'tipo' = 'numero' OR v->>'tipo' = 'number')
      AND v->>'nome' LIKE '%\_cm3'
      AND (v->>'unidade' IS NULL OR v->>'unidade' = '')
  );

-- 1.6 Converter variáveis 'segmento' e 'segmento_maior' de 'texto' para 'select' com opções de segmentos hepáticos
UPDATE frases_modelo
SET variaveis = (
  SELECT jsonb_agg(
    CASE 
      WHEN (elem->>'nome' = 'segmento_maior' OR elem->>'nome' = 'segmento')
        AND elem->>'tipo' = 'texto'
      THEN jsonb_set(
        jsonb_set(elem, '{tipo}', '"select"'), 
        '{opcoes}', '["I", "II", "III", "IVa", "IVb", "V", "VI", "VII", "VIII"]'
      )
      ELSE elem
    END
  )
  FROM jsonb_array_elements(variaveis) as elem
),
    updated_at = now()
WHERE variaveis IS NOT NULL 
  AND variaveis != '[]'::jsonb
  AND EXISTS (
    SELECT 1 FROM jsonb_array_elements(variaveis) v
    WHERE (v->>'nome' = 'segmento_maior' OR v->>'nome' = 'segmento')
      AND v->>'tipo' = 'texto'
  );
