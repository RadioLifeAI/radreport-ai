-- =====================================================
-- MIGRAÇÃO: Otimização de Regiões Anatômicas para Matching Contextual
-- Objetivo: 100% das frases com regiao_anatomica_id preenchido
-- =====================================================

-- =====================================================
-- FASE 1: Criar Novas Regiões Anatômicas
-- =====================================================

INSERT INTO regioes_anatomicas (id, codigo, nome, ativa, created_at, updated_at) VALUES
  ('a1b2c3d4-1111-4444-8888-111111111111', 'CERVICAL', 'Região Cervical', true, now(), now()),
  ('a1b2c3d4-2222-4444-8888-222222222222', 'VASCULAR', 'Vascular', true, now(), now()),
  ('a1b2c3d4-3333-4444-8888-333333333333', 'OBSTETRICO', 'Obstétrico', true, now(), now()),
  ('a1b2c3d4-4444-4444-8888-444444444444', 'PARTES_MOLES', 'Partes Moles', true, now(), now()),
  ('a1b2c3d4-5555-4444-8888-555555555555', 'ESCROTO', 'Bolsa Escrotal', true, now(), now()),
  ('a1b2c3d4-6666-4444-8888-666666666666', 'GASTROINTESTINAL', 'Gastrointestinal', true, now(), now())
ON CONFLICT (codigo) DO NOTHING;

-- =====================================================
-- FASE 2: Mapear Frases para Regiões por Categoria
-- =====================================================

-- 2.1 Extremidade Superior (Ombro, Cotovelo, Punho/Mão)
UPDATE frases_modelo 
SET regiao_anatomica_id = '6b01a549-7805-4fed-9421-860186953c9a',
    updated_at = now()
WHERE categoria IN ('Ombro', 'Cotovelo', 'Punho/Mão', 'Punho', 'Mão', 'Braço', 'Antebraço') 
  AND regiao_anatomica_id IS NULL;

-- 2.2 Extremidade Inferior (Joelho, Tornozelo/Pé, Quadril, Coxa)
UPDATE frases_modelo 
SET regiao_anatomica_id = '5ddca035-4b4f-44d2-921a-f8e1b67ad234',
    updated_at = now()
WHERE categoria IN ('Joelho', 'Tornozelo/Pé', 'Tornozelo', 'Pé', 'Coxa', 'Perna', 'Calcâneo') 
  AND regiao_anatomica_id IS NULL;

-- 2.3 Pelve (Quadril, Transvaginal, Próstata)
UPDATE frases_modelo 
SET regiao_anatomica_id = '554f0d0b-360d-4513-92a2-e31231091c1c',
    updated_at = now()
WHERE categoria IN ('Quadril', 'Transvaginal', 'Próstata', 'Bexiga', 'Útero', 'Ovário', 'Endométrio') 
  AND regiao_anatomica_id IS NULL;

-- 2.4 Coluna (Vertebral, Lombar, Cervical vertebral)
UPDATE frases_modelo 
SET regiao_anatomica_id = 'c9017f1b-e0cf-4a36-b093-b51a69f849e5',
    updated_at = now()
WHERE categoria IN ('Vertebral', 'Coluna', 'Lombar', 'Dorsal', 'Sacro') 
  AND regiao_anatomica_id IS NULL;

-- 2.5 Região Cervical (Tireoide, Carótidas, Parótida, Linfonodos cervicais)
UPDATE frases_modelo 
SET regiao_anatomica_id = 'a1b2c3d4-1111-4444-8888-111111111111',
    updated_at = now()
WHERE categoria IN ('Tireóide', 'Tireoide', 'Carótidas', 'Parótida', 'Adenomegalias Cervicais', 
                    'Adenopatias Cervicais', 'Linfonodo Cervical', 'Linfonodos Cervicais',
                    'Pescoço', 'Submandibular') 
  AND regiao_anatomica_id IS NULL;

