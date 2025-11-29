-- ============================================================================
-- FASE 1: MIGRAÇÃO COMPLETA - 18 TEMPLATES DE ALTA PRIORIDADE
-- Converte valores hardcoded para variáveis dinâmicas em system_templates
-- ============================================================================

-- ----------------------------------------------------------------------------
-- FASE 1A: ANGIOTOMOGRAFIA TC - MEDIDAS (2 templates)
-- ----------------------------------------------------------------------------

-- Template: TAVI (Transcatheter Aortic Valve Implantation)
-- 14 variáveis de medidas anatômicas para planejamento cirúrgico
UPDATE system_templates 
SET 
  achados = REPLACE(
    REPLACE(
      REPLACE(
        REPLACE(
          REPLACE(
            REPLACE(
              REPLACE(
                REPLACE(
                  REPLACE(
                    REPLACE(
                      REPLACE(
                        REPLACE(
                          REPLACE(
                            REPLACE(achados,
                              'diâmetro do anel aórtico médio de [ ] mm', 'diâmetro do anel aórtico médio de {{diametro_anel_mm}} mm'),
                            'área do anel aórtico de [ ] mm²', 'área do anel aórtico de {{area_anel_mm2}} mm²'),
                          'perímetro do anel aórtico de [ ] mm', 'perímetro do anel aórtico de {{perimetro_anel_mm}} mm'),
                        'altura dos óstios coronarianos: óstio coronariano esquerdo a [ ] mm', 'altura dos óstios coronarianos: óstio coronariano esquerdo a {{altura_ostio_esq_mm}} mm'),
                      'óstio coronariano direito a [ ] mm', 'óstio coronariano direito a {{altura_ostio_dir_mm}} mm'),
                    'diâmetro da junção sinotubular de [ ] mm', 'diâmetro da junção sinotubular de {{diametro_juncao_sinotubular_mm}} mm'),
                  'diâmetro da aorta ascendente de [ ] mm', 'diâmetro da aorta ascendente de {{diametro_aorta_ascendente_mm}} mm'),
                'angulação da raiz aórtica em relação à aorta horizontal de [ ]°', 'angulação da raiz aórtica em relação à aorta horizontal de {{angulacao_raiz_graus}}°'),
              'angulação da raiz aórtica em relação à aorta sagital de [ ]°', 'angulação da raiz aórtica em relação à aorta sagital de {{angulacao_sagital_graus}}°'),
            'distância do anel aórtico até o tronco da coronária esquerda de [ ] mm', 'distância do anel aórtico até o tronco da coronária esquerda de {{dist_anel_coronaria_esq_mm}} mm'),
          'distância do anel aórtico até a coronária direita de [ ] mm', 'distância do anel aórtico até a coronária direita de {{dist_anel_coronaria_dir_mm}} mm'),
        'diâmetro das artérias ilíacas comuns: direita [ ] mm', 'diâmetro das artérias ilíacas comuns: direita {{diametro_iliaca_dir_mm}} mm'),
      'esquerda [ ] mm', 'esquerda {{diametro_iliaca_esq_mm}} mm'),
    'cálcio valvar (score de Agatston): [ ]', 'cálcio valvar (score de Agatston): {{calcio_agatston}}'),
  variaveis = '[
    {"nome": "diametro_anel_mm", "tipo": "numero", "descricao": "Diâmetro do anel aórtico médio", "obrigatorio": true, "unidade": "mm", "minimo": 18, "maximo": 32},
    {"nome": "area_anel_mm2", "tipo": "numero", "descricao": "Área do anel aórtico", "obrigatorio": true, "unidade": "mm²", "minimo": 250, "maximo": 800},
    {"nome": "perimetro_anel_mm", "tipo": "numero", "descricao": "Perímetro do anel aórtico", "obrigatorio": true, "unidade": "mm", "minimo": 60, "maximo": 100},
    {"nome": "altura_ostio_esq_mm", "tipo": "numero", "descricao": "Altura do óstio coronariano esquerdo", "obrigatorio": true, "unidade": "mm", "minimo": 8, "maximo": 20},
    {"nome": "altura_ostio_dir_mm", "tipo": "numero", "descricao": "Altura do óstio coronariano direito", "obrigatorio": true, "unidade": "mm", "minimo": 8, "maximo": 20},
    {"nome": "diametro_juncao_sinotubular_mm", "tipo": "numero", "descricao": "Diâmetro da junção sinotubular", "obrigatorio": true, "unidade": "mm", "minimo": 20, "maximo": 40},
    {"nome": "diametro_aorta_ascendente_mm", "tipo": "numero", "descricao": "Diâmetro da aorta ascendente", "obrigatorio": true, "unidade": "mm", "minimo": 25, "maximo": 45},
    {"nome": "angulacao_raiz_graus", "tipo": "numero", "descricao": "Angulação da raiz aórtica (horizontal)", "obrigatorio": true, "unidade": "°", "minimo": 0, "maximo": 90},
    {"nome": "angulacao_sagital_graus", "tipo": "numero", "descricao": "Angulação da raiz aórtica (sagital)", "obrigatorio": true, "unidade": "°", "minimo": 0, "maximo": 90},
    {"nome": "dist_anel_coronaria_esq_mm", "tipo": "numero", "descricao": "Distância anel-coronária esquerda", "obrigatorio": true, "unidade": "mm", "minimo": 8, "maximo": 20},
    {"nome": "dist_anel_coronaria_dir_mm", "tipo": "numero", "descricao": "Distância anel-coronária direita", "obrigatorio": true, "unidade": "mm", "minimo": 8, "maximo": 20},
    {"nome": "diametro_iliaca_dir_mm", "tipo": "numero", "descricao": "Diâmetro da ilíaca comum direita", "obrigatorio": true, "unidade": "mm", "minimo": 6, "maximo": 15},
    {"nome": "diametro_iliaca_esq_mm", "tipo": "numero", "descricao": "Diâmetro da ilíaca comum esquerda", "obrigatorio": true, "unidade": "mm", "minimo": 6, "maximo": 15},
    {"nome": "calcio_agatston", "tipo": "numero", "descricao": "Score de Agatston (cálcio valvar)", "obrigatorio": true, "minimo": 0, "maximo": 10000}
  ]'::jsonb
