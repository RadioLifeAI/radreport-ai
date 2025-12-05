-- =====================================================
-- O-RADS MRI v2020 - Migração Completa (~100 registros)
-- Sistema de Classificação ACR para Lesões Ovarianas por RM
-- =====================================================

-- Categorias O-RADS MRI (0-5)
INSERT INTO rads_text_options (sistema_codigo, categoria, valor, label, texto, ordem, ativo) VALUES
('ORADS_MRI', 'orads_mri_categoria', '0', 'O-RADS MRI 0', 'O-RADS MRI 0 - Avaliação incompleta. Exame limitado, não sendo possível categorização adequada.', 1, true),
('ORADS_MRI', 'orads_mri_categoria', '1', 'O-RADS MRI 1', 'O-RADS MRI 1 - Ovários normais. Sem lesão ovariana identificada.', 2, true),
('ORADS_MRI', 'orads_mri_categoria', '2', 'O-RADS MRI 2', 'O-RADS MRI 2 - Achado quase certamente benigno (risco de malignidade <0,5%).', 3, true),
('ORADS_MRI', 'orads_mri_categoria', '3', 'O-RADS MRI 3', 'O-RADS MRI 3 - Baixo risco de malignidade (risco estimado de 1-5%).', 4, true),
('ORADS_MRI', 'orads_mri_categoria', '4', 'O-RADS MRI 4', 'O-RADS MRI 4 - Risco intermediário de malignidade (risco estimado de ~50%).', 5, true),
('ORADS_MRI', 'orads_mri_categoria', '5', 'O-RADS MRI 5', 'O-RADS MRI 5 - Alto risco de malignidade (risco estimado de ~90%).', 6, true);

-- Recomendações por categoria
INSERT INTO rads_text_options (sistema_codigo, categoria, valor, label, texto, ordem, ativo) VALUES
('ORADS_MRI', 'orads_mri_recomendacao', '0', 'Recomendação O-RADS MRI 0', 'Complementar avaliação com sequências adicionais ou novo exame.', 1, true),
('ORADS_MRI', 'orads_mri_recomendacao', '1', 'Recomendação O-RADS MRI 1', 'Achados normais. Controle de rotina conforme indicação clínica.', 2, true),
('ORADS_MRI', 'orads_mri_recomendacao', '2', 'Recomendação O-RADS MRI 2', 'Achado quase certamente benigno. Seguimento conforme contexto clínico ou nenhum seguimento adicional necessário.', 3, true),
('ORADS_MRI', 'orads_mri_recomendacao', '3', 'Recomendação O-RADS MRI 3', 'Baixo risco. Considerar seguimento por imagem em 6-12 semanas ou conduta conservadora conforme contexto clínico.', 4, true),
('ORADS_MRI', 'orads_mri_recomendacao', '4', 'Recomendação O-RADS MRI 4', 'Risco intermediário. Encaminhar para avaliação ginecológica/oncológica para discussão de conduta cirúrgica.', 5, true),
('ORADS_MRI', 'orads_mri_recomendacao', '5', 'Recomendação O-RADS MRI 5', 'Alto risco de malignidade. Encaminhar para centro de oncologia ginecológica para estadiamento e planejamento cirúrgico.', 6, true);

-- Técnica padrão
INSERT INTO rads_text_options (sistema_codigo, categoria, valor, label, texto, ordem, ativo) VALUES
('ORADS_MRI', 'tecnica', 'padrao', 'Técnica Padrão O-RADS MRI', 'Ressonância magnética da pelve realizada em equipamento de 1,5/3,0 Tesla, com protocolo O-RADS MRI incluindo sequências ponderadas em T1 (axial e sagital), T2 de alta resolução (axial, sagital e coronal), difusão (DWI com valores de b 0, 500 e 1000 s/mm²) com mapa ADC, e estudo dinâmico pós-contraste (DCE-MRI) com aquisições seriadas a cada 30 segundos por 5 minutos após injeção endovenosa de meio de contraste paramagnético. Paciente em jejum de 4-6 horas. Antiespasmódico administrado quando não contraindicado.', 1, true);

