-- O-RADS US v2022 - Sistema Dinâmico
-- ~100 registros para rads_text_options

-- Status Menopausal
INSERT INTO rads_text_options (sistema_codigo, categoria, valor, label, texto, ordem, ativo) VALUES
('ORADS_US', 'status_menopausal', 'pre', 'Pré-menopausa', 'Paciente em período pré-menopausa', 1, true),
('ORADS_US', 'status_menopausal', 'pos', 'Pós-menopausa', 'Paciente em período pós-menopausa (amenorreia ≥1 ano)', 2, true),
('ORADS_US', 'status_menopausal', 'incerto', 'Incerto / >50 anos', 'Status menopausal incerto ou idade >50 anos', 3, true),

-- Tipos de Lesão O-RADS (9 tipos principais)
('ORADS_US', 'tipo_lesao', 'cisto_simples', 'Cisto Simples', 'Cisto anecóico, parede fina lisa, sem componentes sólidos internos', 1, true),
('ORADS_US', 'tipo_lesao', 'cisto_unilocular', 'Cisto Unilocular Não-Simples', 'Cisto unilocular com conteúdo interno (hemorrágico, mucinoso) ou parede espessada', 2, true),
('ORADS_US', 'tipo_lesao', 'cisto_multilocular', 'Cisto Multilocular', 'Cisto com múltiplos lóculos separados por septos', 3, true),
('ORADS_US', 'tipo_lesao', 'cisto_componente_solido', 'Cisto com Componente Sólido', 'Lesão cística com componente sólido interno (nódulo mural, projeção papilar)', 4, true),
('ORADS_US', 'tipo_lesao', 'solida', 'Lesão Sólida', 'Lesão predominantemente sólida (>80% componente sólido)', 5, true),
('ORADS_US', 'tipo_lesao', 'lesao_tipica_benigna', 'Lesão Típica Benigna', 'Lesão com características típicas de benignidade (dermoide, endometrioma, hemorrágico)', 6, true),
('ORADS_US', 'tipo_lesao', 'folicular', 'Cisto Folicular', 'Cisto folicular simples ≤3cm', 7, true),
('ORADS_US', 'tipo_lesao', 'corpo_luteo', 'Cisto de Corpo Lúteo', 'Cisto de corpo lúteo com anel de fogo característico', 8, true),
('ORADS_US', 'tipo_lesao', 'paraovarian', 'Cisto Paraovarian', 'Cisto adjacente ao ovário, sem origem ovariana', 9, true),

-- Lesões Típicas Benignas (6 tipos)
('ORADS_US', 'lesao_tipica', 'hemorragico', 'Cisto Hemorrágico', 'Cisto com padrão reticular interno (teia de aranha), ecos lineares finos', 1, true),
('ORADS_US', 'lesao_tipica', 'dermoide', 'Cisto Dermoide (Teratoma)', 'Lesão com componente ecogênico (gordura/pelos), linhas/pontos hiperecogênicos, sombra acústica', 2, true),
('ORADS_US', 'lesao_tipica', 'endometrioma', 'Endometrioma', 'Cisto com conteúdo homogêneo em vidro fosco (ground glass), ecos internos difusos', 3, true),
('ORADS_US', 'lesao_tipica', 'hidrossalpinge', 'Hidrossalpinge', 'Estrutura tubular tortuosa, sinal da roda dentada, nódulos endossalpíngeos', 4, true),
('ORADS_US', 'lesao_tipica', 'cisto_peritoneal', 'Cisto de Inclusão Peritoneal', 'Coleção líquida septada conformando-se às estruturas pélvicas', 5, true),
('ORADS_US', 'lesao_tipica', 'cisto_paratubal', 'Cisto Paratubal/Paraovarian', 'Cisto simples adjacente ao ovário, ovário identificado separadamente', 6, true),

-- Parede Interna
('ORADS_US', 'parede_interna', 'lisa', 'Lisa', 'Parede interna lisa e regular', 1, true),
('ORADS_US', 'parede_interna', 'irregular', 'Irregular', 'Parede interna irregular, nodular ou com projeções', 2, true),
('ORADS_US', 'parede_interna', 'espessada', 'Espessada (≥3mm)', 'Parede interna espessada ≥3mm', 3, true),

-- Septação
('ORADS_US', 'septacao', 'ausente', 'Ausente', 'Sem septações internas', 1, true),
('ORADS_US', 'septacao', 'fina', 'Fina (<3mm)', 'Septações finas <3mm', 2, true),
('ORADS_US', 'septacao', 'espessa', 'Espessa (≥3mm)', 'Septações espessas ≥3mm', 3, true),
('ORADS_US', 'septacao', 'irregular', 'Irregular', 'Septações irregulares ou nodulares', 4, true),

