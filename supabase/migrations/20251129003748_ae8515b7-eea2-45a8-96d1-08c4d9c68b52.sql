-- ========================================
-- FASE 2 COMPLETA: Migração de 24 Templates
-- RM Cardíaco, AngioTC Coronárias, Mamografia, TC Musculoesqueléticos, RM Coluna/Encéfalo
-- ========================================

-- ========================================
-- FASE 2A: Templates de Alta Complexidade (3 templates)
-- ========================================

-- 1. RM CARDÍACO NORMAL (10 variáveis volumétricas)
UPDATE system_templates 
SET 
  achados = 'Morfologia ventricular preservada. Dimensões de AD {{dimensoes_ad}}, VD {{dimensoes_vd}}, AE {{dimensoes_ae}} e VE {{dimensoes_ve}}. Volume indexado diastólico final do ventrículo direito de {{ivdfvd}} ml/m². Volume indexado sistólico final do ventrículo direito de {{ivsfvd}} ml/m². Fração de ejeção do ventrículo direito de {{fevd}}%. Volume indexado diastólico final do ventrículo esquerdo de {{ivdfve}} ml/m². Volume indexado sistólico final do ventrículo esquerdo de {{ivsfve}} ml/m². Fração de ejeção do ventrículo esquerdo de {{feve}}%. Mobilidade global e segmentar normal do ventrículo esquerdo. Mobilidade global e segmentar normal do ventrículo direito. Atrio esquerdo com volume indexado de {{ivae}} ml/m². Avaliação hemodinâmica: não caracterizado sinais de disfunção ou sobrecarga hemodinâmica. Realce tardio miocárdico ao gadolínio negativo. Não caracterizado sinais de fibrose miocárdica. Estruturas pericárdicas dentro da normalidade.',
  
  impressao = 'Ressonância magnética do coração dentro dos padrões de normalidade.',
  
  variaveis = '[
    {
      "nome": "dimensoes_ad",
      "tipo": "select",
      "descricao": "Dimensões do átrio direito",
      "obrigatorio": true,
      "opcoes": ["preservadas", "aumentadas"]
    },
    {
      "nome": "dimensoes_vd",
      "tipo": "select",
      "descricao": "Dimensões do ventrículo direito",
      "obrigatorio": true,
      "opcoes": ["preservadas", "aumentadas"]
    },
    {
      "nome": "dimensoes_ae",
      "tipo": "select",
      "descricao": "Dimensões do átrio esquerdo",
      "obrigatorio": true,
      "opcoes": ["preservadas", "aumentadas"]
    },
    {
      "nome": "dimensoes_ve",
      "tipo": "select",
      "descricao": "Dimensões do ventrículo esquerdo",
      "obrigatorio": true,
      "opcoes": ["preservadas", "aumentadas"]
    },
    {
      "nome": "ivdfvd",
      "tipo": "numero",
      "descricao": "Volume indexado diastólico final VD",
      "obrigatorio": true,
      "unidade": "ml/m²",
      "minimo": 30,
      "maximo": 150
    },
    {
      "nome": "ivsfvd",
      "tipo": "numero",
      "descricao": "Volume indexado sistólico final VD",
      "obrigatorio": true,
      "unidade": "ml/m²",
      "minimo": 10,
      "maximo": 80
    },
    {
      "nome": "fevd",
      "tipo": "numero",
      "descricao": "Fração de ejeção VD",
      "obrigatorio": true,
      "unidade": "%",
      "minimo": 30,
      "maximo": 80
    },
    {
      "nome": "ivdfve",
      "tipo": "numero",
      "descricao": "Volume indexado diastólico final VE",
      "obrigatorio": true,
      "unidade": "ml/m²",
      "minimo": 40,
      "maximo": 120
    },
    {
      "nome": "ivsfve",
      "tipo": "numero",
      "descricao": "Volume indexado sistólico final VE",
      "obrigatorio": true,
      "unidade": "ml/m²",
      "minimo": 10,
      "maximo": 60
    },
    {
      "nome": "feve",
      "tipo": "numero",
      "descricao": "Fração de ejeção VE",
      "obrigatorio": true,
      "unidade": "%",
      "minimo": 40,
      "maximo": 80
    },
    {
      "nome": "ivae",
      "tipo": "numero",
      "descricao": "Volume indexado do átrio esquerdo",
      "obrigatorio": true,
      "unidade": "ml/m²",
      "minimo": 15,
      "maximo": 80
    }
  ]'::jsonb