WHERE codigo = 'ANGIOTC_AORTA_TORACICA_TAVI_NORMAL';

-- Template: Ablação de Veias Pulmonares
-- 6 variáveis de medidas do átrio esquerdo
UPDATE system_templates 
SET 
  achados = REPLACE(
    REPLACE(
      REPLACE(
        REPLACE(
          REPLACE(
            REPLACE(achados,
              'volume do átrio esquerdo indexado de [ ] ml/m²', 'volume do átrio esquerdo indexado de {{volume_atrio_esq_ml_m2}} ml/m²'),
            'diâmetro ântero-posterior do átrio esquerdo de [ ] mm', 'diâmetro ântero-posterior do átrio esquerdo de {{diametro_ap_atrio_mm}} mm'),
          'diâmetro látero-lateral do átrio esquerdo de [ ] mm', 'diâmetro látero-lateral do átrio esquerdo de {{diametro_ll_atrio_mm}} mm'),
        'diâmetro súpero-inferior do átrio esquerdo de [ ] mm', 'diâmetro súpero-inferior do átrio esquerdo de {{diametro_si_atrio_mm}} mm'),
      'área da aurícula esquerda de [ ] mm²', 'área da aurícula esquerda de {{area_auricula_mm2}} mm²'),
    'área do óstio da aurícula esquerda de [ ] mm²', 'área do óstio da aurícula esquerda de {{area_ostio_auricula_mm2}} mm²'),
  variaveis = '[
    {"nome": "volume_atrio_esq_ml_m2", "tipo": "numero", "descricao": "Volume do átrio esquerdo indexado", "obrigatorio": true, "unidade": "ml/m²", "minimo": 20, "maximo": 120},
    {"nome": "diametro_ap_atrio_mm", "tipo": "numero", "descricao": "Diâmetro ântero-posterior do átrio esquerdo", "obrigatorio": true, "unidade": "mm", "minimo": 30, "maximo": 70},
    {"nome": "diametro_ll_atrio_mm", "tipo": "numero", "descricao": "Diâmetro látero-lateral do átrio esquerdo", "obrigatorio": true, "unidade": "mm", "minimo": 30, "maximo": 70},
    {"nome": "diametro_si_atrio_mm", "tipo": "numero", "descricao": "Diâmetro súpero-inferior do átrio esquerdo", "obrigatorio": true, "unidade": "mm", "minimo": 40, "maximo": 80},
    {"nome": "area_auricula_mm2", "tipo": "numero", "descricao": "Área da aurícula esquerda", "obrigatorio": true, "unidade": "mm²", "minimo": 200, "maximo": 1000},
    {"nome": "area_ostio_auricula_mm2", "tipo": "numero", "descricao": "Área do óstio da aurícula esquerda", "obrigatorio": true, "unidade": "mm²", "minimo": 100, "maximo": 500}
  ]'::jsonb
WHERE codigo = 'ANGIOTC_VEIAS_PULMONARES_ATRIO_ESQUERDO_ABLACAO_NORMAL';

-- ----------------------------------------------------------------------------
-- FASE 1B: RM PELVE/PRÓSTATA - MEDIDAS (3 templates)
-- ----------------------------------------------------------------------------