-- 2.6 Vascular (Venoso, Arterial)
UPDATE frases_modelo 
SET regiao_anatomica_id = 'a1b2c3d4-2222-4444-8888-222222222222',
    updated_at = now()
WHERE categoria IN ('Venoso Membros Inferiores', 'Venoso Membros Superiores', 
                    'Arterial', 'Doppler', 'Oftálmica') 
  AND regiao_anatomica_id IS NULL;

-- 2.7 Obstétrico
UPDATE frases_modelo 
SET regiao_anatomica_id = 'a1b2c3d4-3333-4444-8888-333333333333',
    updated_at = now()
WHERE categoria IN ('Obstétrico', 'Obstetrico', 'Fetal', 'Gestacional') 
  AND regiao_anatomica_id IS NULL;

-- 2.8 Partes Moles
UPDATE frases_modelo 
SET regiao_anatomica_id = 'a1b2c3d4-4444-4444-8888-444444444444',
    updated_at = now()
WHERE categoria IN ('Partes Moles', 'Músculo', 'Muscular', 'Subcutâneo', 'Pele') 
  AND regiao_anatomica_id IS NULL;

-- 2.9 Escroto/Testículo
UPDATE frases_modelo 
SET regiao_anatomica_id = 'a1b2c3d4-5555-4444-8888-555555555555',
    updated_at = now()
WHERE categoria IN ('Achado Epididimário', 'Achado Testicular', 'Nódulo Testicular', 
                    'Nódulos Testiculares', 'Massa Testicular', 'Torção Testicular',
                    'Varicocele', 'Microlitíase', 'Rete Testis', 'Hematoma/Hematocele',
                    'Inflamação Testículo/Epidídimo', 'Bolsa Escrotal', 'Testículo', 'Escroto') 
  AND regiao_anatomica_id IS NULL;

-- 2.10 Abdome (categorias abdominais restantes)
UPDATE frases_modelo 
SET regiao_anatomica_id = '88f1d5c0-825b-4e9c-8660-eed1e542a3b2',
    updated_at = now()
WHERE categoria IN ('Parede Abdominal', 'Fígado', 'Vesícula', 'Baço', 'Pâncreas', 
                    'Rins', 'Rim', 'Adrenal', 'Retroperitônio', 'Aorta Abdominal',
                    'Vias Biliares', 'Hepatobiliar', 'Ascite', 'Líquido Livre') 
  AND regiao_anatomica_id IS NULL;

-- 2.11 Tórax
UPDATE frases_modelo 
SET regiao_anatomica_id = 'd5a6af0a-fb8e-46b5-b350-99906cd49689',
    updated_at = now()
WHERE categoria IN ('Tórax', 'Pulmão', 'Pleura', 'Mediastino', 'Cardíaco', 'Coração') 
  AND regiao_anatomica_id IS NULL;

-- 2.12 Mama
UPDATE frases_modelo 
SET regiao_anatomica_id = '5c71a86b-c8a2-4db5-9d7e-bc90e6efc843',
    updated_at = now()
WHERE categoria IN ('Mama', 'Mamas', 'Axilar', 'Axila') 
  AND regiao_anatomica_id IS NULL;

-- 2.13 Crânio/Face
UPDATE frases_modelo 
SET regiao_anatomica_id = '4c79d8eb-af68-418b-83fc-c3b80cc57ac6',
    updated_at = now()
WHERE categoria IN ('Crânio', 'Face', 'Órbita', 'Seios Paranasais', 'ATM', 'Ouvido') 
  AND regiao_anatomica_id IS NULL;

-- 2.14 Gastrointestinal
UPDATE frases_modelo 
SET regiao_anatomica_id = 'a1b2c3d4-6666-4444-8888-666666666666',
    updated_at = now()
WHERE categoria IN ('Esôfago', 'Estômago', 'Duodeno', 'Intestino', 'Cólon', 'Reto', 'Apêndice') 
  AND regiao_anatomica_id IS NULL;

