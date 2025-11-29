-- Migration: Add variaveis and condicoes_logicas columns to system_templates
-- Add support for dynamic variables in templates (similar to frases_modelo)

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

-- Template: Mamografia Bilateral Completa (localização implante)
UPDATE system_templates 
SET 
  impressao = REPLACE(impressao, '(retroglandular/retropeitoral)', '{{localizacao_implante}}'),
  variaveis = '[
    {
      "nome": "localizacao_implante",
      "tipo": "select",
      "descricao": "Localização do Implante",
      "obrigatorio": true,
      "opcoes": ["retroglandular", "retropeitoral", "subpeitoral"]
    }
  ]'::jsonb
WHERE codigo = 'MG_MAMOGRAFIA_BILATERAL_COMPLETA'
  AND impressao LIKE '%(retroglandular/retropeitoral)%';

-- Template: Tomossíntese Mamária (lateralidade linfonodo)
UPDATE system_templates 
SET 
  achados = REPLACE(achados, '(ambas as mamas/mama direita/mama esquerda)', '{{lado_linfonodo}}'),
  variaveis = '[
    {
      "nome": "lado_linfonodo",
      "tipo": "select",
      "descricao": "Lateralidade do Linfonodo",
      "obrigatorio": true,
      "opcoes": ["ambas as mamas", "mama direita", "mama esquerda"]
    }
  ]'::jsonb
WHERE codigo = 'MG_TOMOSSINTESE_MAMARIA'
  AND achados LIKE '%(ambas as mamas/mama direita/mama esquerda)%';

-- Template: RM Mamas (lateralidade linfonodo)
UPDATE system_templates 
SET 
  achados = REPLACE(achados, '(ambas as mamas/mama direita/mama esquerda)', '{{lado_linfonodo}}'),
  variaveis = '[
    {
      "nome": "lado_linfonodo",
      "tipo": "select",
      "descricao": "Lateralidade do Linfonodo",
      "obrigatorio": true,
      "opcoes": ["ambas as mamas", "mama direita", "mama esquerda"]
    }
  ]'::jsonb
WHERE codigo = 'RM_MAMAS_COMPLETO'
  AND achados LIKE '%(ambas as mamas/mama direita/mama esquerda)%';

-- Template: USG Bolsa Testicular Doppler (volumes e achados)
UPDATE system_templates 
SET 
  achados = REPLACE(REPLACE(REPLACE(achados, 
    'Testículo direito de dimensões e ecotextura normais, com fluxo ao Doppler colorido, com volume de ____ cm³.',
    'Testículo direito de dimensões e ecotextura normais, com fluxo ao Doppler colorido, com volume de {{volume_dir_cm3}} cm³.'),
    'Testículo esquerdo de dimensões e ecotextura normais, com fluxo ao Doppler colorido, com volume de ____ cm³.',
    'Testículo esquerdo de dimensões e ecotextura normais, com fluxo ao Doppler colorido, com volume de {{volume_esq_cm3}} cm³.'),
    '____',
    '{{achados_adicionais}}'),
  variaveis = '[
    {
      "nome": "volume_dir_cm3",
      "tipo": "numero",
      "descricao": "Volume Testículo Direito",
      "obrigatorio": true,
      "unidade": "cm³",
      "minimo": 0,
      "maximo": 50
    },
    {
      "nome": "volume_esq_cm3",
      "tipo": "numero",
      "descricao": "Volume Testículo Esquerdo",
      "obrigatorio": true,
      "unidade": "cm³",
      "minimo": 0,
      "maximo": 50
    },
    {
      "nome": "achados_adicionais",
      "tipo": "texto",
      "descricao": "Achados Adicionais",
      "obrigatorio": false
    }
  ]'::jsonb
WHERE codigo = 'USG_BOLSA_TESTICULAR_DOPPLER_COLORIDO_COMPLETO'
  AND achados LIKE '%____%';

-- Add comments for documentation
COMMENT ON COLUMN system_templates.variaveis IS 'Array JSONB de variáveis dinâmicas no formato: [{nome, tipo, descricao, obrigatorio, opcoes, valor_padrao, unidade, minimo, maximo}]';
COMMENT ON COLUMN system_templates.condicoes_logicas IS 'Array JSONB de regras condicionais para processamento dinâmico de templates';