-- =====================================================
-- CORREÇÃO COMPLETA DAS VARIÁVEIS DAS FRASES MODELO
-- =====================================================
-- Fase 1: Adicionar 22 variáveis faltantes no TI-RADS (N3, N4, ti_rads_texto)
-- Fase 2: Corrigir USG_ABD_FIG_COLECAO_VARIAVEL_001 (variáveis erradas)
-- Fase 3: Completar US_ABD_VESICULA_COLECISTITE_LITIASICA_BORDERLINE_002 (2 variáveis faltantes)
-- Fase 4: Converter todos "tipo": "number" → "tipo": "numero"
-- =====================================================

-- =====================================================
-- FASE 1: Corrigir TI-RADS com 4 nódulos
-- =====================================================
UPDATE frases_modelo 
SET variaveis = '[
  {"nome": "n1_localizacao", "tipo": "select", "opcoes": ["lobo direito", "lobo esquerdo", "istmo"], "obrigatorio": true, "descricao": "Localização do nódulo 1"},
  {"nome": "n1_terco", "tipo": "select", "opcoes": ["superior", "médio", "inferior"], "obrigatorio": true, "descricao": "Terço do nódulo 1"},
  {"nome": "n1_mx_cm", "tipo": "numero", "minimo": 0.1, "maximo": 10.0, "obrigatorio": true, "unidade": "cm", "descricao": "Maior eixo do nódulo 1"},
  {"nome": "n1_my_cm", "tipo": "numero", "minimo": 0.1, "maximo": 10.0, "obrigatorio": true, "unidade": "cm", "descricao": "Segundo eixo do nódulo 1"},
  {"nome": "n1_mz_cm", "tipo": "numero", "minimo": 0.1, "maximo": 10.0, "obrigatorio": true, "unidade": "cm", "descricao": "Terceiro eixo do nódulo 1"},
  {"nome": "n1_composicao", "tipo": "select", "opcoes": ["cístico/quase cístico", "esponjiforme", "misto cístico-sólido", "sólido/quase sólido"], "obrigatorio": true, "descricao": "Composição do nódulo 1"},
  {"nome": "n1_ecogenicidade", "tipo": "select", "opcoes": ["anecóico", "hiperecogênico", "isoecogênico", "hipoecogênico", "muito hipoecogênico"], "obrigatorio": true, "descricao": "Ecogenicidade do nódulo 1"},
  {"nome": "n1_formato", "tipo": "select", "opcoes": ["paralela à pele (mais largo que alto)", "perpendicular à pele (mais alto que largo)"], "obrigatorio": true, "descricao": "Formato do nódulo 1"},
  {"nome": "n1_margem", "tipo": "select", "opcoes": ["bem definidas", "mal definidas", "irregulares/lobuladas", "extensão extratireoidiana"], "obrigatorio": true, "descricao": "Margens do nódulo 1"},
  {"nome": "n1_focos_desc", "tipo": "select", "opcoes": ["sem focos ecogênicos", "com macrocalcificações", "com calcificações periféricas", "com múltiplos focos ecogênicos pontiformes"], "obrigatorio": true, "descricao": "Focos ecogênicos do nódulo 1"},
  {"nome": "n1_ti_rads_texto", "tipo": "select", "opcoes": ["TI-RADS 1 - Benigno", "TI-RADS 2 - Não suspeito", "TI-RADS 3 - Levemente suspeito", "TI-RADS 4 - Moderadamente suspeito", "TI-RADS 5 - Altamente suspeito"], "obrigatorio": true, "descricao": "Classificação TI-RADS do nódulo 1"},
  
  {"nome": "n2_localizacao", "tipo": "select", "opcoes": ["lobo direito", "lobo esquerdo", "istmo"], "obrigatorio": true, "descricao": "Localização do nódulo 2"},
  {"nome": "n2_terco", "tipo": "select", "opcoes": ["superior", "médio", "inferior"], "obrigatorio": true, "descricao": "Terço do nódulo 2"},
  {"nome": "n2_mx_cm", "tipo": "numero", "minimo": 0.1, "maximo": 10.0, "obrigatorio": true, "unidade": "cm", "descricao": "Maior eixo do nódulo 2"},
  {"nome": "n2_my_cm", "tipo": "numero", "minimo": 0.1, "maximo": 10.0, "obrigatorio": true, "unidade": "cm", "descricao": "Segundo eixo do nódulo 2"},
  {"nome": "n2_mz_cm", "tipo": "numero", "minimo": 0.1, "maximo": 10.0, "obrigatorio": true, "unidade": "cm", "descricao": "Terceiro eixo do nódulo 2"},
  {"nome": "n2_composicao", "tipo": "select", "opcoes": ["cístico/quase cístico", "esponjiforme", "misto cístico-sólido", "sólido/quase sólido"], "obrigatorio": true, "descricao": "Composição do nódulo 2"},
  {"nome": "n2_ecogenicidade", "tipo": "select", "opcoes": ["anecóico", "hiperecogênico", "isoecogênico", "hipoecogênico", "muito hipoecogênico"], "obrigatorio": true, "descricao": "Ecogenicidade do nódulo 2"},
  {"nome": "n2_formato", "tipo": "select", "opcoes": ["paralela à pele (mais largo que alto)", "perpendicular à pele (mais alto que largo)"], "obrigatorio": true, "descricao": "Formato do nódulo 2"},
  {"nome": "n2_margem", "tipo": "select", "opcoes": ["bem definidas", "mal definidas", "irregulares/lobuladas", "extensão extratireoidiana"], "obrigatorio": true, "descricao": "Margens do nódulo 2"},
  {"nome": "n2_focos_desc", "tipo": "select", "opcoes": ["sem focos ecogênicos", "com macrocalcificações", "com calcificações periféricas", "com múltiplos focos ecogênicos pontiformes"], "obrigatorio": true, "descricao": "Focos ecogênicos do nódulo 2"},
  {"nome": "n2_ti_rads_texto", "tipo": "select", "opcoes": ["TI-RADS 1 - Benigno", "TI-RADS 2 - Não suspeito", "TI-RADS 3 - Levemente suspeito", "TI-RADS 4 - Moderadamente suspeito", "TI-RADS 5 - Altamente suspeito"], "obrigatorio": true, "descricao": "Classificação TI-RADS do nódulo 2"},
  
  {"nome": "n3_localizacao", "tipo": "select", "opcoes": ["lobo direito", "lobo esquerdo", "istmo"], "obrigatorio": true, "descricao": "Localização do nódulo 3"},
  {"nome": "n3_terco", "tipo": "select", "opcoes": ["superior", "médio", "inferior"], "obrigatorio": true, "descricao": "Terço do nódulo 3"},
  {"nome": "n3_mx_cm", "tipo": "numero", "minimo": 0.1, "maximo": 10.0, "obrigatorio": true, "unidade": "cm", "descricao": "Maior eixo do nódulo 3"},
  {"nome": "n3_my_cm", "tipo": "numero", "minimo": 0.1, "maximo": 10.0, "obrigatorio": true, "unidade": "cm", "descricao": "Segundo eixo do nódulo 3"},
  {"nome": "n3_mz_cm", "tipo": "numero", "minimo": 0.1, "maximo": 10.0, "obrigatorio": true, "unidade": "cm", "descricao": "Terceiro eixo do nódulo 3"},
  {"nome": "n3_composicao", "tipo": "select", "opcoes": ["cístico/quase cístico", "esponjiforme", "misto cístico-sólido", "sólido/quase sólido"], "obrigatorio": true, "descricao": "Composição do nódulo 3"},
  {"nome": "n3_ecogenicidade", "tipo": "select", "opcoes": ["anecóico", "hiperecogênico", "isoecogênico", "hipoecogênico", "muito hipoecogênico"], "obrigatorio": true, "descricao": "Ecogenicidade do nódulo 3"},
  {"nome": "n3_formato", "tipo": "select", "opcoes": ["paralela à pele (mais largo que alto)", "perpendicular à pele (mais alto que largo)"], "obrigatorio": true, "descricao": "Formato do nódulo 3"},
  {"nome": "n3_margem", "tipo": "select", "opcoes": ["bem definidas", "mal definidas", "irregulares/lobuladas", "extensão extratireoidiana"], "obrigatorio": true, "descricao": "Margens do nódulo 3"},
  {"nome": "n3_focos_desc", "tipo": "select", "opcoes": ["sem focos ecogênicos", "com macrocalcificações", "com calcificações periféricas", "com múltiplos focos ecogênicos pontiformes"], "obrigatorio": true, "descricao": "Focos ecogênicos do nódulo 3"},
  {"nome": "n3_ti_rads_texto", "tipo": "select", "opcoes": ["TI-RADS 1 - Benigno", "TI-RADS 2 - Não suspeito", "TI-RADS 3 - Levemente suspeito", "TI-RADS 4 - Moderadamente suspeito", "TI-RADS 5 - Altamente suspeito"], "obrigatorio": true, "descricao": "Classificação TI-RADS do nódulo 3"},
  
  {"nome": "n4_localizacao", "tipo": "select", "opcoes": ["lobo direito", "lobo esquerdo", "istmo"], "obrigatorio": true, "descricao": "Localização do nódulo 4"},
  {"nome": "n4_terco", "tipo": "select", "opcoes": ["superior", "médio", "inferior"], "obrigatorio": true, "descricao": "Terço do nódulo 4"},
  {"nome": "n4_mx_cm", "tipo": "numero", "minimo": 0.1, "maximo": 10.0, "obrigatorio": true, "unidade": "cm", "descricao": "Maior eixo do nódulo 4"},
  {"nome": "n4_my_cm", "tipo": "numero", "minimo": 0.1, "maximo": 10.0, "obrigatorio": true, "unidade": "cm", "descricao": "Segundo eixo do nódulo 4"},
  {"nome": "n4_mz_cm", "tipo": "numero", "minimo": 0.1, "maximo": 10.0, "obrigatorio": true, "unidade": "cm", "descricao": "Terceiro eixo do nódulo 4"},
  {"nome": "n4_composicao", "tipo": "select", "opcoes": ["cístico/quase cístico", "esponjiforme", "misto cístico-sólido", "sólido/quase sólido"], "obrigatorio": true, "descricao": "Composição do nódulo 4"},
  {"nome": "n4_ecogenicidade", "tipo": "select", "opcoes": ["anecóico", "hiperecogênico", "isoecogênico", "hipoecogênico", "muito hipoecogênico"], "obrigatorio": true, "descricao": "Ecogenicidade do nódulo 4"},
  {"nome": "n4_formato", "tipo": "select", "opcoes": ["paralela à pele (mais largo que alto)", "perpendicular à pele (mais alto que largo)"], "obrigatorio": true, "descricao": "Formato do nódulo 4"},
  {"nome": "n4_margem", "tipo": "select", "opcoes": ["bem definidas", "mal definidas", "irregulares/lobuladas", "extensão extratireoidiana"], "obrigatorio": true, "descricao": "Margens do nódulo 4"},
  {"nome": "n4_focos_desc", "tipo": "select", "opcoes": ["sem focos ecogênicos", "com macrocalcificações", "com calcificações periféricas", "com múltiplos focos ecogênicos pontiformes"], "obrigatorio": true, "descricao": "Focos ecogênicos do nódulo 4"},
  {"nome": "n4_ti_rads_texto", "tipo": "select", "opcoes": ["TI-RADS 1 - Benigno", "TI-RADS 2 - Não suspeito", "TI-RADS 3 - Levemente suspeito", "TI-RADS 4 - Moderadamente suspeito", "TI-RADS 5 - Altamente suspeito"], "obrigatorio": true, "descricao": "Classificação TI-RADS do nódulo 4"}
]'::jsonb
WHERE codigo = 'US_CERV_TIREOIDE_NODULOS_TIRADS_ENUM_003';


