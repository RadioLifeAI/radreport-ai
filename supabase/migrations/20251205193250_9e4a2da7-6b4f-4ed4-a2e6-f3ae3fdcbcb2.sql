-- =====================================================
-- LUNG-RADS: Segmentação Pulmonar Completa + Estações Linfonodais IASLC
-- =====================================================

-- =====================================================
-- PARTE 1: Segmentos Broncopulmonares (19 registros)
-- =====================================================

-- Pulmão Direito - Lobo Superior
INSERT INTO rads_text_options (sistema_codigo, categoria, valor, label, texto, ordem, ativo)
VALUES 
('LUNG_RADS', 'segmento_nodulo', 's1_d', 'S1 - Apical direito', 'no segmento apical (S1) do lobo superior direito', 1, true),
('LUNG_RADS', 'segmento_nodulo', 's2_d', 'S2 - Posterior direito', 'no segmento posterior (S2) do lobo superior direito', 2, true),
('LUNG_RADS', 'segmento_nodulo', 's3_d', 'S3 - Anterior direito', 'no segmento anterior (S3) do lobo superior direito', 3, true),

-- Pulmão Direito - Lobo Médio
('LUNG_RADS', 'segmento_nodulo', 's4_d', 'S4 - Lateral do lobo médio', 'no segmento lateral (S4) do lobo médio', 4, true),
('LUNG_RADS', 'segmento_nodulo', 's5_d', 'S5 - Medial do lobo médio', 'no segmento medial (S5) do lobo médio', 5, true),

-- Pulmão Direito - Lobo Inferior
('LUNG_RADS', 'segmento_nodulo', 's6_d', 'S6 - Superior do LID', 'no segmento superior (S6) do lobo inferior direito', 6, true),
('LUNG_RADS', 'segmento_nodulo', 's7_d', 'S7 - Basal medial direito', 'no segmento basal medial (S7) do lobo inferior direito', 7, true),
('LUNG_RADS', 'segmento_nodulo', 's8_d', 'S8 - Basal anterior direito', 'no segmento basal anterior (S8) do lobo inferior direito', 8, true),
('LUNG_RADS', 'segmento_nodulo', 's9_d', 'S9 - Basal lateral direito', 'no segmento basal lateral (S9) do lobo inferior direito', 9, true),
('LUNG_RADS', 'segmento_nodulo', 's10_d', 'S10 - Basal posterior direito', 'no segmento basal posterior (S10) do lobo inferior direito', 10, true),

-- Pulmão Esquerdo - Lobo Superior
('LUNG_RADS', 'segmento_nodulo', 's1_2_e', 'S1+2 - Ápico-posterior esquerdo', 'no segmento ápico-posterior (S1+2) do lobo superior esquerdo', 11, true),
('LUNG_RADS', 'segmento_nodulo', 's3_e', 'S3 - Anterior esquerdo', 'no segmento anterior (S3) do lobo superior esquerdo', 12, true),

-- Língula
('LUNG_RADS', 'segmento_nodulo', 's4_e', 'S4 - Língula superior', 'no segmento superior (S4) da língula', 13, true),
('LUNG_RADS', 'segmento_nodulo', 's5_e', 'S5 - Língula inferior', 'no segmento inferior (S5) da língula', 14, true),

-- Pulmão Esquerdo - Lobo Inferior
('LUNG_RADS', 'segmento_nodulo', 's6_e', 'S6 - Superior do LIE', 'no segmento superior (S6) do lobo inferior esquerdo', 15, true),
('LUNG_RADS', 'segmento_nodulo', 's7_8_e', 'S7+8 - Basal ântero-medial esquerdo', 'no segmento basal ântero-medial (S7+8) do lobo inferior esquerdo', 16, true),
('LUNG_RADS', 'segmento_nodulo', 's9_e', 'S9 - Basal lateral esquerdo', 'no segmento basal lateral (S9) do lobo inferior esquerdo', 17, true),
('LUNG_RADS', 'segmento_nodulo', 's10_e', 'S10 - Basal posterior esquerdo', 'no segmento basal posterior (S10) do lobo inferior esquerdo', 18, true);

-- =====================================================
-- PARTE 2: Estações Linfonodais IASLC (16 registros)
-- =====================================================

INSERT INTO rads_text_options (sistema_codigo, categoria, valor, label, texto, ordem, ativo)
VALUES 
('LUNG_RADS', 'localizacao_linfonodo', 'estacao_1', 'Estação 1 - Supraclavicular', 'na região supraclavicular (Estação 1)', 1, true),
('LUNG_RADS', 'localizacao_linfonodo', 'estacao_2r', 'Estação 2R - Paratraqueal alta D', 'na região paratraqueal alta direita (Estação 2R)', 2, true),
('LUNG_RADS', 'localizacao_linfonodo', 'estacao_2l', 'Estação 2L - Paratraqueal alta E', 'na região paratraqueal alta esquerda (Estação 2L)', 3, true),
('LUNG_RADS', 'localizacao_linfonodo', 'estacao_3a', 'Estação 3A - Pré-vascular', 'na região pré-vascular (Estação 3A)', 4, true),
('LUNG_RADS', 'localizacao_linfonodo', 'estacao_3p', 'Estação 3P - Retrotraqueal', 'na região retrotraqueal (Estação 3P)', 5, true),
('LUNG_RADS', 'localizacao_linfonodo', 'estacao_4r', 'Estação 4R - Paratraqueal baixa D', 'na região paratraqueal baixa direita (Estação 4R)', 6, true),
('LUNG_RADS', 'localizacao_linfonodo', 'estacao_4l', 'Estação 4L - Paratraqueal baixa E', 'na região paratraqueal baixa esquerda (Estação 4L)', 7, true),
('LUNG_RADS', 'localizacao_linfonodo', 'estacao_5', 'Estação 5 - Janela aortopulmonar', 'na janela aortopulmonar (Estação 5)', 8, true),
('LUNG_RADS', 'localizacao_linfonodo', 'estacao_6', 'Estação 6 - Para-aórtica', 'na região para-aórtica (Estação 6)', 9, true),
('LUNG_RADS', 'localizacao_linfonodo', 'estacao_7', 'Estação 7 - Subcarinal', 'na região subcarinal (Estação 7)', 10, true),
('LUNG_RADS', 'localizacao_linfonodo', 'estacao_8', 'Estação 8 - Paraesofágica', 'na região paraesofágica (Estação 8)', 11, true),
('LUNG_RADS', 'localizacao_linfonodo', 'estacao_9', 'Estação 9 - Ligamento pulmonar', 'na região do ligamento pulmonar (Estação 9)', 12, true),
('LUNG_RADS', 'localizacao_linfonodo', 'estacao_10r', 'Estação 10R - Hilar direita', 'na região hilar direita (Estação 10R)', 13, true),
('LUNG_RADS', 'localizacao_linfonodo', 'estacao_10l', 'Estação 10L - Hilar esquerda', 'na região hilar esquerda (Estação 10L)', 14, true),
('LUNG_RADS', 'localizacao_linfonodo', 'estacao_11', 'Estação 11 - Interlobar', 'na região interlobar (Estação 11)', 15, true),
('LUNG_RADS', 'localizacao_linfonodo', 'estacao_12', 'Estação 12 - Lobar', 'na região lobar (Estação 12)', 16, true);