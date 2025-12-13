-- ============================================================================
-- MIGRAÇÃO: Adicionar variável de lateralidade em templates de membros
-- Data: 2025-01-12
-- Objetivo: Uniformizar títulos com {{lateridade_texto}} para todos os 
--           templates de membros (bilaterais) em RM, TC, RX e corrigir USG
-- ============================================================================

-- ============================================================================
-- FASE 1: RESSONÂNCIA MAGNÉTICA (9 templates)
-- Adicionar {{lateridade_texto}} no título e variável no array variaveis
-- ============================================================================

-- RM Joelho
UPDATE system_templates 
SET 
  titulo = 'Ressonância Magnética do Joelho {{lateridade_texto}}',
  variaveis = COALESCE(variaveis, '[]'::jsonb) || '[{"nome": "lateridade_texto", "tipo": "select", "opcoes": ["direito", "esquerdo"], "obrigatorio": true}]'::jsonb
WHERE id = '1e5f7a4e-bae7-40eb-bfc9-a9d9f1bfb7af';

-- RM Tornozelo
UPDATE system_templates 
SET 
  titulo = 'Ressonância Magnética do Tornozelo {{lateridade_texto}}',
  variaveis = COALESCE(variaveis, '[]'::jsonb) || '[{"nome": "lateridade_texto", "tipo": "select", "opcoes": ["direito", "esquerdo"], "obrigatorio": true}]'::jsonb
WHERE id = 'df8649eb-bdb8-4eb9-b0ee-e3fbed56a5f8';

-- RM Ombro
UPDATE system_templates 
SET 
  titulo = 'Ressonância Magnética do Ombro {{lateridade_texto}}',
  variaveis = COALESCE(variaveis, '[]'::jsonb) || '[{"nome": "lateridade_texto", "tipo": "select", "opcoes": ["direito", "esquerdo"], "obrigatorio": true}]'::jsonb
WHERE id = '08098c85-9f7a-43a8-92f0-d58fa2aab88b';

-- RM Quadril
UPDATE system_templates 
SET 
  titulo = 'Ressonância Magnética do Quadril {{lateridade_texto}}',
  variaveis = COALESCE(variaveis, '[]'::jsonb) || '[{"nome": "lateridade_texto", "tipo": "select", "opcoes": ["direito", "esquerdo"], "obrigatorio": true}]'::jsonb
WHERE id = '0e0d58dc-eb3c-433f-b4b9-a9b5f2eca1bc';

-- RM Cotovelo
UPDATE system_templates 
SET 
  titulo = 'Ressonância Magnética do Cotovelo {{lateridade_texto}}',
  variaveis = COALESCE(variaveis, '[]'::jsonb) || '[{"nome": "lateridade_texto", "tipo": "select", "opcoes": ["direito", "esquerdo"], "obrigatorio": true}]'::jsonb
WHERE id = '2fae5db7-8aef-4dd9-9f9c-e6fba6fd8c82';

-- RM Punho
UPDATE system_templates 
SET 
  titulo = 'Ressonância Magnética do Punho {{lateridade_texto}}',
  variaveis = COALESCE(variaveis, '[]'::jsonb) || '[{"nome": "lateridade_texto", "tipo": "select", "opcoes": ["direito", "esquerdo"], "obrigatorio": true}]'::jsonb
WHERE id = '422dfb0a-4e8a-46ab-a0a7-f1c4c9c7e1d3';

-- RM Pé
UPDATE system_templates 
SET 
  titulo = 'Ressonância Magnética do Pé {{lateridade_texto}}',
  variaveis = COALESCE(variaveis, '[]'::jsonb) || '[{"nome": "lateridade_texto", "tipo": "select", "opcoes": ["direito", "esquerdo"], "obrigatorio": true}]'::jsonb
WHERE id = '4c8e9f2a-1b3d-4e5f-a6c7-d8e9f0a1b2c3';

-- RM Mão (primeiro - manter ativo)
UPDATE system_templates 
SET 
  titulo = 'Ressonância Magnética da Mão {{lateridade_texto}}',
  variaveis = COALESCE(variaveis, '[]'::jsonb) || '[{"nome": "lateridade_texto", "tipo": "select", "opcoes": ["direita", "esquerda"], "obrigatorio": true}]'::jsonb
