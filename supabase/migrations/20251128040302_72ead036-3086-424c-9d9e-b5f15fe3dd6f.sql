-- =====================================================
-- CORREÇÃO COMPLETA: VARIÁVEIS USG ABDOME
-- =====================================================
-- Total: ~105 correções em ~94 frases únicas
-- 1. Converter 18 frases: formato objeto → array
-- 2. Corrigir 76 frases: tipo number → numero
-- 3. Converter 7 variáveis: texto → select (segmentos)
-- 4. Adicionar variáveis em 3 frases com texto hardcoded
-- =====================================================

-- =====================================================
-- FASE 1: Converter Formato Objeto → Array (18 frases)
-- =====================================================

-- Frases com formato objeto {"medida": {...}} → array [{"nome": "medida", ...}]
UPDATE frases_modelo SET variaveis = '[{"nome": "medida", "tipo": "numero", "minimo": 0.1, "maximo": 5.0, "obrigatorio": true, "unidade": "cm", "descricao": "Medida do cisto"}]'::jsonb WHERE codigo = 'US_ABD_FIG_CISTO_SIMPLES_001';

UPDATE frases_modelo SET variaveis = '[{"nome": "medida", "tipo": "numero", "minimo": 0.1, "maximo": 5.0, "obrigatorio": true, "unidade": "cm", "descricao": "Medida da imagem nodular"}]'::jsonb WHERE codigo = 'US_ABD_FIG_IMAGEM_NODULAR_HIPOECOGENICA_001';

UPDATE frases_modelo SET variaveis = '[{"nome": "medida", "tipo": "numero", "minimo": 0.1, "maximo": 5.0, "obrigatorio": true, "unidade": "cm", "descricao": "Medida da imagem nodular"}]'::jsonb WHERE codigo = 'US_ABD_FIG_IMAGEM_NODULAR_HIPERECOGENICA_001';

UPDATE frases_modelo SET variaveis = '[{"nome": "medida", "tipo": "numero", "minimo": 0.1, "maximo": 10.0, "obrigatorio": true, "unidade": "cm", "descricao": "Medida da massa"}]'::jsonb WHERE codigo = 'US_ABD_FIG_MASSA_HETEROGENEA_001';

UPDATE frases_modelo SET variaveis = '[{"nome": "medida", "tipo": "numero", "minimo": 0.1, "maximo": 3.0, "obrigatorio": true, "unidade": "cm", "descricao": "Medida da calcificação"}]'::jsonb WHERE codigo = 'US_ABD_FIG_CALCIFICACAO_INTRAPARENQUIMATOSA_001';

UPDATE frases_modelo SET variaveis = '[{"nome": "segmento", "tipo": "select", "opcoes": ["I", "II", "III", "IVa", "IVb", "V", "VI", "VII", "VIII"], "obrigatorio": true, "descricao": "Segmento hepático acometido"}]'::jsonb WHERE codigo = 'US_ABD_FIG_LESAO_FOCAL_INESPECIFICA_001';

UPDATE frases_modelo SET variaveis = '[{"nome": "segmento", "tipo": "select", "opcoes": ["I", "II", "III", "IVa", "IVb", "V", "VI", "VII", "VIII"], "obrigatorio": true, "descricao": "Segmento hepático"}]'::jsonb WHERE codigo = 'US_ABD_FIG_HEMANGIOMA_TIPICO_001';

UPDATE frases_modelo SET variaveis = '[{"nome": "medida", "tipo": "numero", "minimo": 0.1, "maximo": 5.0, "obrigatorio": true, "unidade": "cm", "descricao": "Medida do hemangioma"}, {"nome": "segmento", "tipo": "select", "opcoes": ["I", "II", "III", "IVa", "IVb", "V", "VI", "VII", "VIII"], "obrigatorio": true, "descricao": "Segmento hepático"}]'::jsonb WHERE codigo = 'US_ABD_FIG_HEMANGIOMA_ATIPICO_001';

UPDATE frases_modelo SET variaveis = '[{"nome": "medida", "tipo": "numero", "minimo": 0.1, "maximo": 5.0, "obrigatorio": true, "unidade": "cm", "descricao": "Medida do nódulo"}, {"nome": "segmento", "tipo": "select", "opcoes": ["I", "II", "III", "IVa", "IVb", "V", "VI", "VII", "VIII"], "obrigatorio": true, "descricao": "Segmento hepático"}]'::jsonb WHERE codigo = 'US_ABD_FIG_NODULO_REGENERATIVO_001';