WHERE codigo = 'RM_CARDIACO_NORMAL';

-- 2. ANGIOTC CORONÁRIAS - NORMAL (escore Agatston + dominância + TCE)
UPDATE system_templates 
SET 
  achados = 'Tronco da coronária esquerda {{tce_morfologia}}, com até X mm de diâmetro, sem lesões calcificadas ou ateromatosas significativas. Ramo descendente anterior sem lesões calcificadas ou ateromatosas significativas. Ramo circunflexo sem lesões calcificadas ou ateromatosas significativas. Artéria coronária direita sem lesões calcificadas ou ateromatosas significativas. Dominância: {{dominancia}}. Escore de cálcio de Agatston: {{escore_agatston}}.',
  
  impressao = 'Coronárias sem lesões estenóticas ou ateromatosas significativas. Padrão de {{dominancia}}. Escore de cálcio de Agatston {{escore_agatston}}.',
  
  variaveis = '[
    {
      "nome": "escore_agatston",
      "tipo": "numero",
      "descricao": "Escore de cálcio de Agatston",
      "obrigatorio": true,
      "unidade": "",
      "minimo": 0,
      "maximo": 10000,
      "valor_padrao": 0
    },
    {
      "nome": "dominancia",
      "tipo": "select",
      "descricao": "Dominância coronariana",
      "obrigatorio": true,
      "opcoes": ["coronária direita dominante", "coronária esquerda dominante", "sistema balanceado"]
    },
    {
      "nome": "tce_morfologia",
      "tipo": "select",
      "descricao": "Morfologia do tronco da coronária esquerda",
      "obrigatorio": true,
      "opcoes": ["bifurcado", "trifurcado"]
    }
  ]'::jsonb
WHERE codigo = 'TC_ANGIOTC_CORONARIAS_NORMAL';

-- 3. ANGIOTC CORONÁRIAS - PONTE MIOCÁRDICA
UPDATE system_templates 
SET 
  achados = 'Tronco da coronária esquerda {{tce_morfologia}}, com até X mm de diâmetro, sem lesões calcificadas ou ateromatosas significativas. Ramo descendente anterior com trajeto intramuscular (ponte miocárdica) em seu segmento médio, sem evidências de redução luminal em fase sistólica. Ramo circunflexo sem lesões calcificadas ou ateromatosas significativas. Artéria coronária direita sem lesões calcificadas ou ateromatosas significativas. Dominância: {{dominancia}}. Escore de cálcio de Agatston: {{escore_agatston}}.',
  
  impressao = 'Trajeto intramuscular (ponte miocárdica) no segmento médio do ramo descendente anterior, sem evidências de compressão. Demais coronárias sem lesões. Padrão de {{dominancia}}. Escore de cálcio de Agatston {{escore_agatston}}.',
  
  variaveis = '[
    {
      "nome": "escore_agatston",
      "tipo": "numero",
      "descricao": "Escore de cálcio de Agatston",
      "obrigatorio": true,
      "unidade": "",
      "minimo": 0,
      "maximo": 10000,
      "valor_padrao": 0
    },
    {
      "nome": "dominancia",
      "tipo": "select",
      "descricao": "Dominância coronariana",
      "obrigatorio": true,
      "opcoes": ["coronária direita dominante", "coronária esquerda dominante", "sistema balanceado"]
    },
    {
      "nome": "tce_morfologia",
      "tipo": "select",
      "descricao": "Morfologia do tronco da coronária esquerda",
      "obrigatorio": true,
      "opcoes": ["bifurcado", "trifurcado"]
    }
  ]'::jsonb
WHERE codigo = 'TC_ANGIOTC_CORONARIAS_PONTE_MIOCARDICA';

-- ========================================
-- FASE 2B: Mamografia por Densidade (3 templates)
-- ========================================