-- =====================================================
-- FASE 2: Corrigir USG_ABD_FIG_COLECAO_VARIAVEL_001
-- =====================================================
UPDATE frases_modelo 
SET variaveis = '[
  {"nome": "tipo_paredes", "tipo": "select", "opcoes": ["finas", "regulares", "espessas", "irregulares"], "obrigatorio": true, "descricao": "Tipo das paredes da coleção"},
  {"nome": "tipo_conteudo", "tipo": "select", "opcoes": ["anecóide", "homogêneo", "heterogêneo", "com debris"], "obrigatorio": true, "descricao": "Tipo do conteúdo da coleção"},
  {"nome": "padrao_ecografico", "tipo": "select", "opcoes": ["anecóico", "hipoecogênico", "isoecogênico"], "obrigatorio": true, "descricao": "Padrão ecográfico da coleção"},
  {"nome": "segmento", "tipo": "select", "opcoes": ["I", "II", "III", "IVa", "IVb", "V", "VI", "VII", "VIII"], "obrigatorio": true, "descricao": "Segmento hepático"},
  {"nome": "medida", "tipo": "texto", "obrigatorio": true, "descricao": "Medidas da coleção (ex: 3,0 x 2,5 x 2,0 cm)"}
]'::jsonb
WHERE codigo = 'USG_ABD_FIG_COLECAO_VARIAVEL_001';


