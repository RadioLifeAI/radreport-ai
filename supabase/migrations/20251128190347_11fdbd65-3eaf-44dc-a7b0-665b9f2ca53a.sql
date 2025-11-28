-- =====================================================
-- FASE 1+2: CONVERTER TIPOS TEXT E EXPANDIR DIMENSÕES
-- =====================================================
-- Corrige 10 frases: 7 com tipo "text" + 3 MM/RM/TC
-- =====================================================

-- FASE 1: Corrigir 7 frases com tipo "text" (inglês)
-- ====================================================

-- 1. US_ABD_FIG_MASSA_001: segmentos text → select
UPDATE frases_modelo 
SET 
  texto = 'Massa hepática no(s) segmento(s) {{segmentos}}, medindo {{mx_cm}} x {{my_cm}} x {{mz_cm}} cm, com ecotextura {{ecotextura}}.',
  variaveis = '[
    {"nome": "segmentos", "tipo": "select", "opcoes": ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "I+II", "III+IV", "V+VI", "VII+VIII", "V+VI+VII+VIII"], "obrigatorio": true, "descricao": "Segmentos hepáticos acometidos"},
    {"nome": "mx_cm", "tipo": "numero", "minimo": 0.1, "maximo": 30.0, "obrigatorio": true, "unidade": "cm", "descricao": "Maior dimensão longitudinal"},
    {"nome": "my_cm", "tipo": "numero", "minimo": 0.1, "maximo": 30.0, "obrigatorio": true, "unidade": "cm", "descricao": "Dimensão anteroposterior"},
    {"nome": "mz_cm", "tipo": "numero", "minimo": 0.1, "maximo": 30.0, "obrigatorio": true, "unidade": "cm", "descricao": "Dimensão transversa"},
    {"nome": "ecotextura", "tipo": "select", "opcoes": ["sólida", "cística", "heterogênea", "hipoecogênica", "hiperecogênica", "mista"], "obrigatorio": true, "descricao": "Ecotextura da massa"}
  ]'::jsonb
WHERE codigo = 'US_ABD_FIG_MASSA_001';

-- 2. US_ABD_LINFONODOS_LINFONODOMEGALIA_001: cadeia text → select
UPDATE frases_modelo 
SET 
  texto = 'Linfonodomegalia em cadeia {{cadeia}}, com maior linfonodo medindo {{maior_dim_cm}} cm no menor eixo.',
  variaveis = '[
    {"nome": "cadeia", "tipo": "select", "opcoes": ["para-aórtica", "mesentérica", "ilíaca", "retroperitoneal", "inguinal", "peri-hepática", "peri-esplênica"], "obrigatorio": true, "descricao": "Cadeia linfonodal acometida"},
    {"nome": "maior_dim_cm", "tipo": "numero", "minimo": 0.5, "maximo": 10.0, "obrigatorio": true, "unidade": "cm", "descricao": "Maior dimensão no menor eixo"}
  ]'::jsonb
WHERE codigo = 'US_ABD_LINFONODOS_LINFONODOMEGALIA_001';

-- 3. US_ABD_RINS_ENXERTO_RENAL_001: dim_cm text → expandir para 3 variáveis
UPDATE frases_modelo 
SET 
  texto = 'Enxerto renal em fossa ilíaca {{lado}}, medindo {{dim_l_cm}} x {{dim_ap_cm}} x {{dim_t_cm}} cm, com ecotextura {{aspecto}}.',
  variaveis = '[
    {"nome": "lado", "tipo": "select", "opcoes": ["direita", "esquerda"], "obrigatorio": true, "descricao": "Lateralidade do enxerto"},
    {"nome": "dim_l_cm", "tipo": "numero", "minimo": 5.0, "maximo": 20.0, "obrigatorio": true, "unidade": "cm", "descricao": "Dimensão longitudinal"},
    {"nome": "dim_ap_cm", "tipo": "numero", "minimo": 3.0, "maximo": 15.0, "obrigatorio": true, "unidade": "cm", "descricao": "Dimensão anteroposterior"},
    {"nome": "dim_t_cm", "tipo": "numero", "minimo": 3.0, "maximo": 15.0, "obrigatorio": true, "unidade": "cm", "descricao": "Dimensão transversa"},
    {"nome": "aspecto", "tipo": "select", "opcoes": ["homogêneo", "preservado", "heterogêneo"], "obrigatorio": true, "descricao": "Aspecto do parênquima"}
  ]'::jsonb
WHERE codigo = 'US_ABD_RINS_ENXERTO_RENAL_001';

