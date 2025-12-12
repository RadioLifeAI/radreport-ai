-- =====================================================
-- FASE 3: Padronização de Títulos - RX → Radiografia
-- =====================================================
-- Corrige templates com abreviação "RX" para nome completo "Radiografia"
-- =====================================================

-- 1. Templates normais com "RX" abreviado
UPDATE system_templates SET titulo = 'Radiografia do Braço' WHERE codigo = 'RX_BRACO_NORMAL';
UPDATE system_templates SET titulo = 'Radiografia da Clavícula' WHERE codigo = 'RX_CLAVICULA_NORMAL';
UPDATE system_templates SET titulo = 'Radiografia das Articulações Temporomandibulares' WHERE codigo = 'RX_ATM_NORMAL';
UPDATE system_templates SET titulo = 'Radiografia do Cavum' WHERE codigo = 'RX_CAVUM_NORMAL';
UPDATE system_templates SET titulo = 'Radiografia da Coluna Cervical' WHERE codigo = 'RX_COLUNA_CERVICAL_NORMAL';
UPDATE system_templates SET titulo = 'Radiografia da Coluna Lombar' WHERE codigo = 'RX_COLUNA_LOMBAR_NORMAL';
UPDATE system_templates SET titulo = 'Radiografia da Coluna Torácica' WHERE codigo = 'RX_COLUNA_TORACICA_NORMAL';
UPDATE system_templates SET titulo = 'Radiografia do Crânio' WHERE codigo = 'RX_CRANIO_NORMAL';
UPDATE system_templates SET titulo = 'Radiografia do Antebraço' WHERE codigo = 'RX_ANTEBRACO_NORMAL';
UPDATE system_templates SET titulo = 'Radiografia da Mão' WHERE codigo = 'RX_MAO_NORMAL';
UPDATE system_templates SET titulo = 'Radiografia do Punho' WHERE codigo = 'RX_PUNHO_NORMAL';
UPDATE system_templates SET titulo = 'Radiografia do Cotovelo' WHERE codigo = 'RX_COTOVELO_NORMAL';
UPDATE system_templates SET titulo = 'Radiografia do Ombro' WHERE codigo = 'RX_OMBRO_NORMAL';
UPDATE system_templates SET titulo = 'Radiografia do Joelho' WHERE codigo = 'RX_JOELHO_NORMAL';
UPDATE system_templates SET titulo = 'Radiografia do Tornozelo' WHERE codigo = 'RX_TORNOZELO_NORMAL';
UPDATE system_templates SET titulo = 'Radiografia do Pé' WHERE codigo = 'RX_PE_NORMAL';
UPDATE system_templates SET titulo = 'Radiografia da Coxa' WHERE codigo = 'RX_COXA_NORMAL';
UPDATE system_templates SET titulo = 'Radiografia da Perna' WHERE codigo = 'RX_PERNA_NORMAL';
UPDATE system_templates SET titulo = 'Radiografia da Bacia' WHERE codigo = 'RX_BACIA_NORMAL';
UPDATE system_templates SET titulo = 'Radiografia do Quadril' WHERE codigo = 'RX_QUADRIL_NORMAL';
UPDATE system_templates SET titulo = 'Radiografia do Abdome' WHERE codigo = 'RX_ABDOME_NORMAL';
UPDATE system_templates SET titulo = 'Radiografia do Tórax' WHERE codigo = 'RX_TORAX_NORMAL';
UPDATE system_templates SET titulo = 'Radiografia dos Seios da Face' WHERE codigo = 'RX_SEIOS_FACE_NORMAL';

-- 2. Templates alterados
UPDATE system_templates SET titulo = 'Radiografia do Tórax — Alterado' WHERE codigo = 'RX_TORAX_ALTERADO_002';

-- =====================================================
-- FIM FASE 3 - Total: ~24 templates atualizados
-- =====================================================
