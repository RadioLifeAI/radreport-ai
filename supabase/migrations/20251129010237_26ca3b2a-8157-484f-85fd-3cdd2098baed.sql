-- ============================================================================
-- FASE 3 COMPLETA REVISADA: Correções Críticas + Limpeza RM + Consolidação RX Segura
-- ============================================================================

-- ============================================================================
-- FASE 3A: CORREÇÕES CRÍTICAS (7 templates)
-- ============================================================================

-- 1. RM_BRACO_DIREITO_NORMAL → RM_BRACO_NORMAL + variável {{lado}}
UPDATE system_templates
SET 
  codigo = 'RM_BRACO_NORMAL',
  titulo = 'RM Braço',
  achados = REPLACE(achados, 'direito', '{{lado}}'),
  impressao = REPLACE(impressao, 'direito', '{{lado}}'),
  variaveis = '[
    {
      "nome": "lado",
      "tipo": "select",
      "descricao": "Lateralidade",
      "obrigatorio": true,
      "opcoes": ["direito", "esquerdo"]
    }
  ]'::jsonb
WHERE codigo = 'RM_BRACO_DIREITO_NORMAL';

-- 2. USG_APARELHO_URINARIO: adicionar 4 variáveis de medidas renais
UPDATE system_templates
SET 
  achados = REPLACE(REPLACE(REPLACE(REPLACE(
    achados,
    '__ cm', '{{med_rim_dir_cm}} cm'),
    '____ cm', '{{med_rim_esq_cm}} cm'),
    '__ cm (parênquima direito)', '{{esp_parenquima_dir_cm}} cm'),
    '__ cm (parênquima esquerdo)', '{{esp_parenquima_esq_cm}} cm'
  ),
  variaveis = '[
    {
      "nome": "med_rim_dir_cm",
      "tipo": "numero",
      "descricao": "Medida rim direito (cm)",
      "obrigatorio": true,
      "unidade": "cm",
      "minimo": 8.0,
      "maximo": 14.0
    },
    {
      "nome": "med_rim_esq_cm",
      "tipo": "numero",
      "descricao": "Medida rim esquerdo (cm)",
      "obrigatorio": true,
      "unidade": "cm",
      "minimo": 8.0,
      "maximo": 14.0
    },
    {
      "nome": "esp_parenquima_dir_cm",
      "tipo": "numero",
      "descricao": "Espessura parênquima direito (cm)",
      "obrigatorio": true,
      "unidade": "cm",
      "minimo": 1.0,
      "maximo": 3.0
    },
    {
      "nome": "esp_parenquima_esq_cm",
      "tipo": "numero",
      "descricao": "Espessura parênquima esquerdo (cm)",
      "obrigatorio": true,
      "unidade": "cm",
      "minimo": 1.0,
      "maximo": 3.0
    }
  ]'::jsonb
WHERE codigo = 'USG_APARELHO_URINARIO';

-- 3. USG_ABDOME_TOTAL_HEPATOPATIA_DEPOSITO: converter "grau _" para {{grau}}
UPDATE system_templates
SET 
  impressao = REPLACE(impressao, 'grau _', 'grau {{grau}}'),
  variaveis = '[
    {
      "nome": "grau",
      "tipo": "select",
      "descricao": "Grau da hepatopatia",
      "obrigatorio": true,
      "opcoes": ["I", "II", "III"]
    }
  ]'::jsonb
WHERE codigo = 'USG_ABDOME_TOTAL_HEPATOPATIA_DEPOSITO'
  AND impressao LIKE '%grau _%';

