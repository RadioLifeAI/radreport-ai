-- Migração: Templates de Mamografia com Técnicas Dinâmicas
-- Adiciona variáveis booleanas e condições lógicas para construção dinâmica do campo técnica

-- Template 1: MG_MAMOGRAFIA_BILATERAL_COMPLETA
UPDATE system_templates SET
  tecnica = '{
    "SEM": "Exame realizado em equipamento {{equipamento}}. Exame realizado nas incidências crânio-caudal e médio-lateral-oblíqua.{{frase_compressao}}{{frase_magnificacao}}{{frase_eklund}}{{frase_marcador}}"
  }'::jsonb,
  
  variaveis = '[
    {
      "nome": "equipamento",
      "tipo": "select",
      "descricao": "Equipamento utilizado",
      "obrigatorio": true,
      "opcoes": ["CR Digital", "DR Digital"],
      "valor_padrao": "DR Digital"
    },
    {
      "nome": "compressao_localizada",
      "tipo": "boolean",
      "descricao": "Compressão localizada",
      "obrigatorio": false,
      "valor_padrao": false
    },
    {
      "nome": "magnificacao",
      "tipo": "boolean",
      "descricao": "Magnificação",
      "obrigatorio": false,
      "valor_padrao": false
    },
    {
      "nome": "manobra_eklund",
      "tipo": "boolean",
      "descricao": "Manobra de Eklund (implantes)",
      "obrigatorio": false,
      "valor_padrao": false
    },
    {
      "nome": "marcador_radiopaco",
      "tipo": "boolean",
      "descricao": "Marcador radiopaco",
      "obrigatorio": false,
      "valor_padrao": false
    },
    {
      "nome": "lado_marcador",
      "tipo": "select",
      "descricao": "Lado do marcador",
      "obrigatorio": false,
      "opcoes": ["direita", "esquerda", "bilateral"],
      "valor_padrao": "direita"
    }
  ]'::jsonb,
  
  condicoes_logicas = '[
    {
      "quando": "compressao_localizada",
      "igual": true,
      "derivar": {
        "frase_compressao": " Foram obtidas incidências adicionais com compressão localizada."
      }
    },
    {
      "quando": "compressao_localizada",
      "igual": false,
      "derivar": {
        "frase_compressao": ""
      }
    },
    {
      "quando": "magnificacao",
      "igual": true,
      "derivar": {
        "frase_magnificacao": " Foram obtidas incidências adicionais com magnificação."
      }
    },
    {
      "quando": "magnificacao",
      "igual": false,
      "derivar": {
        "frase_magnificacao": ""
      }
    },
    {
      "quando": "manobra_eklund",
      "igual": true,
      "derivar": {
        "frase_eklund": " Realizada manobra de Eklund (deslocamento posterior do implante) para melhor caracterização do tecido mamário."
      }
    },
    {
      "quando": "manobra_eklund",
      "igual": false,
      "derivar": {
        "frase_eklund": ""
      }
    },
    {
      "quando": "marcador_radiopaco",
      "igual": true,
      "derivar": {
        "frase_marcador": " Marcador radiopaco em alteração cutânea na mama {{lado_marcador}}."
      }
    },
    {
      "quando": "marcador_radiopaco",
      "igual": false,
      "derivar": {
        "frase_marcador": ""
      }
    }
  ]'::jsonb,
  
  updated_at = now()

WHERE codigo = 'MG_MAMOGRAFIA_BILATERAL_COMPLETA';

-- Template 2: MG_MAMOGRAFIA_BILATERAL_TOMOSSINTESE
UPDATE system_templates SET
  tecnica = '{
    "SEM": "Exame realizado nas projeções crânio-caudal e médio-lateral-oblíqua, complementado com aquisição volumétrica com cortes de 1 mm.{{frase_compressao}}{{frase_magnificacao}}{{frase_eklund}}{{frase_marcador}}"
  }'::jsonb,
  
  variaveis = '[
    {
      "nome": "compressao_localizada",
      "tipo": "boolean",
      "descricao": "Compressão localizada",
      "obrigatorio": false,
      "valor_padrao": false
    },
    {
      "nome": "magnificacao",
      "tipo": "boolean",
      "descricao": "Magnificação",
      "obrigatorio": false,
      "valor_padrao": false
    },
    {
      "nome": "manobra_eklund",
      "tipo": "boolean",
      "descricao": "Manobra de Eklund (implantes)",
      "obrigatorio": false,
      "valor_padrao": false
    },
    {
      "nome": "marcador_radiopaco",
      "tipo": "boolean",
      "descricao": "Marcador radiopaco",
      "obrigatorio": false,
      "valor_padrao": false
    },
    {
      "nome": "lado_marcador",
      "tipo": "select",
      "descricao": "Lado do marcador",
      "obrigatorio": false,
      "opcoes": ["direita", "esquerda", "bilateral"],
      "valor_padrao": "direita"
    }
  ]'::jsonb,
  
  condicoes_logicas = '[
    {
      "quando": "compressao_localizada",
      "igual": true,
      "derivar": {
        "frase_compressao": " Foram obtidas incidências adicionais com compressão localizada."
      }
    },
    {
      "quando": "compressao_localizada",
      "igual": false,
      "derivar": {
        "frase_compressao": ""
      }
    },
    {
      "quando": "magnificacao",
      "igual": true,
      "derivar": {
        "frase_magnificacao": " Foram obtidas incidências adicionais com magnificação."
      }
    },
    {
      "quando": "magnificacao",
      "igual": false,
      "derivar": {
        "frase_magnificacao": ""
      }
    },
    {
      "quando": "manobra_eklund",
      "igual": true,
      "derivar": {
        "frase_eklund": " Realizada manobra de Eklund (deslocamento posterior do implante) para melhor caracterização do tecido mamário."
      }
    },
    {
      "quando": "manobra_eklund",
      "igual": false,
      "derivar": {
        "frase_eklund": ""
      }
    },
    {
      "quando": "marcador_radiopaco",
      "igual": true,
      "derivar": {
        "frase_marcador": " Marcador radiopaco em alteração cutânea na mama {{lado_marcador}}."
      }
    },
    {
      "quando": "marcador_radiopaco",
      "igual": false,
      "derivar": {
        "frase_marcador": ""
      }
    }
  ]'::jsonb,
  
  updated_at = now()

WHERE codigo = 'MG_MAMOGRAFIA_BILATERAL_TOMOSSINTESE';

-- Adicionar comentários para documentação
COMMENT ON COLUMN system_templates.condicoes_logicas IS 'Array JSONB de regras condicionais: suporta derivação de variáveis baseadas em condições (boolean, select, etc.)';
COMMENT ON COLUMN system_templates.variaveis IS 'Array JSONB de variáveis dinâmicas: suporta texto, numero, select e boolean para formulários dinâmicos';