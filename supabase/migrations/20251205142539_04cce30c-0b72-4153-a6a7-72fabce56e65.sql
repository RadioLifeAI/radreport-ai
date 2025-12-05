-- LI-RADS US Surveillance v2024 - Dynamic Options
-- Sistema de Vigilância para CHC com Ultrassonografia

-- ============= POPULAÇÃO DE RISCO =============
INSERT INTO public.rads_text_options (sistema_codigo, categoria, valor, label, texto, ordem, ativo) VALUES
('LIRADS_US', 'populacao_risco', 'cirrose', 'Cirrose Hepática', 'paciente com cirrose hepática', 1, true),
('LIRADS_US', 'populacao_risco', 'hepatite_b', 'Hepatite B Crônica', 'paciente com infecção crônica pelo vírus da hepatite B', 2, true),
('LIRADS_US', 'populacao_risco', 'hepatite_c', 'Hepatite C Crônica', 'paciente com infecção crônica pelo vírus da hepatite C', 3, true),
('LIRADS_US', 'populacao_risco', 'mafld', 'Doença Hepática Gordurosa', 'paciente com doença hepática gordurosa associada a disfunção metabólica (MAFLD)', 4, true),
('LIRADS_US', 'populacao_risco', 'outro', 'Outro Fator de Risco', 'paciente com alto risco para carcinoma hepatocelular', 5, true);

-- ============= ETIOLOGIA DA CIRROSE =============
INSERT INTO public.rads_text_options (sistema_codigo, categoria, valor, label, texto, ordem, ativo) VALUES
('LIRADS_US', 'etiologia_cirrose', 'alcoolica', 'Alcoólica', 'etiologia alcoólica', 1, true),
('LIRADS_US', 'etiologia_cirrose', 'hcv', 'Hepatite C', 'etiologia viral (HCV)', 2, true),
('LIRADS_US', 'etiologia_cirrose', 'hbv', 'Hepatite B', 'etiologia viral (HBV)', 3, true),
('LIRADS_US', 'etiologia_cirrose', 'nash', 'NASH/Esteatohepatite', 'etiologia metabólica (NASH)', 4, true),
('LIRADS_US', 'etiologia_cirrose', 'hemocromatose', 'Hemocromatose', 'etiologia por hemocromatose', 5, true),
('LIRADS_US', 'etiologia_cirrose', 'cbp', 'Cirrose Biliar Primária', 'cirrose biliar primária', 6, true),
('LIRADS_US', 'etiologia_cirrose', 'cep', 'Colangite Esclerosante', 'colangite esclerosante primária', 7, true),
('LIRADS_US', 'etiologia_cirrose', 'outra', 'Outra', 'outra etiologia', 8, true);

-- ============= CLASSIFICAÇÃO CHILD-PUGH =============
INSERT INTO public.rads_text_options (sistema_codigo, categoria, valor, label, texto, ordem, ativo) VALUES
('LIRADS_US', 'child_pugh', 'A', 'Child-Pugh A', 'Child-Pugh A (doença hepática compensada)', 1, true),
('LIRADS_US', 'child_pugh', 'B', 'Child-Pugh B', 'Child-Pugh B (comprometimento funcional significativo)', 2, true),
('LIRADS_US', 'child_pugh', 'C', 'Child-Pugh C', 'Child-Pugh C (doença hepática descompensada)', 3, true);

-- ============= STATUS AFP =============
INSERT INTO public.rads_text_options (sistema_codigo, categoria, valor, label, texto, ordem, ativo) VALUES
('LIRADS_US', 'afp_status', 'normal', 'Normal', 'AFP dentro dos limites normais', 1, true),
('LIRADS_US', 'afp_status', 'elevada', 'Elevada', 'AFP elevada', 2, true),
('LIRADS_US', 'afp_status', 'crescente', 'Crescente', 'AFP com tendência de elevação', 3, true),
('LIRADS_US', 'afp_status', 'nao_disponivel', 'Não Disponível', 'AFP não disponível', 4, true);

-- ============= ASPECTO DO PARÊNQUIMA =============
INSERT INTO public.rads_text_options (sistema_codigo, categoria, valor, label, texto, ordem, ativo) VALUES
('LIRADS_US', 'aspecto_parenquima', 'homogeneo', 'Homogêneo', 'parênquima hepático de ecotextura homogênea', 1, true),
('LIRADS_US', 'aspecto_parenquima', 'heterogeneo', 'Heterogêneo', 'parênquima hepático de ecotextura heterogênea', 2, true),
('LIRADS_US', 'aspecto_parenquima', 'esteatose', 'Esteatose Difusa', 'parênquima hepático com aumento difuso da ecogenicidade, sugestivo de esteatose', 3, true),
('LIRADS_US', 'aspecto_parenquima', 'nodular', 'Aspecto Nodular', 'parênquima hepático de aspecto nodular/cirrótico', 4, true);

