-- Atualizar template obstétrico com formato padrão
UPDATE system_templates 
SET 
  achados = 'Idade Gestacional DUM: {{ig_dum_semanas}} semanas e {{ig_dum_dias}} dias
Idade Gestacional USG: {{ig_usg_semanas}} semanas e {{ig_usg_dias}} dias

Gestação tópica e, única, com feto vivo em apresentação {{apresentacao}}, situação longitudinal e dorso {{dorso}}, apresentando movimentos ativos e batimentos cardíacos rítmicos, com frequência de {{fcf}} bpm.

Biometria Fetal:
- Diâmetro Bi-parietal: {{dbp}} cm
- Circunferência Cefálica: {{cc}} cm
- Circunferência Abdominal: {{ca}} cm
- Comprimento do Fêmur: {{cf}} cm

Cordão umbilical com {{cordao_vasos}}.
Placenta inserida na parede {{placenta_parede}}, grau {{placenta_grau}} de maturação, medindo {{placenta_espessura}} cm.
Volume de líquido amniótico {{status_la}} (I.L.A.: {{ila}} cm; Maior Bolsão: {{maior_bolsao}} cm).

- Peso Fetal Estimado: {{peso_estimado}} g. (percentil {{percentil_peso}})
- Biometria fetal compatível com a média de {{ig_usg_semanas}} semanas e {{ig_usg_dias}} dias.',
  impressao = '- Gestação tópica e única, com feto vivo, apresentando boa vitalidade e desenvolvimento simétrico e compatível com a idade gestacional.
- Não identifiquei anormalidades.
{{alerta_la}}{{alerta_fcf}}{{alerta_peso}}{{alerta_mov}}{{alerta_cordao}}{{alerta_cordao_vasos}}{{alerta_placenta}}',
  updated_at = now()
WHERE id = '16f55e62-fa23-4b9c-a193-9c08268de23a';