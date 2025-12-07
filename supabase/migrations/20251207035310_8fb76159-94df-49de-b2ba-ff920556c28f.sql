-- Update US_OB_MORFOLOGICO_001 template with complete obstetric variables
-- Adds: DPP, Maior Bolsão, Sexo, Cordão, Movimentação, and intelligent conclusion with alerts

UPDATE system_templates
SET 
  variaveis = '[
    {
      "nome": "data_dum",
      "tipo": "data",
      "descricao": "Data da Última Menstruação (DUM)",
      "obrigatorio": true,
      "grupo": "datas"
    },
    {
      "nome": "dpp",
      "tipo": "texto",
      "descricao": "Data Provável do Parto",
      "calculado": true,
      "grupo": "datas"
    },
    {
      "nome": "dbp",
      "tipo": "numero",
      "descricao": "Diâmetro Biparietal (DBP)",
      "unidade": "cm",
      "minimo": 1,
      "maximo": 12,
      "grupo": "biometria"
    },
    {
      "nome": "cc",
      "tipo": "numero",
      "descricao": "Circunferência Cefálica (CC)",
      "unidade": "cm",
      "minimo": 5,
      "maximo": 40,
      "grupo": "biometria"
    },
    {
      "nome": "ca",
      "tipo": "numero",
      "descricao": "Circunferência Abdominal (CA)",
      "unidade": "cm",
      "minimo": 5,
      "maximo": 45,
      "grupo": "biometria"
    },
    {
      "nome": "cf",
      "tipo": "numero",
      "descricao": "Comprimento do Fêmur (CF)",
      "unidade": "cm",
      "minimo": 1,
      "maximo": 9,
      "grupo": "biometria"
    },
    {
      "nome": "ig_dum_semanas",
      "tipo": "numero",
      "descricao": "IG pela DUM (semanas)",
      "unidade": "sem",
      "calculado": true,
      "grupo": "ig_calculada"
    },
    {
      "nome": "ig_dum_dias",
      "tipo": "numero",
      "descricao": "IG pela DUM (dias)",
      "unidade": "dias",
      "calculado": true,
      "grupo": "ig_calculada"
    },
    {
      "nome": "ig_usg_semanas",
      "tipo": "numero",
      "descricao": "IG pela Biometria (semanas)",
      "unidade": "sem",
      "calculado": true,
      "grupo": "ig_calculada"
    },
    {
      "nome": "ig_usg_dias",
      "tipo": "numero",
      "descricao": "IG pela Biometria (dias)",
      "unidade": "dias",
      "calculado": true,
      "grupo": "ig_calculada"
    },
    {
      "nome": "peso_estimado",
      "tipo": "numero",
      "descricao": "Peso Fetal Estimado",
      "unidade": "g",
      "calculado": true,
      "grupo": "peso"
    },
    {
      "nome": "percentil_peso",
      "tipo": "numero",
      "descricao": "Percentil do Peso",
      "minimo": 1,
      "maximo": 99,
      "calculado": true,
      "grupo": "peso"
    },
    {
      "nome": "apresentacao",
      "tipo": "select",
      "descricao": "Apresentação fetal",
      "opcoes": ["cefálica", "pélvica", "córmica", "variável"],
      "valor_padrao": "cefálica",
      "grupo": "caracteristicas"
    },
    {
      "nome": "dorso",
      "tipo": "select",
      "descricao": "Posição do dorso fetal",
      "opcoes": ["anterior", "posterior", "à direita", "à esquerda"],
      "grupo": "caracteristicas"
    },
    {
      "nome": "fcf",
      "tipo": "numero",
      "descricao": "Frequência Cardíaca Fetal",
      "unidade": "bpm",
      "minimo": 60,
      "maximo": 200,
      "grupo": "caracteristicas"
    },
    {
      "nome": "movimento_fetal",
      "tipo": "select",
      "descricao": "Movimentação fetal",
      "opcoes": ["ativa", "diminuída", "ausente"],
      "valor_padrao": "ativa",
      "grupo": "caracteristicas"
    },
    {
      "nome": "sexo_fetal",
      "tipo": "select",
      "descricao": "Sexo fetal",
      "opcoes": ["masculino", "feminino", "não visualizado"],
      "grupo": "caracteristicas"
    },
    {
      "nome": "cordao_vasos",
      "tipo": "select",
      "descricao": "Vasos do cordão umbilical",
      "opcoes": ["3 vasos (2 artérias e 1 veia)", "2 vasos (artéria umbilical única)"],
      "valor_padrao": "3 vasos (2 artérias e 1 veia)",
      "grupo": "cordao"
    },
    {
      "nome": "cordao_circular",
      "tipo": "select",
      "descricao": "Circular de cordão",
      "opcoes": ["não visualizada", "única", "dupla", "múltipla"],
      "valor_padrao": "não visualizada",
      "grupo": "cordao"
    },
    {
      "nome": "insercao_cordao",
      "tipo": "select",
      "descricao": "Inserção do cordão",
      "opcoes": ["central", "paracentral", "marginal", "velamentosa"],
      "valor_padrao": "central",
      "grupo": "cordao"
    },
    {
      "nome": "placenta_parede",
      "tipo": "select",
      "descricao": "Localização da placenta",
      "opcoes": ["anterior", "posterior", "fúndica", "lateral direita", "lateral esquerda", "prévia total", "prévia parcial", "prévia marginal"],
      "grupo": "placenta"
    },
    {
      "nome": "placenta_grau",
      "tipo": "select",
      "descricao": "Grau de maturação placentária",
      "opcoes": ["0", "I", "II", "III"],
      "grupo": "placenta"
    },
    {
      "nome": "placenta_espessura",
      "tipo": "numero",
      "descricao": "Espessura placentária",
      "unidade": "cm",
      "minimo": 1,
      "maximo": 8,
      "grupo": "placenta"
    },
    {
      "nome": "ila",
      "tipo": "numero",
      "descricao": "Índice de Líquido Amniótico (ILA)",
      "unidade": "cm",
      "minimo": 0,
      "maximo": 35,
      "grupo": "liquido"
    },
    {
      "nome": "maior_bolsao",
      "tipo": "numero",
      "descricao": "Maior Bolsão Vertical (MB)",
      "unidade": "cm",
      "minimo": 0,
      "maximo": 15,
      "grupo": "liquido"
    }
  ]'::jsonb,
  
  condicoes_logicas = '[
    {
      "quando": "ila",
      "menor_que": 5,
      "derivar": {
        "alerta_la": "- Oligoâmnio (ILA {{ila}} cm). Recomenda-se correlação clínica e avaliação de bem-estar fetal.",
        "status_la": "reduzido"
      }
    },
    {
      "quando": "maior_bolsao",
      "menor_que": 2,
      "derivar": {
        "alerta_la": "- Oligoâmnio (Maior Bolsão {{maior_bolsao}} cm). Recomenda-se correlação clínica.",
        "status_la": "reduzido"
      }
    },
    {
      "quando": "ila",
      "maior_que": 25,
      "derivar": {
        "alerta_la": "- Polidrâmnio (ILA {{ila}} cm). Recomenda-se investigação de causas maternas e fetais.",
        "status_la": "aumentado"
      }
    },
    {
      "quando": "maior_bolsao",
      "maior_que": 8,
      "derivar": {
        "alerta_la": "- Polidrâmnio (Maior Bolsão {{maior_bolsao}} cm). Recomenda-se investigação complementar.",
        "status_la": "aumentado"
      }
    },
    {
      "quando": "ila",
      "maior_igual": 5,
      "derivar": {
        "status_la": "normal"
      }
    },
    {
      "quando": "fcf",
      "menor_que": 110,
      "derivar": {
        "alerta_fcf": "- Bradicardia fetal (FCF {{fcf}} bpm). Recomenda-se avaliação de bem-estar fetal."
      }
    },
    {
      "quando": "fcf",
      "maior_que": 160,
      "derivar": {
        "alerta_fcf": "- Taquicardia fetal (FCF {{fcf}} bpm). Correlacionar com condições maternas."
      }
    },
    {
      "quando": "percentil_peso",
      "menor_que": 3,
      "derivar": {
        "alerta_peso": "- Restrição de crescimento intrauterino (CIUR). Peso fetal abaixo do percentil 3. Recomenda-se avaliação de vitalidade fetal e Doppler obstétrico."
      }
    },
    {
      "quando": "percentil_peso",
      "menor_que": 10,
      "derivar": {
        "alerta_peso": "- Feto pequeno para idade gestacional (PIG). Peso no percentil {{percentil_peso}}. Recomenda-se acompanhamento do crescimento."
      }
    },
    {
      "quando": "percentil_peso",
      "maior_que": 90,
      "derivar": {
        "alerta_peso": "- Feto grande para idade gestacional (GIG). Peso no percentil {{percentil_peso}}. Investigar diabetes gestacional."
      }
    },
    {
      "quando": "peso_estimado",
      "maior_que": 4000,
      "derivar": {
        "alerta_peso": "- Macrossomia fetal (peso estimado {{peso_estimado}} g). Considerar via de parto e investigação de diabetes."
      }
    },
    {
      "quando": "movimento_fetal",
      "igual": "diminuída",
      "derivar": {
        "alerta_mov": "- Movimentação fetal diminuída. Recomenda-se avaliação de vitalidade fetal."
      }
    },
    {
      "quando": "movimento_fetal",
      "igual": "ausente",
      "derivar": {
        "alerta_mov": "- Movimentação fetal ausente ao exame. Correlação clínica urgente."
      }
    },
    {
      "quando": "cordao_circular",
      "igual": "única",
      "derivar": {
        "alerta_cordao": "- Circular de cordão única. Achado frequente, sem significado patológico na maioria dos casos."
      }
    },
    {
      "quando": "cordao_circular",
      "igual": "dupla",
      "derivar": {
        "alerta_cordao": "- Circular de cordão dupla. Recomenda-se acompanhamento intraparto."
      }
    },
    {
      "quando": "cordao_circular",
      "igual": "múltipla",
      "derivar": {
        "alerta_cordao": "- Circulares múltiplas de cordão. Recomenda-se monitorização fetal contínua."
      }
    },
    {
      "quando": "cordao_vasos",
      "igual": "2 vasos (artéria umbilical única)",
      "derivar": {
        "alerta_cordao_vasos": "- Artéria umbilical única. Recomenda-se ecocardiograma fetal e acompanhamento do crescimento."
      }
    },
    {
      "quando": "placenta_parede",
      "igual": "prévia total",
      "derivar": {
        "alerta_placenta": "- Placenta prévia total. Indicada cesárea. Risco de sangramento."
      }
    },
    {
      "quando": "placenta_parede",
      "igual": "prévia parcial",
      "derivar": {
        "alerta_placenta": "- Placenta prévia parcial. Acompanhamento da migração placentária."
      }
    },
    {
      "quando": "placenta_parede",
      "igual": "prévia marginal",
      "derivar": {
        "alerta_placenta": "- Placenta prévia marginal. Acompanhamento ultrassonográfico recomendado."
      }
    }
  ]'::jsonb,
  
  achados = 'DUM: {{data_dum}}. Data Provável do Parto (DPP): {{dpp}}.

