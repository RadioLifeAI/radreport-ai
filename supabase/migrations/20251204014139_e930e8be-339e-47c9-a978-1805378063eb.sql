-- Migration: Add placeholders to remaining templates - Phase 2
-- Templates: AngioTC Veias Pulmonares, USG Aparelho Urinário, RM Mamas, TC Joelhos

-- 1. ANGIOTC_VEIAS_PULMONARES_ATRIO_ESQUERDO_ABLACAO_NORMAL (14 variáveis)
-- Substituir todos os "[ ] x [ ] mm" pelos placeholders correspondentes
UPDATE system_templates 
SET achados = REPLACE(
  REPLACE(
    REPLACE(
      REPLACE(
        REPLACE(
          REPLACE(
            achados,
            'Veia pulmonar superior direita (VPSD): [ ] x [ ] mm.',
            'Veia pulmonar superior direita (VPSD): {{vpsd_diam1_mm}} x {{vpsd_diam2_mm}} mm.'
          ),
          'Veia pulmonar inferior direita (VPID): [ ] x [ ] mm.',
          'Veia pulmonar inferior direita (VPID): {{vpid_diam1_mm}} x {{vpid_diam2_mm}} mm.'
        ),
        'Veia pulmonar superior esquerda (VPSE): [ ] x [ ] mm.',
        'Veia pulmonar superior esquerda (VPSE): {{vpse_diam1_mm}} x {{vpse_diam2_mm}} mm.'
      ),
      'Veia pulmonar inferior esquerda (VPIE): [ ] x [ ] mm.',
      'Veia pulmonar inferior esquerda (VPIE): {{vpie_diam1_mm}} x {{vpie_diam2_mm}} mm.'
    ),
    'Transição átrio esquerdo - apêndice atrial esquerdo: [ ] x [ ] mm.',
    'Transição átrio esquerdo - apêndice atrial esquerdo: {{transicao_ae_aae_diam1_mm}} x {{transicao_ae_aae_diam2_mm}} mm.'
  ),
  'Diâmetro ântero-posterior do átrio esquerdo: [ ] mm.',
  'Diâmetro ântero-posterior do átrio esquerdo: {{diametro_atrio_esquerdo_mm}} mm.'
)
WHERE codigo = 'ANGIOTC_VEIAS_PULMONARES_ATRIO_ESQUERDO_ABLACAO_NORMAL'
AND achados LIKE '%[ ] x [ ] mm%';

-- 1b. AngioTC Veias Pulmonares - volumes (cm³)
UPDATE system_templates 
SET achados = REPLACE(
  REPLACE(
    REPLACE(
      achados,
      'Volume do átrio esquerdo: [ ] cm³.',
      'Volume do átrio esquerdo: {{atrio_esquerdo_cm3}} cm³.'
    ),
    'Volume do apêndice atrial esquerdo: [ ] cm³.',
    'Volume do apêndice atrial esquerdo: {{apendice_atrial_cm3}} cm³.'
  ),
  'Área do átrio esquerdo (em corte axial): [ ] cm².',
  'Área do átrio esquerdo (em corte axial): {{area_atrio_esquerdo_cm2}} cm².'
)
WHERE codigo = 'ANGIOTC_VEIAS_PULMONARES_ATRIO_ESQUERDO_ABLACAO_NORMAL'
AND achados LIKE '%[ ] cm%';

-- 2. USG_APARELHO_URINARIO (4 variáveis)
-- Identificar e substituir os placeholders de medidas renais
UPDATE system_templates 
SET achados = REPLACE(
  REPLACE(
    REPLACE(
      REPLACE(
        achados,
        'Rim direito: cm.',
        'Rim direito: {{med_rim_dir_cm}} cm.'
      ),
      'Espessura do parênquima: cm.',
      'Espessura do parênquima: {{esp_parenquima_dir_cm}} cm.'
    ),
    'Rim esquerdo: cm.',
    'Rim esquerdo: {{med_rim_esq_cm}} cm.'
  ),
  'Espessura do parênquima: cm.',
  'Espessura do parênquima: {{esp_parenquima_esq_cm}} cm.'
)
WHERE codigo = 'USG_APARELHO_URINARIO'
AND achados LIKE '%Rim direito: cm.%';

-- 3. RM_MAMAS_NORMAL (1 variável) - substituir opções por placeholder
UPDATE system_templates 
SET achados = REPLACE(
  achados,
  '(ambas as mamas/mama direita/mama esquerda)',
  '{{lado_linfonodo}}'
)
WHERE codigo = 'RM_MAMAS_NORMAL'
AND achados LIKE '%ambas as mamas/mama direita/mama esquerda%';

-- 4. TC_JOELHOS_BILATERAL_MEDIDAS (1 variável) - adicionar lateralidade
UPDATE system_templates 
SET achados = achados || E'\n\nExame realizado {{lado}}.'
WHERE codigo = 'TC_JOELHOS_BILATERAL_MEDIDAS'
AND achados NOT LIKE '%{{lado}}%';

-- 5. Atualizar RM_ABDOME_SUPERIOR_COLANGIO que pode ter ficado pendente
-- (o texto pode ter formato diferente)
UPDATE system_templates 
SET achados = REPLACE(achados, 'calibre preservado (0,5 cm)', 'calibre preservado ({{calibre_hepatocoledoco_cm}} cm)')
WHERE codigo = 'RM_ABDOME_SUPERIOR_COLANGIO'
AND achados LIKE '%calibre preservado (0,5 cm)%'
AND achados NOT LIKE '%{{calibre_hepatocoledoco_cm}}%';