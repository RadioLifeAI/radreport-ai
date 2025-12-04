-- Migration: Padronização dos títulos de templates - 5 fases
-- Objetivo: Formato "[Modalidade por extenso] [artigo] [Região]"

-- ============================================
-- FASE 1: Templates RM (44 templates)
-- ============================================

-- Substituir "RM " por "Ressonância Magnética " e adicionar artigos corretos
UPDATE system_templates SET titulo = 'Ressonância Magnética do Encéfalo' WHERE titulo LIKE 'RM Encéfalo%';
UPDATE system_templates SET titulo = 'Ressonância Magnética da Hipófise' WHERE titulo LIKE 'RM Hipófise%';
UPDATE system_templates SET titulo = 'Ressonância Magnética das Órbitas' WHERE titulo LIKE 'RM Órbitas%';
UPDATE system_templates SET titulo = 'Ressonância Magnética dos Seios da Face' WHERE titulo LIKE 'RM Seios da Face%';
UPDATE system_templates SET titulo = 'Ressonância Magnética da ATM' WHERE titulo LIKE 'RM ATM%';
UPDATE system_templates SET titulo = 'Ressonância Magnética do Pescoço' WHERE titulo LIKE 'RM Pescoço%';
UPDATE system_templates SET titulo = 'Ressonância Magnética da Coluna Cervical' WHERE titulo LIKE 'RM Coluna Cervical%';
UPDATE system_templates SET titulo = 'Ressonância Magnética da Coluna Torácica' WHERE titulo LIKE 'RM Coluna Torácica%';
UPDATE system_templates SET titulo = 'Ressonância Magnética da Coluna Lombar' WHERE titulo LIKE 'RM Coluna Lombar%' OR titulo LIKE 'RM Coluna Lombossacra%';
UPDATE system_templates SET titulo = 'Ressonância Magnética do Plexo Braquial' WHERE titulo LIKE 'RM Plexo Braquial%';
UPDATE system_templates SET titulo = 'Ressonância Magnética do Ombro' WHERE titulo LIKE 'RM Ombro%';
UPDATE system_templates SET titulo = 'Ressonância Magnética do Cotovelo' WHERE titulo LIKE 'RM Cotovelo%';
UPDATE system_templates SET titulo = 'Ressonância Magnética do Punho' WHERE titulo LIKE 'RM Punho%';
UPDATE system_templates SET titulo = 'Ressonância Magnética da Mão' WHERE titulo LIKE 'RM Mão%';
UPDATE system_templates SET titulo = 'Ressonância Magnética do Quadril' WHERE titulo LIKE 'RM Quadril%';
UPDATE system_templates SET titulo = 'Ressonância Magnética do Joelho' WHERE titulo LIKE 'RM Joelho%';
UPDATE system_templates SET titulo = 'Ressonância Magnética do Tornozelo' WHERE titulo LIKE 'RM Tornozelo%';
UPDATE system_templates SET titulo = 'Ressonância Magnética do Pé' WHERE titulo LIKE 'RM Pé%';
UPDATE system_templates SET titulo = 'Ressonância Magnética do Tórax' WHERE titulo LIKE 'RM Tórax%';
UPDATE system_templates SET titulo = 'Ressonância Magnética Cardíaca' WHERE titulo LIKE 'RM Cardíaca%' OR titulo LIKE 'RM Coração%';
UPDATE system_templates SET titulo = 'Ressonância Magnética do Abdome Superior' WHERE titulo LIKE 'RM Abdome Superior%';
UPDATE system_templates SET titulo = 'Ressonância Magnética do Abdome Total' WHERE titulo LIKE 'RM Abdome Total%';
UPDATE system_templates SET titulo = 'Ressonância Magnética do Fígado' WHERE titulo LIKE 'RM Fígado%' OR titulo LIKE 'RM Hepática%';
UPDATE system_templates SET titulo = 'Ressonância Magnética do Pâncreas' WHERE titulo LIKE 'RM Pâncreas%';
UPDATE system_templates SET titulo = 'Ressonância Magnética dos Rins' WHERE titulo LIKE 'RM Rins%' OR titulo LIKE 'RM Renal%';
UPDATE system_templates SET titulo = 'Ressonância Magnética da Pelve Feminina' WHERE titulo LIKE 'RM Pelve%Feminina%' OR titulo LIKE 'RM Pelve%Endometriose%';
UPDATE system_templates SET titulo = 'Ressonância Magnética da Pelve Masculina' WHERE titulo LIKE 'RM Pelve%Masculina%' OR titulo LIKE 'RM Pelve%Próstata%';
UPDATE system_templates SET titulo = 'Ressonância Magnética da Pelve' WHERE titulo LIKE 'RM Pelve%' AND titulo NOT LIKE '%Feminina%' AND titulo NOT LIKE '%Masculina%' AND titulo NOT LIKE '%Endometriose%' AND titulo NOT LIKE '%Próstata%';
UPDATE system_templates SET titulo = 'Ressonância Magnética da Próstata' WHERE titulo LIKE 'RM Próstata%';
UPDATE system_templates SET titulo = 'Ressonância Magnética do Reto' WHERE titulo LIKE 'RM Reto%';
UPDATE system_templates SET titulo = 'Ressonância Magnética da Mama' WHERE titulo LIKE 'RM Mama%' OR titulo LIKE 'RM Mamas%';
UPDATE system_templates SET titulo = 'Ressonância Magnética Fetal' WHERE titulo LIKE 'RM Fetal%';
UPDATE system_templates SET titulo = 'Angiorressonância Cerebral' WHERE titulo LIKE 'Angio%RM%Cerebral%' OR titulo LIKE 'AngioRM%Cerebral%';
UPDATE system_templates SET titulo = 'Angiorressonância do Pescoço' WHERE titulo LIKE 'Angio%RM%Pescoço%' OR titulo LIKE 'AngioRM%Pescoço%';
UPDATE system_templates SET titulo = 'Angiorressonância Aórtica' WHERE titulo LIKE 'Angio%RM%Aort%' OR titulo LIKE 'AngioRM%Aort%';
UPDATE system_templates SET titulo = 'Angiorressonância Renal' WHERE titulo LIKE 'Angio%RM%Renal%' OR titulo LIKE 'AngioRM%Renal%';
UPDATE system_templates SET titulo = 'Angiorressonância dos Membros Inferiores' WHERE titulo LIKE 'Angio%RM%Membros%' OR titulo LIKE 'AngioRM%Membros%';
UPDATE system_templates SET titulo = 'Colangiorressonância' WHERE titulo LIKE 'Colangio%RM%' OR titulo LIKE 'RM Colangio%';