BIOMETRIA FETAL:
- Diâmetro biparietal (DBP): {{dbp}} cm
- Circunferência cefálica (CC): {{cc}} cm  
- Circunferência abdominal (CA): {{ca}} cm
- Comprimento do fêmur (CF): {{cf}} cm

IDADE GESTACIONAL:
- Pela DUM: {{ig_dum_semanas}} semanas e {{ig_dum_dias}} dias
- Pela biometria (USG): {{ig_usg_semanas}} semanas e {{ig_usg_dias}} dias

PESO FETAL ESTIMADO: {{peso_estimado}} g (percentil {{percentil_peso}})

APRESENTAÇÃO E SITUAÇÃO: {{apresentacao}}, dorso {{dorso}}.

ATIVIDADE CARDÍACA: presente, regular, {{fcf}} bpm.

MOVIMENTAÇÃO FETAL: {{movimento_fetal}}.

SEXO FETAL: genitália externa de padrão {{sexo_fetal}}.

PLACENTA: implantada em parede {{placenta_parede}}, grau {{placenta_grau}} de maturação, espessura de {{placenta_espessura}} cm.

CORDÃO UMBILICAL: com {{cordao_vasos}}. Inserção {{insercao_cordao}} na placenta. Circular de cordão: {{cordao_circular}}.

LÍQUIDO AMNIÓTICO: volume {{status_la}} (ILA: {{ila}} cm; Maior Bolsão: {{maior_bolsao}} cm).',
  
  impressao = '- Gestação tópica e única, com feto vivo em apresentação {{apresentacao}}.
- Idade gestacional pela DUM: {{ig_dum_semanas}} semanas e {{ig_dum_dias}} dias.
- Idade gestacional pela biometria: {{ig_usg_semanas}} semanas e {{ig_usg_dias}} dias.
- Peso fetal estimado: {{peso_estimado}} g (percentil {{percentil_peso}}).
- Data provável do parto: {{dpp}}.
{{alerta_la}}
{{alerta_fcf}}
{{alerta_peso}}
{{alerta_mov}}
{{alerta_cordao}}
{{alerta_cordao_vasos}}
{{alerta_placenta}}
- Não foram identificadas anormalidades estruturais maiores, considerando-se a época gestacional.'

WHERE codigo = 'US_OB_MORFOLOGICO_001';