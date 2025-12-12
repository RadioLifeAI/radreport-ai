-- Migração para refinar títulos - remover mais prefixos e truncar
-- O título deve ser o ACHADO/DIAGNÓSTICO conciso, não a frase completa

-- 1. Remover prefixos adicionais comuns
UPDATE frases_modelo 
SET titulo = TRIM(
  REGEXP_REPLACE(
    REGEXP_REPLACE(
      REGEXP_REPLACE(
        REGEXP_REPLACE(
          REGEXP_REPLACE(
            REGEXP_REPLACE(
              REGEXP_REPLACE(
                REGEXP_REPLACE(
                  REGEXP_REPLACE(
                    REGEXP_REPLACE(titulo, '^Achados compatíveis com ', '', 'i'),
                    '^Achados sugestivos de ', '', 'i'
                  ),
                  '^Achados de ', '', 'i'
                ),
                '^Alterações compatíveis com ', '', 'i'
              ),
              '^Alteração parenquimatosa [a-z]+\. Considerar possibilidade de ', '', 'i'
            ),
            '^Alteração [a-z]+ compatível com ', '', 'i'
          ),
          '^Considerar possibilidade de ', '', 'i'
        ),
        '^Possibilidade de ', '', 'i'
      ),
      '^Aparente ', '', 'i'
    ),
    '^Aspecto compatível com ', '', 'i'
  )
)
WHERE titulo IS NOT NULL AND titulo != '';

-- 2. Remover variáveis de template do título
UPDATE frases_modelo 
SET titulo = TRIM(REGEXP_REPLACE(titulo, '\{\{[^}]+\}\}', '', 'g'))
WHERE titulo LIKE '%{{%';

-- 3. Truncar títulos longos no primeiro ponto ou vírgula (max 80 chars)
UPDATE frases_modelo 
SET titulo = CASE 
  WHEN POSITION('.' IN titulo) > 0 AND POSITION('.' IN titulo) <= 80 
    THEN TRIM(SUBSTRING(titulo FROM 1 FOR POSITION('.' IN titulo) - 1))
  WHEN POSITION(',' IN titulo) > 10 AND POSITION(',' IN titulo) <= 60 
    THEN TRIM(SUBSTRING(titulo FROM 1 FOR POSITION(',' IN titulo) - 1))
  WHEN LENGTH(titulo) > 80 
    THEN TRIM(SUBSTRING(titulo FROM 1 FOR 80))
  ELSE titulo
END
WHERE LENGTH(titulo) > 60;

-- 4. Capitalizar primeira letra novamente
UPDATE frases_modelo 
SET titulo = UPPER(SUBSTRING(titulo FROM 1 FOR 1)) || SUBSTRING(titulo FROM 2)
WHERE titulo IS NOT NULL AND titulo != '' AND titulo !~ '^[A-Z]';

-- 5. Limpar títulos que ficaram vazios ou só com espaços
UPDATE frases_modelo 
SET titulo = INITCAP(REPLACE(REGEXP_REPLACE(REGEXP_REPLACE(codigo, '^(US|USG|TC|RM|RX|MN)_[A-Z]+_[A-Z]+_', '', 'i'), '_\d{3}$', ''), '_', ' '))
WHERE titulo IS NULL OR TRIM(titulo) = '' OR LENGTH(TRIM(titulo)) < 3;