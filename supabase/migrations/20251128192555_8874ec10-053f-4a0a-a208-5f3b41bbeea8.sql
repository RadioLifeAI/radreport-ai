-- =====================================================
-- CORREÇÃO: US_ABD_AORTA_ANEURISMA_001
-- =====================================================
-- Simplifica frase de aneurisma de aorta abdominal de 13 para 5 variáveis essenciais
-- Adiciona conclusão profissional com recomendação de angioTC
-- =====================================================

UPDATE frases_modelo 
SET 
  texto = 'Aorta {{tipo_parede}}, notando-se dilatação {{morfologia}} no segmento {{segmento}}, com diâmetro transverso máximo medindo cerca de {{diametro_max_cm}} cm, e extensão de cerca de {{extensao_cm}} cm.',
  conclusao = 'Aneurisma de aorta abdominal {{segmento}}. A critério clínico o estudo de angiotomografia de aorta abdominal fornecerá informações adicionais.',
  variaveis = '[
    {"nome": "tipo_parede", "tipo": "select", "opcoes": ["ateromatosa", "de paredes regulares", "com calcificações parietais leves", "com calcificações parietais moderadas"], "obrigatorio": true, "descricao": "Característica das paredes da aorta"},
    {"nome": "morfologia", "tipo": "select", "opcoes": ["fusiforme", "sacular"], "obrigatorio": true, "descricao": "Morfologia da dilatação"},
    {"nome": "segmento", "tipo": "select", "opcoes": ["infrarrenal", "suprarrenal", "ao nível das artérias renais", "justa-renal"], "obrigatorio": true, "descricao": "Localização do aneurisma"},
    {"nome": "diametro_max_cm", "tipo": "numero", "minimo": 2.0, "maximo": 15.0, "obrigatorio": true, "unidade": "cm", "descricao": "Diâmetro transverso máximo"},
    {"nome": "extensao_cm", "tipo": "numero", "minimo": 1.0, "maximo": 25.0, "obrigatorio": true, "unidade": "cm", "descricao": "Extensão do aneurisma"}
  ]'::jsonb
WHERE codigo = 'US_ABD_AORTA_ANEURISMA_001';

-- =====================================================
-- RESULTADO
-- =====================================================
-- Variáveis: 13 complexas → 5 essenciais
-- Conclusão: Profissional com recomendação de angioTC
-- Exemplo: "Aneurisma de aorta abdominal infrarrenal. 
--           A critério clínico o estudo de angiotomografia 
--           de aorta abdominal fornecerá informações adicionais."
-- =====================================================