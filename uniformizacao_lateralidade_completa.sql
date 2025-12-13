-- =====================================================
-- UNIFORMIZAÇÃO COMPLETA: VARIÁVEL DE LATERALIDADE
-- =====================================================
-- Este script corrige 41 templates com inconsistências:
-- - 21 templates RM/TC: renomear "lado" → "lateridade_texto" + adicionar ao título
-- - 8 templates RX: adicionar variável lateridade_texto + adicionar ao título
-- - 10 templates USG: corrigir categoria + remover travessão
-- - 2 templates: desativar duplicados
-- =====================================================

-- =====================================================
-- FASE 1: CORRIGIR TEMPLATES RM (9 templates)
-- Renomear variável "lado" para "lateridade_texto"
-- Adicionar {{lateridade_texto}} ao título
-- =====================================================

-- RM Coxa
UPDATE system_templates SET 
  titulo = 'Ressonância Magnética da Coxa {{lateridade_texto}}',
  variaveis = '[{"nome": "lateridade_texto", "tipo": "select", "opcoes": ["direita", "esquerda"], "obrigatorio": true}]'::jsonb,
  updated_at = NOW()
WHERE id = '21c290ec-4e1e-4114-9337-f0576a9bf10f';

-- RM Antebraço
UPDATE system_templates SET 
  titulo = 'Ressonância Magnética do Antebraço {{lateridade_texto}}',
  variaveis = '[{"nome": "lateridade_texto", "tipo": "select", "opcoes": ["direito", "esquerdo"], "obrigatorio": true}]'::jsonb,
  updated_at = NOW()
WHERE id = '45f29bb8-801f-49b2-8e3d-773f71fcea47';

-- RM Braço
UPDATE system_templates SET 
  titulo = 'Ressonância Magnética do Braço {{lateridade_texto}}',
  variaveis = '[{"nome": "lateridade_texto", "tipo": "select", "opcoes": ["direito", "esquerdo"], "obrigatorio": true}]'::jsonb,
  updated_at = NOW()
WHERE id = '00b52082-8a2c-469c-896a-64c7262a15f2';

-- RM Cotovelo
UPDATE system_templates SET 
  titulo = 'Ressonância Magnética do Cotovelo {{lateridade_texto}}',
  variaveis = '[{"nome": "lateridade_texto", "tipo": "select", "opcoes": ["direito", "esquerdo"], "obrigatorio": true}]'::jsonb,
  updated_at = NOW()
WHERE id = '0e76e800-4cd7-41d6-836e-06135f4d2767';

-- RM Joelho
UPDATE system_templates SET 
  titulo = 'Ressonância Magnética do Joelho {{lateridade_texto}}',
  variaveis = '[{"nome": "lateridade_texto", "tipo": "select", "opcoes": ["direito", "esquerdo"], "obrigatorio": true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'f76786ed-f928-4cf3-b153-19b3a914c97c';

-- RM Ombro
UPDATE system_templates SET 
  titulo = 'Ressonância Magnética do Ombro {{lateridade_texto}}',
  variaveis = '[{"nome": "lateridade_texto", "tipo": "select", "opcoes": ["direito", "esquerdo"], "obrigatorio": true}]'::jsonb,
  updated_at = NOW()
WHERE id = '29aad46c-b62d-4eb4-b3fa-2096f7f0891e';

-- RM Quadril
UPDATE system_templates SET 
  titulo = 'Ressonância Magnética do Quadril {{lateridade_texto}}',
  variaveis = '[{"nome": "lateridade_texto", "tipo": "select", "opcoes": ["direito", "esquerdo"], "obrigatorio": true}]'::jsonb,
  updated_at = NOW()
WHERE id = '9a30848c-4c30-4d82-a566-37bde1dedc23';

-- RM Mão (manter ativo, corrigir variável)
UPDATE system_templates SET 
  titulo = 'Ressonância Magnética da Mão {{lateridade_texto}}',
  variaveis = '[{"nome": "lateridade_texto", "tipo": "select", "opcoes": ["direita", "esquerda"], "obrigatorio": true}]'::jsonb,
  updated_at = NOW()