UPDATE frases_modelo SET variaveis = '[{"nome": "medida", "tipo": "numero", "minimo": 0.1, "maximo": 5.0, "obrigatorio": true, "unidade": "cm", "descricao": "Medida da lesão"}, {"nome": "segmento", "tipo": "select", "opcoes": ["I", "II", "III", "IVa", "IVb", "V", "VI", "VII", "VIII"], "obrigatorio": true, "descricao": "Segmento hepático"}]'::jsonb WHERE codigo = 'US_ABD_FIG_HNF_SUSPEITA_001';

UPDATE frases_modelo SET variaveis = '[{"nome": "medida", "tipo": "numero", "minimo": 0.1, "maximo": 10.0, "obrigatorio": true, "unidade": "cm", "descricao": "Medida da lesão"}, {"nome": "segmento", "tipo": "select", "opcoes": ["I", "II", "III", "IVa", "IVb", "V", "VI", "VII", "VIII"], "obrigatorio": true, "descricao": "Segmento hepático"}]'::jsonb WHERE codigo = 'US_ABD_FIG_CHC_SUSPEITA_001';

UPDATE frases_modelo SET variaveis = '[{"nome": "medida", "tipo": "numero", "minimo": 0.1, "maximo": 10.0, "obrigatorio": true, "unidade": "cm", "descricao": "Medida da lesão"}, {"nome": "segmento", "tipo": "select", "opcoes": ["I", "II", "III", "IVa", "IVb", "V", "VI", "VII", "VIII"], "obrigatorio": true, "descricao": "Segmento hepático"}]'::jsonb WHERE codigo = 'US_ABD_FIG_METASTASE_SUSPEITA_001';

UPDATE frases_modelo SET variaveis = '[{"nome": "medida", "tipo": "numero", "minimo": 0.1, "maximo": 5.0, "obrigatorio": true, "unidade": "cm", "descricao": "Medida do abscesso"}, {"nome": "segmento", "tipo": "select", "opcoes": ["I", "II", "III", "IVa", "IVb", "V", "VI", "VII", "VIII"], "obrigatorio": true, "descricao": "Segmento hepático"}]'::jsonb WHERE codigo = 'US_ABD_FIG_ABSCESSO_001';

UPDATE frases_modelo SET variaveis = '[{"nome": "medida", "tipo": "numero", "minimo": 0.1, "maximo": 5.0, "obrigatorio": true, "unidade": "cm", "descricao": "Medida do cisto hidático"}, {"nome": "segmento", "tipo": "select", "opcoes": ["I", "II", "III", "IVa", "IVb", "V", "VI", "VII", "VIII"], "obrigatorio": true, "descricao": "Segmento hepático"}]'::jsonb WHERE codigo = 'US_ABD_FIG_CISTO_HIDATICO_001';

UPDATE frases_modelo SET variaveis = '[{"nome": "medida", "tipo": "numero", "minimo": 0.1, "maximo": 3.0, "obrigatorio": true, "unidade": "cm", "descricao": "Medida do cálculo"}]'::jsonb WHERE codigo = 'US_ABD_VESICULA_COLELITIASE_UNICA_001';

UPDATE frases_modelo SET variaveis = '[{"nome": "maior_medida", "tipo": "numero", "minimo": 0.1, "maximo": 3.0, "obrigatorio": true, "unidade": "cm", "descricao": "Maior medida dos cálculos"}]'::jsonb WHERE codigo = 'US_ABD_VESICULA_COLELITIASE_MULTIPLA_001';

UPDATE frases_modelo SET variaveis = '[{"nome": "medida", "tipo": "numero", "minimo": 0.1, "maximo": 2.0, "obrigatorio": true, "unidade": "cm", "descricao": "Medida do pólipo"}]'::jsonb WHERE codigo = 'US_ABD_VESICULA_POLIPO_001';

UPDATE frases_modelo SET variaveis = '[{"nome": "espessura", "tipo": "numero", "minimo": 0.3, "maximo": 2.0, "obrigatorio": true, "unidade": "cm", "descricao": "Espessura da parede vesicular"}]'::jsonb WHERE codigo = 'US_ABD_VESICULA_COLECISTITE_ALITIASICA_001';


-- =====================================================
-- FASE 2: Corrigir Tipos "number" → "numero" (76 frases)
-- =====================================================

UPDATE frases_modelo 
SET variaveis = (
  SELECT jsonb_agg(
    CASE 
      WHEN elem->>'tipo' = 'number' THEN jsonb_set(elem, '{tipo}', '"numero"'::jsonb)
      ELSE elem
    END
  )
  FROM jsonb_array_elements(variaveis) elem
)
WHERE variaveis IS NOT NULL 
  AND variaveis::text != '[]'
  AND variaveis::text LIKE '%"tipo":"number"%'
  AND codigo LIKE 'US_ABD_%';

