-- Adicionar campos opcionais ao LI-RADS US
INSERT INTO rads_text_options (sistema_codigo, categoria, valor, label, texto, ordem, ativo) VALUES

-- Contornos Hepáticos
('LIRADS_US', 'contornos_figado', 'regulares', 'Regulares', 'contornos hepáticos regulares', 1, true),
('LIRADS_US', 'contornos_figado', 'irregulares', 'Irregulares/Nodulares', 'contornos hepáticos irregulares/nodulares', 2, true),

-- Esteatose Hepática
('LIRADS_US', 'esteatose', 'ausente', 'Ausente', 'sem sinais de esteatose hepática', 1, true),
('LIRADS_US', 'esteatose', 'leve', 'Leve', 'esteatose hepática leve', 2, true),
('LIRADS_US', 'esteatose', 'moderada', 'Moderada', 'esteatose hepática moderada', 3, true),
('LIRADS_US', 'esteatose', 'acentuada', 'Acentuada', 'esteatose hepática acentuada', 4, true),

-- Esplenomegalia
('LIRADS_US', 'esplenomegalia', 'ausente', 'Ausente', 'baço de dimensões normais', 1, true),
('LIRADS_US', 'esplenomegalia', 'presente', 'Presente', 'esplenomegalia', 2, true),

-- Ascite
('LIRADS_US', 'ascite', 'ausente', 'Ausente', 'sem líquido livre na cavidade peritoneal', 1, true),
('LIRADS_US', 'ascite', 'leve', 'Leve (Perihepático)', 'pequena quantidade de líquido livre perihepático', 2, true),
('LIRADS_US', 'ascite', 'moderada', 'Moderada', 'moderada quantidade de líquido livre na cavidade', 3, true),
('LIRADS_US', 'ascite', 'volumosa', 'Volumosa', 'volumosa ascite', 4, true),

-- Resultado Exame Anterior
('LIRADS_US', 'resultado_anterior', 'US-1', 'US-1 (Negativo)', 'resultado anterior US-1 (negativo)', 1, true),
('LIRADS_US', 'resultado_anterior', 'US-2', 'US-2 (Sublimiar)', 'resultado anterior US-2 (sublimiar)', 2, true),
('LIRADS_US', 'resultado_anterior', 'US-3', 'US-3 (Positivo)', 'resultado anterior US-3 (positivo)', 3, true),
('LIRADS_US', 'resultado_anterior', 'nao_disponivel', 'Não Disponível', 'sem exame anterior disponível para comparação', 4, true);