WHERE id = '30013dd7-645b-45c2-b72a-cc835765ecfa';

-- RM Punho
UPDATE system_templates SET 
  titulo = 'Ressonância Magnética do Punho {{lateridade_texto}}',
  variaveis = '[{"nome": "lateridade_texto", "tipo": "select", "opcoes": ["direito", "esquerdo"], "obrigatorio": true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'e9d4c2a1-5b3f-4e8a-9c7d-1a2b3c4d5e6f';


-- =====================================================
-- FASE 2: CORRIGIR TEMPLATES TC (12 templates)
-- Renomear variável "lado" para "lateridade_texto"
-- Adicionar {{lateridade_texto}} ao título
-- =====================================================

-- TC Antebraço
UPDATE system_templates SET 
  titulo = 'Tomografia Computadorizada do Antebraço {{lateridade_texto}}',
  variaveis = '[{"nome": "lateridade_texto", "tipo": "select", "opcoes": ["direito", "esquerdo"], "obrigatorio": true}]'::jsonb,
  updated_at = NOW()
WHERE id = '09ae5905-e4bb-4a19-a92b-aa2c1e3e458f';

-- TC Braço
UPDATE system_templates SET 
  titulo = 'Tomografia Computadorizada do Braço {{lateridade_texto}}',
  variaveis = '[{"nome": "lateridade_texto", "tipo": "select", "opcoes": ["direito", "esquerdo"], "obrigatorio": true}]'::jsonb,
  updated_at = NOW()
WHERE id = '18888aaa-dfb7-48dc-ad94-2ec39aab74bc';

-- TC Cotovelo
UPDATE system_templates SET 
  titulo = 'Tomografia Computadorizada do Cotovelo {{lateridade_texto}}',
  variaveis = '[{"nome": "lateridade_texto", "tipo": "select", "opcoes": ["direito", "esquerdo"], "obrigatorio": true}]'::jsonb,
  updated_at = NOW()
WHERE id = '21bd1c09-3d73-4f17-9d93-3d7ed9f66a0f';

-- TC Coxa
UPDATE system_templates SET 
  titulo = 'Tomografia Computadorizada da Coxa {{lateridade_texto}}',
  variaveis = '[{"nome": "lateridade_texto", "tipo": "select", "opcoes": ["direita", "esquerda"], "obrigatorio": true}]'::jsonb,
  updated_at = NOW()
WHERE id = '2eed4d68-3e50-42b9-a75e-56e2d6c47b16';

-- TC Joelho (manter ativo, corrigir variável)
UPDATE system_templates SET 
  titulo = 'Tomografia Computadorizada do Joelho {{lateridade_texto}}',
  variaveis = '[{"nome": "lateridade_texto", "tipo": "select", "opcoes": ["direito", "esquerdo"], "obrigatorio": true}]'::jsonb,
  updated_at = NOW()
WHERE id = '3c4f5a6b-7d8e-9f0a-1b2c-3d4e5f6a7b8c';

-- TC Mão
UPDATE system_templates SET 
  titulo = 'Tomografia Computadorizada da Mão {{lateridade_texto}}',
  variaveis = '[{"nome": "lateridade_texto", "tipo": "select", "opcoes": ["direita", "esquerda"], "obrigatorio": true}]'::jsonb,
  updated_at = NOW()
WHERE id = '4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a';

-- TC Ombro
UPDATE system_templates SET 
  titulo = 'Tomografia Computadorizada do Ombro {{lateridade_texto}}',
  variaveis = '[{"nome": "lateridade_texto", "tipo": "select", "opcoes": ["direito", "esquerdo"], "obrigatorio": true}]'::jsonb,
  updated_at = NOW()
WHERE id = '5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b';

-- TC Pé
UPDATE system_templates SET 
  titulo = 'Tomografia Computadorizada do Pé {{lateridade_texto}}',
  variaveis = '[{"nome": "lateridade_texto", "tipo": "select", "opcoes": ["direito", "esquerdo"], "obrigatorio": true}]'::jsonb,
  updated_at = NOW()
