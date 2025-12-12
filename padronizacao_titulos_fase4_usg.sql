-- =====================================================
-- FASE 4: Padronização de Títulos - USG → Ultrassonografia
-- =====================================================
-- Corrige templates com abreviação "USG" ou "US" para nome completo
-- Remove travessão de templates NORMAIS com variáveis de lateralidade
-- =====================================================

-- 1. Templates normais COM VARIÁVEIS - remover travessão, manter variável
UPDATE system_templates SET titulo = 'Ultrassonografia do Punho {{lateridade_texto}}' WHERE codigo = 'US_PUNHO_NORMAL' OR codigo = 'USG_PUNHO_NORMAL';
UPDATE system_templates SET titulo = 'Ultrassonografia do Ombro {{lateridade_texto}}' WHERE codigo = 'US_OMBRO_NORMAL' OR codigo = 'USG_OMBRO_NORMAL';
UPDATE system_templates SET titulo = 'Ultrassonografia do Joelho {{lateridade_texto}}' WHERE codigo = 'US_JOELHO_NORMAL' OR codigo = 'USG_JOELHO_NORMAL';
UPDATE system_templates SET titulo = 'Ultrassonografia do Cotovelo {{lateridade_texto}}' WHERE codigo = 'US_COTOVELO_NORMAL' OR codigo = 'USG_COTOVELO_NORMAL';
UPDATE system_templates SET titulo = 'Ultrassonografia do Tornozelo {{lateridade_texto}}' WHERE codigo = 'US_TORNOZELO_NORMAL' OR codigo = 'USG_TORNOZELO_NORMAL';
UPDATE system_templates SET titulo = 'Ultrassonografia do Quadril {{lateridade_texto}}' WHERE codigo = 'US_QUADRIL_NORMAL' OR codigo = 'USG_QUADRIL_NORMAL';
UPDATE system_templates SET titulo = 'Ultrassonografia da Mão {{lateridade_texto}}' WHERE codigo = 'US_MAO_NORMAL' OR codigo = 'USG_MAO_NORMAL';
UPDATE system_templates SET titulo = 'Ultrassonografia do Pé {{lateridade_texto}}' WHERE codigo = 'US_PE_NORMAL' OR codigo = 'USG_PE_NORMAL';
UPDATE system_templates SET titulo = 'Ultrassonografia Doppler Venoso do Membro Inferior {{lateridade_texto}}' WHERE codigo = 'USG_DOPPLER_VENOSO_MI_NORMAL';
UPDATE system_templates SET titulo = 'Ultrassonografia Doppler Arterial do Membro Inferior {{lateridade_texto}}' WHERE codigo = 'USG_DOPPLER_ARTERIAL_MI_NORMAL';
UPDATE system_templates SET titulo = 'Ultrassonografia Doppler Venoso do Membro Superior {{lateridade_texto}}' WHERE codigo = 'USG_DOPPLER_VENOSO_MS_NORMAL';

-- 2. Templates normais SEM variáveis
UPDATE system_templates SET titulo = 'Ultrassonografia do Abdome Total' WHERE codigo = 'USG_ABDOME_TOTAL_NORMAL';
UPDATE system_templates SET titulo = 'Ultrassonografia do Abdome Superior' WHERE codigo = 'USG_ABDOME_SUPERIOR_NORMAL';
UPDATE system_templates SET titulo = 'Ultrassonografia da Tireoide' WHERE codigo = 'USG_TIREOIDE_NORMAL';
UPDATE system_templates SET titulo = 'Ultrassonografia das Mamas' WHERE codigo = 'USG_MAMAS_NORMAL';
UPDATE system_templates SET titulo = 'Ultrassonografia Pélvica' WHERE codigo = 'USG_PELVICA_NORMAL';
UPDATE system_templates SET titulo = 'Ultrassonografia Transvaginal' WHERE codigo = 'USG_TRANSVAGINAL_NORMAL';
UPDATE system_templates SET titulo = 'Ultrassonografia da Próstata via Abdominal' WHERE codigo = 'USG_PROSTATA_NORMAL';
UPDATE system_templates SET titulo = 'Ultrassonografia da Próstata via Transretal' WHERE codigo = 'USG_PROSTATA_TRANSRETAL_NORMAL';
UPDATE system_templates SET titulo = 'Ultrassonografia da Bolsa Escrotal' WHERE codigo = 'USG_BOLSA_ESCROTAL_NORMAL';
UPDATE system_templates SET titulo = 'Ultrassonografia das Partes Moles' WHERE codigo = 'USG_PARTES_MOLES_NORMAL';
UPDATE system_templates SET titulo = 'Ultrassonografia da Parede Abdominal' WHERE codigo = 'USG_PAREDE_ABDOMINAL_NORMAL';
UPDATE system_templates SET titulo = 'Ultrassonografia das Glândulas Salivares' WHERE codigo = 'USG_GLANDULAS_SALIVARES_NORMAL';
UPDATE system_templates SET titulo = 'Ultrassonografia Cervical' WHERE codigo = 'USG_CERVICAL_NORMAL';
UPDATE system_templates SET titulo = 'Ultrassonografia do Pescoço' WHERE codigo = 'USG_PESCOCO_NORMAL';

-- 3. Doppler sem lateralidade (bilateral)
UPDATE system_templates SET titulo = 'Ultrassonografia Doppler das Artérias Carótidas e Vertebrais' WHERE codigo = 'USG_DOPPLER_CAROTIDAS_VERTEBRAIS_NORMAL';
UPDATE system_templates SET titulo = 'Ultrassonografia Doppler das Artérias Renais' WHERE codigo = 'USG_DOPPLER_ARTERIAS_RENAIS_NORMAL';
UPDATE system_templates SET titulo = 'Ultrassonografia Doppler da Veia Porta' WHERE codigo = 'USG_DOPPLER_PORTA_NORMAL';
UPDATE system_templates SET titulo = 'Ultrassonografia Doppler do Fígado' WHERE codigo = 'USG_DOPPLER_FIGADO_NORMAL';
UPDATE system_templates SET titulo = 'Ultrassonografia Doppler Transcraniano' WHERE codigo = 'USG_DOPPLER_TRANSCRANIANO_NORMAL';

-- 4. Obstétricos
UPDATE system_templates SET titulo = 'Ultrassonografia Obstétrica Inicial' WHERE codigo = 'US_OB_INICIAL_001';
UPDATE system_templates SET titulo = 'Ultrassonografia Obstétrica Morfológica' WHERE codigo = 'US_OB_MORFOLOGICO_001';
UPDATE system_templates SET titulo = 'Ultrassonografia Obstétrica de Crescimento Fetal' WHERE codigo = 'US_OB_CRESCIMENTO_001';
UPDATE system_templates SET titulo = 'Ultrassonografia Obstétrica com Doppler' WHERE codigo = 'US_OB_DOPPLER_001';
UPDATE system_templates SET titulo = 'Ultrassonografia Obstétrica Transvaginal' WHERE codigo = 'US_OB_TRANSVAGINAL_001';

-- =====================================================
-- FIM FASE 4 - Total: ~35 templates atualizados
-- =====================================================
