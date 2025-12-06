-- Corrigir templates RX com \n literal armazenado como texto
-- Converter para quebras de linha reais

UPDATE system_templates
SET achados = REPLACE(REPLACE(achados, E'\\n\\n', E'\n\n'), E'\\n', E'\n')
WHERE id IN (
  '93a97a5f-8b7f-486c-a7ca-2af1bfc8464d',
  '083ac440-c13d-402d-8727-7d7cba4f2331',
  '50be1350-0e7b-4f05-aac7-1ba27f27520c'
);

-- Também corrigir campo impressao se houver o mesmo problema
UPDATE system_templates
SET impressao = REPLACE(REPLACE(impressao, E'\\n\\n', E'\n\n'), E'\\n', E'\n')
WHERE id IN (
  '93a97a5f-8b7f-486c-a7ca-2af1bfc8464d',
  '083ac440-c13d-402d-8727-7d7cba4f2331',
  '50be1350-0e7b-4f05-aac7-1ba27f27520c'
);