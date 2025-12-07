-- Corrigir \n literal em frases_modelo.texto (2 registros identificados)
UPDATE frases_modelo
SET texto = REPLACE(REPLACE(texto, E'\\n\\n', E'\n\n'), E'\\n', E'\n'),
    updated_at = now()
WHERE texto LIKE E'%\\\\n%';