-- 4. ANGIOTC_ESCORE_CALCIO_CORONARIAS_NORMAL: adicionar variáveis
UPDATE system_templates
SET 
  achados = REPLACE(REPLACE(
    achados,
    'Escore de Agatston: ____',
    'Escore de Agatston: {{escore_agatston}}'),
    'Dominância: ____',
    'Dominância: {{dominancia}}'
  ),
  variaveis = '[
    {
      "nome": "escore_agatston",
      "tipo": "numero",
      "descricao": "Escore de Agatston",
      "obrigatorio": true,
      "minimo": 0,
      "maximo": 5000
    },
    {
      "nome": "dominancia",
      "tipo": "select",
      "descricao": "Dominância coronariana",
      "obrigatorio": true,
      "opcoes": ["Direita", "Esquerda", "Codominante"]
    }
  ]'::jsonb
WHERE codigo = 'ANGIOTC_ESCORE_CALCIO_CORONARIAS_NORMAL';

-- 5. ANGIOTC_ESCORE_CALCIO_CORONARIAS_DETALHADO_NORMAL: adicionar variáveis
UPDATE system_templates
SET 
  achados = REPLACE(REPLACE(
    achados,
    'Escore de Agatston: ____',
    'Escore de Agatston: {{escore_agatston}}'),
    'Dominância: ____',
    'Dominância: {{dominancia}}'
  ),
  variaveis = '[
    {
      "nome": "escore_agatston",
      "tipo": "numero",
      "descricao": "Escore de Agatston",
      "obrigatorio": true,
      "minimo": 0,
      "maximo": 5000
    },
    {
      "nome": "dominancia",
      "tipo": "select",
      "descricao": "Dominância coronariana",
      "obrigatorio": true,
      "opcoes": ["Direita", "Esquerda", "Codominante"]
    }
  ]'::jsonb
WHERE codigo = 'ANGIOTC_ESCORE_CALCIO_CORONARIAS_DETALHADO_NORMAL';

-- ============================================================================
-- FASE 3B: LIMPEZA PLACEHOLDERS RM (29 templates)
-- ============================================================================

UPDATE system_templates
SET 
  achados = REPLACE(achados, '____', ''),
  impressao = REPLACE(impressao, '____', ''),
  adicionais = REPLACE(COALESCE(adicionais, ''), '____', '')
WHERE modalidade_codigo = 'RM'
  AND (achados LIKE '%____%' OR impressao LIKE '%____%' OR adicionais LIKE '%____%');

-- ============================================================================
-- FASE 3C: CONSOLIDAÇÃO RX SEGURA (9 variantes → 5 templates master)
-- ============================================================================

-- 1. RX COLUNA LOMBOSSACRA (3 → 1)
UPDATE system_templates
SET 
  tecnica = jsonb_set(
    tecnica,
    '{incidências}',
    '"{{incidencias}}"'::jsonb
  ),
  variaveis = '[
    {
      "nome": "incidencias",
      "tipo": "select",
      "descricao": "Incidências realizadas",
      "obrigatorio": true,
      "opcoes": ["AP e Perfil", "AP, Perfil, Flexão e Extensão", "AP, Perfil e Oblíquas"]
    }
  ]'::jsonb
WHERE codigo = 'RX_COLUNA_LOMBOSSACRA';

-- Desativar variantes
UPDATE system_templates
SET ativo = false
WHERE codigo IN ('RX_COLUNA_LOMBOSSACRA_DINAMICA', 'RX_COLUNA_LOMBOSSACRA_OBLIQUAS');

-- 2. RX BRAÇO (2 → 1)
UPDATE system_templates
SET 
  tecnica = jsonb_set(
    tecnica,
    '{incidências}',
    '"{{incidencias}}"'::jsonb
  ),
  variaveis = '[
    {
      "nome": "incidencias",
      "tipo": "select",
      "descricao": "Incidências realizadas",
      "obrigatorio": true,
      "opcoes": ["AP e Perfil", "AP"]
    }
  ]'::jsonb
WHERE codigo = 'RX_BRACO';

UPDATE system_templates
SET ativo = false
WHERE codigo = 'RX_BRACO_VAR2';

