-- Criar template unificado de mamografia com composição dinâmica
INSERT INTO system_templates (
  codigo,
  titulo,
  modalidade_codigo,
  regiao_codigo,
  tecnica,
  achados,
  impressao,
  tags,
  variaveis,
  condicoes_logicas,
  ativo
) VALUES (
  'MG_MAMOGRAFIA_BILATERAL_NEGATIVA',
  'Mamografia Bilateral - Negativa (Composição Variável)',
  'MG',
  'MAMA',
  '{"SEM": "Mamografia digital bilateral nas incidências crânio-caudal (CC) e médio-lateral oblíqua (MLO)."}',
  'Mamas de composição {{achados_composicao}}.

Ausência de nódulos, calcificações suspeitas, distorções arquiteturais ou assimetrias focais.

Pele, complexo aréolo-mamilar e linfonodos axilares de aspecto habitual.',
  '{{impressao_composicao}}

Categoria BI-RADS {{birads}}: Negativo.

Sugestão de seguimento: controle em {{intervalo_rastreamento}} para rastreamento.',
  ARRAY['mamografia', 'bilateral', 'rastreamento', 'negativa', 'birads', 'composicao-mamaria']::text[],
  '[
    {
      "nome": "composicao_mamaria",
      "tipo": "select",
      "descricao": "Composição Mamária (ACR BI-RADS)",
      "obrigatorio": true,
      "opcoes": ["A - Quase inteiramente adiposa", "B - Áreas esparsas de densidade fibroglandular", "C - Heterogeneamente densa", "D - Extremamente densa"]
    },
    {
      "nome": "birads",
      "tipo": "select",
      "descricao": "Categoria BI-RADS",
      "obrigatorio": true,
      "opcoes": ["0", "1", "2", "3", "4", "5", "6"],
      "valor_padrao": "1"
    },
    {
      "nome": "intervalo_rastreamento",
      "tipo": "select",
      "descricao": "Intervalo de Rastreamento",
      "obrigatorio": true,
      "opcoes": ["1 ano", "2 anos"],
      "valor_padrao": "1 ano"
    }
  ]'::jsonb,
  '[
    {
      "quando": "composicao_mamaria",
      "igual": "A - Quase inteiramente adiposa",
      "derivar": {
        "achados_composicao": "quase inteiramente adiposa (A)",
        "impressao_composicao": "Mamas de composição quase inteiramente adiposa (A)."
      }
    },
    {
      "quando": "composicao_mamaria",
      "igual": "B - Áreas esparsas de densidade fibroglandular",
      "derivar": {
        "achados_composicao": "áreas esparsas de densidade fibroglandular (B)",
        "impressao_composicao": "Mamas com áreas esparsas de densidade fibroglandular (B)."
      }
    },
    {
      "quando": "composicao_mamaria",
      "igual": "C - Heterogeneamente densa",
      "derivar": {
        "achados_composicao": "heterogeneamente densa (C), o que pode obscurecer pequenas massas",
        "impressao_composicao": "Mamas heterogeneamente densas (C), que podem obscurecer pequenas massas."
      }
    },
    {
      "quando": "composicao_mamaria",
      "igual": "D - Extremamente densa",
      "derivar": {
        "achados_composicao": "extremamente densa (D), o que reduz a sensibilidade da mamografia",
        "impressao_composicao": "Mamas extremamente densas (D), reduzindo a sensibilidade do método mamográfico."
      }
    }
  ]'::jsonb,
  true
);

-- Desativar os 3 templates duplicados antigos
UPDATE system_templates 
SET ativo = false 
WHERE codigo IN (
  'MG_MAMOGRAFIA_BILATERAL_EXTREMAMENTE_DENSA',
  'MG_MAMOGRAFIA_BILATERAL_FIBROGLANDULARES_ESPARSAS',
  'MG_MAMOGRAFIA_BILATERAL_HETEROGENEAMENTE_DENSA'
);

-- Comentário sobre a unificação
COMMENT ON COLUMN system_templates.condicoes_logicas IS 
'Condições lógicas para processamento dinâmico de templates. Formato: [{quando, igual, derivar}] onde "quando" é a variável a verificar, "igual" é o valor a comparar, e "derivar" é um objeto com variáveis derivadas. Exemplo: templates de mamografia com composição dinâmica (A/B/C/D) derivam achados_composicao e impressao_composicao automaticamente.';