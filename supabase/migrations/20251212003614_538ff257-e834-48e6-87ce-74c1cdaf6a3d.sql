-- Migração para popular titulo com base no campo conclusao (mais fidedigno)
-- Prioridade: conclusao > tags[1] > categoria (se não for genérico)

-- 1. Atualizar titulo a partir de conclusao, removendo prefixos comuns
UPDATE frases_modelo 
SET titulo = TRIM(
  REGEXP_REPLACE(
    REGEXP_REPLACE(
      REGEXP_REPLACE(
        REGEXP_REPLACE(
          REGEXP_REPLACE(
            REGEXP_REPLACE(
              REGEXP_REPLACE(conclusao, '^Sinais de ', '', 'i'),
              '^Sinais ecográficos de ', '', 'i'
            ),
            '^Aspectos ecográficos de ', '', 'i'
          ),
          '^Aspectos sugestivos de ', '', 'i'
        ),
        '^Imagem sugestiva de ', '', 'i'
      ),
      '^Sugestivo de ', '', 'i'
    ),
    '\.$', ''  -- Remove ponto final
  )
)
WHERE conclusao IS NOT NULL 
  AND conclusao != ''
  AND LENGTH(conclusao) <= 120;  -- Só conclusões curtas (diagnósticos diretos)

-- 2. Capitalizar primeira letra
UPDATE frases_modelo 
SET titulo = INITCAP(SUBSTRING(titulo FROM 1 FOR 1)) || SUBSTRING(titulo FROM 2)
WHERE titulo IS NOT NULL AND titulo != '';

-- 3. Para frases sem conclusao ou com conclusao muito longa, usar primeira tag como fallback
UPDATE frases_modelo 
SET titulo = INITCAP(tags[1])
WHERE (titulo IS NULL OR titulo = '' OR titulo IN ('descritivo', 'Descritivo'))
  AND tags IS NOT NULL 
  AND array_length(tags, 1) > 0
  AND LENGTH(tags[1]) <= 60;

-- 4. Manter categoria apenas se for um diagnóstico real (não genérico)
UPDATE frases_modelo 
SET titulo = categoria
WHERE (titulo IS NULL OR titulo = '')
  AND categoria IS NOT NULL 
  AND categoria != ''
  AND categoria NOT IN (
    'descritivo', 'Descritivo', 
    'Cotovelo', 'Transvaginal', 'Ombro', 'Joelho', 'Quadril',
    'Punho', 'Mão', 'Tornozelo', 'Pé', 'Coluna', 'Tórax',
    'Abdome', 'Pelve', 'Pescoço', 'Mama', 'Tireoide'
  );

-- 5. Fallback: extrair do código removendo prefixos de modalidade/região
UPDATE frases_modelo 
SET titulo = INITCAP(
  REPLACE(
    REGEXP_REPLACE(
      REGEXP_REPLACE(codigo, '^(US|USG|TC|RM|RX|MN)_[A-Z]+_[A-Z]+_', '', 'i'),
      '_\d{3}$', ''
    ),
    '_', ' '
  )
)
WHERE titulo IS NULL OR titulo = '' OR titulo IN ('descritivo', 'Descritivo');