-- ============================================
-- FASE 2: Templates TC (43 templates)
-- ============================================

UPDATE system_templates SET titulo = 'Tomografia Computadorizada do Crânio' WHERE titulo LIKE 'TC Crânio%';
UPDATE system_templates SET titulo = 'Tomografia Computadorizada do Encéfalo' WHERE titulo LIKE 'TC Encéfalo%';
UPDATE system_templates SET titulo = 'Tomografia Computadorizada da Face' WHERE titulo LIKE 'TC Face%';
UPDATE system_templates SET titulo = 'Tomografia Computadorizada dos Seios da Face' WHERE titulo LIKE 'TC Seios da Face%' OR titulo LIKE 'TC Seios Paranasais%';
UPDATE system_templates SET titulo = 'Tomografia Computadorizada das Órbitas' WHERE titulo LIKE 'TC Órbitas%';
UPDATE system_templates SET titulo = 'Tomografia Computadorizada dos Ossos Temporais' WHERE titulo LIKE 'TC Ossos Temporais%' OR titulo LIKE 'TC Mastoides%';
UPDATE system_templates SET titulo = 'Tomografia Computadorizada da ATM' WHERE titulo LIKE 'TC ATM%';
UPDATE system_templates SET titulo = 'Tomografia Computadorizada do Pescoço' WHERE titulo LIKE 'TC Pescoço%';
UPDATE system_templates SET titulo = 'Tomografia Computadorizada da Coluna Cervical' WHERE titulo LIKE 'TC Coluna Cervical%';
UPDATE system_templates SET titulo = 'Tomografia Computadorizada da Coluna Torácica' WHERE titulo LIKE 'TC Coluna Torácica%' OR titulo LIKE 'TC Coluna Dorsal%';
UPDATE system_templates SET titulo = 'Tomografia Computadorizada da Coluna Lombar' WHERE titulo LIKE 'TC Coluna Lombar%' OR titulo LIKE 'TC Coluna Lombossacra%';
UPDATE system_templates SET titulo = 'Tomografia Computadorizada do Tórax' WHERE titulo LIKE 'TC Tórax%';
UPDATE system_templates SET titulo = 'Tomografia Computadorizada do Abdome Superior' WHERE titulo LIKE 'TC Abdome Superior%';
UPDATE system_templates SET titulo = 'Tomografia Computadorizada do Abdome Total' WHERE titulo LIKE 'TC Abdome Total%' OR titulo LIKE 'TC Abdome e Pelve%';
UPDATE system_templates SET titulo = 'Tomografia Computadorizada da Pelve' WHERE titulo LIKE 'TC Pelve%';
UPDATE system_templates SET titulo = 'Tomografia Computadorizada do Ombro' WHERE titulo LIKE 'TC Ombro%';
UPDATE system_templates SET titulo = 'Tomografia Computadorizada do Cotovelo' WHERE titulo LIKE 'TC Cotovelo%';
UPDATE system_templates SET titulo = 'Tomografia Computadorizada do Punho' WHERE titulo LIKE 'TC Punho%';
UPDATE system_templates SET titulo = 'Tomografia Computadorizada da Mão' WHERE titulo LIKE 'TC Mão%';
UPDATE system_templates SET titulo = 'Tomografia Computadorizada do Quadril' WHERE titulo LIKE 'TC Quadril%';
UPDATE system_templates SET titulo = 'Tomografia Computadorizada do Joelho' WHERE titulo LIKE 'TC Joelho%';
UPDATE system_templates SET titulo = 'Tomografia Computadorizada do Tornozelo' WHERE titulo LIKE 'TC Tornozelo%';
UPDATE system_templates SET titulo = 'Tomografia Computadorizada do Pé' WHERE titulo LIKE 'TC Pé%';
UPDATE system_templates SET titulo = 'Angiotomografia Cerebral' WHERE titulo LIKE 'AngioTC%Cerebral%' OR titulo LIKE 'Angio%TC%Cerebral%';
UPDATE system_templates SET titulo = 'Angiotomografia do Pescoço' WHERE titulo LIKE 'AngioTC%Pescoço%' OR titulo LIKE 'Angio%TC%Pescoço%';
UPDATE system_templates SET titulo = 'Angiotomografia do Tórax' WHERE titulo LIKE 'AngioTC%Tórax%' OR titulo LIKE 'Angio%TC%Tórax%' OR titulo LIKE 'TC%Angio%Tórax%';
UPDATE system_templates SET titulo = 'Angiotomografia Coronariana' WHERE titulo LIKE 'AngioTC%Coron%' OR titulo LIKE 'Angio%TC%Coron%' OR titulo LIKE 'TC%Coron%';
UPDATE system_templates SET titulo = 'Angiotomografia da Aorta' WHERE titulo LIKE 'AngioTC%Aort%' OR titulo LIKE 'Angio%TC%Aort%';
UPDATE system_templates SET titulo = 'Angiotomografia Renal' WHERE titulo LIKE 'AngioTC%Renal%' OR titulo LIKE 'Angio%TC%Renal%';
UPDATE system_templates SET titulo = 'Angiotomografia dos Membros Inferiores' WHERE titulo LIKE 'AngioTC%Membros%' OR titulo LIKE 'Angio%TC%Membros%';
UPDATE system_templates SET titulo = 'Urotomografia' WHERE titulo LIKE 'UroTC%' OR titulo LIKE 'Uro%TC%' OR titulo LIKE 'TC%Uro%';
UPDATE system_templates SET titulo = 'Colonoscopia Virtual' WHERE titulo LIKE 'Colonoscopia%Virtual%' OR titulo LIKE 'TC%Colonoscopia%';

