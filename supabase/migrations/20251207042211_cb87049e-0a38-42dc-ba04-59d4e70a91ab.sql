-- Atualizar template obstétrico: remover obrigatoriedade e adicionar campos IG manual
UPDATE system_templates 
SET variaveis = '[
  {"nome": "data_dum", "tipo": "data", "grupo": "datas", "descricao": "Data da Última Menstruação (DUM)"},
  {"nome": "dpp", "tipo": "texto", "grupo": "datas", "descricao": "Data Provável do Parto", "calculado": true},
  {"nome": "dbp", "tipo": "numero", "grupo": "biometria", "unidade": "cm", "minimo": 1, "maximo": 12, "descricao": "Diâmetro Biparietal (DBP)"},
  {"nome": "cc", "tipo": "numero", "grupo": "biometria", "unidade": "cm", "minimo": 5, "maximo": 40, "descricao": "Circunferência Cefálica (CC)"},
  {"nome": "ca", "tipo": "numero", "grupo": "biometria", "unidade": "cm", "minimo": 5, "maximo": 45, "descricao": "Circunferência Abdominal (CA)"},
  {"nome": "cf", "tipo": "numero", "grupo": "biometria", "unidade": "cm", "minimo": 1, "maximo": 9, "descricao": "Comprimento do Fêmur (CF)"},
  {"nome": "ig_dum_semanas", "tipo": "numero", "grupo": "ig_calculada", "unidade": "sem", "descricao": "IG pela DUM (semanas)", "calculado": true},
  {"nome": "ig_dum_dias", "tipo": "numero", "grupo": "ig_calculada", "unidade": "dias", "descricao": "IG pela DUM (dias)", "calculado": true},
  {"nome": "ig_usg_semanas", "tipo": "numero", "grupo": "ig_calculada", "unidade": "sem", "descricao": "IG pela Biometria (semanas)", "calculado": true},
  {"nome": "ig_usg_dias", "tipo": "numero", "grupo": "ig_calculada", "unidade": "dias", "descricao": "IG pela Biometria (dias)", "calculado": true},
  {"nome": "ig_manual_semanas", "tipo": "numero", "grupo": "ig_calculada", "unidade": "sem", "minimo": 10, "maximo": 42, "descricao": "IG Manual (semanas) - se conhecido"},
  {"nome": "ig_manual_dias", "tipo": "numero", "grupo": "ig_calculada", "unidade": "dias", "minimo": 0, "maximo": 6, "descricao": "IG Manual (dias restantes)"},
  {"nome": "peso_estimado", "tipo": "numero", "grupo": "peso", "unidade": "g", "descricao": "Peso Fetal Estimado", "calculado": true},
  {"nome": "percentil_peso", "tipo": "numero", "grupo": "peso", "minimo": 1, "maximo": 99, "descricao": "Percentil do Peso", "calculado": true},
  {"nome": "apresentacao", "tipo": "select", "grupo": "caracteristicas", "descricao": "Apresentação fetal", "opcoes": ["cefálica", "pélvica", "córmica", "variável"], "valor_padrao": "cefálica"},
  {"nome": "dorso", "tipo": "select", "grupo": "caracteristicas", "descricao": "Posição do dorso fetal", "opcoes": ["anterior", "posterior", "à direita", "à esquerda"]},
  {"nome": "fcf", "tipo": "numero", "grupo": "caracteristicas", "unidade": "bpm", "minimo": 60, "maximo": 200, "descricao": "Frequência Cardíaca Fetal"},
  {"nome": "movimento_fetal", "tipo": "select", "grupo": "caracteristicas", "descricao": "Movimentação fetal", "opcoes": ["ativa", "diminuída", "ausente"], "valor_padrao": "ativa"},
  {"nome": "sexo_fetal", "tipo": "select", "grupo": "caracteristicas", "descricao": "Sexo fetal", "opcoes": ["masculino", "feminino", "não visualizado"]},
  {"nome": "cordao_vasos", "tipo": "select", "grupo": "cordao", "descricao": "Vasos do cordão umbilical", "opcoes": ["3 vasos (2 artérias e 1 veia)", "2 vasos (artéria umbilical única)"], "valor_padrao": "3 vasos (2 artérias e 1 veia)"},
  {"nome": "cordao_circular", "tipo": "select", "grupo": "cordao", "descricao": "Circular de cordão", "opcoes": ["não visualizada", "única", "dupla", "múltipla"], "valor_padrao": "não visualizada"},
  {"nome": "insercao_cordao", "tipo": "select", "grupo": "cordao", "descricao": "Inserção do cordão", "opcoes": ["central", "paracentral", "marginal", "velamentosa"], "valor_padrao": "central"},
  {"nome": "placenta_parede", "tipo": "select", "grupo": "placenta", "descricao": "Localização da placenta", "opcoes": ["anterior", "posterior", "fúndica", "lateral direita", "lateral esquerda", "prévia total", "prévia parcial", "prévia marginal"]},
  {"nome": "placenta_grau", "tipo": "select", "grupo": "placenta", "descricao": "Grau de maturação placentária", "opcoes": ["0", "I", "II", "III"]},
  {"nome": "placenta_espessura", "tipo": "numero", "grupo": "placenta", "unidade": "cm", "minimo": 1, "maximo": 8, "descricao": "Espessura placentária"},
  {"nome": "ila", "tipo": "numero", "grupo": "liquido", "unidade": "cm", "minimo": 0, "maximo": 35, "descricao": "Índice de Líquido Amniótico (ILA)"},
  {"nome": "maior_bolsao", "tipo": "numero", "grupo": "liquido", "unidade": "cm", "minimo": 0, "maximo": 15, "descricao": "Maior Bolsão Vertical (MB)"}
]'::jsonb,
updated_at = now()
WHERE id = '16f55e62-fa23-4b9c-a193-9c08268de23a';