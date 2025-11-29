-- Migration: Add variaveis and condicoes_logicas columns to system_templates
-- Add support for dynamic variables in templates (similar to frases_modelo)
-- 
-- EXECUTE THIS VIA SUPABASE DASHBOARD SQL EDITOR

-- 1. Add columns to system_templates
ALTER TABLE system_templates 
ADD COLUMN IF NOT EXISTS variaveis JSONB DEFAULT '[]'::jsonb;

ALTER TABLE system_templates 
ADD COLUMN IF NOT EXISTS condicoes_logicas JSONB DEFAULT '[]'::jsonb;

-- 2. Migrate existing templates with hardcoded values to use variables

-- Template: Esteatose Hepática (3 graus)
UPDATE system_templates 
SET 
  impressao = 'Esteatose hepática {{grau_esteatose}}.',
  variaveis = '[
    {
      "nome": "grau_esteatose",
      "tipo": "select",
      "descricao": "Grau da Esteatose",
      "obrigatorio": true,
      "opcoes": ["leve", "moderada", "acentuada (grau III)"]
    }
  ]'::jsonb
WHERE codigo = 'USG_ABDOME_TOTAL_ESTEATOSE' 
  AND impressao LIKE '%leve / moderada / acentuada%';

-- Template: Esteatose + Colecistectomia
UPDATE system_templates 
SET 
  impressao = 'Esteatose hepática {{grau_esteatose}}. Colecistectomia.',
  variaveis = '[
    {
      "nome": "grau_esteatose",
      "tipo": "select",
      "descricao": "Grau da Esteatose",
      "obrigatorio": true,
      "opcoes": ["leve", "moderada", "acentuada (grau III)"]
    }
  ]'::jsonb
WHERE codigo = 'USG_ABDOME_TOTAL_ESTEATOSE_COLECISTECTOMIA'
  AND impressao LIKE '%leve / moderada / acentuada%';

-- Template: Hepatopatia de Depósito
UPDATE system_templates 
SET 
  impressao = 'Aumento difuso da ecogenicidade do parênquima hepático, achado que mais comumente está relacionado à infiltração gordurosa (esteatose grau {{grau}}), não sendo possível excluir outras doenças de depósito (ferro, glicogênio e cobre).',
  variaveis = '[
    {
      "nome": "grau",
      "tipo": "select",
      "descricao": "Grau",
      "obrigatorio": true,
      "opcoes": ["I", "II", "III"]
    }
  ]'::jsonb
WHERE codigo = 'USG_ABDOME_TOTAL_HEPATOPATIA_DEPOSITO'
  AND impressao LIKE '%grau I / II / III%';

-- Template: Orquiepididimite (lado variável)
UPDATE system_templates 
SET 
  impressao = 'Orquiepididimite {{lado}}.',
  achados = REPLACE(achados, '___', '{{lado}}'),
  variaveis = '[
    {
      "nome": "lado",
      "tipo": "select",
      "descricao": "Lateralidade",
      "obrigatorio": true,
      "opcoes": ["à direita", "à esquerda", "bilateral"]
    }
  ]'::jsonb
WHERE codigo LIKE '%ORQUIEPIDIDIMITE%'
  AND (impressao LIKE '%____%' OR achados LIKE '%____%');

-- Add comments for documentation
COMMENT ON COLUMN system_templates.variaveis IS 'Array JSONB de variáveis dinâmicas no formato: [{nome, tipo, descricao, obrigatorio, opcoes, valor_padrao, unidade, minimo, maximo}]';
COMMENT ON COLUMN system_templates.condicoes_logicas IS 'Array JSONB de regras condicionais para processamento dinâmico de templates';