-- ============================================
-- FASE 3: Templates RX (45 templates)
-- ============================================

UPDATE system_templates SET titulo = 'Radiografia do Tórax' WHERE titulo LIKE 'RX Tórax%' OR titulo LIKE 'Radiografia%Tórax%';
UPDATE system_templates SET titulo = 'Radiografia do Crânio' WHERE titulo LIKE 'RX Crânio%';
UPDATE system_templates SET titulo = 'Radiografia dos Seios da Face' WHERE titulo LIKE 'RX Seios da Face%' OR titulo LIKE 'RX Seios Paranasais%';
UPDATE system_templates SET titulo = 'Radiografia da Coluna Cervical' WHERE titulo LIKE 'RX Coluna Cervical%' OR (titulo LIKE '%Coluna Cervical%' AND modalidade_codigo = 'RX');
UPDATE system_templates SET titulo = 'Radiografia da Coluna Torácica' WHERE titulo LIKE 'RX Coluna Torácica%' OR titulo LIKE 'RX Coluna Dorsal%' OR (titulo LIKE '%Coluna Torácica%' AND modalidade_codigo = 'RX');
UPDATE system_templates SET titulo = 'Radiografia da Coluna Lombar' WHERE titulo LIKE 'RX Coluna Lombar%' OR titulo LIKE 'RX Coluna Lombossacra%' OR (titulo LIKE '%Coluna Lombar%' AND modalidade_codigo = 'RX');
UPDATE system_templates SET titulo = 'Radiografia Panorâmica da Coluna' WHERE titulo LIKE '%Coluna%Panorâmica%' OR titulo LIKE '%Panorâmica%Coluna%' AND modalidade_codigo = 'RX';
UPDATE system_templates SET titulo = 'Radiografia do Abdome' WHERE titulo LIKE 'RX Abdome%' OR (titulo LIKE 'Abdome%' AND modalidade_codigo = 'RX');
UPDATE system_templates SET titulo = 'Radiografia do Ombro' WHERE titulo LIKE 'RX Ombro%' OR (titulo LIKE 'Ombro%' AND modalidade_codigo = 'RX');
UPDATE system_templates SET titulo = 'Radiografia do Úmero' WHERE titulo LIKE 'RX Úmero%' OR (titulo LIKE 'Úmero%' AND modalidade_codigo = 'RX');
UPDATE system_templates SET titulo = 'Radiografia do Cotovelo' WHERE titulo LIKE 'RX Cotovelo%' OR (titulo LIKE 'Cotovelo%' AND modalidade_codigo = 'RX');
UPDATE system_templates SET titulo = 'Radiografia do Antebraço' WHERE titulo LIKE 'RX Antebraço%' OR (titulo LIKE 'Antebraço%' AND modalidade_codigo = 'RX');
UPDATE system_templates SET titulo = 'Radiografia do Punho' WHERE titulo LIKE 'RX Punho%' OR (titulo LIKE 'Punho%' AND modalidade_codigo = 'RX');
UPDATE system_templates SET titulo = 'Radiografia da Mão' WHERE titulo LIKE 'RX Mão%' OR (titulo LIKE 'Mão%' AND modalidade_codigo = 'RX');
UPDATE system_templates SET titulo = 'Radiografia da Bacia' WHERE titulo LIKE 'RX Bacia%' OR titulo LIKE 'RX Pelve%' OR (titulo LIKE 'Bacia%' AND modalidade_codigo = 'RX');
UPDATE system_templates SET titulo = 'Radiografia do Quadril' WHERE titulo LIKE 'RX Quadril%' OR (titulo LIKE 'Quadril%' AND modalidade_codigo = 'RX');
UPDATE system_templates SET titulo = 'Radiografia do Fêmur' WHERE titulo LIKE 'RX Fêmur%' OR (titulo LIKE 'Fêmur%' AND modalidade_codigo = 'RX');
UPDATE system_templates SET titulo = 'Radiografia do Joelho' WHERE titulo LIKE 'RX Joelho%' OR (titulo LIKE 'Joelho%' AND modalidade_codigo = 'RX');
UPDATE system_templates SET titulo = 'Radiografia da Perna' WHERE titulo LIKE 'RX Perna%' OR (titulo LIKE 'Perna%' AND modalidade_codigo = 'RX');
UPDATE system_templates SET titulo = 'Radiografia do Tornozelo' WHERE titulo LIKE 'RX Tornozelo%' OR (titulo LIKE 'Tornozelo%' AND modalidade_codigo = 'RX');
UPDATE system_templates SET titulo = 'Radiografia do Pé' WHERE titulo LIKE 'RX Pé%' OR (titulo LIKE 'Pé%' AND modalidade_codigo = 'RX');
UPDATE system_templates SET titulo = 'Radiografia do Calcâneo' WHERE titulo LIKE 'RX Calcâneo%' OR (titulo LIKE 'Calcâneo%' AND modalidade_codigo = 'RX');
UPDATE system_templates SET titulo = 'Radiografia Panorâmica dos Membros Inferiores' WHERE titulo LIKE '%Membros Inferiores%Panorâmica%' OR titulo LIKE '%Panorâmica%Membros Inferiores%' AND modalidade_codigo = 'RX';
UPDATE system_templates SET titulo = 'Radiografia com Esofagograma' WHERE titulo LIKE '%Esofagograma%' OR titulo LIKE '%Esôfago%Estômago%Duodeno%' AND modalidade_codigo = 'RX';
UPDATE system_templates SET titulo = 'Radiografia com Enema Opaco' WHERE titulo LIKE '%Enema Opaco%' AND modalidade_codigo = 'RX';
UPDATE system_templates SET titulo = 'Colangiografia Transparieto-hepática' WHERE titulo LIKE '%Colangiografia%Transparieto%' AND modalidade_codigo = 'RX';
UPDATE system_templates SET titulo = 'Urografia Excretora' WHERE titulo LIKE '%Urografia%' AND modalidade_codigo = 'RX';
UPDATE system_templates SET titulo = 'Uretrocistografia Miccional' WHERE titulo LIKE '%Uretrocistografia%' AND modalidade_codigo = 'RX';
UPDATE system_templates SET titulo = 'Histerossalpingografia' WHERE titulo LIKE '%Histerossalpingografia%' AND modalidade_codigo = 'RX';
UPDATE system_templates SET titulo = 'Artrografia' WHERE titulo LIKE '%Artrografia%' AND modalidade_codigo = 'RX';