-- ============= TAMANHO DO FÍGADO =============
INSERT INTO public.rads_text_options (sistema_codigo, categoria, valor, label, texto, ordem, ativo) VALUES
('LIRADS_US', 'tamanho_figado', 'normal', 'Normal', 'dimensões normais', 1, true),
('LIRADS_US', 'tamanho_figado', 'aumentado', 'Hepatomegalia', 'aumentado de volume', 2, true),
('LIRADS_US', 'tamanho_figado', 'reduzido', 'Reduzido', 'reduzido de volume', 3, true);

-- ============= TIPO DE OBSERVAÇÃO =============
INSERT INTO public.rads_text_options (sistema_codigo, categoria, valor, label, texto, ordem, ativo) VALUES
('LIRADS_US', 'tipo_observacao', 'nenhuma', 'Nenhuma Observação', 'sem observações focais', 1, true),
('LIRADS_US', 'tipo_observacao', 'cisto_simples', 'Cisto Simples', 'cisto simples', 2, true),
('LIRADS_US', 'tipo_observacao', 'hemangioma', 'Hemangioma Confirmado', 'hemangioma previamente confirmado', 3, true),
('LIRADS_US', 'tipo_observacao', 'esteatose_focal', 'Esteatose Focal', 'área de esteatose focal ou preservação focal de parênquima', 4, true),
('LIRADS_US', 'tipo_observacao', 'nodulo_menor_10', 'Nódulo < 10mm', 'nódulo/observação com maior diâmetro menor que 10 mm', 5, true),
('LIRADS_US', 'tipo_observacao', 'nodulo_maior_10', 'Nódulo ≥ 10mm', 'nódulo/observação com maior diâmetro igual ou maior que 10 mm', 6, true),
('LIRADS_US', 'tipo_observacao', 'distorcao', 'Distorção Parenquimatosa', 'área de distorção do parênquima hepático', 7, true),
('LIRADS_US', 'tipo_observacao', 'trombo', 'Trombo Novo', 'trombo vascular hepático ou portal novo', 8, true);

-- ============= LOCALIZAÇÃO DA OBSERVAÇÃO =============
INSERT INTO public.rads_text_options (sistema_codigo, categoria, valor, label, texto, ordem, ativo) VALUES
('LIRADS_US', 'localizacao_observacao', 'lobo_direito', 'Lobo Direito', 'no lobo direito', 1, true),
('LIRADS_US', 'localizacao_observacao', 'lobo_esquerdo', 'Lobo Esquerdo', 'no lobo esquerdo', 2, true),
('LIRADS_US', 'localizacao_observacao', 'caudado', 'Lobo Caudado', 'no lobo caudado', 3, true),
('LIRADS_US', 'localizacao_observacao', 'segmento_I', 'Segmento I', 'no segmento I', 4, true),
('LIRADS_US', 'localizacao_observacao', 'segmento_II', 'Segmento II', 'no segmento II', 5, true),
('LIRADS_US', 'localizacao_observacao', 'segmento_III', 'Segmento III', 'no segmento III', 6, true),
('LIRADS_US', 'localizacao_observacao', 'segmento_IV', 'Segmento IV', 'no segmento IV', 7, true),
('LIRADS_US', 'localizacao_observacao', 'segmento_V', 'Segmento V', 'no segmento V', 8, true),
('LIRADS_US', 'localizacao_observacao', 'segmento_VI', 'Segmento VI', 'no segmento VI', 9, true),
('LIRADS_US', 'localizacao_observacao', 'segmento_VII', 'Segmento VII', 'no segmento VII', 10, true),
('LIRADS_US', 'localizacao_observacao', 'segmento_VIII', 'Segmento VIII', 'no segmento VIII', 11, true);

-- ============= ECOGENICIDADE DA OBSERVAÇÃO =============
INSERT INTO public.rads_text_options (sistema_codigo, categoria, valor, label, texto, ordem, ativo) VALUES
('LIRADS_US', 'ecogenicidade_observacao', 'hipo', 'Hipoecogênica', 'hipoecogênica', 1, true),
('LIRADS_US', 'ecogenicidade_observacao', 'iso', 'Isoecogênica', 'isoecogênica', 2, true),
('LIRADS_US', 'ecogenicidade_observacao', 'hiper', 'Hiperecogênica', 'hiperecogênica', 3, true),
('LIRADS_US', 'ecogenicidade_observacao', 'mista', 'Ecogenicidade Mista', 'de ecogenicidade mista', 4, true);