-- =====================================================
-- FASE 3: Normalizar regiao_codigo em Templates
-- =====================================================

-- Normalizar para 'abdome'
UPDATE system_templates 
SET regiao_codigo = 'abdome', updated_at = now()
WHERE LOWER(regiao_codigo) IN ('abdome', 'abdomen', 'abd_pelve', 'abd_sup', 'abdome_pelve', 
                               'abdome_superior', 'abdome_superior_pelve', 'abdome_total', 
                               'aparelho_urinario', 'uro', 'figado', 'rins', 'baco', 
                               'pancreas', 'vesicula', 'vias_biliares', 'retroperitonio');

-- Normalizar para 'pelve'
UPDATE system_templates 
SET regiao_codigo = 'pelve', updated_at = now()
WHERE LOWER(regiao_codigo) IN ('pelve', 'pelvis', 'pelve_colo_uterino', 'pelve_endometriose', 
                               'pelve_fístula_perianal', 'pelve_masculina', 'prostata', 
                               'bacia', 'utero', 'ovarios', 'bexiga');

-- Normalizar para 'torax'
UPDATE system_templates 
SET regiao_codigo = 'torax', updated_at = now()
WHERE LOWER(regiao_codigo) IN ('torax', 'tórax', 'tórax_parede', 'torax_tromboembolismo', 
                               'cardiaco', 'coração', 'pulmao', 'pulmões', 'mediastino', 'pleura');

-- Normalizar para 'cranio'
UPDATE system_templates 
SET regiao_codigo = 'cranio', updated_at = now()
WHERE LOWER(regiao_codigo) IN ('cranio', 'crânio', 'encéfalo', 'encefalo', 'sela_turcica', 
                               'ossos_temporais', 'ouvidos', 'face', 'seios_face', 
                               'seios_paranasais', 'orbitas', 'órbitas', 'cavum', 'mandibula', 
                               'osso_malar', 'apofises_estiloides', 'arcos_zigomaticos', 'atm', 
                               'articulacoes_temporomandibulares', 'hipofise');

-- Normalizar para 'coluna'
UPDATE system_templates 
SET regiao_codigo = 'coluna', updated_at = now()
WHERE LOWER(regiao_codigo) IN ('coluna', 'coluna_cervical', 'coluna_dorsal', 'coluna_lombar', 
                               'coluna_lombar_femur', 'coluna_lombossacra', 'coluna_panoramica', 
                               'coluna_toracica', 'coluna_vertebral', 'sacrococcix', 
                               'sacroccocigea', 'sacroiliacas', 'articulacoes_sacroiliacas', 
                               'articulações_sacroilíacas');

-- Normalizar para 'cervical'
UPDATE system_templates 
SET regiao_codigo = 'cervical', updated_at = now()
WHERE LOWER(regiao_codigo) IN ('pescoco', 'pescoço', 'arterial_cervical', 'venosa_cervical',
                               'angio_arterial_cervical', 'tireoide', 'parotida', 'carotidas');

-- Normalizar para 'mama'
UPDATE system_templates 
SET regiao_codigo = 'mama', updated_at = now()
WHERE LOWER(regiao_codigo) IN ('mama', 'mamas', 'axilar', 'axila');

-- Normalizar para 'ext_superior'
UPDATE system_templates 
SET regiao_codigo = 'ext_superior', updated_at = now()
WHERE LOWER(regiao_codigo) IN ('ombro', 'cotovelo', 'cotovolo', 'punho', 'mao', 'mão', 
                               'mao_polegar', 'braco', 'braco_direito', 'antebraco', 
                               'plexo_braquial', 'escapula', 'clavicula');

