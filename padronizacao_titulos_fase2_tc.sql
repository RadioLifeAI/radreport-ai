-- =====================================================
-- FASE 2: Padronização de Títulos - TC → Tomografia Computadorizada
-- =====================================================
-- Corrige templates com abreviação "TC" para nome completo
-- Preserva travessão (—) APENAS para templates alterados com patologia
-- =====================================================

-- 1. Templates normais com "TC" abreviado
UPDATE system_templates SET titulo = 'Tomografia Computadorizada do Abdome e Pelve' WHERE codigo = 'TC_ABDOME_PELVE_NORMAL';
UPDATE system_templates SET titulo = 'Tomografia Computadorizada do Abdome e Pelve — Com Contraste' WHERE codigo = 'TC_ABDOME_PELVE_COM_CONTRASTE_NORMAL';
UPDATE system_templates SET titulo = 'Tomografia Computadorizada do Abdome Superior' WHERE codigo = 'TC_ABDOME_SUPERIOR_NORMAL';
UPDATE system_templates SET titulo = 'Tomografia Computadorizada do Braço' WHERE codigo = 'TC_BRACO_NORMAL';
UPDATE system_templates SET titulo = 'Tomografia Computadorizada da Coluna Cervical' WHERE codigo = 'TC_COLUNA_CERVICAL_NORMAL';
UPDATE system_templates SET titulo = 'Tomografia Computadorizada da Coluna Lombar' WHERE codigo = 'TC_COLUNA_LOMBAR_NORMAL';
UPDATE system_templates SET titulo = 'Tomografia Computadorizada da Coluna Torácica' WHERE codigo = 'TC_COLUNA_TORACICA_NORMAL';
UPDATE system_templates SET titulo = 'Tomografia Computadorizada de Crânio' WHERE codigo = 'TC_CRANIO_NORMAL';
UPDATE system_templates SET titulo = 'Tomografia Computadorizada da Face' WHERE codigo = 'TC_FACE_NORMAL';
UPDATE system_templates SET titulo = 'Tomografia Computadorizada do Joelho' WHERE codigo = 'TC_JOELHO_NORMAL';
UPDATE system_templates SET titulo = 'Tomografia Computadorizada dos Ouvidos' WHERE codigo = 'TC_OUVIDOS_NORMAL';
UPDATE system_templates SET titulo = 'Tomografia Computadorizada da Pelve' WHERE codigo = 'TC_PELVE_NORMAL';
UPDATE system_templates SET titulo = 'Tomografia Computadorizada dos Seios da Face' WHERE codigo = 'TC_SEIOS_FACE_NORMAL';
UPDATE system_templates SET titulo = 'Tomografia Computadorizada do Tórax' WHERE codigo = 'TC_TORAX_NORMAL';
UPDATE system_templates SET titulo = 'Tomografia Computadorizada do Tórax de Alta Resolução' WHERE codigo = 'TC_TORAX_AR_NORMAL';
UPDATE system_templates SET titulo = 'Tomografia Computadorizada do Tórax — Baixa Dose (Rastreamento)' WHERE codigo = 'TC_TORAX_BAIXA_DOSE_NORMAL';

-- 2. Templates alterados com "TC" abreviado
UPDATE system_templates SET titulo = 'Tomografia Computadorizada do Abdome e Pelve — Carcinoma Urotelial' WHERE codigo = 'TC_ABDOME_PELVE_CA_UROTELIAL_ALTERADO';
UPDATE system_templates SET titulo = 'Enterotomografia Computadorizada — Ceco/apêndice (espessamento e obstrução)' WHERE codigo = 'TC_ENTEROTC_CECO_APENDICE_NEOPLASIA_ALTERADO';
UPDATE system_templates SET titulo = 'Tomografia Computadorizada do Tórax — Massa Mediastinal' WHERE codigo = 'TC_TORAX_MASSA_MEDIASTINAL_ALTERADO';
UPDATE system_templates SET titulo = 'Tomografia Computadorizada do Tórax — COVID-19' WHERE codigo = 'TC_TORAX_COVID_ALTERADO';
UPDATE system_templates SET titulo = 'Tomografia Computadorizada do Tórax — Fibrose Pulmonar' WHERE codigo = 'TC_TORAX_FIBROSE_ALTERADO';
UPDATE system_templates SET titulo = 'Tomografia Computadorizada do Abdome — Apendicite Aguda' WHERE codigo = 'TC_ABDOME_APENDICITE_ALTERADO';
UPDATE system_templates SET titulo = 'Tomografia Computadorizada do Abdome — Pancreatite Aguda' WHERE codigo = 'TC_ABDOME_PANCREATITE_ALTERADO';
UPDATE system_templates SET titulo = 'Tomografia Computadorizada do Abdome — Obstrução Intestinal' WHERE codigo = 'TC_ABDOME_OBSTRUCAO_ALTERADO';

-- 3. Angiotomografias - já usam nome completo, apenas verificar padrão
-- (Angiotomografia está correto, não precisa alterar)

-- =====================================================
-- FIM FASE 2 - Total: ~25 templates atualizados
-- =====================================================