-- ============= VIS SCORE =============
INSERT INTO public.rads_text_options (sistema_codigo, categoria, valor, label, texto, ordem, ativo) VALUES
('LIRADS_US', 'vis_score', 'A', 'VIS-A - Adequada', 'Sem ou mínimas limitações que são improváveis de afetar a sensibilidade', 1, true),
('LIRADS_US', 'vis_score', 'B', 'VIS-B - Moderada', 'Limitações moderadas que podem obscurecer pequenas observações (<10 mm)', 2, true),
('LIRADS_US', 'vis_score', 'C', 'VIS-C - Limitada', 'Limitações severas que limitam significativamente a detecção de observações (>50% não visualizado)', 3, true);

-- ============= LIMITAÇÕES DE VISUALIZAÇÃO =============
INSERT INTO public.rads_text_options (sistema_codigo, categoria, valor, label, texto, ordem, ativo) VALUES
('LIRADS_US', 'limitacao_vis', 'atenuacao', 'Atenuação Sonora', 'atenuação do feixe sonoro por esteatose ou cirrose', 1, true),
('LIRADS_US', 'limitacao_vis', 'cirrose_nodular', 'Parênquima Nodular', 'heterogeneidade do parênquima cirrótico limitando identificação de lesões focais', 2, true),
('LIRADS_US', 'limitacao_vis', 'obesidade', 'Obesidade', 'biotipo do paciente com parede abdominal espessa', 3, true),
('LIRADS_US', 'limitacao_vis', 'gas', 'Interposição Gasosa', 'interposição de gás intestinal', 4, true),
('LIRADS_US', 'limitacao_vis', 'nao_colaboracao', 'Não Colaboração', 'limitação por não colaboração do paciente', 5, true);

-- ============= TIPO DE TROMBO =============
INSERT INTO public.rads_text_options (sistema_codigo, categoria, valor, label, texto, ordem, ativo) VALUES
('LIRADS_US', 'trombo_tipo', 'nenhum', 'Nenhum', 'sem evidência de trombose', 1, true),
('LIRADS_US', 'trombo_tipo', 'portal', 'Trombose Portal', 'trombose da veia porta', 2, true),
('LIRADS_US', 'trombo_tipo', 'hepatica', 'Trombose Hepática', 'trombose de veia hepática', 3, true);

-- ============= LOCALIZAÇÃO DO TROMBO =============
INSERT INTO public.rads_text_options (sistema_codigo, categoria, valor, label, texto, ordem, ativo) VALUES
('LIRADS_US', 'trombo_localizacao', 'principal', 'Tronco Principal', 'no tronco principal', 1, true),
('LIRADS_US', 'trombo_localizacao', 'ramo_direito', 'Ramo Direito', 'no ramo direito', 2, true),
('LIRADS_US', 'trombo_localizacao', 'ramo_esquerdo', 'Ramo Esquerdo', 'no ramo esquerdo', 3, true),
('LIRADS_US', 'trombo_localizacao', 'periferico', 'Ramos Periféricos', 'em ramos periféricos', 4, true);

-- ============= COMPARATIVO =============
INSERT INTO public.rads_text_options (sistema_codigo, categoria, valor, label, texto, ordem, ativo) VALUES
('LIRADS_US', 'comparativo', 'sem', 'Sem Exame Anterior', 'sem exame anterior disponível para comparação', 1, true),
('LIRADS_US', 'comparativo', 'estavel', 'Estável', 'estável em comparação com exame anterior', 2, true),
('LIRADS_US', 'comparativo', 'novo', 'Achado Novo', 'novo em comparação com exame anterior', 3, true),
('LIRADS_US', 'comparativo', 'cresceu', 'Aumento', 'com aumento em comparação com exame anterior', 4, true),
('LIRADS_US', 'comparativo', 'reduziu', 'Redução', 'com redução em comparação com exame anterior', 5, true);

-- ============= CATEGORIAS LI-RADS =============
INSERT INTO public.rads_text_options (sistema_codigo, categoria, valor, label, texto, pontos, suspeicao, ordem, ativo) VALUES
('LIRADS_US', 'lirads_categoria', 'US-1', 'US-1 - Negativo', 'Sem observação ou observação definitivamente benigna. Repetir ultrassonografia em 6 meses.', 1, 'benigno', 1, true),
('LIRADS_US', 'lirads_categoria', 'US-2', 'US-2 - Sublimiar', 'Observação < 10 mm não definitivamente benigna. Repetir ultrassonografia em 3-6 meses, até 2 vezes.', 2, 'indeterminado', 2, true),
('LIRADS_US', 'lirads_categoria', 'US-3', 'US-3 - Positivo', 'Observação ≥ 10 mm não definitivamente benigna, distorção parenquimatosa, ou trombo novo. Avaliação com TC, RM ou CEUS multifásico.', 3, 'suspeito', 3, true);