WHERE id = '5d9f0a3b-2c4e-5f6a-b7d8-e9f0a1b2c3d4';

-- RM Mão (duplicado - desativar)
UPDATE system_templates SET ativo = false WHERE id = '6e0a1b4c-3d5f-6a7b-c8e9-f0a1b2c3d4e5';

-- RM Coxa
UPDATE system_templates 
SET 
  titulo = 'Ressonância Magnética da Coxa {{lateridade_texto}}',
  variaveis = COALESCE(variaveis, '[]'::jsonb) || '[{"nome": "lateridade_texto", "tipo": "select", "opcoes": ["direita", "esquerda"], "obrigatorio": true}]'::jsonb
WHERE id = '7f1b2c5d-4e6a-7b8c-d9f0-a1b2c3d4e5f6';

-- ============================================================================
-- FASE 2: TOMOGRAFIA COMPUTADORIZADA (11 templates)
-- ============================================================================

-- TC Joelho (primeiro - manter ativo)
UPDATE system_templates 
SET 
  titulo = 'Tomografia Computadorizada do Joelho {{lateridade_texto}}',
  variaveis = COALESCE(variaveis, '[]'::jsonb) || '[{"nome": "lateridade_texto", "tipo": "select", "opcoes": ["direito", "esquerdo"], "obrigatorio": true}]'::jsonb
WHERE id = 'b69ef22e-f825-49a9-965b-47047e69a458';

-- TC Joelho (duplicado - desativar)
UPDATE system_templates SET ativo = false WHERE id = 'cc20cba6-25d5-4f3a-87d5-cf31bdbb1e07';

-- TC Tornozelo
UPDATE system_templates 
SET 
  titulo = 'Tomografia Computadorizada do Tornozelo {{lateridade_texto}}',
  variaveis = COALESCE(variaveis, '[]'::jsonb) || '[{"nome": "lateridade_texto", "tipo": "select", "opcoes": ["direito", "esquerdo"], "obrigatorio": true}]'::jsonb
WHERE id = '8a2c3d6e-5f7b-8c9d-e0a1-b2c3d4e5f6a7';

-- TC Ombro
UPDATE system_templates 
SET 
  titulo = 'Tomografia Computadorizada do Ombro {{lateridade_texto}}',
  variaveis = COALESCE(variaveis, '[]'::jsonb) || '[{"nome": "lateridade_texto", "tipo": "select", "opcoes": ["direito", "esquerdo"], "obrigatorio": true}]'::jsonb
WHERE id = '9b3d4e7f-6a8c-9d0e-f1b2-c3d4e5f6a7b8';

-- TC Cotovelo
UPDATE system_templates 
SET 
  titulo = 'Tomografia Computadorizada do Cotovelo {{lateridade_texto}}',
  variaveis = COALESCE(variaveis, '[]'::jsonb) || '[{"nome": "lateridade_texto", "tipo": "select", "opcoes": ["direito", "esquerdo"], "obrigatorio": true}]'::jsonb
WHERE id = '0c4e5f8a-7b9d-0e1f-a2c3-d4e5f6a7b8c9';

-- TC Punho
UPDATE system_templates 
SET 
  titulo = 'Tomografia Computadorizada do Punho {{lateridade_texto}}',
  variaveis = COALESCE(variaveis, '[]'::jsonb) || '[{"nome": "lateridade_texto", "tipo": "select", "opcoes": ["direito", "esquerdo"], "obrigatorio": true}]'::jsonb
WHERE id = '1d5f6a9b-8c0e-1f2a-b3d4-e5f6a7b8c9d0';

-- TC Quadril
UPDATE system_templates 
SET 
  titulo = 'Tomografia Computadorizada do Quadril {{lateridade_texto}}',
  variaveis = COALESCE(variaveis, '[]'::jsonb) || '[{"nome": "lateridade_texto", "tipo": "select", "opcoes": ["direito", "esquerdo"], "obrigatorio": true}]'::jsonb
WHERE id = '2e6a7b0c-9d1f-2a3b-c4e5-f6a7b8c9d0e1';

