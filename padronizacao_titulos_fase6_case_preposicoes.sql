-- =====================================================
-- FASE 6: Correção de Case e Preposições
-- =====================================================
-- Corrige títulos com case incorreto (Rm, Tc, Rx)
-- Adiciona preposições corretas (do, da, dos, das)
-- =====================================================

-- 1. Corrigir títulos específicos com case errado identificados
UPDATE system_templates SET titulo = 'Ressonância Magnética do Encéfalo' WHERE codigo = 'RM_ENCEFALO_NORMAL';
UPDATE system_templates SET titulo = 'Ressonância Magnética da Coluna Lombar — Hérnia de Disco' WHERE codigo = 'RM_DISCO_HERNIA';
UPDATE system_templates SET titulo = 'Angiorressonância da Aorta e Artérias Renais' WHERE codigo = 'ANGIO_RM_AORTA_RENAIS_NORMAL_001';
UPDATE system_templates SET titulo = 'Ressonância Magnética do Abdome Superior com Colangiorressonância' WHERE codigo = 'RM_ABD_SUP_COLANGIO_NORMAL_001';
UPDATE system_templates SET titulo = 'Ressonância Magnética do Abdome e Pelve Feminino' WHERE codigo = 'RM_ABDOME_PELVE_FEMININO_NORMAL_001';
UPDATE system_templates SET titulo = 'Ressonância Magnética do Abdome e Pelve' WHERE codigo = 'RM_ABDOME_PELVE_NORMAL_001';
UPDATE system_templates SET titulo = 'Ressonância Magnética do Abdome Superior' WHERE codigo = 'RM_ABDOME_SUPERIOR_NORMAL_001';
UPDATE system_templates SET titulo = 'Enterorressonância Magnética' WHERE codigo = 'RM_ENTERORRESSONANCIA_NORMAL_001';
UPDATE system_templates SET titulo = 'Ressonância Magnética das Mamas com Implantes' WHERE codigo = 'RM_MAMAS_IMPLANTES_NORMAL_001';
UPDATE system_templates SET titulo = 'Ressonância Magnética das Mamas' WHERE codigo = 'RM_MAMAS_NORMAL_001';
UPDATE system_templates SET titulo = 'Ressonância Magnética da Parede Torácica' WHERE codigo = 'RM_PAREDE_TORACICA_NORMAL_001';
UPDATE system_templates SET titulo = 'Ressonância Magnética da Pelve — Endometriomas' WHERE codigo = 'RM_PELVE_ENDOMETRIOMAS_NOVOS_001';
UPDATE system_templates SET titulo = 'Ressonância Magnética da Pelve — Endometriose Profunda e Adenomiose' WHERE codigo = 'RM_PELVE_ENDOMETRIOSE_PROFUNDA_ADENOMIOSE_SUPERFICIAL_001';
UPDATE system_templates SET titulo = 'Ressonância Magnética da Pelve Feminina — Com Contraste' WHERE codigo = 'RM_PELVE_FEMININO_COM_CONTRASTE_NORMAL_001';
UPDATE system_templates SET titulo = 'Ressonância Magnética da Pelve Masculina — Com Contraste' WHERE codigo = 'RM_PELVE_MASCULINO_COM_CONTRASTE_NORMAL_001';
UPDATE system_templates SET titulo = 'Ressonância Magnética da Pelve — Útero Unicorno e Ovários Aderidos' WHERE codigo = 'RM_PELVE_UTERO_UNICORNO_OVARIOS_ADERIDOS_001';
UPDATE system_templates SET titulo = 'Ressonância Magnética Multiparamétrica da Próstata' WHERE codigo = 'RM_PROSTATA_NORMAL_001';
UPDATE system_templates SET titulo = 'Ressonância Magnética da Coluna Total' WHERE codigo = 'RM_COLUNA_TOTAL_NORMAL_001';
UPDATE system_templates SET titulo = 'Ressonância Magnética da Pelve Feminina' WHERE codigo = 'RM_PELVE_FEMININO_NORMAL';
UPDATE system_templates SET titulo = 'Ressonância Magnética do Abdome e Pelve Masculino — Com Contraste' WHERE codigo = 'RM_ABDOME_PELVE_MASCULINO_COM_CONTRASTE_001';

-- 2. Colangiorressonância - garantir padrão
UPDATE system_templates SET titulo = 'Colangiorressonância Magnética — Coledocolitíase e achados associados' WHERE codigo = 'COLANGIO_RM_COLEDOCOLITIASE_ALTERADO';
UPDATE system_templates SET titulo = 'Colangiorressonância Magnética — Nódulos pancreáticos (NET), baço acessório, esteatose e hemangioma' WHERE codigo = 'COLANGIO_RM_NEUROENDOCRINO_BACO_ACESSORIO_ALTERADO';

-- 3. Densitometria - corrigir categoria
UPDATE system_templates SET categoria = 'normal' WHERE codigo = 'DXA_ZSCORE_DENSITOMETRIA' AND categoria IS NULL;

-- =====================================================
-- FIM FASE 6 - Total: ~25 templates atualizados
-- =====================================================
