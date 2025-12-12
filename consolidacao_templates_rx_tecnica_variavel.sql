-- ============================================================================
-- CONSOLIDAÇÃO DE TEMPLATES DE RADIOGRAFIA COM TÉCNICA COMO VARIÁVEL
-- Data: 2024-12-12
-- Objetivo: Transformar 19 templates duplicados em 8 templates únicos
--           com técnica como variável selecionável (tipo alternativo)
-- ============================================================================

-- ============================================================================
-- 1. RADIOGRAFIA DO ABDOME (4 → 1)
-- Templates: VAR1, VAR2, VAR3, VAR4
-- Principal: VAR1 (0ff3f695-d3a9-45a3-b6d1-f64b85f6b4e8)
-- ============================================================================
UPDATE system_templates 
SET 
  tecnica = '{
    "Decúbito Simples": "Realizada radiografia do abdome em decúbito dorsal, projeção anteroposterior, técnica simples.",
    "Decúbito Dupla Contrastação": "Realizada radiografia do abdome em decúbito dorsal, projeção anteroposterior, técnica de dupla contrastação.",
    "Decúbito com Compressão": "Realizada radiografia do abdome em decúbito dorsal, projeção anteroposterior, com compressão localizada.",
    "Ortostática": "Realizada radiografia do abdome em ortostase, projeção anteroposterior, incidência ortostática."
  }'::jsonb,
  tecnica_config = '{"tipo": "alternativo", "concatenar": false}'::jsonb
WHERE id = '0ff3f695-d3a9-45a3-b6d1-f64b85f6b4e8';

-- Desativar duplicados do Abdome
UPDATE system_templates SET ativo = false 
WHERE id IN (
  '35fa20f8-08a1-4b25-9530-ecb923215500',  -- VAR2
  '42dae6a6-c5ce-482e-bb49-bbdf1736350b',  -- VAR3
  '2c991830-a6ab-452e-9063-f708e88630d7'   -- VAR4
);

-- ============================================================================
-- 2. RADIOGRAFIA DA COLUNA CERVICAL (3 → 1)
-- Templates: AP, COMPLETA, COMPLETO (dinâmica)
-- Principal: COMPLETA (4a3764a8-132d-46d7-8a03-830e269ef658)
-- ============================================================================
UPDATE system_templates 
SET 
  tecnica = '{
    "AP Simples": "Realizada radiografia da coluna cervical em ortostase, projeção anteroposterior.",
    "Completa (AP, Perfil, Oblíquas, Transoral)": "Realizadas incidências AP, perfil, oblíquas direita e esquerda, e transoral da coluna cervical.",
    "Dinâmica (Flexão e Extensão)": "Realizadas incidências AP, perfil, em flexão máxima e extensão máxima da coluna cervical para estudo dinâmico."
  }'::jsonb,
  tecnica_config = '{"tipo": "alternativo", "concatenar": false}'::jsonb
WHERE id = '4a3764a8-132d-46d7-8a03-830e269ef658';

-- Desativar duplicados da Coluna Cervical
UPDATE system_templates SET ativo = false 
WHERE id IN (
  '9f9730ee-1f73-40da-9afe-ef7fb88f62c0',  -- AP
  '9c63bc4b-0826-447f-a7eb-6915e2ec1dd2'   -- COMPLETO (dinâmica)
);

-- ============================================================================
-- 3. RADIOGRAFIA DA COLUNA TORÁCICA (2 → 1)
-- Templates: AP, AP_PERFIL
-- Principal: AP_PERFIL (3bfdc185-2dfe-4715-a713-4fc281e09ff4)
-- ============================================================================
UPDATE system_templates 
SET 
  tecnica = '{
    "AP Simples": "Realizada radiografia da coluna torácica em ortostase, projeção anteroposterior.",
    "AP e Perfil": "Realizadas incidências anteroposterior e perfil da coluna torácica em ortostase."
  }'::jsonb,
  tecnica_config = '{"tipo": "alternativo", "concatenar": false}'::jsonb