-- TC Mão
UPDATE system_templates 
SET 
  titulo = 'Tomografia Computadorizada da Mão {{lateridade_texto}}',
  variaveis = COALESCE(variaveis, '[]'::jsonb) || '[{"nome": "lateridade_texto", "tipo": "select", "opcoes": ["direita", "esquerda"], "obrigatorio": true}]'::jsonb
WHERE id = '3f7b8c1d-0e2a-3b4c-d5f6-a7b8c9d0e1f2';

-- TC Pé
UPDATE system_templates 
SET 
  titulo = 'Tomografia Computadorizada do Pé {{lateridade_texto}}',
  variaveis = COALESCE(variaveis, '[]'::jsonb) || '[{"nome": "lateridade_texto", "tipo": "select", "opcoes": ["direito", "esquerdo"], "obrigatorio": true}]'::jsonb
WHERE id = '4a8c9d2e-1f3b-4c5d-e6a7-b8c9d0e1f2a3';

-- TC Coxa
UPDATE system_templates 
SET 
  titulo = 'Tomografia Computadorizada da Coxa {{lateridade_texto}}',
  variaveis = COALESCE(variaveis, '[]'::jsonb) || '[{"nome": "lateridade_texto", "tipo": "select", "opcoes": ["direita", "esquerda"], "obrigatorio": true}]'::jsonb
WHERE id = '5b9d0e3f-2a4c-5d6e-f7b8-c9d0e1f2a3b4';

-- TC Perna
UPDATE system_templates 
SET 
  titulo = 'Tomografia Computadorizada da Perna {{lateridade_texto}}',
  variaveis = COALESCE(variaveis, '[]'::jsonb) || '[{"nome": "lateridade_texto", "tipo": "select", "opcoes": ["direita", "esquerda"], "obrigatorio": true}]'::jsonb
WHERE id = '6c0e1f4a-3b5d-6e7f-a8c9-d0e1f2a3b4c5';

-- TC Antebraço
UPDATE system_templates 
SET 
  titulo = 'Tomografia Computadorizada do Antebraço {{lateridade_texto}}',
  variaveis = COALESCE(variaveis, '[]'::jsonb) || '[{"nome": "lateridade_texto", "tipo": "select", "opcoes": ["direito", "esquerdo"], "obrigatorio": true}]'::jsonb
WHERE id = '7d1f2a5b-4c6e-7f8a-b9d0-e1f2a3b4c5d6';

-- ============================================================================
-- FASE 3: RADIOGRAFIA (12 templates)
-- ============================================================================

-- RX Joelho
UPDATE system_templates 
SET 
  titulo = 'Radiografia do Joelho {{lateridade_texto}}',
  variaveis = COALESCE(variaveis, '[]'::jsonb) || '[{"nome": "lateridade_texto", "tipo": "select", "opcoes": ["direito", "esquerdo"], "obrigatorio": true}]'::jsonb
WHERE id = 'beff3b05-7e20-403c-b825-aba5e5e68d3f';

-- RX Tornozelo
UPDATE system_templates 
SET 
  titulo = 'Radiografia do Tornozelo {{lateridade_texto}}',
  variaveis = COALESCE(variaveis, '[]'::jsonb) || '[{"nome": "lateridade_texto", "tipo": "select", "opcoes": ["direito", "esquerdo"], "obrigatorio": true}]'::jsonb
WHERE id = '28baaece-37e7-4a8f-9e80-55f90eba2bab';

-- RX Ombro
UPDATE system_templates 
SET 
  titulo = 'Radiografia do Ombro {{lateridade_texto}}',
  variaveis = COALESCE(variaveis, '[]'::jsonb) || '[{"nome": "lateridade_texto", "tipo": "select", "opcoes": ["direito", "esquerdo"], "obrigatorio": true}]'::jsonb
WHERE id = '7eb56c76-6f41-489a-b9b2-f1c02ebf3c4d';

-- RX Cotovelo
UPDATE system_templates 
SET 
  titulo = 'Radiografia do Cotovelo {{lateridade_texto}}',
  variaveis = COALESCE(variaveis, '[]'::jsonb) || '[{"nome": "lateridade_texto", "tipo": "select", "opcoes": ["direito", "esquerdo"], "obrigatorio": true}]'::jsonb