-- 1. MG MAMOGRAFIA BILATERAL EXTREMAMENTE DENSA
UPDATE system_templates 
SET 
  achados = 'Mamas com composição extremamente densa, o que pode reduzir a sensibilidade da mamografia. Sem nódulos, assimetrias focais, distorções arquiteturais ou calcificações suspeitas de malignidade.',
  
  impressao = 'BI-RADS {{birads}}: mamografia bilateral negativa. Mamas extremamente densas. Controle em {{intervalo_rastreamento}}.',
  
  variaveis = '[
    {
      "nome": "birads",
      "tipo": "select",
      "descricao": "Categoria BI-RADS",
      "obrigatorio": true,
      "opcoes": ["0", "1", "2", "3", "4A", "4B", "4C", "5", "6"]
    },
    {
      "nome": "intervalo_rastreamento",
      "tipo": "select",
      "descricao": "Intervalo de rastreamento recomendado",
      "obrigatorio": true,
      "opcoes": ["6 meses", "1 ano", "2 anos"]
    }
  ]'::jsonb
WHERE codigo = 'MG_MAMOGRAFIA_BILATERAL_EXTREMAMENTE_DENSA';

-- 2. MG MAMOGRAFIA BILATERAL FIBROGLANDULARES ESPARSAS
UPDATE system_templates 
SET 
  achados = 'Mamas com áreas esparsas de tecido fibroglandular. Sem nódulos, assimetrias focais, distorções arquiteturais ou calcificações suspeitas de malignidade.',
  
  impressao = 'BI-RADS {{birads}}: mamografia bilateral negativa. Controle em {{intervalo_rastreamento}}.',
  
  variaveis = '[
    {
      "nome": "birads",
      "tipo": "select",
      "descricao": "Categoria BI-RADS",
      "obrigatorio": true,
      "opcoes": ["0", "1", "2", "3", "4A", "4B", "4C", "5", "6"]
    },
    {
      "nome": "intervalo_rastreamento",
      "tipo": "select",
      "descricao": "Intervalo de rastreamento recomendado",
      "obrigatorio": true,
      "opcoes": ["6 meses", "1 ano", "2 anos"]
    }
  ]'::jsonb
WHERE codigo = 'MG_MAMOGRAFIA_BILATERAL_FIBROGLANDULARES_ESPARSAS';

-- 3. MG MAMOGRAFIA BILATERAL HETEROGENEAMENTE DENSA
UPDATE system_templates 
SET 
  achados = 'Mamas heterogeneamente densas, o que pode obscurecer pequenas lesões. Sem nódulos, assimetrias focais, distorções arquiteturais ou calcificações suspeitas de malignidade.',
  
  impressao = 'BI-RADS {{birads}}: mamografia bilateral negativa. Mamas heterogeneamente densas. Controle em {{intervalo_rastreamento}}.',
  
  variaveis = '[
    {
      "nome": "birads",
      "tipo": "select",
      "descricao": "Categoria BI-RADS",
      "obrigatorio": true,
      "opcoes": ["0", "1", "2", "3", "4A", "4B", "4C", "5", "6"]
    },
    {
      "nome": "intervalo_rastreamento",
      "tipo": "select",
      "descricao": "Intervalo de rastreamento recomendado",
      "obrigatorio": true,
      "opcoes": ["6 meses", "1 ano", "2 anos"]
    }
  ]'::jsonb
WHERE codigo = 'MG_MAMOGRAFIA_BILATERAL_HETEROGENEAMENTE_DENSA';

-- ========================================
-- FASE 2C: TC Musculoesqueléticos (10 templates)
-- ========================================

-- Adicionar variável {{lado}} a todos os templates TC musculoesqueléticos
UPDATE system_templates 
SET 
  achados = REPLACE(achados, 'Joelho', 'Joelho {{lado}}'),
  impressao = REPLACE(impressao, 'joelho', 'joelho {{lado}}'),
  variaveis = '[
    {
      "nome": "lado",
      "tipo": "select",
      "descricao": "Lateralidade",
      "obrigatorio": true,
      "opcoes": ["direito", "esquerdo", "bilateral"]
    }
  ]'::jsonb
WHERE codigo IN (
  'TC_JOELHO_NORMAL',
  'TC_JOELHOS_BILATERAL_MEDIDAS'
);

UPDATE system_templates 
SET 
  achados = REPLACE(achados, 'Cotovelo', 'Cotovelo {{lado}}'),
  impressao = REPLACE(impressao, 'cotovelo', 'cotovelo {{lado}}'),
  variaveis = '[
    {
      "nome": "lado",
      "tipo": "select",
      "descricao": "Lateralidade",
      "obrigatorio": true,
      "opcoes": ["direito", "esquerdo", "bilateral"]
    }
  ]'::jsonb
WHERE codigo = 'TC_COTOVELO_NORMAL';

