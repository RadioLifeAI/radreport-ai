-- Phase 5: Correção de Templates TC - TC Braço + AngioTC TAVI + AngioTC Ablação
-- Adicionar 14 novas variáveis e conectar 25+ placeholders [ ]

-- ============================================================
-- 5A. TC_BRACO_NORMAL - Adicionar variável lado
-- ============================================================
UPDATE system_templates 
SET 
  variaveis = '[
    {
      "nome": "lado",
      "tipo": "select",
      "opcoes": ["direito", "esquerdo", "bilateral"],
      "descricao": "Lateralidade",
      "obrigatorio": true
    }
  ]'::jsonb
WHERE codigo = 'TC_BRACO_NORMAL';

-- ============================================================
-- 5B. ANGIOTC_AORTA_TORACICA_TAVI_NORMAL - Adicionar 5 variáveis e substituir 14 placeholders
-- ============================================================
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
                              'aspecto [ ]', 'aspecto {{aspecto_valva}}'),
                            'total de [ ] unidades Agatston', 'total de {{calcio_agatston}} unidades Agatston'),
                          'diâmetro de [ ] mm', 'diâmetro de {{diametro_anel_mm}} mm'),
                        'perímetro de [ ] mm', 'perímetro de {{perimetro_anel_mm}} mm'),
                      'área de [ ] mm²', 'área de {{area_anel_mm2}} mm²'),
                    'Distância ao óstio da coronária direita de [ ] mm', 'Distância ao óstio da coronária direita de {{distancia_ostio_cd_mm}} mm'),
                  'Distância ao óstio da coronária esquerda de [ ] mm', 'Distância ao óstio da coronária esquerda de {{distancia_ostio_ce_mm}} mm'),
                'Altura dos óstios coronarianos de [ ] mm', 'Altura dos óstios coronarianos de {{altura_ostios_mm}} mm'),
              'Altura da comissura direita de [ ] mm', 'Altura da comissura direita de {{altura_comissura_direita_mm}} mm'),
            'Altura da comissura esquerda de [ ] mm', 'Altura da comissura esquerda de {{altura_comissura_esquerda_mm}} mm'),
          'medida a 4 cm da valva aórtica de [ ] mm', 'medida a 4 cm da valva aórtica de {{aorta_4cm_mm}} mm'),
        'bulbo aórtico de [ ] mm', 'bulbo aórtico de {{bulbo_aortico_mm}} mm'),
      'aorta descendente de [ ] mm', 'aorta descendente de {{aorta_descendente_mm}} mm'),
    'arco transverso [ ] mm', 'arco transverso {{arco_transverso_mm}} mm'),
  variaveis = '[
    {
      "nome": "aspecto_valva",
      "tipo": "select",
      "opcoes": ["bicúspide", "tricúspide"],
      "descricao": "Aspecto da valva aórtica",
      "obrigatorio": true
    },
    {
      "nome": "calcio_agatston",
      "tipo": "numero",
      "unidade": "unidades",
      "descricao": "Score de cálcio Agatston",
      "minimo": 0,
      "maximo": 10000,
      "obrigatorio": true
    },
    {
      "nome": "diametro_anel_mm",
      "tipo": "numero",
      "unidade": "mm",
      "descricao": "Diâmetro do anel valvar",
      "minimo": 15,
      "maximo": 35,
      "obrigatorio": true
    },
    {
      "nome": "perimetro_anel_mm",
      "tipo": "numero",
      "unidade": "mm",
      "descricao": "Perímetro do anel valvar",
      "minimo": 50,
      "maximo": 110,
      "obrigatorio": true
    },
    {
      "nome": "area_anel_mm2",
      "tipo": "numero",
      "unidade": "mm²",
      "descricao": "Área do anel valvar",
      "minimo": 200,
      "maximo": 1000,
      "obrigatorio": true
    },
    {
      "nome": "distancia_ostio_cd_mm",
      "tipo": "numero",
      "unidade": "mm",
      "descricao": "Distância ao óstio da coronária direita",
      "minimo": 5,
      "maximo": 25,
      "obrigatorio": true
    },
    {
      "nome": "distancia_ostio_ce_mm",
      "tipo": "numero",
      "unidade": "mm",
      "descricao": "Distância ao óstio da coronária esquerda",
      "minimo": 5,
      "maximo": 25,
      "obrigatorio": true
    },
    {
      "nome": "altura_ostios_mm",
      "tipo": "numero",
      "unidade": "mm",
      "descricao": "Altura dos óstios coronarianos",
      "minimo": 8,
      "maximo": 20,
      "obrigatorio": true
    },
    {
      "nome": "altura_comissura_direita_mm",
      "tipo": "numero",
      "unidade": "mm",
      "descricao": "Altura da comissura direita",
      "minimo": 10,
      "maximo": 25,
      "obrigatorio": true
    },
    {
      "nome": "altura_comissura_esquerda_mm",
      "tipo": "numero",
      "unidade": "mm",
      "descricao": "Altura da comissura esquerda",
      "minimo": 10,
      "maximo": 25,
      "obrigatorio": true
    },
    {
      "nome": "aorta_4cm_mm",
      "tipo": "numero",
      "unidade": "mm",
      "descricao": "Diâmetro da aorta a 4 cm da valva",
      "minimo": 20,
      "maximo": 60,
      "obrigatorio": true
    },
    {
      "nome": "bulbo_aortico_mm",
      "tipo": "numero",
      "unidade": "mm",
      "descricao": "Diâmetro do bulbo aórtico",
      "minimo": 25,
      "maximo": 60,
      "obrigatorio": true
    },
    {
      "nome": "aorta_descendente_mm",
      "tipo": "numero",
      "unidade": "mm",
      "descricao": "Diâmetro da aorta descendente",
      "minimo": 15,
      "maximo": 50,
      "obrigatorio": true
    },
    {
      "nome": "arco_transverso_mm",
      "tipo": "numero",
      "unidade": "mm",
      "descricao": "Diâmetro do arco transverso",
      "minimo": 20,
      "maximo": 50,
      "obrigatorio": true
    }
  ]'::jsonb