-- Template: Endometriose
-- 7 variáveis de medidas uterinas e ovarianas
UPDATE system_templates 
SET 
  achados = REPLACE(
    REPLACE(
      REPLACE(
        REPLACE(
          REPLACE(
            REPLACE(
              REPLACE(achados,
                'útero com dimensões de XXX cm', 'útero com dimensões de {{med_utero_cm}} cm'),
              'volume estimado de XXX cm³', 'volume estimado de {{vol_utero_cm3}} cm³'),
            'espessura endometrial de XXX mm', 'espessura endometrial de {{esp_endometrio_mm}} mm'),
          'ovário direito com dimensões de XXX cm', 'ovário direito com dimensões de {{med_ovario_dir_cm}} cm'),
        'volume de XXX cm³', 'volume de {{vol_ovario_dir_cm3}} cm³'),
      'ovário esquerdo com dimensões de XXX cm', 'ovário esquerdo com dimensões de {{med_ovario_esq_cm}} cm'),
    'volume de XXX cm³', 'volume de {{vol_ovario_esq_cm3}} cm³'),
  variaveis = '[
    {"nome": "med_utero_cm", "tipo": "texto", "descricao": "Medidas do útero (formato: X x X x X cm)", "obrigatorio": true},
    {"nome": "vol_utero_cm3", "tipo": "numero", "descricao": "Volume uterino", "obrigatorio": true, "unidade": "cm³", "minimo": 20, "maximo": 300},
    {"nome": "esp_endometrio_mm", "tipo": "numero", "descricao": "Espessura endometrial", "obrigatorio": true, "unidade": "mm", "minimo": 1, "maximo": 20},
    {"nome": "med_ovario_dir_cm", "tipo": "texto", "descricao": "Medidas do ovário direito (formato: X x X x X cm)", "obrigatorio": true},
    {"nome": "vol_ovario_dir_cm3", "tipo": "numero", "descricao": "Volume do ovário direito", "obrigatorio": true, "unidade": "cm³", "minimo": 2, "maximo": 50},
    {"nome": "med_ovario_esq_cm", "tipo": "texto", "descricao": "Medidas do ovário esquerdo (formato: X x X x X cm)", "obrigatorio": true},
    {"nome": "vol_ovario_esq_cm3", "tipo": "numero", "descricao": "Volume do ovário esquerdo", "obrigatorio": true, "unidade": "cm³", "minimo": 2, "maximo": 50}
  ]'::jsonb
WHERE codigo = 'RM_PELVE_ENDOMETRIOSE';

-- Template: Pelve Masculina
-- 2 variáveis de medidas prostáticas
UPDATE system_templates 
SET 
  achados = REPLACE(
    REPLACE(achados,
      'próstata com dimensões de XXX cm', 'próstata com dimensões de {{med_prostata_cm}} cm'),
    'volume estimado de XXX cm³', 'volume estimado de {{vol_prostata_cm3}} cm³'),
  variaveis = '[
    {"nome": "med_prostata_cm", "tipo": "texto", "descricao": "Medidas da próstata (formato: X x X x X cm)", "obrigatorio": true},
    {"nome": "vol_prostata_cm3", "tipo": "numero", "descricao": "Volume prostático", "obrigatorio": true, "unidade": "cm³", "minimo": 10, "maximo": 200}
  ]'::jsonb
WHERE codigo = 'RM_PELVE_MASCULINA_NORMAL';

-- Template: Próstata Multiparamétrica
-- 4 variáveis de medidas + classificação PI-RADS
UPDATE system_templates 
SET 
  achados = REPLACE(
    REPLACE(
      REPLACE(
        REPLACE(achados,
          'próstata com dimensões de XXX cm', 'próstata com dimensões de {{med_prostata_cm}} cm'),
        'volume estimado de XXX cm³', 'volume estimado de {{vol_prostata_cm3}} cm³'),
      'peso estimado de XXX g', 'peso estimado de {{peso_prostata_g}} g'),
    'PI-RADS: [ ]', 'PI-RADS: {{pirads}}'),
  impressao = REPLACE(impressao,
    'PI-RADS [ ]', 'PI-RADS {{pirads}}'),
  variaveis = '[
    {"nome": "med_prostata_cm", "tipo": "texto", "descricao": "Medidas da próstata (formato: X x X x X cm)", "obrigatorio": true},
    {"nome": "vol_prostata_cm3", "tipo": "numero", "descricao": "Volume prostático", "obrigatorio": true, "unidade": "cm³", "minimo": 10, "maximo": 200},
    {"nome": "peso_prostata_g", "tipo": "numero", "descricao": "Peso prostático estimado", "obrigatorio": true, "unidade": "g", "minimo": 10, "maximo": 200},
    {"nome": "pirads", "tipo": "select", "descricao": "Classificação PI-RADS", "obrigatorio": true, "opcoes": ["1 (muito baixa probabilidade)", "2 (baixa probabilidade)", "3 (probabilidade intermediária)", "4 (alta probabilidade)", "5 (muito alta probabilidade)"]}
  ]'::jsonb
