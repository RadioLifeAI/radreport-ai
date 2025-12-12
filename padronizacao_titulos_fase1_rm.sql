-- =====================================================
-- FASE 1: Padronização de Títulos - RM → Ressonância Magnética
-- =====================================================
-- Corrige 44+ templates com abreviação "RM" ou "Rm" para nome completo
-- Preserva travessão (—) APENAS para templates alterados com patologia
-- =====================================================

-- 1. Templates com "RM " no início (abreviação)
UPDATE system_templates SET titulo = 'Ressonância Magnética Angio Arterial Cervical' WHERE codigo = 'RM_ANGIO_ARTERIAL_CERVICAL_NORMAL';
UPDATE system_templates SET titulo = 'Ressonância Magnética Angio Arterial Intracraniana' WHERE codigo = 'RM_ANGIO_ARTERIAL_INTRACRANIANA_NORMAL';
UPDATE system_templates SET titulo = 'Ressonância Magnética Angio Arterial dos Membros Inferiores' WHERE codigo = 'RM_ANGIO_ARTERIAL_MEMBROS_INFERIORES_NORMAL';
UPDATE system_templates SET titulo = 'Ressonância Magnética do Antebraço' WHERE codigo = 'RM_ANTEBRACO_NORMAL';
UPDATE system_templates SET titulo = 'Ressonância Magnética das Articulações Sacroilíacas' WHERE codigo = 'RM_ARTICULAÇÕES_SACROILÍACAS_NORMAL';
UPDATE system_templates SET titulo = 'Ressonância Magnética das Articulações Temporomandibulares' WHERE codigo = 'RM_ATM_NORMAL';
UPDATE system_templates SET titulo = 'Ressonância Magnética da Bacia' WHERE codigo = 'RM_BACIA_NORMAL';
UPDATE system_templates SET titulo = 'Ressonância Magnética do Braço' WHERE codigo = 'RM_BRACO_NORMAL';
UPDATE system_templates SET titulo = 'Ressonância Magnética Cardíaca' WHERE codigo = 'RM_CARDIACO_NORMAL';
UPDATE system_templates SET titulo = 'Ressonância Magnética da Coxa' WHERE codigo = 'RM_COXA_NORMAL';
UPDATE system_templates SET titulo = 'Enterorressonância Magnética' WHERE codigo = 'RM_ENTERO_NORMAL';
UPDATE system_templates SET titulo = 'Ressonância Magnética da Face' WHERE codigo = 'RM_FACE_NORMAL';
UPDATE system_templates SET titulo = 'Ressonância Magnética dos Ouvidos' WHERE codigo = 'RM_OUVIDOS_NORMAL';
UPDATE system_templates SET titulo = 'Ressonância Magnética do Pé' WHERE codigo = 'RM_PE_NORMAL';
UPDATE system_templates SET titulo = 'Ressonância Magnética do Punho' WHERE codigo = 'RM_PUNHO_NORMAL';
UPDATE system_templates SET titulo = 'Ressonância Magnética dos Seios da Face' WHERE codigo = 'RM_SEIOS_FACE_NORMAL';
UPDATE system_templates SET titulo = 'Ressonância Magnética da Sela Túrcica' WHERE codigo = 'RM_SELA_TURCICA_NORMAL';
UPDATE system_templates SET titulo = 'Ressonância Magnética do Tornozelo' WHERE codigo = 'RM_TORNOZELO_NORMAL';