WHERE id = 'fe8dd653-54a4-4f84-a0f6-67a8b02c9e1f';

-- RX Punho
UPDATE system_templates 
SET 
  titulo = 'Radiografia do Punho {{lateridade_texto}}',
  variaveis = COALESCE(variaveis, '[]'::jsonb) || '[{"nome": "lateridade_texto", "tipo": "select", "opcoes": ["direito", "esquerdo"], "obrigatorio": true}]'::jsonb
WHERE id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

-- RX Quadril
UPDATE system_templates 
SET 
  titulo = 'Radiografia do Quadril {{lateridade_texto}}',
  variaveis = COALESCE(variaveis, '[]'::jsonb) || '[{"nome": "lateridade_texto", "tipo": "select", "opcoes": ["direito", "esquerdo"], "obrigatorio": true}]'::jsonb
WHERE id = 'b2c3d4e5-f6a7-8901-bcde-f23456789012';

-- RX Mão
UPDATE system_templates 
SET 
  titulo = 'Radiografia da Mão {{lateridade_texto}}',
  variaveis = COALESCE(variaveis, '[]'::jsonb) || '[{"nome": "lateridade_texto", "tipo": "select", "opcoes": ["direita", "esquerda"], "obrigatorio": true}]'::jsonb
WHERE id = '76e50ddd-8b1c-4f5b-8e2a-1c9f3e7a5d2b';

-- RX Pé
UPDATE system_templates 
SET 
  titulo = 'Radiografia do Pé {{lateridade_texto}}',
  variaveis = COALESCE(variaveis, '[]'::jsonb) || '[{"nome": "lateridade_texto", "tipo": "select", "opcoes": ["direito", "esquerdo"], "obrigatorio": true}]'::jsonb
WHERE id = 'c3d4e5f6-a7b8-9012-cdef-345678901234';

-- RX Antebraço
UPDATE system_templates 
SET 
  titulo = 'Radiografia do Antebraço {{lateridade_texto}}',
  variaveis = COALESCE(variaveis, '[]'::jsonb) || '[{"nome": "lateridade_texto", "tipo": "select", "opcoes": ["direito", "esquerdo"], "obrigatorio": true}]'::jsonb
WHERE id = '8ea84a0a-8d3a-4ab9-88c7-d1b3d67d2c8a';

-- RX Perna
UPDATE system_templates 
SET 
  titulo = 'Radiografia da Perna {{lateridade_texto}}',
  variaveis = COALESCE(variaveis, '[]'::jsonb) || '[{"nome": "lateridade_texto", "tipo": "select", "opcoes": ["direita", "esquerda"], "obrigatorio": true}]'::jsonb
WHERE id = 'd4e5f6a7-b8c9-0123-defa-456789012345';

-- RX Coxa/Fêmur
UPDATE system_templates 
SET 
  titulo = 'Radiografia da Coxa {{lateridade_texto}}',
  variaveis = COALESCE(variaveis, '[]'::jsonb) || '[{"nome": "lateridade_texto", "tipo": "select", "opcoes": ["direita", "esquerda"], "obrigatorio": true}]'::jsonb
WHERE id = 'e5f6a7b8-c9d0-1234-efab-567890123456';

-- RX Braço/Úmero
UPDATE system_templates 
SET 
  titulo = 'Radiografia do Braço {{lateridade_texto}}',
  variaveis = COALESCE(variaveis, '[]'::jsonb) || '[{"nome": "lateridade_texto", "tipo": "select", "opcoes": ["direito", "esquerdo"], "obrigatorio": true}]'::jsonb
WHERE id = 'f6a7b8c9-d0e1-2345-fabc-678901234567';

-- ============================================================================
-- FASE 4: CORRIGIR ULTRASSONOGRAFIA (10 templates)
-- Remover travessão do título e corrigir categoria para 'normal'
-- ============================================================================

-- USG Ombro
UPDATE system_templates 
SET 
  titulo = 'Ultrassonografia do Ombro {{lateridade_texto}}',
  categoria = 'normal'
WHERE id = '6d1c0f3e-8b2a-4c5d-9e7f-0a1b2c3d4e5f';

