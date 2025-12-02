-- Adicionar coluna categoria à tabela system_templates
ALTER TABLE system_templates 
ADD COLUMN IF NOT EXISTS categoria VARCHAR(50) DEFAULT 'normal';

-- Atualizar templates existentes baseado nas tags e título
UPDATE system_templates 
SET categoria = CASE 
  WHEN 'normal' = ANY(tags) OR titulo ILIKE '%normal%' THEN 'normal'
  ELSE 'alterado'
END
WHERE categoria IS NULL OR categoria = 'normal';

-- Criar índice para performance de filtros
CREATE INDEX IF NOT EXISTS idx_system_templates_categoria ON system_templates(categoria);