WHERE codigo = 'RM_PROSTATA_MULTIPARAMETRICA_NORMAL';

-- ----------------------------------------------------------------------------
-- FASE 1C: LATERALIDADE MUSCULOESQUELÉTICA (8 templates)
-- ----------------------------------------------------------------------------

-- Variável padrão de lateralidade para templates musculoesqueléticos
UPDATE system_templates 
SET variaveis = '[
  {"nome": "lado", "tipo": "select", "descricao": "Lateralidade", "obrigatorio": true, "opcoes": ["direito", "esquerdo"]}
]'::jsonb,
achados = REPLACE(achados, 'direito/esquerdo', '{{lado}}'),
impressao = REPLACE(impressao, 'direito/esquerdo', '{{lado}}')
WHERE codigo IN (
  'RM_JOELHO_NORMAL',
  'RM_OMBRO_NORMAL',
  'RM_COTOVELO_NORMAL',
  'RM_QUADRIL_NORMAL',
  'RM_MÃO_NORMAL',
  'RM_MAO_POLEGAR_NORMAL',
  'RM_ANTEBRACO_NORMAL',
  'RM_COXA_NORMAL'
);

-- ----------------------------------------------------------------------------
-- FASE 1D: CALIBRE DO COLÉDOCO (2 templates)
-- ----------------------------------------------------------------------------

-- Templates de Colangiografia: adicionar medida do colédoco
UPDATE system_templates 
SET 
  achados = REPLACE(achados, '0.5 cm', '{{calibre_hepatocoledoco_cm}} cm'),
  variaveis = '[
    {"nome": "calibre_hepatocoledoco_cm", "tipo": "numero", "descricao": "Calibre do hepatocolédoco", "obrigatorio": true, "unidade": "cm", "minimo": 0.3, "maximo": 1.5, "valor_padrao": 0.5}
  ]'::jsonb
WHERE codigo IN (
  'RM_ABDOME_SUPERIOR_COLANGIO',
  'RM_COLANGIO_NORMAL'
);

-- ----------------------------------------------------------------------------
-- FASE 1E: LATERALIDADE MAMOGRAFIA (3 templates - já parcialmente migrados)
-- ----------------------------------------------------------------------------

-- Template: Mamografia Bilateral Completa
-- Adicionar variáveis faltantes (tamanho_cistos)
UPDATE system_templates 
SET 
  variaveis = jsonb_set(
    COALESCE(variaveis, '[]'::jsonb),
    '{2}',
    '{"nome": "tamanho_cistos", "tipo": "texto", "descricao": "Tamanho dos cistos mamários (ex: até 1.0 cm)", "obrigatorio": false}'::jsonb,
    true
  )
WHERE codigo = 'MG_MAMOGRAFIA_BILATERAL_COMPLETA';

-- Template: Tomossíntese
-- Adicionar variáveis faltantes (tamanho_cistos)
UPDATE system_templates 
SET 
  variaveis = jsonb_set(
    COALESCE(variaveis, '[]'::jsonb),
    '{2}',
    '{"nome": "tamanho_cistos", "tipo": "texto", "descricao": "Tamanho dos cistos mamários (ex: até 1.0 cm)", "obrigatorio": false}'::jsonb,
    true
  )
WHERE codigo = 'MG_MAMOGRAFIA_BILATERAL_TOMOSSINTESE';

-- Template: RM Mamas
-- Adicionar variáveis faltantes (lado_linfonodo)
UPDATE system_templates 
SET 
  variaveis = jsonb_set(
    COALESCE(variaveis, '[]'::jsonb),
    '{2}',
    '{"nome": "lado_linfonodo", "tipo": "select", "descricao": "Lateralidade dos linfonodos", "obrigatorio": false, "opcoes": ["ambas as mamas", "mama direita", "mama esquerda"]}'::jsonb,
    true
  )
WHERE codigo = 'RM_MAMAS_NORMAL';

-- ----------------------------------------------------------------------------
-- COMENTÁRIOS FINAIS
-- ----------------------------------------------------------------------------
COMMENT ON COLUMN system_templates.variaveis IS 
'Array JSONB de variáveis dinâmicas. Tipos: texto, numero, select, boolean. 
Suporta: opcoes[], valor_padrao, unidade, minimo, maximo, obrigatorio.
Substituição em template via {{nome_variavel}}.';

COMMENT ON COLUMN system_templates.condicoes_logicas IS 
'Array JSONB de regras condicionais para processamento dinâmico de templates.
Estrutura: [{condicao, acao, parametros}].';