-- USG Cotovelo
UPDATE system_templates 
SET 
  titulo = 'Ultrassonografia do Cotovelo {{lateridade_texto}}',
  categoria = 'normal'
WHERE id = '7e2d1a4f-9c3b-5d6e-0f8a-1b2c3d4e5f6a';

-- USG Punho
UPDATE system_templates 
SET 
  titulo = 'Ultrassonografia do Punho {{lateridade_texto}}',
  categoria = 'normal'
WHERE id = '8f3e2b5a-0d4c-6e7f-1a9b-2c3d4e5f6a7b';

-- USG Mão
UPDATE system_templates 
SET 
  titulo = 'Ultrassonografia da Mão {{lateridade_texto}}',
  categoria = 'normal'
WHERE id = '9a4f3c6b-1e5d-7f8a-2b0c-3d4e5f6a7b8c';

-- USG Quadril
UPDATE system_templates 
SET 
  titulo = 'Ultrassonografia do Quadril {{lateridade_texto}}',
  categoria = 'normal'
WHERE id = '0b5a4d7c-2f6e-8a9b-3c1d-4e5f6a7b8c9d';

-- USG Joelho
UPDATE system_templates 
SET 
  titulo = 'Ultrassonografia do Joelho {{lateridade_texto}}',
  categoria = 'normal'
WHERE id = '1c6b5e8d-3a7f-9b0c-4d2e-5f6a7b8c9d0e';

-- USG Tornozelo
UPDATE system_templates 
SET 
  titulo = 'Ultrassonografia do Tornozelo {{lateridade_texto}}',
  categoria = 'normal'
WHERE id = '2d7c6f9e-4b8a-0c1d-5e3f-6a7b8c9d0e1f';

-- USG Pé
UPDATE system_templates 
SET 
  titulo = 'Ultrassonografia do Pé {{lateridade_texto}}',
  categoria = 'normal'
WHERE id = '3e8d7a0f-5c9b-1d2e-6f4a-7b8c9d0e1f2a';

-- USG Coxa
UPDATE system_templates 
SET 
  titulo = 'Ultrassonografia da Coxa {{lateridade_texto}}',
  categoria = 'normal'
WHERE id = '4f9e8b1a-6d0c-2e3f-7a5b-8c9d0e1f2a3b';

-- USG Panturrilha/Perna
UPDATE system_templates 
SET 
  titulo = 'Ultrassonografia da Perna {{lateridade_texto}}',
  categoria = 'normal'
WHERE id = '5a0f9c2b-7e1d-3f4a-8b6c-9d0e1f2a3b4c';

-- ============================================================================
-- FASE 5: VERIFICAÇÃO
-- ============================================================================

-- Verificar templates com lateralidade após migração
SELECT 
  modalidade_codigo,
  titulo,
  categoria,
  CASE WHEN titulo LIKE '%{{lateridade_texto}}%' THEN '✓' ELSE '✗' END as tem_lateralidade,
  CASE WHEN variaveis::text LIKE '%lateridade_texto%' THEN '✓' ELSE '✗' END as tem_variavel
FROM system_templates 
WHERE ativo = true 
  AND (
    titulo ILIKE '%joelho%' OR
    titulo ILIKE '%tornozelo%' OR
    titulo ILIKE '%ombro%' OR
    titulo ILIKE '%cotovelo%' OR
    titulo ILIKE '%punho%' OR
    titulo ILIKE '%mão%' OR
    titulo ILIKE '%pé%' OR
    titulo ILIKE '%quadril%' OR
    titulo ILIKE '%coxa%' OR
    titulo ILIKE '%perna%' OR
    titulo ILIKE '%antebraço%' OR
    titulo ILIKE '%braço%'
  )
ORDER BY modalidade_codigo, titulo;

-- Contar templates com lateralidade por modalidade
SELECT 
  modalidade_codigo,
  COUNT(*) as total,
  SUM(CASE WHEN titulo LIKE '%{{lateridade_texto}}%' THEN 1 ELSE 0 END) as com_lateralidade
FROM system_templates 
WHERE ativo = true
GROUP BY modalidade_codigo
ORDER BY modalidade_codigo;