UPDATE system_templates 
SET 
  achados = REPLACE(achados, 'Ombro', 'Ombro {{lado}}'),
  impressao = REPLACE(impressao, 'ombro', 'ombro {{lado}}'),
  variaveis = '[
    {
      "nome": "lado",
      "tipo": "select",
      "descricao": "Lateralidade",
      "obrigatorio": true,
      "opcoes": ["direito", "esquerdo", "bilateral"]
    }
  ]'::jsonb
WHERE codigo = 'TC_OMBRO_NORMAL';

UPDATE system_templates 
SET 
  achados = REPLACE(achados, 'Quadril', 'Quadril {{lado}}'),
  impressao = REPLACE(impressao, 'quadril', 'quadril {{lado}}'),
  variaveis = '[
    {
      "nome": "lado",
      "tipo": "select",
      "descricao": "Lateralidade",
      "obrigatorio": true,
      "opcoes": ["direito", "esquerdo", "bilateral"]
    }
  ]'::jsonb
WHERE codigo = 'TC_QUADRIL_NORMAL';

UPDATE system_templates 
SET 
  achados = REPLACE(achados, 'Mão', 'Mão {{lado}}'),
  impressao = REPLACE(impressao, 'mão', 'mão {{lado}}'),
  variaveis = '[
    {
      "nome": "lado",
      "tipo": "select",
      "descricao": "Lateralidade",
      "obrigatorio": true,
      "opcoes": ["direita", "esquerda", "bilateral"]
    }
  ]'::jsonb
WHERE codigo = 'TC_MAO_NORMAL';

UPDATE system_templates 
SET 
  achados = REPLACE(achados, 'Pé', 'Pé {{lado}}'),
  impressao = REPLACE(impressao, 'pé', 'pé {{lado}}'),
  variaveis = '[
    {
      "nome": "lado",
      "tipo": "select",
      "descricao": "Lateralidade",
      "obrigatorio": true,
      "opcoes": ["direito", "esquerdo", "bilateral"]
    }
  ]'::jsonb
WHERE codigo = 'TC_PE_NORMAL';

UPDATE system_templates 
SET 
  achados = REPLACE(achados, 'Punho', 'Punho {{lado}}'),
  impressao = REPLACE(impressao, 'punho', 'punho {{lado}}'),
  variaveis = '[
    {
      "nome": "lado",
      "tipo": "select",
      "descricao": "Lateralidade",
      "obrigatorio": true,
      "opcoes": ["direito", "esquerdo", "bilateral"]
    }
  ]'::jsonb
WHERE codigo = 'TC_PUNHO_NORMAL';

UPDATE system_templates 
SET 
  achados = REPLACE(achados, 'Tornozelo', 'Tornozelo {{lado}}'),
  impressao = REPLACE(impressao, 'tornozelo', 'tornozelo {{lado}}'),
  variaveis = '[
    {
      "nome": "lado",
      "tipo": "select",
      "descricao": "Lateralidade",
      "obrigatorio": true,
      "opcoes": ["direito", "esquerdo", "bilateral"]
    }
  ]'::jsonb
WHERE codigo = 'TC_TORNOZELO_NORMAL';

UPDATE system_templates 
SET 
  achados = REPLACE(achados, 'Coxa', 'Coxa {{lado}}'),
  impressao = REPLACE(impressao, 'coxa', 'coxa {{lado}}'),
  variaveis = '[
    {
      "nome": "lado",
      "tipo": "select",
      "descricao": "Lateralidade",
      "obrigatorio": true,
      "opcoes": ["direita", "esquerda", "bilateral"]
    }
  ]'::jsonb
WHERE codigo = 'TC_COXA_NORMAL';

UPDATE system_templates 
SET 
  achados = REPLACE(achados, 'Perna', 'Perna {{lado}}'),
  impressao = REPLACE(impressao, 'perna', 'perna {{lado}}'),
  variaveis = '[
    {
      "nome": "lado",
      "tipo": "select",
      "descricao": "Lateralidade",
      "obrigatorio": true,
      "opcoes": ["direita", "esquerda", "bilateral"]
    }
  ]'::jsonb
WHERE codigo = 'TC_PERNA_NORMAL';

-- ========================================
-- FASE 2D: RM Coluna/Encéfalo (8 templates)
-- ========================================

-- 1. RM COLUNA CERVICAL - remover ____
UPDATE system_templates 
SET 
  achados = REPLACE(REPLACE(achados, '____', ''), '  ', ' '),
  impressao = REPLACE(REPLACE(impressao, '____', ''), '  ', ' ')