-- Color Score (CS 1-4)
('ORADS_US', 'color_score', '1', 'CS 1 - Sem fluxo', 'Ausência de fluxo ao Doppler colorido', 1, true),
('ORADS_US', 'color_score', '2', 'CS 2 - Fluxo mínimo', 'Fluxo mínimo detectável', 2, true),
('ORADS_US', 'color_score', '3', 'CS 3 - Fluxo moderado', 'Fluxo moderado em componente sólido ou septo', 3, true),
('ORADS_US', 'color_score', '4', 'CS 4 - Fluxo intenso', 'Fluxo intenso em componente sólido', 4, true),

-- Contorno Externo
('ORADS_US', 'contorno_externo', 'liso', 'Liso', 'Contorno externo liso e regular', 1, true),
('ORADS_US', 'contorno_externo', 'irregular', 'Irregular', 'Contorno externo irregular ou lobulado', 2, true),
('ORADS_US', 'contorno_externo', 'papilacoes', 'Com Papilações', 'Contorno com projeções papilares externas', 3, true),

-- Localização da Lesão
('ORADS_US', 'localizacao_lesao', 'ovario_direito', 'Ovário Direito', 'Lesão localizada no ovário direito', 1, true),
('ORADS_US', 'localizacao_lesao', 'ovario_esquerdo', 'Ovário Esquerdo', 'Lesão localizada no ovário esquerdo', 2, true),
('ORADS_US', 'localizacao_lesao', 'paraovarian_direito', 'Paraovarian Direito', 'Lesão paraovarian à direita', 3, true),
('ORADS_US', 'localizacao_lesao', 'paraovarian_esquerdo', 'Paraovarian Esquerdo', 'Lesão paraovarian à esquerda', 4, true),
('ORADS_US', 'localizacao_lesao', 'tubaria_direita', 'Tubária Direita', 'Lesão de origem tubária à direita', 5, true),
('ORADS_US', 'localizacao_lesao', 'tubaria_esquerda', 'Tubária Esquerda', 'Lesão de origem tubária à esquerda', 6, true),

-- Posição Uterina
('ORADS_US', 'posicao_utero', 'avf', 'Anteversoflexão (AVF)', 'Útero em anteversoflexão', 1, true),
('ORADS_US', 'posicao_utero', 'rvf', 'Retroversoflexão (RVF)', 'Útero em retroversoflexão', 2, true),
('ORADS_US', 'posicao_utero', 'medio', 'Posição Média', 'Útero em posição intermediária', 3, true),
('ORADS_US', 'posicao_utero', 'laterodesviado_d', 'Laterodesviado à Direita', 'Útero laterodesviado para a direita', 4, true),
('ORADS_US', 'posicao_utero', 'laterodesviado_e', 'Laterodesviado à Esquerda', 'Útero laterodesviado para a esquerda', 5, true),

-- Forma Uterina
('ORADS_US', 'forma_utero', 'regular', 'Regular', 'Forma uterina regular, piriforme', 1, true),
('ORADS_US', 'forma_utero', 'globoso', 'Globoso', 'Forma uterina globosa', 2, true),
('ORADS_US', 'forma_utero', 'irregular', 'Irregular', 'Forma uterina irregular', 3, true),
('ORADS_US', 'forma_utero', 'alongado', 'Alongado', 'Forma uterina alongada', 4, true),

-- Contornos Uterinos
('ORADS_US', 'contornos_utero', 'regulares', 'Regulares', 'Contornos uterinos regulares e lisos', 1, true),
('ORADS_US', 'contornos_utero', 'lobulados', 'Lobulados', 'Contornos uterinos lobulados', 2, true),
('ORADS_US', 'contornos_utero', 'irregulares', 'Irregulares', 'Contornos uterinos irregulares', 3, true),
('ORADS_US', 'contornos_utero', 'abaulados', 'Abaulados', 'Contornos uterinos abaulados por nódulos', 4, true),

-- Ecotextura Miometrial
('ORADS_US', 'ecotextura_utero', 'homogenea', 'Homogênea', 'Ecotextura miometrial homogênea', 1, true),
('ORADS_US', 'ecotextura_utero', 'heterogenea', 'Heterogênea', 'Ecotextura miometrial heterogênea', 2, true),
('ORADS_US', 'ecotextura_utero', 'heterogenea_focal', 'Heterogênea Focal', 'Ecotextura com área focal de heterogeneidade', 3, true),

