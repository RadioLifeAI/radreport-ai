-- LI-RADS US v2024: Atualização nomenclatura MASH/MASLD
-- Atualizar etiologias existentes para nomenclatura v2024

UPDATE rads_text_options SET 
  valor = 'mash',
  label = 'MASH (ex-NASH)',
  texto = 'cirrose por esteatohepatite metabólica associada a disfunção metabólica (MASH)'
WHERE sistema_codigo = 'LIRADS_US' AND categoria = 'etiologia_cirrose' AND valor = 'nash';

UPDATE rads_text_options SET 
  valor = 'masld',
  label = 'MASLD (ex-NAFLD)', 
  texto = 'doença hepática esteatótica associada a disfunção metabólica (MASLD)'
WHERE sistema_codigo = 'LIRADS_US' AND categoria = 'etiologia_cirrose' AND valor = 'nafld';

-- Inserir caso não existam
INSERT INTO rads_text_options (sistema_codigo, categoria, valor, label, texto, ordem, ativo)
SELECT 'LIRADS_US', 'etiologia_cirrose', 'mash', 'MASH (ex-NASH)', 'cirrose por esteatohepatite metabólica associada a disfunção metabólica (MASH)', 10, true
WHERE NOT EXISTS (SELECT 1 FROM rads_text_options WHERE sistema_codigo = 'LIRADS_US' AND categoria = 'etiologia_cirrose' AND valor = 'mash');

INSERT INTO rads_text_options (sistema_codigo, categoria, valor, label, texto, ordem, ativo)
SELECT 'LIRADS_US', 'etiologia_cirrose', 'masld', 'MASLD (ex-NAFLD)', 'doença hepática esteatótica associada a disfunção metabólica (MASLD)', 11, true
WHERE NOT EXISTS (SELECT 1 FROM rads_text_options WHERE sistema_codigo = 'LIRADS_US' AND categoria = 'etiologia_cirrose' AND valor = 'masld');

INSERT INTO rads_text_options (sistema_codigo, categoria, valor, label, texto, ordem, ativo)
SELECT 'LIRADS_US', 'etiologia_cirrose', 'alcool', 'Alcoólica', 'cirrose de etiologia alcoólica', 12, true
WHERE NOT EXISTS (SELECT 1 FROM rads_text_options WHERE sistema_codigo = 'LIRADS_US' AND categoria = 'etiologia_cirrose' AND valor = 'alcool');