-- ============================================
-- FASE 4: Templates USG (4 templates com sufixo)
-- ============================================

UPDATE system_templates SET titulo = 'Ultrassonografia do Abdome Total' WHERE titulo LIKE 'Ultrassonografia do Abdome Total -%' OR titulo LIKE 'Ultrassonografia do Abdome Total (%';
UPDATE system_templates SET titulo = 'Ultrassonografia da Tireoide' WHERE titulo LIKE 'Ultrassonografia da Tireoide -%' OR titulo LIKE 'Ultrassonografia da Tireoide (%' OR titulo LIKE 'Ultrassonografia%Tireoide%TI-RADS%';
UPDATE system_templates SET titulo = 'Ultrassonografia das Mamas' WHERE titulo LIKE 'Ultrassonografia das Mamas -%' OR titulo LIKE 'Ultrassonografia das Mamas (%' OR titulo LIKE 'Ultrassonografia%Mama%BI-RADS%';
UPDATE system_templates SET titulo = 'Ultrassonografia Obstétrica' WHERE titulo LIKE 'Ultrassonografia Obstétrica -%' OR titulo LIKE 'Ultrassonografia Obstétrica (%';

-- ============================================
-- FASE 5: Templates MG (1 template com sufixo)
-- ============================================

UPDATE system_templates SET titulo = 'Mamografia Bilateral' WHERE titulo LIKE 'Mamografia Bilateral -%' OR titulo LIKE 'Mamografia Bilateral (%';