-- Indicações clínicas
INSERT INTO rads_text_options (sistema_codigo, categoria, valor, label, texto, ordem, ativo) VALUES
('ORADS_MRI', 'indicacao', 'massa_anexial', 'Massa anexial', 'Caracterização de massa anexial identificada em exame prévio.', 1, true),
('ORADS_MRI', 'indicacao', 'cisto_indeterminado', 'Cisto indeterminado', 'Avaliação de cisto ovariano indeterminado ao ultrassom.', 2, true),
('ORADS_MRI', 'indicacao', 'estadiamento', 'Estadiamento', 'Estadiamento de neoplasia ovariana conhecida ou suspeita.', 3, true),
('ORADS_MRI', 'indicacao', 'seguimento', 'Seguimento', 'Seguimento de lesão ovariana previamente caracterizada.', 4, true),
('ORADS_MRI', 'indicacao', 'dor_pelvica', 'Dor pélvica', 'Investigação de dor pélvica crônica ou aguda.', 5, true),
('ORADS_MRI', 'indicacao', 'endometriose', 'Endometriose', 'Avaliação de endometriose pélvica.', 6, true),
('ORADS_MRI', 'indicacao', 'infertilidade', 'Infertilidade', 'Investigação de infertilidade.', 7, true),
('ORADS_MRI', 'indicacao', 'pre_cirurgico', 'Pré-cirúrgico', 'Planejamento pré-operatório.', 8, true);

-- Status menopausal
INSERT INTO rads_text_options (sistema_codigo, categoria, valor, label, texto, ordem, ativo) VALUES
('ORADS_MRI', 'status_menopausal', 'pre', 'Pré-menopausa', 'Paciente em idade reprodutiva, pré-menopausa.', 1, true),
('ORADS_MRI', 'status_menopausal', 'pos', 'Pós-menopausa', 'Paciente em pós-menopausa.', 2, true),
('ORADS_MRI', 'status_menopausal', 'incerto', 'Incerto', 'Status menopausal não determinado.', 3, true);

-- Tipos de lesão MRI
INSERT INTO rads_text_options (sistema_codigo, categoria, valor, label, texto, ordem, ativo) VALUES
('ORADS_MRI', 'tipo_lesao_mri', 'foliculo', 'Folículo', 'Folículo ovariano (cisto simples ≤3 cm em pré-menopausa).', 1, true),
('ORADS_MRI', 'tipo_lesao_mri', 'corpo_luteo', 'Corpo lúteo', 'Corpo lúteo ± hemorragia.', 2, true),
('ORADS_MRI', 'tipo_lesao_mri', 'cisto_hemorragico', 'Cisto hemorrágico', 'Cisto hemorrágico funcional.', 3, true),
('ORADS_MRI', 'tipo_lesao_mri', 'cisto_unilocular', 'Cisto unilocular', 'Cisto ovariano unilocular.', 4, true),
('ORADS_MRI', 'tipo_lesao_mri', 'cisto_multilocular', 'Cisto multilocular', 'Cisto ovariano multilocular.', 5, true),
('ORADS_MRI', 'tipo_lesao_mri', 'cisto_paraovariano', 'Cisto paraovariano', 'Cisto paraovariano/paratubário.', 6, true),
('ORADS_MRI', 'tipo_lesao_mri', 'hidrossalpinge', 'Hidrossalpinge', 'Trompa uterina dilatada (hidrossalpinge).', 7, true),
('ORADS_MRI', 'tipo_lesao_mri', 'lesao_lipidica', 'Lesão com conteúdo lipídico', 'Lesão com conteúdo lipídico (teratoma maduro).', 8, true),
('ORADS_MRI', 'tipo_lesao_mri', 'lesao_solida', 'Lesão sólida', 'Lesão predominantemente sólida.', 9, true),
('ORADS_MRI', 'tipo_lesao_mri', 'lesao_mista', 'Lesão mista', 'Lesão cístico-sólida mista.', 10, true);