-- Normalizar para 'ext_inferior'
UPDATE system_templates 
SET regiao_codigo = 'ext_inferior', updated_at = now()
WHERE LOWER(regiao_codigo) IN ('joelho', 'tornozelo', 'pe', 'pé', 'calcaneo', 'calcâneo',
                               'perna', 'coxa', 'patela', 'coxofemoral', 'quadril', 
                               'membros_inferiores', 'escanometria', 'plexo_sacral',
                               'angio_arterial_membros_inferiores', 'femur');

-- Normalizar para 'vascular'
UPDATE system_templates 
SET regiao_codigo = 'vascular', updated_at = now()
WHERE LOWER(regiao_codigo) IN ('aorta_abdominal_iliacas', 'aorta_toracica_abdominal', 
                               'aorta_toracica_tavi', 'veias_pulmonares_atrio_esquerdo',
                               'escore_calcio_coronarias', 'escore_calcio_coronarias_detalhado',
                               'arterial_intracraniana', 'angio_arterial_intracraniana',
                               'venosa_intracraniana', 'doppler', 'angiografia');

-- Normalizar para 'obstetrico'
UPDATE system_templates 
SET regiao_codigo = 'obstetrico', updated_at = now()
WHERE LOWER(regiao_codigo) IN ('obstetrico', 'obstétrico', 'fetal', 'gestacional');

-- Normalizar para 'escroto'
UPDATE system_templates 
SET regiao_codigo = 'escroto', updated_at = now()
WHERE LOWER(regiao_codigo) IN ('bolsa_escrotal', 'bolsa_testicular', 'testiculo', 'escroto');

-- Normalizar para 'partes_moles'
UPDATE system_templates 
SET regiao_codigo = 'partes_moles', updated_at = now()
WHERE LOWER(regiao_codigo) IN ('partes_moles', 'subcutaneo', 'muscular');

-- Normalizar para 'gastrointestinal'
UPDATE system_templates 
SET regiao_codigo = 'gastrointestinal', updated_at = now()
WHERE LOWER(regiao_codigo) IN ('colangio', 'colangiografia', 'entero', 'enterografia',
                               'esofago_estomago_duodeno', 'enema_opaco', 'intestino');

-- =====================================================
-- FASE 4: Adicionar Campo Desnormalizado regiao_codigo em Frases
-- =====================================================

-- Adicionar coluna se não existir
ALTER TABLE frases_modelo ADD COLUMN IF NOT EXISTS regiao_codigo VARCHAR(50);

-- Popular campo a partir da FK
UPDATE frases_modelo fm
SET regiao_codigo = LOWER(ra.codigo),
    updated_at = now()
FROM regioes_anatomicas ra
WHERE fm.regiao_anatomica_id = ra.id
  AND (fm.regiao_codigo IS NULL OR fm.regiao_codigo = '');

-- =====================================================
-- FASE 5: Adicionar Índices para Performance
-- =====================================================

-- Índice para matching contextual em frases
CREATE INDEX IF NOT EXISTS idx_frases_modelo_regiao_codigo ON frases_modelo(regiao_codigo);
CREATE INDEX IF NOT EXISTS idx_frases_modelo_modalidade_regiao ON frases_modelo(modalidade_codigo, regiao_codigo);

-- Índice para matching contextual em templates
CREATE INDEX IF NOT EXISTS idx_system_templates_regiao_codigo ON system_templates(regiao_codigo);
CREATE INDEX IF NOT EXISTS idx_system_templates_modalidade_regiao ON system_templates(modalidade_codigo, regiao_codigo);

-- =====================================================
-- VERIFICAÇÃO: Consulta de validação
-- =====================================================
-- SELECT 
--   COUNT(*) as total_frases,
--   COUNT(regiao_anatomica_id) as com_regiao,
--   COUNT(*) - COUNT(regiao_anatomica_id) as sem_regiao,
--   ROUND(COUNT(regiao_anatomica_id)::numeric / COUNT(*)::numeric * 100, 1) as percentual_mapeado
-- FROM frases_modelo WHERE ativa = true;