-- 2. Templates com "Rm " (case incorreto) - Corrigir case e expandir
UPDATE system_templates SET titulo = 'Angiorressonância da Aorta e Artérias Renais' WHERE codigo = 'ANGIO_RM_AORTA_RENAIS_NORMAL_001';
UPDATE system_templates SET titulo = 'Ressonância Magnética do Abdome Superior com Colangiorressonância' WHERE codigo = 'RM_ABD_SUP_COLANGIO_NORMAL_001';
UPDATE system_templates SET titulo = 'Ressonância Magnética do Abdome e Pelve Feminino' WHERE codigo = 'RM_ABDOME_PELVE_FEMININO_NORMAL_001';
UPDATE system_templates SET titulo = 'Ressonância Magnética do Abdome e Pelve Masculino — Com Contraste' WHERE codigo = 'RM_ABDOME_PELVE_MASCULINO_COM_CONTRASTE_001';
UPDATE system_templates SET titulo = 'Ressonância Magnética do Abdome e Pelve' WHERE codigo = 'RM_ABDOME_PELVE_NORMAL_001';
UPDATE system_templates SET titulo = 'Ressonância Magnética do Abdome Superior' WHERE codigo = 'RM_ABDOME_SUPERIOR_NORMAL_001';
UPDATE system_templates SET titulo = 'Ressonância Magnética da Coluna Lombar — Hérnia de Disco' WHERE codigo = 'RM_DISCO_HERNIA';
UPDATE system_templates SET titulo = 'Ressonância Magnética do Encéfalo' WHERE codigo = 'RM_ENCEFALO_NORMAL';
UPDATE system_templates SET titulo = 'Enterorressonância Magnética' WHERE codigo = 'RM_ENTERORRESSONANCIA_NORMAL_001';
UPDATE system_templates SET titulo = 'Ressonância Magnética das Mamas com Implantes' WHERE codigo = 'RM_MAMAS_IMPLANTES_NORMAL_001';
UPDATE system_templates SET titulo = 'Ressonância Magnética das Mamas' WHERE codigo = 'RM_MAMAS_NORMAL_001';
UPDATE system_templates SET titulo = 'Ressonância Magnética da Parede Torácica' WHERE codigo = 'RM_PAREDE_TORACICA_NORMAL_001';
UPDATE system_templates SET titulo = 'Ressonância Magnética da Pelve — Miomas e Adenomiose' WHERE codigo = 'RM_PELVE_MIOMAS_ADENOMIOSE_ALTERADO';
UPDATE system_templates SET titulo = 'Ressonância Magnética da Pelve — Endometriomas' WHERE codigo = 'RM_PELVE_ENDOMETRIOMAS_NOVOS_001';
UPDATE system_templates SET titulo = 'Ressonância Magnética da Pelve — Endometriose Profunda e Adenomiose' WHERE codigo = 'RM_PELVE_ENDOMETRIOSE_PROFUNDA_ADENOMIOSE_SUPERFICIAL_001';
UPDATE system_templates SET titulo = 'Ressonância Magnética da Pelve Feminina — Com Contraste' WHERE codigo = 'RM_PELVE_FEMININO_COM_CONTRASTE_NORMAL_001';
UPDATE system_templates SET titulo = 'Ressonância Magnética da Pelve Masculina — Com Contraste' WHERE codigo = 'RM_PELVE_MASCULINO_COM_CONTRASTE_NORMAL_001';
UPDATE system_templates SET titulo = 'Ressonância Magnética da Pelve — Útero Unicorno e Ovários Aderidos' WHERE codigo = 'RM_PELVE_UTERO_UNICORNO_OVARIOS_ADERIDOS_001';
UPDATE system_templates SET titulo = 'Ressonância Magnética Multiparamétrica da Próstata' WHERE codigo = 'RM_PROSTATA_NORMAL_001';
UPDATE system_templates SET titulo = 'Ressonância Magnética da Coluna Total' WHERE codigo = 'RM_COLUNA_TOTAL_NORMAL_001';
UPDATE system_templates SET titulo = 'Ressonância Magnética da Pelve Feminina' WHERE codigo = 'RM_PELVE_FEMININO_NORMAL';

-- 3. Templates alterados com "RM " abreviado - manter travessão
UPDATE system_templates SET titulo = 'Ressonância Magnética da Pelve — Espessamento uterossacro e nódulo apendicular' WHERE codigo = 'RM_PELVE_ENDOMETRIOSE_NODULO_APENDICE_ALTERADO';
UPDATE system_templates SET titulo = 'Ressonância Magnética da Pelve — Nódulo subcutâneo monte pubiano direito' WHERE codigo = 'RM_PELVE_NODULO_MONTE_PUBIANO_ALTERADO';
UPDATE system_templates SET titulo = 'Ressonância Magnética do Abdome e Próstata — PI-RADS 4, hérnias inguinais e cistos renais Bosniak I' WHERE codigo = 'RM_ABD_PELVE_PROSTATA_PIRADS4_HERNIAS_BOSNIAK1_ALTERADO';
UPDATE system_templates SET titulo = 'Ressonância Magnética do Abdome e Pelve — Nódulo renal indeterminado, cistos hepáticos e Bosniak I' WHERE codigo = 'RM_ABD_PELVE_NODULO_RENAL_INDETERMINADO_ALTERADO';
UPDATE system_templates SET titulo = 'Ressonância Magnética do Abdome Superior — Sobrecarga de ferro e esteatose hepática' WHERE codigo = 'RM_ABD_SUP_FERRO_ESTEATOSE_ALTERADO';
UPDATE system_templates SET titulo = 'Ressonância Magnética do Abdome Superior com Colangiorressonância — Nódulos pancreáticos neuroendócrinos, esteatose e hemangioma' WHERE codigo = 'RM_ABD_SUP_COLANGIO_NEUROENDOCRINO_PANCREAS_ALTERADO';
UPDATE system_templates SET titulo = 'Ressonância Magnética do Tórax — Nódulo pulmonar lobo superior direito (controle)' WHERE codigo = 'RM_TORAX_NODULO_PULMONAR_CONTROLE_ALTERADO';