-- Conteúdo fluido
INSERT INTO rads_text_options (sistema_codigo, categoria, valor, label, texto, ordem, ativo) VALUES
('ORADS_MRI', 'conteudo_fluido', 'simples', 'Simples', 'Conteúdo líquido simples (hipointenso em T1, hiperintenso em T2).', 1, true),
('ORADS_MRI', 'conteudo_fluido', 'proteinaceo', 'Proteináceo', 'Conteúdo proteináceo (hiperintenso em T1 e T2).', 2, true),
('ORADS_MRI', 'conteudo_fluido', 'hemorragico', 'Hemorrágico', 'Conteúdo hemorrágico (hiperintenso em T1, hipointenso em T2 - shading).', 3, true),
('ORADS_MRI', 'conteudo_fluido', 'mucinoso', 'Mucinoso', 'Conteúdo mucinoso (intensidade intermediária em T1, variável em T2).', 4, true),
('ORADS_MRI', 'conteudo_fluido', 'endometriotico', 'Endometriótico', 'Conteúdo endometriótico (hiperintenso em T1, com shading em T2).', 5, true),
('ORADS_MRI', 'conteudo_fluido', 'lipidico', 'Lipídico', 'Conteúdo lipídico/gorduroso (hiperintenso em T1, com queda de sinal em fat-sat).', 6, true);

-- Tecido sólido
INSERT INTO rads_text_options (sistema_codigo, categoria, valor, label, texto, ordem, ativo) VALUES
('ORADS_MRI', 'tecido_solido', 'ausente', 'Ausente', 'Sem tecido sólido com realce identificado.', 1, true),
('ORADS_MRI', 'tecido_solido', 'projecao_papilar', 'Projeção papilar', 'Projeção papilar com realce.', 2, true),
('ORADS_MRI', 'tecido_solido', 'nodulo_mural', 'Nódulo mural', 'Nódulo mural com realce.', 3, true),
('ORADS_MRI', 'tecido_solido', 'septo_irregular', 'Septação irregular', 'Septação irregular com realce.', 4, true),
('ORADS_MRI', 'tecido_solido', 'parede_irregular', 'Parede irregular', 'Espessamento irregular da parede com realce.', 5, true),
('ORADS_MRI', 'tecido_solido', 'grande_solido', 'Grande componente sólido', 'Grande componente sólido com realce.', 6, true);

-- Sinal T1
INSERT INTO rads_text_options (sistema_codigo, categoria, valor, label, texto, ordem, ativo) VALUES
('ORADS_MRI', 'sinal_t1', 'hipointenso', 'Hipointenso', 'Hipointenso em T1 (sinal similar ao músculo).', 1, true),
('ORADS_MRI', 'sinal_t1', 'isointenso', 'Isointenso', 'Isointenso em T1.', 2, true),
('ORADS_MRI', 'sinal_t1', 'hiperintenso', 'Hiperintenso', 'Hiperintenso em T1 (sugestivo de conteúdo proteináceo, hemorrágico ou gorduroso).', 3, true);

-- Sinal T2
INSERT INTO rads_text_options (sistema_codigo, categoria, valor, label, texto, ordem, ativo) VALUES
('ORADS_MRI', 'sinal_t2', 'hipointenso', 'Hipointenso', 'Hipointenso em T2.', 1, true),
('ORADS_MRI', 'sinal_t2', 'intermediario', 'Intermediário', 'Sinal intermediário em T2.', 2, true),
('ORADS_MRI', 'sinal_t2', 'hiperintenso', 'Hiperintenso', 'Hiperintenso em T2.', 3, true),
('ORADS_MRI', 'sinal_t2', 'dark_t2_dark_dwi', 'Dark T2/Dark DWI', 'Homogeneamente hipointenso em T2 e DWI de alto valor b (característico de fibroma/tecoma).', 4, true);

-- Sinal DWI
INSERT INTO rads_text_options (sistema_codigo, categoria, valor, label, texto, ordem, ativo) VALUES
('ORADS_MRI', 'sinal_dwi', 'restricao', 'Restrição à difusão', 'Hipersinal em DWI com queda de sinal no mapa ADC (restrição verdadeira).', 1, true),
('ORADS_MRI', 'sinal_dwi', 'sem_restricao', 'Sem restrição', 'Sem restrição significativa à difusão.', 2, true),
('ORADS_MRI', 'sinal_dwi', 'dark_dwi', 'Dark DWI', 'Marcadamente hipointenso em DWI de alto valor b.', 3, true),
('ORADS_MRI', 'sinal_dwi', 'variavel', 'Variável', 'Sinal heterogêneo/variável em DWI.', 4, true);