-- 4. US_ABD_RINS_PIELONEFRITE_001: dim_mm text → expandir para 3 variáveis
UPDATE frases_modelo 
SET 
  texto = 'Área focal de nefrite aguda no rim {{lado}}, medindo {{dim_l_mm}} x {{dim_ap_mm}} x {{dim_t_mm}} mm.',
  variaveis = '[
    {"nome": "lado", "tipo": "select", "opcoes": ["direito", "esquerdo"], "obrigatorio": true, "descricao": "Lateralidade"},
    {"nome": "dim_l_mm", "tipo": "numero", "minimo": 5, "maximo": 100, "obrigatorio": true, "unidade": "mm", "descricao": "Dimensão longitudinal"},
    {"nome": "dim_ap_mm", "tipo": "numero", "minimo": 5, "maximo": 100, "obrigatorio": true, "unidade": "mm", "descricao": "Dimensão anteroposterior"},
    {"nome": "dim_t_mm", "tipo": "numero", "minimo": 5, "maximo": 100, "obrigatorio": true, "unidade": "mm", "descricao": "Dimensão transversa"}
  ]'::jsonb
WHERE codigo = 'US_ABD_RINS_PIELONEFRITE_001';

-- 5. US_ABD_RINS_RIM_PELVICO_001: dimensoes_cm text → expandir para 3 variáveis
UPDATE frases_modelo 
SET 
  texto = 'Rim pélvico {{lado}}, medindo {{dim_l_cm}} x {{dim_ap_cm}} x {{dim_t_cm}} cm, com ecotextura preservada.',
  variaveis = '[
    {"nome": "lado", "tipo": "select", "opcoes": ["direito", "esquerdo"], "obrigatorio": true, "descricao": "Lateralidade"},
    {"nome": "dim_l_cm", "tipo": "numero", "minimo": 5.0, "maximo": 15.0, "obrigatorio": true, "unidade": "cm", "descricao": "Dimensão longitudinal"},
    {"nome": "dim_ap_cm", "tipo": "numero", "minimo": 3.0, "maximo": 10.0, "obrigatorio": true, "unidade": "cm", "descricao": "Dimensão anteroposterior"},
    {"nome": "dim_t_cm", "tipo": "numero", "minimo": 3.0, "maximo": 10.0, "obrigatorio": true, "unidade": "cm", "descricao": "Dimensão transversa"}
  ]'::jsonb
WHERE codigo = 'US_ABD_RINS_RIM_PELVICO_001';

-- 6. US_CERV_LINFONODOS_HABITUAL_001: cadeia text → select
UPDATE frases_modelo 
SET 
  texto = 'Linfonodos cervicais em cadeia {{cadeia}}, com aspecto habitual, menor eixo até {{menor_eixo_mm}} mm.',
  variaveis = '[
    {"nome": "cadeia", "tipo": "select", "opcoes": ["jugular interna", "espinhal acessória", "supraclavicular", "submandibular", "submentoniana", "cervical posterior", "pré-laríngea", "pré-traqueal", "paratraqueal"], "obrigatorio": true, "descricao": "Cadeia linfonodal cervical"},
    {"nome": "menor_eixo_mm", "tipo": "numero", "minimo": 3, "maximo": 15, "obrigatorio": true, "unidade": "mm", "descricao": "Menor eixo linfonodal"}
  ]'::jsonb
WHERE codigo = 'US_CERV_LINFONODOS_HABITUAL_001';

-- 7. US_ESC_TESTICULO_TORSAO_001: testiculo_dim_cm text → expandir para 3 variáveis
UPDATE frases_modelo 
SET 
  texto = 'Testículo {{lado}} aumentado de volume, medindo {{dim_l_cm}} x {{dim_ap_cm}} x {{dim_t_cm}} cm, com ecotextura heterogênea e ausência de fluxo ao Doppler colorido, compatível com torção testicular.',
  conclusao = 'Torção testicular {{lado}}. Correlacionar com achados clínicos e cirúrgicos.',
  variaveis = '[
    {"nome": "lado", "tipo": "select", "opcoes": ["direito", "esquerdo"], "obrigatorio": true, "descricao": "Lateralidade"},
    {"nome": "dim_l_cm", "tipo": "numero", "minimo": 2.0, "maximo": 8.0, "obrigatorio": true, "unidade": "cm", "descricao": "Dimensão longitudinal"},
    {"nome": "dim_ap_cm", "tipo": "numero", "minimo": 1.5, "maximo": 6.0, "obrigatorio": true, "unidade": "cm", "descricao": "Dimensão anteroposterior"},
    {"nome": "dim_t_cm", "tipo": "numero", "minimo": 1.5, "maximo": 6.0, "obrigatorio": true, "unidade": "cm", "descricao": "Dimensão transversa"}
  ]'::jsonb
