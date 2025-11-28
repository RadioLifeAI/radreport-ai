-- =====================================================
-- UNIFORMIZAÇÃO DE VARIÁVEIS - FRASES_MODELO
-- =====================================================
-- Este script corrige inconsistências nas variáveis das frases:
-- 1. Adiciona metadados faltantes (3 frases)
-- 2. Converte lateralidade hardcoded para variáveis (4 frases)
-- 3. Padroniza tipos: number→numero, text→texto (~219 registros)
-- 4. Adiciona variável faltante (1 frase)
-- 5. Converte grau hardcoded para variável (1 frase)
-- =====================================================

-- FASE 1: Corrigir 3 Frases de Vias Biliares (SEM metadados)
-- ============================================================

UPDATE frases_modelo 
SET variaveis = '[{"nome": "medida", "tipo": "numero", "minimo": 0.3, "maximo": 2.0, "obrigatorio": true, "unidade": "cm", "descricao": "Medida do hepatocolédoco"}]'::jsonb
WHERE codigo = 'USG_ABD_VIAS_BILIARES_LEVE_DILAT_INTRA_004';

UPDATE frases_modelo 
SET variaveis = '[{"nome": "medida", "tipo": "numero", "minimo": 0.3, "maximo": 2.0, "obrigatorio": true, "unidade": "cm", "descricao": "Medida do hepatocolédoco"}]'::jsonb
WHERE codigo = 'USG_ABD_VIAS_BILIARES_MOD_DILAT_INTRA_005';

UPDATE frases_modelo 
SET variaveis = '[{"nome": "medida", "tipo": "numero", "minimo": 0.3, "maximo": 2.5, "obrigatorio": true, "unidade": "cm", "descricao": "Medida do hepatocolédoco"}]'::jsonb
WHERE codigo = 'USG_ABD_VIAS_BILIARES_ACEN_DILAT_INTRA_006';


-- FASE 2: Converter Frases com Lateralidade Hardcoded
-- ====================================================

-- US_ABD_RINS_NEFRECTOMIA_001
UPDATE frases_modelo 
SET 
  texto = 'Rim {{lado}} não caracterizado (status pós-cirúrgico).',
  conclusao = 'Nefrectomia {{lado}}.',
  variaveis = '[{"nome": "lado", "tipo": "select", "opcoes": ["direito", "esquerdo"], "obrigatorio": true, "descricao": "Lateralidade"}]'::jsonb
WHERE codigo = 'US_ABD_RINS_NEFRECTOMIA_001';

-- USG_ABD_FIG_HEPATOMEGALIA_LOBAR_001
UPDATE frases_modelo 
SET 
  texto = 'Fígado de contornos preservados e dimensões aumentadas à custa do lobo {{lobo}}. Parênquima hepático com ecotextura homogênea.',
  conclusao = 'Hepatomegalia homogênea à custa do lobo {{lobo}}.',
  variaveis = '[{"nome": "lobo", "tipo": "select", "opcoes": ["direito", "esquerdo"], "obrigatorio": true, "descricao": "Lobo hepático"}]'::jsonb
WHERE codigo = 'USG_ABD_FIG_HEPATOMEGALIA_LOBAR_001';

-- US_ABD_MESENTERIO_BORRAMENTO_001
UPDATE frases_modelo 
SET 
  texto = 'Área de borramento da gordura mesentérica na fossa ilíaca {{lado}}. Alças intestinais com peristalse levemente reduzida.',
  conclusao = 'Borramento da gordura mesentérica na fossa ilíaca {{lado}}: processo inflamatório? Conveniente complementar com TC.',
  variaveis = '[{"nome": "lado", "tipo": "select", "opcoes": ["direita", "esquerda"], "obrigatorio": true, "descricao": "Lateralidade"}]'::jsonb
WHERE codigo = 'US_ABD_MESENTERIO_BORRAMENTO_001';


-- FASE 3: Padronizar Tipos (number → numero, text → texto)
-- =========================================================

UPDATE frases_modelo 
SET variaveis = (
  SELECT jsonb_agg(
    CASE 
      WHEN elem->>'tipo' = 'number' THEN jsonb_set(elem, '{tipo}', '"numero"'::jsonb)
      WHEN elem->>'tipo' = 'text' THEN jsonb_set(elem, '{tipo}', '"texto"'::jsonb)
      ELSE elem
    END
  )
  FROM jsonb_array_elements(variaveis) elem
)
WHERE variaveis IS NOT NULL 
  AND variaveis::text != '[]'
  AND (variaveis::text LIKE '%"tipo":"number"%' OR variaveis::text LIKE '%"tipo":"text"%');


-- FASE 4: Corrigir Frase US_ABD_RINS_DUPLO_J_001
-- ===============================================

UPDATE frases_modelo 
SET 
  texto = 'Extremidade do cateter de duplo J no sistema pielocalicial {{lado}}. Extremidade do cateter de duplo J no interior vesical.',
  variaveis = '[{"nome": "lado", "tipo": "select", "opcoes": ["direito", "esquerdo"], "obrigatorio": true, "descricao": "Lateralidade do cateter"}]'::jsonb
WHERE codigo = 'US_ABD_RINS_DUPLO_J_001';


-- FASE 5: Converter Frase com Grau Hardcoded
-- ===========================================

UPDATE frases_modelo 
SET 
  texto = 'Moderada quantidade de líquido livre intraperitoneal com aspecto anecóide com {{grau_debris}} debris, se estendendo do fundo de saco posterior e goteiras parietocólicas até espaços hepato e espleno-renais.',
  variaveis = '[{"nome": "grau_debris", "tipo": "select", "opcoes": ["leves", "moderados", "leves/moderados"], "obrigatorio": true, "descricao": "Grau dos debris"}]'::jsonb
WHERE codigo = 'US_ABD_CAVIDADE_LIQUIDO_MODERADO_DEBRIS_002';


-- =====================================================
-- FIM DA UNIFORMIZAÇÃO
-- =====================================================
-- Total estimado de registros afetados: ~227
-- Tempo estimado de execução: <1 segundo
-- =====================================================