-- Curvas DCE (Time-Intensity Curve)
INSERT INTO rads_text_options (sistema_codigo, categoria, valor, label, texto, ordem, ativo) VALUES
('ORADS_MRI', 'curva_dce', 'tipo_1', 'Tipo 1 - Baixo risco', 'Curva tipo 1 (baixo risco): realce progressivo lento, sem washout.', 1, true),
('ORADS_MRI', 'curva_dce', 'tipo_2', 'Tipo 2 - Risco intermediário', 'Curva tipo 2 (risco intermediário): realce rápido com platô.', 2, true),
('ORADS_MRI', 'curva_dce', 'tipo_3', 'Tipo 3 - Alto risco', 'Curva tipo 3 (alto risco): realce rápido com washout precoce.', 3, true),
('ORADS_MRI', 'curva_dce', 'nao_realizado', 'Não realizado', 'Estudo dinâmico não realizado.', 4, true);

-- Enhancement vs miométrio
INSERT INTO rads_text_options (sistema_codigo, categoria, valor, label, texto, ordem, ativo) VALUES
('ORADS_MRI', 'enhancement_miometrio', 'menor', 'Menor que miométrio', 'Realce menor que o miométrio em 30-40 segundos.', 1, true),
('ORADS_MRI', 'enhancement_miometrio', 'igual', 'Igual ao miométrio', 'Realce igual ao miométrio em 30-40 segundos.', 2, true),
('ORADS_MRI', 'enhancement_miometrio', 'maior', 'Maior que miométrio', 'Realce maior que o miométrio em 30-40 segundos.', 3, true),
('ORADS_MRI', 'enhancement_miometrio', 'na', 'Não aplicável', 'Comparação com miométrio não aplicável.', 4, true);

-- Parede da lesão
INSERT INTO rads_text_options (sistema_codigo, categoria, valor, label, texto, ordem, ativo) VALUES
('ORADS_MRI', 'parede_lesao', 'fina_lisa', 'Fina e lisa', 'Parede fina (<3mm) e lisa, com ou sem realce.', 1, true),
('ORADS_MRI', 'parede_lesao', 'espessa_lisa', 'Espessa e lisa', 'Parede espessa (>=3mm) e lisa, com realce.', 2, true),
('ORADS_MRI', 'parede_lesao', 'fina_irregular', 'Fina e irregular', 'Parede fina com contorno irregular.', 3, true),
('ORADS_MRI', 'parede_lesao', 'espessa_irregular', 'Espessa e irregular', 'Parede espessa e irregular, com realce.', 4, true),
('ORADS_MRI', 'parede_lesao', 'imperceptivel', 'Imperceptível', 'Parede imperceptível ou ausente.', 5, true);

-- Septação
INSERT INTO rads_text_options (sistema_codigo, categoria, valor, label, texto, ordem, ativo) VALUES
('ORADS_MRI', 'septacao', 'ausente', 'Ausente', 'Sem septações internas.', 1, true),
('ORADS_MRI', 'septacao', 'fina_lisa', 'Fina e lisa', 'Septação fina (<3mm) e lisa.', 2, true),
('ORADS_MRI', 'septacao', 'espessa_lisa', 'Espessa e lisa', 'Septação espessa (>=3mm) e lisa.', 3, true),
('ORADS_MRI', 'septacao', 'irregular', 'Irregular', 'Septação irregular ou nodular.', 4, true);

-- Localização da lesão
INSERT INTO rads_text_options (sistema_codigo, categoria, valor, label, texto, ordem, ativo) VALUES
('ORADS_MRI', 'localizacao_lesao', 'ovario_direito', 'Ovário direito', 'Lesão localizada no ovário direito.', 1, true),
('ORADS_MRI', 'localizacao_lesao', 'ovario_esquerdo', 'Ovário esquerdo', 'Lesão localizada no ovário esquerdo.', 2, true),
('ORADS_MRI', 'localizacao_lesao', 'paraovariana', 'Paraovariana', 'Lesão paraovariana/paratubária.', 3, true),
('ORADS_MRI', 'localizacao_lesao', 'tubaria', 'Tubária', 'Lesão de origem tubária (hidrossalpinge).', 4, true);