-- Zona Juncional
('ORADS_US', 'zona_juncional', 'regular', 'Regular', 'Zona juncional regular e bem definida', 1, true),
('ORADS_US', 'zona_juncional', 'irregular', 'Irregular', 'Zona juncional irregular', 2, true),
('ORADS_US', 'zona_juncional', 'espessada', 'Espessada', 'Zona juncional espessada', 3, true),
('ORADS_US', 'zona_juncional', 'indefinida', 'Indefinida', 'Zona juncional mal definida', 4, true),

-- Aspecto Endometrial
('ORADS_US', 'aspecto_endometrio', 'uniforme', 'Uniforme', 'Eco endometrial uniforme e homogêneo', 1, true),
('ORADS_US', 'aspecto_endometrio', 'trilaminar', 'Trilaminar', 'Eco endometrial trilaminar (fase proliferativa)', 2, true),
('ORADS_US', 'aspecto_endometrio', 'secretor', 'Secretor', 'Eco endometrial hiperecogênico (fase secretora)', 3, true),
('ORADS_US', 'aspecto_endometrio', 'heterogeneo', 'Heterogêneo', 'Eco endometrial heterogêneo', 4, true),
('ORADS_US', 'aspecto_endometrio', 'espessado', 'Espessado', 'Eco endometrial espessado', 5, true),
('ORADS_US', 'aspecto_endometrio', 'atrofico', 'Atrófico', 'Eco endometrial atrófico/linear', 6, true),

-- Linha Média Endometrial
('ORADS_US', 'linha_media', 'linear', 'Linear', 'Linha média endometrial linear e regular', 1, true),
('ORADS_US', 'linha_media', 'irregular', 'Irregular', 'Linha média endometrial irregular', 2, true),
('ORADS_US', 'linha_media', 'desviada', 'Desviada', 'Linha média endometrial desviada', 3, true),
('ORADS_US', 'linha_media', 'mal_definida', 'Mal Definida', 'Linha média endometrial mal definida', 4, true),

-- Junção Endométrio-Miométrio
('ORADS_US', 'juncao_endometrio', 'regular', 'Regular', 'Junção endométrio-miométrio regular e bem definida', 1, true),
('ORADS_US', 'juncao_endometrio', 'irregular', 'Irregular', 'Junção endométrio-miométrio irregular', 2, true),
('ORADS_US', 'juncao_endometrio', 'mal_definida', 'Mal Definida', 'Junção endométrio-miométrio mal definida', 3, true),

-- Localização Nódulo Miometrial
('ORADS_US', 'localizacao_nodulo', 'intramural', 'Intramural', 'Nódulo localizado no miométrio', 1, true),
('ORADS_US', 'localizacao_nodulo', 'subseroso', 'Subseroso', 'Nódulo subseroso (abaulando contorno externo)', 2, true),
('ORADS_US', 'localizacao_nodulo', 'submucoso', 'Submucoso', 'Nódulo submucoso (abaulando cavidade endometrial)', 3, true),
('ORADS_US', 'localizacao_nodulo', 'pediculado', 'Pediculado', 'Nódulo pediculado', 4, true),
('ORADS_US', 'localizacao_nodulo', 'fundo', 'Fundo Uterino', 'Nódulo no fundo uterino', 5, true),
('ORADS_US', 'localizacao_nodulo', 'corpo_anterior', 'Corpo Anterior', 'Nódulo no corpo anterior', 6, true),
('ORADS_US', 'localizacao_nodulo', 'corpo_posterior', 'Corpo Posterior', 'Nódulo no corpo posterior', 7, true),
('ORADS_US', 'localizacao_nodulo', 'istmo', 'Istmo', 'Nódulo no istmo uterino', 8, true),
('ORADS_US', 'localizacao_nodulo', 'cervix', 'Colo Uterino', 'Nódulo no colo uterino', 9, true),

-- Ecogenicidade (genérico)
('ORADS_US', 'ecogenicidade', 'hipoecogenico', 'Hipoecogênico', 'Ecogenicidade reduzida em relação ao miométrio', 1, true),
('ORADS_US', 'ecogenicidade', 'isoecogenico', 'Isoecogênico', 'Ecogenicidade similar ao miométrio', 2, true),
('ORADS_US', 'ecogenicidade', 'hiperecogenico', 'Hiperecogênico', 'Ecogenicidade aumentada em relação ao miométrio', 3, true),
('ORADS_US', 'ecogenicidade', 'heterogeneo', 'Heterogêneo', 'Ecogenicidade mista/heterogênea', 4, true),
('ORADS_US', 'ecogenicidade', 'anecogenico', 'Anecogênico', 'Ausência de ecos (cístico)', 5, true),