-- 4. Próstata multiparamétrica alterados
UPDATE system_templates SET titulo = 'Ressonância Magnética Multiparamétrica da Próstata — Lesão cística na ZT e HPB' WHERE codigo = 'RM_PROSTATA_TZ_LESOES_CISTICA_HPB_ALTERADO';
UPDATE system_templates SET titulo = 'Ressonância Magnética Multiparamétrica da Próstata — PI-RADS 2 pós-TURP e fibrose AFMS' WHERE codigo = 'RM_PROSTATA_PIRADS2_TURP_FIBROSE_ALTERADO';
UPDATE system_templates SET titulo = 'Ressonância Magnética Multiparamétrica da Próstata — PI-RADS 2 controle (PRECISE 1; cisto utrículo)' WHERE codigo = 'RM_PROSTATA_PIRADS2_COMPARATIVO_PRECISE1_UTRICULO_ALTERADO';
UPDATE system_templates SET titulo = 'Ressonância Magnética Multiparamétrica da Próstata — PI-RADS 2 e cálculo em vesícula seminal' WHERE codigo = 'RM_PROSTATA_PIRADS2_CALCULO_VESICULA_SEMINAL_ALTERADO';
UPDATE system_templates SET titulo = 'Ressonância Magnética Multiparamétrica da Próstata — PI-RADS 3 zona central direita (base)' WHERE codigo = 'RM_PROSTATA_PIRADS3_2PLUS1_ZONA_CENTRAL_DIR_ALTERADO';
UPDATE system_templates SET titulo = 'Ressonância Magnética Multiparamétrica da Próstata — PI-RADS 4 zona de transição (terço médio direito)' WHERE codigo = 'RM_PROSTATA_PIRADS4_3PLUS1_ZT_MID_DIR_ALTERADO';
UPDATE system_templates SET titulo = 'Ressonância Magnética Multiparamétrica da Próstata — PI-RADS 4 ZP apical direita e zona central esquerda' WHERE codigo = 'RM_PROSTATA_PIRADS4_E_4_ALTERADO';
UPDATE system_templates SET titulo = 'Ressonância Magnética Multiparamétrica da Próstata — PI-RADS 4 ZP base esquerda (biópsia por fusão)' WHERE codigo = 'RM_PROSTATA_PIRADS4_BIOPSIA_FUSAO_ZP_BASE_ESQ_ALTERADO';
UPDATE system_templates SET titulo = 'Ressonância Magnética Multiparamétrica da Próstata — PI-RADS 4 com abaulamento capsular' WHERE codigo = 'RM_PROSTATA_PIRADS4_CAPSULAR_BULGE_ALTERADO';
UPDATE system_templates SET titulo = 'Ressonância Magnética Multiparamétrica da Próstata — PI-RADS 4 duas lesões ZP esquerda (comparativo)' WHERE codigo = 'RM_PROSTATA_PIRADS4_COMPARATIVO_ZP_DUPLA_ALTERADO';
UPDATE system_templates SET titulo = 'Ressonância Magnética Multiparamétrica da Próstata — PI-RADS 4 (controle 4-6 meses)' WHERE codigo = 'RM_PROSTATA_PIRADS4_CONTROLE_4_6M_ALTERADO';
UPDATE system_templates SET titulo = 'Ressonância Magnética Multiparamétrica da Próstata — PI-RADS 4 e PI-RADS 3 ZT ápice' WHERE codigo = 'RM_PROSTATA_PIRADS4_E_3_ALTERADO';
UPDATE system_templates SET titulo = 'Ressonância Magnética Multiparamétrica da Próstata — PI-RADS 4 zona de transição apical direita' WHERE codigo = 'RM_PROSTATA_PIRADS4_ZT_APICAL_DIR_ALTERADO';
UPDATE system_templates SET titulo = 'Ressonância Magnética Multiparamétrica da Próstata — PI-RADS 4 estroma fibromuscular anterior ápice' WHERE codigo = 'RM_PROSTATA_PIRADS4_ESTROMA_FIBROMUSCULAR_ALTERADO';
UPDATE system_templates SET titulo = 'Ressonância Magnética Multiparamétrica da Próstata — PI-RADS 5 ZP e PI-RADS 3 ZT' WHERE codigo = 'RM_PROSTATA_PIRADS3_E_5_ALTERADO';
UPDATE system_templates SET titulo = 'Ressonância Magnética Multiparamétrica da Próstata — PI-RADS 5 com abaulamento capsular' WHERE codigo = 'RM_PROSTATA_PIRADS5_CAPSULAR_BULGE_ALTERADO';
UPDATE system_templates SET titulo = 'Ressonância Magnética Multiparamétrica da Próstata — PI-RADS 5 com invasão vesículas seminais' WHERE codigo = 'RM_PROSTATA_PIRADS5_INVASAO_VESICULAS_ALTERADO';
UPDATE system_templates SET titulo = 'Ressonância Magnética Multiparamétrica da Próstata — PI-RADS 4 ZP e lesão cística ZT' WHERE codigo = 'RM_PROSTATA_PIRADS4_ZT_CISTICA_ALTERADO';
UPDATE system_templates SET titulo = 'Ressonância Magnética Multiparamétrica do Leito Prostático — Pós-prostatectomia (sem recidiva)' WHERE codigo = 'RM_PELVE_POS_PROSTATECTOMIA_SEM_RECIDIVA_ALTERADO';

-- =====================================================
-- FIM FASE 1 - Total: ~60 templates atualizados
-- =====================================================