WHERE codigo = 'ANGIOTC_AORTA_TORACICA_TAVI_NORMAL';

-- ============================================================
-- 5C. ANGIOTC_VEIAS_PULMONARES_ATRIO_ESQUERDO_ABLACAO_NORMAL
-- Adicionar 10 variáveis e substituir 11 placeholders
-- ============================================================
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
                      REPLACE(achados,
                        'VPSD: [ ] x [ ] mm', 'VPSD: {{vpsd_diam1_mm}} x {{vpsd_diam2_mm}} mm'),
                      'VPID: [ ] x [ ] mm', 'VPID: {{vpid_diam1_mm}} x {{vpid_diam2_mm}} mm'),
                    'VPSE: [ ] x [ ] mm', 'VPSE: {{vpse_diam1_mm}} x {{vpse_diam2_mm}} mm'),
                  'VPIE: [ ] x [ ] mm', 'VPIE: {{vpie_diam1_mm}} x {{vpie_diam2_mm}} mm'),
                'Transição AE-AAE: [ ] x [ ] mm', 'Transição AE-AAE: {{transicao_ae_aae_diam1_mm}} x {{transicao_ae_aae_diam2_mm}} mm'),
              'Átrio esquerdo: [ ] cm³', 'Átrio esquerdo: {{atrio_esquerdo_cm3}} cm³'),
            'Apêndice atrial esquerdo: [ ] cm³', 'Apêndice atrial esquerdo: {{apendice_atrial_cm3}} cm³'),
          'Átrio esquerdo: [ ] mL', 'Átrio esquerdo: {{atrio_esquerdo_cm3}} mL'),
        'Apêndice atrial esquerdo: [ ] mL', 'Apêndice atrial esquerdo: {{apendice_atrial_cm3}} mL'),
      'Átrio esquerdo: área [ ] cm²', 'Átrio esquerdo: área {{area_atrio_esquerdo_cm2}} cm²'),
    'Átrio esquerdo: diâmetro [ ] mm', 'Átrio esquerdo: diâmetro {{diametro_atrio_esquerdo_mm}} mm'),
  variaveis = '[
    {
      "nome": "vpsd_diam1_mm",
      "tipo": "numero",
      "unidade": "mm",
      "descricao": "VPSD - Diâmetro 1",
      "minimo": 5,
      "maximo": 30,
      "obrigatorio": true
    },
    {
      "nome": "vpsd_diam2_mm",
      "tipo": "numero",
      "unidade": "mm",
      "descricao": "VPSD - Diâmetro 2",
      "minimo": 5,
      "maximo": 30,
      "obrigatorio": true
    },
    {
      "nome": "vpid_diam1_mm",
      "tipo": "numero",
      "unidade": "mm",
      "descricao": "VPID - Diâmetro 1",
      "minimo": 5,
      "maximo": 30,
      "obrigatorio": true
    },
    {
      "nome": "vpid_diam2_mm",
      "tipo": "numero",
      "unidade": "mm",
      "descricao": "VPID - Diâmetro 2",
      "minimo": 5,
      "maximo": 30,
      "obrigatorio": true
    },
    {
      "nome": "vpse_diam1_mm",
      "tipo": "numero",
      "unidade": "mm",
      "descricao": "VPSE - Diâmetro 1",
      "minimo": 5,
      "maximo": 30,
      "obrigatorio": true
    },
    {
      "nome": "vpse_diam2_mm",
      "tipo": "numero",
      "unidade": "mm",
      "descricao": "VPSE - Diâmetro 2",
      "minimo": 5,
      "maximo": 30,
      "obrigatorio": true
    },
    {
      "nome": "vpie_diam1_mm",
      "tipo": "numero",
      "unidade": "mm",
      "descricao": "VPIE - Diâmetro 1",
      "minimo": 5,
      "maximo": 30,
      "obrigatorio": true
    },
    {
      "nome": "vpie_diam2_mm",
      "tipo": "numero",
      "unidade": "mm",
      "descricao": "VPIE - Diâmetro 2",
      "minimo": 5,
      "maximo": 30,
      "obrigatorio": true
    },
    {
      "nome": "transicao_ae_aae_diam1_mm",
      "tipo": "numero",
      "unidade": "mm",
      "descricao": "Transição AE-AAE - Diâmetro 1",
      "minimo": 10,
      "maximo": 40,
      "obrigatorio": true
    },
    {
      "nome": "transicao_ae_aae_diam2_mm",
      "tipo": "numero",
      "unidade": "mm",
      "descricao": "Transição AE-AAE - Diâmetro 2",
      "minimo": 10,
      "maximo": 40,
      "obrigatorio": true
    },
    {
      "nome": "atrio_esquerdo_cm3",
      "tipo": "numero",
      "unidade": "cm³",
      "descricao": "Volume do átrio esquerdo",
      "minimo": 20,
      "maximo": 200,
      "obrigatorio": true
    },
    {
      "nome": "apendice_atrial_cm3",
      "tipo": "numero",
      "unidade": "cm³",
      "descricao": "Volume do apêndice atrial esquerdo",
      "minimo": 1,
      "maximo": 50,
      "obrigatorio": true
    },
    {
      "nome": "area_atrio_esquerdo_cm2",
      "tipo": "numero",
      "unidade": "cm²",
      "descricao": "Área do átrio esquerdo",
      "minimo": 10,
      "maximo": 60,
      "obrigatorio": false
    },
    {
      "nome": "diametro_atrio_esquerdo_mm",
      "tipo": "numero",
      "unidade": "mm",
      "descricao": "Diâmetro do átrio esquerdo",
      "minimo": 20,
      "maximo": 80,
      "obrigatorio": false
    }
  ]'::jsonb
WHERE codigo = 'ANGIOTC_VEIAS_PULMONARES_ATRIO_ESQUERDO_ABLACAO_NORMAL';

-- Comentário final
COMMENT ON TABLE system_templates IS 'Phase 5 Complete: 3 TC templates corrected - TC Braço (1 variable), AngioTC TAVI (14 variables + 14 placeholders), AngioTC Ablação (14 variables + 11 placeholders). Total: 29 new variables, 25+ placeholder substitutions';