-- Contornos Nódulo
('ORADS_US', 'contornos_nodulo', 'regulares', 'Regulares', 'Contornos regulares e bem definidos', 1, true),
('ORADS_US', 'contornos_nodulo', 'irregulares', 'Irregulares', 'Contornos irregulares ou mal definidos', 2, true),
('ORADS_US', 'contornos_nodulo', 'lobulados', 'Lobulados', 'Contornos lobulados', 3, true),

-- Subtipo Nódulo
('ORADS_US', 'subtipo_nodulo', 'leiomioma', 'Leiomioma Típico', 'Nódulo sólido hipoecogênico com sombra acústica posterior', 1, true),
('ORADS_US', 'subtipo_nodulo', 'leiomioma_degenerado', 'Leiomioma Degenerado', 'Leiomioma com áreas de degeneração cística/hialina', 2, true),
('ORADS_US', 'subtipo_nodulo', 'leiomioma_calcificado', 'Leiomioma Calcificado', 'Leiomioma com calcificações e sombra acústica', 3, true),
('ORADS_US', 'subtipo_nodulo', 'adenomiose_focal', 'Adenomiose Focal', 'Área focal de adenomiose', 4, true),
('ORADS_US', 'subtipo_nodulo', 'indeterminado', 'Indeterminado', 'Nódulo de natureza indeterminada', 5, true),

-- Quantidade Líquido Livre
('ORADS_US', 'quantidade_liquido', 'ausente', 'Ausente', 'Ausência de líquido livre na cavidade pélvica', 1, true),
('ORADS_US', 'quantidade_liquido', 'minima', 'Mínima', 'Quantidade mínima de líquido livre', 2, true),
('ORADS_US', 'quantidade_liquido', 'pequena', 'Pequena', 'Pequena quantidade de líquido livre', 3, true),
('ORADS_US', 'quantidade_liquido', 'moderada', 'Moderada', 'Quantidade moderada de líquido livre', 4, true),
('ORADS_US', 'quantidade_liquido', 'grande', 'Grande', 'Grande quantidade de líquido livre (ascite)', 5, true),

-- Aspecto Líquido
('ORADS_US', 'aspecto_liquido', 'anecogenico', 'Anecogênico', 'Líquido anecogênico (simples)', 1, true),
('ORADS_US', 'aspecto_liquido', 'ecos_finos', 'Com Ecos Finos', 'Líquido com ecos finos em suspensão', 2, true),
('ORADS_US', 'aspecto_liquido', 'heterogeneo', 'Heterogêneo', 'Líquido heterogêneo (hemático, purulento)', 3, true),
('ORADS_US', 'aspecto_liquido', 'septado', 'Septado', 'Líquido com septações internas', 4, true),

-- Indicação do Exame
('ORADS_US', 'indicacao', 'rotina', 'Rotina Ginecológica', 'Avaliação ginecológica de rotina', 1, true),
('ORADS_US', 'indicacao', 'dor_pelvica', 'Dor Pélvica', 'Investigação de dor pélvica', 2, true),
('ORADS_US', 'indicacao', 'sangramento', 'Sangramento Uterino', 'Investigação de sangramento uterino anormal', 3, true),
('ORADS_US', 'indicacao', 'massa_anexial', 'Massa Anexial', 'Caracterização de massa anexial', 4, true),
('ORADS_US', 'indicacao', 'infertilidade', 'Infertilidade', 'Avaliação de infertilidade', 5, true),
('ORADS_US', 'indicacao', 'seguimento', 'Seguimento', 'Seguimento de achado prévio', 6, true),
('ORADS_US', 'indicacao', 'pos_menopausa', 'Pós-Menopausa', 'Avaliação endometrial pós-menopausa', 7, true),
('ORADS_US', 'indicacao', 'rastreamento', 'Rastreamento', 'Rastreamento de câncer ovariano (alto risco)', 8, true),

-- Categorias O-RADS (para referência/lookup)
('ORADS_US', 'orads_categoria', '0', 'O-RADS 0', 'Avaliação incompleta - exame limitado tecnicamente', 1, true),
('ORADS_US', 'orads_categoria', '1', 'O-RADS 1', 'Normal - folículo fisiológico', 2, true),
('ORADS_US', 'orads_categoria', '2', 'O-RADS 2', 'Quase certamente benigno (<1% risco malignidade)', 3, true),
('ORADS_US', 'orads_categoria', '3', 'O-RADS 3', 'Baixo risco de malignidade (1-10%)', 4, true),
('ORADS_US', 'orads_categoria', '4', 'O-RADS 4', 'Risco intermediário de malignidade (10-50%)', 5, true),
('ORADS_US', 'orads_categoria', '5', 'O-RADS 5', 'Alto risco de malignidade (>50%)', 6, true);