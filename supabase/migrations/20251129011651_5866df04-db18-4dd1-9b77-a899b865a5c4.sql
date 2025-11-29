-- Phase 4: Correção de Templates RM - Adicionar variáveis e substituir placeholders
-- RM Fetal, RM Pelve Endometriose, RM Pelve Masculina, RM Próstata Multiparamétrica

-- 1. RM_FETAL_NORMAL - Adicionar 4 variáveis select e substituir placeholders <>
UPDATE system_templates 
SET 
  achados = REPLACE(
    REPLACE(
      REPLACE(
        REPLACE(achados, 
          'situação <>', 'situação {{situacao}}'),
        'apresentação <>', 'apresentação {{apresentacao}}'),
      'posição do dorso à <>', 'posição do dorso à {{posicao_dorso}}'),
    'inserção <>', 'inserção {{insercao_placenta}}'),
  variaveis = '[
    {
      "nome": "situacao",
      "tipo": "select",
      "opcoes": ["longitudinal", "transversa", "oblíqua"],
      "descricao": "Situação fetal",
      "obrigatorio": true
    },
    {
      "nome": "apresentacao",
      "tipo": "select",
      "opcoes": ["cefálica", "pélvica"],
      "descricao": "Apresentação fetal",
      "obrigatorio": true
    },
    {
      "nome": "posicao_dorso",
      "tipo": "select",
      "opcoes": ["direita", "esquerda", "anterior", "posterior"],
      "descricao": "Posição do dorso",
      "obrigatorio": true
    },
    {
      "nome": "insercao_placenta",
      "tipo": "select",
      "opcoes": ["anterior", "posterior", "fúndica", "lateral direita", "lateral esquerda", "prévia"],
      "descricao": "Inserção placentária",
      "obrigatorio": true
    }
  ]'::jsonb
WHERE codigo = 'RM_FETAL_NORMAL';

-- 2. RM_PELVE_ENDOMETRIOSE - Substituir placeholders genéricos XXX, XX pelos {{variables}}
UPDATE system_templates 
SET 
  achados = REPLACE(
    REPLACE(
      REPLACE(
        REPLACE(
          REPLACE(achados,
            'XXX cm', '{{med_utero_cm}} cm'),
          'XX cm³', '{{vol_utero_cm3}} cm³'),
        'XX mm', '{{esp_endometrio_mm}} mm'),
      'XX x XX mm', '{{med_ovario_dir_mm}} mm'), -- ovário direito
    'XX x XX mm', '{{med_ovario_esq_mm}} mm')   -- ovário esquerdo (segunda ocorrência)
WHERE codigo = 'RM_PELVE_ENDOMETRIOSE';

-- 3. RM_PELVE_MASCULINA_NORMAL - Substituir X X cm e adicionar variável peso_prostata_g
UPDATE system_templates 
SET 
  achados = REPLACE(
    REPLACE(achados,
      'medindo X X cm', 'medindo {{med_prostata_cm}} cm'),
    'com peso de aproximadamente  g', 'com peso de aproximadamente {{peso_prostata_g}} g'),
  variaveis = jsonb_insert(
    COALESCE(variaveis, '[]'::jsonb),
    '{0}',
    '{
      "nome": "peso_prostata_g",
      "tipo": "numero",
      "unidade": "g",
      "descricao": "Peso estimado da próstata",
      "minimo": 10,
      "maximo": 200,
      "obrigatorio": true
    }'::jsonb
  )
WHERE codigo = 'RM_PELVE_MASCULINA_NORMAL';

-- 4. RM_PROSTATA_MULTIPARAMETRICA_NORMAL - Substituir X X cm, cm³, g pelos placeholders
UPDATE system_templates 
SET 
  achados = REPLACE(
    REPLACE(
      REPLACE(
        REPLACE(achados,
          'medindo X X cm', 'medindo {{med_prostata_cm}} cm'),
        ', com volume de cm³', ', com volume de {{vol_prostata_cm3}} cm³'),
      'e peso de  g', 'e peso de {{peso_prostata_g}} g'),
    'e um peso estimado de  g', 'e um peso estimado de {{peso_prostata_g}} g')
WHERE codigo = 'RM_PROSTATA_MULTIPARAMETRICA_NORMAL';

-- Comentário final
COMMENT ON TABLE system_templates IS 'Phase 4 Complete: 4 RM templates corrected with 5 new variables and 12+ placeholder substitutions (RM Fetal, RM Pelve Endometriose, RM Pelve Masculina, RM Próstata Multiparamétrica)';