UPDATE frases_modelo 
SET variaveis = (
  SELECT jsonb_agg(
    CASE 
      WHEN elem->>'tipo' = 'number' THEN jsonb_set(elem, '{tipo}', '"numero"'::jsonb)
      ELSE elem
    END
  )
  FROM jsonb_array_elements(variaveis) elem
)
WHERE variaveis IS NOT NULL 
  AND variaveis::text != '[]'
  AND variaveis::text LIKE '%"tipo": "number"%'
  AND codigo LIKE 'US_ABD_%';


-- =====================================================
-- FASE 3: Converter "texto" → "select" para Segmentos (7 variáveis)
-- =====================================================

-- Já foi corrigido na Fase 1 para as frases com formato objeto
-- Corrigir frases restantes que já estão em array mas têm tipo "texto" para segmento

UPDATE frases_modelo 
SET variaveis = (
  SELECT jsonb_agg(
    CASE 
      WHEN elem->>'nome' IN ('segmento', 'segmento_hepatico') AND elem->>'tipo' = 'texto' 
      THEN jsonb_build_object(
        'nome', elem->>'nome',
        'tipo', 'select',
        'opcoes', '["I", "II", "III", "IVa", "IVb", "V", "VI", "VII", "VIII"]'::jsonb,
        'obrigatorio', COALESCE((elem->>'obrigatorio')::boolean, true),
        'descricao', COALESCE(elem->>'descricao', 'Segmento hepático')
      )
      ELSE elem
    END
  )
  FROM jsonb_array_elements(variaveis) elem
)
WHERE variaveis IS NOT NULL 
  AND variaveis::text != '[]'
  AND (variaveis::text LIKE '%"nome":"segmento"%' OR variaveis::text LIKE '%"nome":"segmento_hepatico"%')
  AND variaveis::text LIKE '%"tipo":"texto"%'
  AND codigo LIKE 'US_ABD_%';


-- =====================================================
-- FASE 4: Adicionar Variáveis para Texto Hardcoded (3 frases)
-- =====================================================

-- 1. USG_ABD_COLEDOCOLITIASE_001: adicionar {{grau_dilatacao}}
UPDATE frases_modelo 
SET 
  texto = REPLACE(texto, 'leve/moderada/acentuada', '{{grau_dilatacao}}'),
  conclusao = REPLACE(COALESCE(conclusao, ''), 'leve/moderada/acentuada', '{{grau_dilatacao}}'),
  variaveis = COALESCE(variaveis, '[]'::jsonb) || '[{"nome": "grau_dilatacao", "tipo": "select", "opcoes": ["leve", "moderada", "acentuada"], "obrigatorio": true, "descricao": "Grau de dilatação"}]'::jsonb
WHERE codigo = 'USG_ABD_COLEDOCOLITIASE_001';

-- 2. US_ABD_VESICULA_COLECISTITE_LITIASICA_BORDERLINE_002: adicionar {{quantidade}} e {{espessura_parede_cm}}
UPDATE frases_modelo 
SET 
  texto = REPLACE(REPLACE(texto, 'múltiplas/algumas', '{{quantidade}}'), '0,4 cm', '{{espessura_parede_cm}} cm'),
  conclusao = REPLACE(REPLACE(COALESCE(conclusao, ''), 'múltiplas/algumas', '{{quantidade}}'), '0,4 cm', '{{espessura_parede_cm}} cm'),
  variaveis = '[{"nome": "quantidade", "tipo": "select", "opcoes": ["múltiplas", "algumas", "poucas"], "obrigatorio": true, "descricao": "Quantidade de imagens calculosas"}, {"nome": "espessura_parede_cm", "tipo": "numero", "minimo": 0.3, "maximo": 1.5, "obrigatorio": true, "unidade": "cm", "descricao": "Espessura da parede vesicular"}]'::jsonb
WHERE codigo = 'US_ABD_VESICULA_COLECISTITE_LITIASICA_BORDERLINE_002';

-- 3. US_ABD_VESICULA_COLELITIASE_MULTIPLA_002: adicionar {{quantidade}}
UPDATE frases_modelo 
SET 
  texto = REPLACE(texto, 'Múltiplas', '{{quantidade}}'),
  conclusao = REPLACE(COALESCE(conclusao, ''), 'Múltiplas', '{{quantidade}}'),
  variaveis = COALESCE(variaveis, '[]'::jsonb) || '[{"nome": "quantidade", "tipo": "select", "opcoes": ["Múltiplas", "Algumas", "Poucas"], "obrigatorio": true, "descricao": "Quantidade de imagens calculosas"}]'::jsonb
WHERE codigo = 'US_ABD_VESICULA_COLELITIASE_MULTIPLA_002';


-- =====================================================
-- FIM DA CORREÇÃO
-- =====================================================
-- Total estimado: ~105 correções em ~94 frases únicas
-- Tempo estimado: <2 segundos
-- =====================================================