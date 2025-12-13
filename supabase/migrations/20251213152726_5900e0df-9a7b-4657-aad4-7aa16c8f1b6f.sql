-- =====================================================
-- EXPANSÃO DE TABELAS USER CONTENT
-- =====================================================
-- Adiciona campos para paridade com system_templates e frases_modelo

-- Expandir user_templates
ALTER TABLE user_templates
ADD COLUMN IF NOT EXISTS indicacao_clinica TEXT,
ADD COLUMN IF NOT EXISTS tecnica JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS achados TEXT,
ADD COLUMN IF NOT EXISTS impressao TEXT,
ADD COLUMN IF NOT EXISTS adicionais TEXT,
ADD COLUMN IF NOT EXISTS regiao_codigo VARCHAR(50),
ADD COLUMN IF NOT EXISTS categoria VARCHAR(20) DEFAULT 'normal',
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS conteudo_template TEXT,
ADD COLUMN IF NOT EXISTS modo VARCHAR(20) DEFAULT 'simples';

-- Expandir user_frases
ALTER TABLE user_frases
ADD COLUMN IF NOT EXISTS categoria VARCHAR(20) DEFAULT 'normal',
ADD COLUMN IF NOT EXISTS regiao_codigo VARCHAR(50),
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS indicacao_clinica TEXT,
ADD COLUMN IF NOT EXISTS tecnica TEXT;

-- Comentários para documentação
COMMENT ON COLUMN user_templates.modo IS 'Modo de criação: simples ou profissional';
COMMENT ON COLUMN user_templates.tecnica IS 'Objeto JSON com técnicas (pode ter variantes como EV, SEM)';
COMMENT ON COLUMN user_templates.categoria IS 'normal ou alterado';
COMMENT ON COLUMN user_frases.categoria IS 'normal ou alterado';