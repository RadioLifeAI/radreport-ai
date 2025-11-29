-- Fase 6: Migração do Template USG Abdome Total com Esteatose
-- Adiciona sistema de condições lógicas para derivar variáveis automaticamente

UPDATE system_templates SET
  achados = 'Fígado de topografia e morfologia normais, contornos regulares, {{achados_figado}}.

Vesícula biliar tópica, com paredes finas, contendo bile anecóica em seu interior.

Vias biliares intra e extra-hepáticas não dilatadas.

Pâncreas de dimensões preservadas, apresentando textura habitual e contornos regulares.

Baço de dimensões preservadas e textura homogênea.

Rins tópicos, com dimensões e morfologia preservadas, sem sinais de dilatação pielocalicinal.

Ausência de líquido livre na cavidade abdominal.

Alças intestinais sem particularidades.',
  
  impressao = 'Esteatose hepática {{impressao_grau}}.',
  
  variaveis = '[
    {
      "nome": "grau_esteatose",
      "tipo": "select",
      "descricao": "Grau da Esteatose Hepática",
      "obrigatorio": true,
      "opcoes": ["I", "II", "III"],
      "valor_padrao": "I"
    }
  ]'::jsonb,
  
  condicoes_logicas = '[
    {
      "quando": "grau_esteatose",
      "igual": "I",
      "derivar": {
        "achados_figado": "apresentando leve aumento difuso da ecogenicidade de seu parênquima",
        "impressao_grau": "leve (grau I)"
      }
    },
    {
      "quando": "grau_esteatose",
      "igual": "II",
      "derivar": {
        "achados_figado": "apresentando leve aumento difuso da ecogenicidade de seu parênquima, com atenuação do feixe acústico",
        "impressao_grau": "moderada (grau II)"
      }
    },
    {
      "quando": "grau_esteatose",
      "igual": "III",
      "derivar": {
        "achados_figado": "apresentando leve aumento difuso da ecogenicidade de seu parênquima, com atenuação do feixe acústico, o que prejudicou a análise das porções posteriores",
        "impressao_grau": "acentuada (grau III)"
      }
    }
  ]'::jsonb,
  
  updated_at = now()

WHERE codigo = 'USG_ABDOME_TOTAL_ESTEATOSE';