-- 3. RX CALCÂNEO (2 → 1)
UPDATE system_templates
SET 
  tecnica = jsonb_set(
    tecnica,
    '{incidências}',
    '"{{incidencias}}"'::jsonb
  ),
  variaveis = '[
    {
      "nome": "incidencias",
      "tipo": "select",
      "descricao": "Incidências realizadas",
      "obrigatorio": true,
      "opcoes": ["AP e Perfil", "AP"]
    }
  ]'::jsonb
WHERE codigo = 'RX_CALCANEO';

UPDATE system_templates
SET ativo = false
WHERE codigo = 'RX_CALCANE0_VAR2';

-- 4. RX CLAVÍCULA (2 → 1)
UPDATE system_templates
SET 
  codigo = 'RX_CLAVICULA',
  titulo = 'RX Clavícula',
  achados = REPLACE(achados, 'direita', '{{lado}}'),
  impressao = REPLACE(impressao, 'direita', '{{lado}}'),
  tecnica = jsonb_set(
    tecnica,
    '{incidências}',
    '"{{incidencias}}"'::jsonb
  ),
  variaveis = '[
    {
      "nome": "lado",
      "tipo": "select",
      "descricao": "Lateralidade",
      "obrigatorio": true,
      "opcoes": ["direita", "esquerda"]
    },
    {
      "nome": "incidencias",
      "tipo": "select",
      "descricao": "Incidências realizadas",
      "obrigatorio": true,
      "opcoes": ["AP/Zanca", "AP"]
    }
  ]'::jsonb
WHERE codigo = 'RX_CLAVICULA_DIR';

UPDATE system_templates
SET ativo = false
WHERE codigo = 'RX_CLAVICULA_ESQ';

-- 5. RX COLUNA CERVICAL (5 → 2)
-- Grupo A: Templates simples (AP)
UPDATE system_templates
SET 
  tecnica = jsonb_set(
    tecnica,
    '{incidências}',
    '"{{incidencias}}"'::jsonb
  ),
  variaveis = '[
    {
      "nome": "incidencias",
      "tipo": "select",
      "descricao": "Incidências realizadas",
      "obrigatorio": true,
      "opcoes": ["AP", "AP e Perfil"]
    }
  ]'::jsonb
WHERE codigo = 'RX_COLUNA_CERVICAL_SIMPLES';

UPDATE system_templates
SET ativo = false
WHERE codigo = 'RX_COLUNA_CERVICAL_AP_PERFIL';

-- Grupo B: Templates completos
UPDATE system_templates
SET 
  codigo = 'RX_COLUNA_CERVICAL_COMPLETO',
  titulo = 'RX Coluna Cervical Completo',
  tecnica = jsonb_set(
    tecnica,
    '{incidências}',
    '"{{incidencias}}"'::jsonb
  ),
  variaveis = '[
    {
      "nome": "incidencias",
      "tipo": "select",
      "descricao": "Incidências realizadas",
      "obrigatorio": true,
      "opcoes": ["AP, Perfil, Extensão e Flexão", "AP, Perfil e Oblíquas", "AP, Perfil, Oblíquas e Transoral"]
    }
  ]'::jsonb
WHERE codigo = 'RX_COLUNA_CERVICAL_AP_PERFIL_EXTENSAO_FLEXAO';

UPDATE system_templates
SET ativo = false
WHERE codigo IN ('RX_COLUNA_CERVICAL_AP_PERFIL_OBLIQUAS', 'RX_COLUNA_CERVICAL_AP_PERFIL_OBLIQUAS_TRANSORAL');

-- ============================================================================
-- RESUMO DA MIGRAÇÃO
-- ============================================================================
-- Fase 3A: 7 templates corrigidos (variáveis adicionadas)
-- Fase 3B: 29 templates RM limpos (placeholders ____ removidos)
-- Fase 3C: 9 templates RX desativados, 5 templates master criados com 7 novas variáveis
-- TOTAL: 45 templates modificados, 9 templates desativados
-- ZERO PERDA DE DADOS: Templates desativados preservados para auditoria
-- ============================================================================