WHERE id = '3bfdc185-2dfe-4715-a713-4fc281e09ff4';

-- Desativar duplicado da Coluna Torácica
UPDATE system_templates SET ativo = false 
WHERE id = '2e6690f2-9f09-48e2-8aa6-c0f7ac181a62';  -- AP

-- ============================================================================
-- 4. RADIOGRAFIA DA BACIA (2 → 1)
-- Templates: VAR1 (decúbito), VAR3 (ortostase)
-- Principal: VAR1 (51dd01bb-3fcf-454e-b2ef-a77c8ffa96e9)
-- ============================================================================
UPDATE system_templates 
SET 
  tecnica = '{
    "Decúbito (AP e Perfil)": "Realizada radiografia da bacia em decúbito dorsal, projeções anteroposterior e perfil.",
    "Ortostase (AP)": "Realizada radiografia da bacia em ortostase, projeção anteroposterior."
  }'::jsonb,
  tecnica_config = '{"tipo": "alternativo", "concatenar": false}'::jsonb
WHERE id = '51dd01bb-3fcf-454e-b2ef-a77c8ffa96e9';

-- Desativar duplicado da Bacia
UPDATE system_templates SET ativo = false 
WHERE id = 'f3435999-e0ab-49d9-835b-4a054b513bfe';  -- VAR3

-- ============================================================================
-- 5. RADIOGRAFIA DA MÃO (2 → 1)
-- Templates: PA_PERFIL, PA_OBLIQUA_PERFIL
-- Principal: PA_OBLIQUA_PERFIL (d111c1cc-b34f-4877-bb94-a66a4c7859f6) - mais completo
-- ============================================================================
UPDATE system_templates 
SET 
  tecnica = '{
    "PA e Perfil": "Realizadas incidências posteroanterior e perfil da mão.",
    "PA, Oblíqua e Perfil": "Realizadas incidências posteroanterior, oblíqua e perfil da mão."
  }'::jsonb,
  tecnica_config = '{"tipo": "alternativo", "concatenar": false}'::jsonb
WHERE id = 'd111c1cc-b34f-4877-bb94-a66a4c7859f6';

-- Desativar duplicado da Mão
UPDATE system_templates SET ativo = false 
WHERE id = '74cffdbb-59ec-4179-8cbb-cb40cdc74f6f';  -- PA_PERFIL

-- ============================================================================
-- 6. RADIOGRAFIA DO ANTEBRAÇO (2 → 1)
-- Templates: VAR1 (PA e Perfil), VAR2 (PA)
-- Principal: VAR1 (a22bd639-cccd-4bd8-8dbc-9f2258e68015) - mais completo
-- ============================================================================
UPDATE system_templates 
SET 
  tecnica = '{
    "PA Simples": "Realizada radiografia do antebraço em pronação, projeção posteroanterior.",
    "PA e Perfil": "Realizadas incidências posteroanterior e perfil do antebraço em pronação."
  }'::jsonb,
  tecnica_config = '{"tipo": "alternativo", "concatenar": false}'::jsonb
WHERE id = 'a22bd639-cccd-4bd8-8dbc-9f2258e68015';

-- Desativar duplicado do Antebraço
UPDATE system_templates SET ativo = false 
WHERE id = '2d80b7b4-024d-4183-85aa-a5efad889a84';  -- VAR2

-- ============================================================================
-- 7. RADIOGRAFIA DO CAVUM (2 → 1)
-- Templates: VAR1 (PA decúbito), VAR2 (Perfil)
-- Principal: VAR1 (1bd587b8-63b6-426b-a406-d83eb9b5c9e5)
-- ============================================================================
UPDATE system_templates 
SET 
  tecnica = '{
    "PA (Decúbito)": "Realizada radiografia do cavum em decúbito dorsal, projeção posteroanterior.",
    "Perfil (Decúbito Lateral)": "Realizada radiografia do cavum em decúbito lateral, projeção em perfil."
  }'::jsonb,
  tecnica_config = '{"tipo": "alternativo", "concatenar": false}'::jsonb