-- =====================================================
-- FASE 3: Completar US_ABD_VESICULA_COLECISTITE_LITIASICA_BORDERLINE_002
-- =====================================================
UPDATE frases_modelo 
SET variaveis = '[
  {"nome": "dimensao_cm", "tipo": "texto", "obrigatorio": true, "descricao": "Dimensões da vesícula (ex: 10,0 x 4,0 cm)"},
  {"nome": "espessura_parede_mm", "tipo": "numero", "minimo": 2.5, "maximo": 6.0, "obrigatorio": true, "unidade": "mm", "descricao": "Espessura da parede vesicular"},
  {"nome": "maior_calculo_cm", "tipo": "numero", "minimo": 0.2, "maximo": 3.0, "obrigatorio": true, "unidade": "cm", "descricao": "Maior cálculo (cm)"}
]'::jsonb
WHERE codigo = 'US_ABD_VESICULA_COLECISTITE_LITIASICA_BORDERLINE_002';


-- =====================================================
-- FASE 4: Converter globalmente "tipo": "number" → "tipo": "numero"
-- =====================================================
UPDATE frases_modelo 
SET variaveis = (
  SELECT jsonb_agg(
    CASE 
      WHEN elem->>'tipo' = 'number' THEN jsonb_set(elem, '{tipo}', '"numero"'::jsonb)
      ELSE elem
    END
  )
  FROM jsonb_array_elements(variaveis) elem
)
WHERE variaveis IS NOT NULL 
  AND variaveis::text != '[]'
  AND variaveis::text LIKE '%"tipo":"number"%';


-- =====================================================
-- FIM DA CORREÇÃO DAS VARIÁVEIS
-- =====================================================
-- Total estimado de registros afetados: ~4 frases
-- Tempo estimado de execução: <1 segundo
-- =====================================================