-- Ascite
INSERT INTO rads_text_options (sistema_codigo, categoria, valor, label, texto, ordem, ativo) VALUES
('ORADS_MRI', 'ascite', 'ausente', 'Ausente', 'Sem ascite.', 1, true),
('ORADS_MRI', 'ascite', 'pequena', 'Pequena quantidade', 'Pequena quantidade de líquido livre pélvico (fisiológico ou mínima ascite).', 2, true),
('ORADS_MRI', 'ascite', 'moderada', 'Moderada', 'Ascite moderada.', 3, true),
('ORADS_MRI', 'ascite', 'volumosa', 'Volumosa', 'Ascite volumosa.', 4, true);

-- Nodularidade peritoneal
INSERT INTO rads_text_options (sistema_codigo, categoria, valor, label, texto, ordem, ativo) VALUES
('ORADS_MRI', 'nodularidade_peritoneal', 'ausente', 'Ausente', 'Sem implantes peritoneais identificados.', 1, true),
('ORADS_MRI', 'nodularidade_peritoneal', 'peritoneal', 'Peritoneal', 'Nodularidade/espessamento peritoneal.', 2, true),
('ORADS_MRI', 'nodularidade_peritoneal', 'mesenterica', 'Mesentérica', 'Nodularidade mesentérica.', 3, true),
('ORADS_MRI', 'nodularidade_peritoneal', 'omental_caking', 'Omental caking', 'Espessamento omental difuso (omental caking).', 4, true);

-- Linfonodos
INSERT INTO rads_text_options (sistema_codigo, categoria, valor, label, texto, ordem, ativo) VALUES
('ORADS_MRI', 'linfonodos', 'ausentes', 'Não visualizados', 'Linfonodos pélvicos não caracterizados/não visualizados.', 1, true),
('ORADS_MRI', 'linfonodos', 'reactivos', 'Reactivos', 'Linfonodos de aspecto reactivo (pequenos, morfologia preservada).', 2, true),
('ORADS_MRI', 'linfonodos', 'suspeitos', 'Suspeitos', 'Linfonodos suspeitos (aumentados, arredondados, ou com sinal alterado).', 3, true),
('ORADS_MRI', 'linfonodos', 'indeterminados', 'Indeterminados', 'Linfonodos de significado indeterminado.', 4, true);

-- Comparativo
INSERT INTO rads_text_options (sistema_codigo, categoria, valor, label, texto, ordem, ativo) VALUES
('ORADS_MRI', 'comparativo', 'sem_anterior', 'Sem exame anterior', 'Não há exame de imagem anterior disponível para comparação.', 1, true),
('ORADS_MRI', 'comparativo', 'estavel', 'Estável', 'Achados estáveis em relação ao exame anterior.', 2, true),
('ORADS_MRI', 'comparativo', 'diminuicao', 'Diminuição', 'Redução das dimensões e/ou melhora dos achados.', 3, true),
('ORADS_MRI', 'comparativo', 'aumento', 'Aumento', 'Aumento das dimensões da lesão.', 4, true),
('ORADS_MRI', 'comparativo', 'nova_lesao', 'Nova lesão', 'Nova lesão não identificada em exame anterior.', 5, true);

-- Posição do útero
INSERT INTO rads_text_options (sistema_codigo, categoria, valor, label, texto, ordem, ativo) VALUES
('ORADS_MRI', 'posicao_utero', 'avf', 'Anteroversofletido', 'Útero em anteroversofletido.', 1, true),
('ORADS_MRI', 'posicao_utero', 'rvf', 'Retroversofletido', 'Útero em retroversofletido.', 2, true),
('ORADS_MRI', 'posicao_utero', 'medioversao', 'Medioversão', 'Útero em medioversão.', 3, true),
('ORADS_MRI', 'posicao_utero', 'dextroversao', 'Dextroversão', 'Útero com dextroversão.', 4, true),
('ORADS_MRI', 'posicao_utero', 'sinistroversao', 'Sinistroversão', 'Útero com sinistroversão.', 5, true);

