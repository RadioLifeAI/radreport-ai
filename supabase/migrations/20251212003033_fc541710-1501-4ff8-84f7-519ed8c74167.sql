-- 1. Adicionar coluna titulo em frases_modelo
ALTER TABLE frases_modelo 
ADD COLUMN IF NOT EXISTS titulo VARCHAR(255);

-- 2. Popular titulo com categoria (que já é o identificador descritivo)
UPDATE frases_modelo 
SET titulo = categoria 
WHERE titulo IS NULL AND categoria IS NOT NULL AND categoria != '';

-- 3. Para frases sem categoria, extrair título do codigo usando pattern matching
UPDATE frases_modelo 
SET titulo = INITCAP(
  REPLACE(
    REPLACE(
      REGEXP_REPLACE(
        REGEXP_REPLACE(codigo, '^[A-Z]+_[A-Z]+_[A-Z]+_', ''),
        '_\d{3}$', ''
      ),
      '_', ' '
    ),
    '  ', ' '
  )
)
WHERE (titulo IS NULL OR titulo = '') AND codigo IS NOT NULL;

-- 4. Fallback final: usar código formatado
UPDATE frases_modelo 
SET titulo = REPLACE(codigo, '_', ' ')
WHERE titulo IS NULL OR titulo = '';

-- 5. Criar índice para busca eficiente
CREATE INDEX IF NOT EXISTS idx_frases_modelo_titulo 
ON frases_modelo(titulo);

-- 6. Criar índice GIN para busca full-text em português
CREATE INDEX IF NOT EXISTS idx_frases_modelo_titulo_gin 
ON frases_modelo USING gin(to_tsvector('portuguese', COALESCE(titulo, '')));