WHERE id = '1bd587b8-63b6-426b-a406-d83eb9b5c9e5';

-- Desativar duplicado do Cavum
UPDATE system_templates SET ativo = false 
WHERE id = 'd10d698e-c250-4f42-b05f-cf8993ffe3fc';  -- VAR2

-- ============================================================================
-- 8. RADIOGRAFIA DO JOELHO (2 → 1)
-- Templates: AP_PERFIL, AP_PERFIL_APOIO_AXIAL_PATEL
-- Principal: AP_PERFIL_APOIO_AXIAL_PATEL (7fff9935-c363-43c5-b58f-d7bad2f9533d) - mais completo
-- ============================================================================
UPDATE system_templates 
SET 
  tecnica = '{
    "AP e Perfil": "Realizadas incidências anteroposterior e perfil do joelho.",
    "AP, Perfil com Apoio e Axial da Patela": "Realizadas incidências anteroposterior, perfil com apoio monopodal e axial da patela."
  }'::jsonb,
  tecnica_config = '{"tipo": "alternativo", "concatenar": false}'::jsonb
WHERE id = '7fff9935-c363-43c5-b58f-d7bad2f9533d';

-- Desativar duplicado do Joelho
UPDATE system_templates SET ativo = false 
WHERE id = '9d2cddc1-53f8-42a5-84e2-9743e5abfc3d';  -- AP_PERFIL

-- ============================================================================
-- VERIFICAÇÃO FINAL
-- ============================================================================

-- Verificar que não há mais duplicados ativos
SELECT titulo, COUNT(*) as total
FROM system_templates 
WHERE ativo = true AND modalidade_codigo = 'RX'
GROUP BY titulo 
HAVING COUNT(*) > 1
ORDER BY titulo;

-- Verificar templates consolidados
SELECT titulo, tecnica, tecnica_config
FROM system_templates 
WHERE id IN (
  '0ff3f695-d3a9-45a3-b6d1-f64b85f6b4e8',  -- Abdome
  '4a3764a8-132d-46d7-8a03-830e269ef658',  -- Coluna Cervical
  '3bfdc185-2dfe-4715-a713-4fc281e09ff4',  -- Coluna Torácica
  '51dd01bb-3fcf-454e-b2ef-a77c8ffa96e9',  -- Bacia
  'd111c1cc-b34f-4877-bb94-a66a4c7859f6',  -- Mão
  'a22bd639-cccd-4bd8-8dbc-9f2258e68015',  -- Antebraço
  '1bd587b8-63b6-426b-a406-d83eb9b5c9e5',  -- Cavum
  '7fff9935-c363-43c5-b58f-d7bad2f9533d'   -- Joelho
)
ORDER BY titulo;

-- Verificar templates desativados (para rollback se necessário)
SELECT titulo, codigo, ativo
FROM system_templates 
WHERE id IN (
  '35fa20f8-08a1-4b25-9530-ecb923215500',
  '42dae6a6-c5ce-482e-bb49-bbdf1736350b',
  '2c991830-a6ab-452e-9063-f708e88630d7',
  '9f9730ee-1f73-40da-9afe-ef7fb88f62c0',
  '9c63bc4b-0826-447f-a7eb-6915e2ec1dd2',
  '2e6690f2-9f09-48e2-8aa6-c0f7ac181a62',
  'f3435999-e0ab-49d9-835b-4a054b513bfe',
  '74cffdbb-59ec-4179-8cbb-cb40cdc74f6f',
  '2d80b7b4-024d-4183-85aa-a5efad889a84',
  'd10d698e-c250-4f42-b05f-cf8993ffe3fc',
  '9d2cddc1-53f8-42a5-84e2-9743e5abfc3d'
)
ORDER BY titulo;