WHERE codigo = 'RM_COLUNA_CERVICAL_NORMAL';

-- 2. RM COLUNA LOMOSSACRA - remover ____
UPDATE system_templates 
SET 
  achados = REPLACE(REPLACE(achados, '____', ''), '  ', ' '),
  impressao = REPLACE(REPLACE(impressao, '____', ''), '  ', ' ')
WHERE codigo = 'RM_COLUNA_LOMOSSACRA_NORMAL';

-- 3. RM COLUNA TORÁCICA - remover ____
UPDATE system_templates 
SET 
  achados = REPLACE(REPLACE(achados, '____', ''), '  ', ' '),
  impressao = REPLACE(REPLACE(impressao, '____', ''), '  ', ' ')
WHERE codigo = 'RM_COLUNA_TORACICA_NORMAL';

-- 4. RM ENCÉFALO NORMAL - remover ____
UPDATE system_templates 
SET 
  achados = REPLACE(REPLACE(achados, '____', ''), '  ', ' '),
  impressao = REPLACE(REPLACE(impressao, '____', ''), '  ', ' ')
WHERE codigo = 'RM_ENCEFALO_NORMAL';

-- 5. RM ENCÉFALO MICROANGIOPATIA (adicionar variável grau)
UPDATE system_templates 
SET 
  achados = 'Discreta atrofia cortical para a faixa etária. Focos de hipersinal em T2/FLAIR na substância branca periventricular e subcortical, sugestivos de doença microangiopática {{grau_microangiopatia}}. Ventrículos laterais de volume preservado. Terceiro e quarto ventrículos de volume preservado. Aqueduto cerebral patente. Tonsilas cerebelares em topografia habitual. Região selar e paraselar sem alterações. Ouvidos internos sem anormalidades.',
  
  impressao = 'Alterações de natureza microangiopática de grau {{grau_microangiopatia}}.',
  
  variaveis = '[
    {
      "nome": "grau_microangiopatia",
      "tipo": "select",
      "descricao": "Grau da microangiopatia",
      "obrigatorio": true,
      "opcoes": ["discreto", "moderado", "acentuado"]
    }
  ]'::jsonb
WHERE codigo = 'RM_ENCEFALO_MICROANGIOPATIA';

-- 6. RM ENCÉFALO ATROFIA (adicionar variável grau_atrofia)
UPDATE system_templates 
SET 
  achados = 'Atrofia cortical {{grau_atrofia}} para a faixa etária. Ventrículos laterais de volume discretamente aumentado. Terceiro e quarto ventrículos de volume preservado. Aqueduto cerebral patente. Tonsilas cerebelares em topografia habitual. Região selar e paraselar sem alterações. Ouvidos internos sem anormalidades.',
  
  impressao = 'Atrofia cortical {{grau_atrofia}} para a faixa etária.',
  
  variaveis = '[
    {
      "nome": "grau_atrofia",
      "tipo": "select",
      "descricao": "Grau da atrofia cortical",
      "obrigatorio": true,
      "opcoes": ["não significativa", "discreta", "moderada", "acentuada"]
    }
  ]'::jsonb
WHERE codigo LIKE '%ATROFIA%' AND modalidade_codigo = 'RM';

-- 7. RM ATM BILATERAL - remover ____
UPDATE system_templates 
SET 
  achados = REPLACE(REPLACE(achados, '____', ''), '  ', ' '),
  impressao = REPLACE(REPLACE(impressao, '____', ''), '  ', ' ')
WHERE codigo = 'RM_ATM_BILATERAL_NORMAL';

-- 8. RM SELA TÚRCICA - remover ____
UPDATE system_templates 
SET 
  achados = REPLACE(REPLACE(achados, '____', ''), '  ', ' '),
  impressao = REPLACE(REPLACE(impressao, '____', ''), '  ', ' ')
WHERE codigo = 'RM_SELA_TURCICA_NORMAL';

-- ========================================
-- Comentários finais
-- ========================================

COMMENT ON COLUMN system_templates.variaveis IS 'Array JSONB de variáveis dinâmicas no formato: [{nome, tipo, descricao, obrigatorio, opcoes, valor_padrao, unidade, minimo, maximo}]. Fase 2 completa migrou 24 templates com ~41 novas variáveis.';