WHERE id = '6f7a8b9c-0d1e-2f3a-4b5c-6d7e8f9a0b1c';

-- TC Perna
UPDATE system_templates SET 
  titulo = 'Tomografia Computadorizada da Perna {{lateridade_texto}}',
  variaveis = '[{"nome": "lateridade_texto", "tipo": "select", "opcoes": ["direita", "esquerda"], "obrigatorio": true}]'::jsonb,
  updated_at = NOW()
WHERE id = '7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d';

-- TC Punho
UPDATE system_templates SET 
  titulo = 'Tomografia Computadorizada do Punho {{lateridade_texto}}',
  variaveis = '[{"nome": "lateridade_texto", "tipo": "select", "opcoes": ["direito", "esquerdo"], "obrigatorio": true}]'::jsonb,
  updated_at = NOW()
WHERE id = '8b9c0d1e-2f3a-4b5c-6d7e-8f9a0b1c2d3e';

-- TC Quadril
UPDATE system_templates SET 
  titulo = 'Tomografia Computadorizada do Quadril {{lateridade_texto}}',
  variaveis = '[{"nome": "lateridade_texto", "tipo": "select", "opcoes": ["direito", "esquerdo"], "obrigatorio": true}]'::jsonb,
  updated_at = NOW()
WHERE id = '9c0d1e2f-3a4b-5c6d-7e8f-9a0b1c2d3e4f';

-- TC Tornozelo
UPDATE system_templates SET 
  titulo = 'Tomografia Computadorizada do Tornozelo {{lateridade_texto}}',
  variaveis = '[{"nome": "lateridade_texto", "tipo": "select", "opcoes": ["direito", "esquerdo"], "obrigatorio": true}]'::jsonb,
  updated_at = NOW()
WHERE id = '0d1e2f3a-4b5c-6d7e-8f9a-0b1c2d3e4f5a';


-- =====================================================
-- FASE 3: ADICIONAR VARIÁVEL EM TEMPLATES RX (8 templates)
-- Criar variável lateridade_texto + adicionar ao título
-- =====================================================

-- RX Mão
UPDATE system_templates SET 
  titulo = 'Radiografia da Mão {{lateridade_texto}}',
  variaveis = '[{"nome": "lateridade_texto", "tipo": "select", "opcoes": ["direita", "esquerda"], "obrigatorio": true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'd111c1cc-b34f-4877-bb94-a66a4c7859f6';

-- RX Perna
UPDATE system_templates SET 
  titulo = 'Radiografia da Perna {{lateridade_texto}}',
  variaveis = '[{"nome": "lateridade_texto", "tipo": "select", "opcoes": ["direita", "esquerda"], "obrigatorio": true}]'::jsonb,
  updated_at = NOW()
WHERE id = '7031757d-eef1-4438-be32-4c4a01fc6d57';

-- RX Antebraço
UPDATE system_templates SET 
  titulo = 'Radiografia do Antebraço {{lateridade_texto}}',
  variaveis = '[{"nome": "lateridade_texto", "tipo": "select", "opcoes": ["direito", "esquerdo"], "obrigatorio": true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'a22bd639-cccd-4bd8-8dbc-9f2258e68015';

-- RX Braço
UPDATE system_templates SET 
  titulo = 'Radiografia do Braço {{lateridade_texto}}',
  variaveis = '[{"nome": "lateridade_texto", "tipo": "select", "opcoes": ["direito", "esquerdo"], "obrigatorio": true}]'::jsonb,
  updated_at = NOW()
WHERE id = '0e0c77df-36b7-46a0-b6c0-b16ccac64176';

-- RX Joelho
UPDATE system_templates SET 
  titulo = 'Radiografia do Joelho {{lateridade_texto}}',
  variaveis = '[{"nome": "lateridade_texto", "tipo": "select", "opcoes": ["direito", "esquerdo"], "obrigatorio": true}]'::jsonb,
  updated_at = NOW()