WHERE codigo = 'US_ESC_TESTICULO_TORSAO_001';


-- FASE 2: Corrigir 3 frases MM/RM/TC com texto → select
-- ======================================================

-- 8. MM_MICROCALCIFICACOES: 3 variáveis texto → select
UPDATE frases_modelo 
SET 
  texto = 'Microcalcificações {{tipo_microcalcificacoes}} no {{quadrante}}, distribuição {{distribuicao}}.',
  conclusao = 'BI-RADS {{categoria}}: Microcalcificações suspeitas. Recomenda-se biópsia.',
  variaveis = '[
    {"nome": "tipo_microcalcificacoes", "tipo": "select", "opcoes": ["amorfas", "pleomórficas", "lineares finas", "ramificadas", "grosseiras heterogêneas", "redondas"], "obrigatorio": true, "descricao": "Tipo de microcalcificações"},
    {"nome": "quadrante", "tipo": "select", "opcoes": ["QSL", "QSM", "QIL", "QIM", "retromamilar", "região central", "prolongamento axilar"], "obrigatorio": true, "descricao": "Quadrante acometido"},
    {"nome": "distribuicao", "tipo": "select", "opcoes": ["agrupadas", "lineares", "segmentares", "regionais", "difusas"], "obrigatorio": true, "descricao": "Distribuição das calcificações"},
    {"nome": "categoria", "tipo": "select", "opcoes": ["4A", "4B", "4C", "5"], "obrigatorio": true, "descricao": "Categoria BI-RADS"}
  ]'::jsonb
WHERE codigo = 'MM_MICROCALCIFICACOES';

-- 9. RM_DISCO_HERNIA: 3 variáveis texto → select
UPDATE frases_modelo 
SET 
  texto = 'Hérnia discal {{tipo_hernia}} no nível {{nivel}}, com compressão de {{estruturas_comprometidas}}.',
  conclusao = 'Hérnia discal {{tipo_hernia}} em {{nivel}} com compressão neural.',
  variaveis = '[
    {"nome": "tipo_hernia", "tipo": "select", "opcoes": ["central", "paramediana direita", "paramediana esquerda", "foraminal direita", "foraminal esquerda", "extraforaminal direita", "extraforaminal esquerda"], "obrigatorio": true, "descricao": "Tipo de hérnia discal"},
    {"nome": "nivel", "tipo": "select", "opcoes": ["C2-C3", "C3-C4", "C4-C5", "C5-C6", "C6-C7", "C7-T1", "T1-T2", "T11-T12", "T12-L1", "L1-L2", "L2-L3", "L3-L4", "L4-L5", "L5-S1"], "obrigatorio": true, "descricao": "Nível vertebral"},
    {"nome": "estruturas_comprometidas", "tipo": "select", "opcoes": ["raiz nervosa", "saco dural", "cone medular", "cauda equina", "forame neural", "recesso lateral"], "obrigatorio": true, "descricao": "Estruturas comprometidas"}
  ]'::jsonb
WHERE codigo = 'RM_DISCO_HERNIA';

-- 10. TC_NODULO_SOLITARIO: 2 variáveis texto → select
UPDATE frases_modelo 
SET 
  texto = 'Nódulo pulmonar solitário no {{localizacao}}, medindo {{diametro_mm}} mm, com margens {{tipo_margens}}.',
  conclusao = 'Nódulo pulmonar solitário: correlacionar com história clínica e considerar seguimento/investigação conforme protocolo Fleischner.',
  variaveis = '[
    {"nome": "localizacao", "tipo": "select", "opcoes": ["lobo superior direito", "lobo médio", "lobo inferior direito", "lobo superior esquerdo", "língula", "lobo inferior esquerdo"], "obrigatorio": true, "descricao": "Localização do nódulo"},
    {"nome": "diametro_mm", "tipo": "numero", "minimo": 3, "maximo": 30, "obrigatorio": true, "unidade": "mm", "descricao": "Diâmetro do nódulo"},
    {"nome": "tipo_margens", "tipo": "select", "opcoes": ["lisas", "lobuladas", "espiculadas", "irregulares"], "obrigatorio": true, "descricao": "Tipo de margens"}
  ]'::jsonb
WHERE codigo = 'TC_NODULO_SOLITARIO';


-- =====================================================
-- FIM DA MIGRAÇÃO FASE 1+2
-- =====================================================
-- Total: 10 frases corrigidas
-- - 7 frases com tipo "text" convertidas
-- - 3 frases MM/RM/TC com tipo "texto" convertidas
-- =====================================================