-- Forma do útero
INSERT INTO rads_text_options (sistema_codigo, categoria, valor, label, texto, ordem, ativo) VALUES
('ORADS_MRI', 'forma_utero', 'regular', 'Regular', 'Útero de forma e contornos regulares.', 1, true),
('ORADS_MRI', 'forma_utero', 'irregular', 'Irregular', 'Útero de forma irregular.', 2, true),
('ORADS_MRI', 'forma_utero', 'globoso', 'Globoso', 'Útero de aspecto globoso.', 3, true),
('ORADS_MRI', 'forma_utero', 'malformacao', 'Malformação', 'Malformação mülleriana uterina.', 4, true);

-- Zona juncional
INSERT INTO rads_text_options (sistema_codigo, categoria, valor, label, texto, ordem, ativo) VALUES
('ORADS_MRI', 'zona_juncional', 'regular', 'Regular', 'Zona juncional regular e de espessura normal.', 1, true),
('ORADS_MRI', 'zona_juncional', 'espessada', 'Espessada', 'Zona juncional espessada (>12mm).', 2, true),
('ORADS_MRI', 'zona_juncional', 'irregular', 'Irregular', 'Zona juncional de contornos irregulares.', 3, true),
('ORADS_MRI', 'zona_juncional', 'indistinta', 'Indistinta', 'Zona juncional mal definida/indistinta.', 4, true);

-- Endométrio
INSERT INTO rads_text_options (sistema_codigo, categoria, valor, label, texto, ordem, ativo) VALUES
('ORADS_MRI', 'endometrio_aspecto', 'linear', 'Linear', 'Endométrio de aspecto linear, fino.', 1, true),
('ORADS_MRI', 'endometrio_aspecto', 'trilaminar', 'Trilaminar', 'Endométrio trilaminar (fase proliferativa).', 2, true),
('ORADS_MRI', 'endometrio_aspecto', 'secretor', 'Secretor', 'Endométrio de aspecto secretor (hiperintenso homogêneo em T2).', 3, true),
('ORADS_MRI', 'endometrio_aspecto', 'espessado', 'Espessado', 'Endométrio espessado.', 4, true),
('ORADS_MRI', 'endometrio_aspecto', 'heterogeneo', 'Heterogêneo', 'Endométrio de aspecto heterogêneo.', 5, true);

-- Miomas - localização
INSERT INTO rads_text_options (sistema_codigo, categoria, valor, label, texto, ordem, ativo) VALUES
('ORADS_MRI', 'mioma_localizacao', 'submucoso', 'Submucoso', 'Leiomioma submucoso.', 1, true),
('ORADS_MRI', 'mioma_localizacao', 'intramural', 'Intramural', 'Leiomioma intramural.', 2, true),
('ORADS_MRI', 'mioma_localizacao', 'subseroso', 'Subseroso', 'Leiomioma subseroso.', 3, true),
('ORADS_MRI', 'mioma_localizacao', 'pediculado', 'Pediculado', 'Leiomioma pediculado.', 4, true),
('ORADS_MRI', 'mioma_localizacao', 'cervical', 'Cervical', 'Leiomioma cervical.', 5, true);

-- Miomas - aspecto
INSERT INTO rads_text_options (sistema_codigo, categoria, valor, label, texto, ordem, ativo) VALUES
('ORADS_MRI', 'mioma_aspecto', 'tipico', 'Típico', 'Nódulo miometrial de aspecto típico (hipointenso em T2).', 1, true),
('ORADS_MRI', 'mioma_aspecto', 'degenerado', 'Degenerado', 'Leiomioma com sinais de degeneração.', 2, true),
('ORADS_MRI', 'mioma_aspecto', 'calcificado', 'Calcificado', 'Leiomioma com calcificações.', 3, true),
('ORADS_MRI', 'mioma_aspecto', 'celular', 'Celular', 'Leiomioma celular (sinal intermediário/alto em T2).', 4, true);