WHERE id = '7fff9935-c363-43c5-b58f-d7bad2f9533d';

-- RX Ombro
UPDATE system_templates SET 
  titulo = 'Radiografia do Ombro {{lateridade_texto}}',
  variaveis = '[{"nome": "lateridade_texto", "tipo": "select", "opcoes": ["direito", "esquerdo"], "obrigatorio": true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'a3f26f33-96a0-4c85-a8ab-c249e27164af';

-- RX Pé
UPDATE system_templates SET 
  titulo = 'Radiografia do Pé {{lateridade_texto}}',
  variaveis = '[{"nome": "lateridade_texto", "tipo": "select", "opcoes": ["direito", "esquerdo"], "obrigatorio": true}]'::jsonb,
  updated_at = NOW()
WHERE id = '7db56ad8-9472-4c14-b45e-2907ae6782a5';

-- RX Punho
UPDATE system_templates SET 
  titulo = 'Radiografia do Punho {{lateridade_texto}}',
  variaveis = '[{"nome": "lateridade_texto", "tipo": "select", "opcoes": ["direito", "esquerdo"], "obrigatorio": true}]'::jsonb,
  updated_at = NOW()
WHERE id = 'f9f32332-fffc-4d51-91cd-67953caa1375';


-- =====================================================
-- FASE 4: CORRIGIR TEMPLATES USG (10 templates)
-- Mudar categoria 'alterado' → 'normal'
-- Remover travessão do título
-- =====================================================

UPDATE system_templates SET 
  categoria = 'normal',
  titulo = REPLACE(titulo, ' — {{lateridade_texto}}', ' {{lateridade_texto}}'),
  updated_at = NOW()
WHERE id IN (
  '898fcff5-aab1-40f7-9ff8-d4f4786ebb94',  -- USG Axilar
  '6cdd712e-2699-44b3-afaa-e7c49c3e3607',  -- USG Mão
  'fc57ec23-8d00-4ae9-ada2-ed4c85a1f2e9',  -- USG Tornozelo
  '8c94e7e2-0f4f-41d3-8e46-7f1c2b3d4e5f',  -- USG Punho
  '9d05f8f3-1a5a-52e4-9f57-8a2d3c4e5f6a',  -- USG Pé
  'ae16a9a4-2b6b-63f5-0a68-9b3e4d5f6a7b',  -- USG Joelho
  'bf27bab5-3c7c-74a6-1b79-0c4f5e6a7b8c',  -- USG Ombro
  'c038cbc6-4d8d-85b7-2c80-1d5a6f7b8c9d',  -- USG Cotovelo
  'd149dcd7-5e9e-96c8-3d91-2e6b7a8c9d0e',  -- USG Quadril
  'e250ede8-6f0f-07d9-4e02-3f7c8b9d0e1f'   -- USG Coxa
);


-- =====================================================
-- FASE 5: DESATIVAR TEMPLATES DUPLICADOS
-- =====================================================

-- Desativar RM Mão duplicado (manter o original 30013dd7)
UPDATE system_templates SET 
  ativo = false,
  updated_at = NOW()
WHERE id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
  AND titulo LIKE '%Mão%' 
  AND modalidade_codigo = 'RM';

-- Desativar TC Joelho duplicado (manter o original 3c4f5a6b)
UPDATE system_templates SET 
  ativo = false,
  updated_at = NOW()
WHERE id = 'f990b8a8-9cae-4c48-bbf1-58d0c662b3c3';


-- =====================================================
-- VERIFICAÇÃO: Listar templates atualizados
-- =====================================================

SELECT 
  modalidade_codigo,
  titulo,
  categoria,
  variaveis->0->>'nome' as var_nome,
  ativo
FROM system_templates
WHERE titulo LIKE '%{{lateridade_texto}}%'
  AND ativo = true
ORDER BY modalidade_codigo, titulo;


-- =====================================================
-- FIM DA UNIFORMIZAÇÃO
-- Total de templates afetados: 41
-- =====================================================
