-- LI-RADS US: Adicionar registros dinâmicos para textos profissionais
-- Técnica padrão
INSERT INTO rads_text_options (sistema_codigo, categoria, valor, label, texto, ordem, ativo)
VALUES 
('LIRADS_US', 'tecnica', 'padrao', 'Técnica Padrão', 'Exame realizado com transdutor convexo multifrequencial (2-5 MHz), utilizando técnica padrão para avaliação hepática de vigilância conforme protocolo ACR LI-RADS US Surveillance v2024.', 1, true)
ON CONFLICT DO NOTHING;

-- Categorias LI-RADS com descrições profissionais
INSERT INTO rads_text_options (sistema_codigo, categoria, valor, label, texto, ordem, ativo)
VALUES 
('LIRADS_US', 'lirads_categoria', 'US-1', 'US-1 - Negativo', 'Exame ultrassonográfico de vigilância sem identificação de observações focais suspeitas ou com observações definitivamente benignas (cisto simples, hemangioma típico, esteatose focal).', 1, true),
('LIRADS_US', 'lirads_categoria', 'US-2', 'US-2 - Sublimiar', 'Observação focal inferior a 10 mm, não caracterizada como definitivamente benigna. Achado requer seguimento ultrassonográfico de curto prazo para avaliar estabilidade.', 2, true),
('LIRADS_US', 'lirads_categoria', 'US-3', 'US-3 - Positivo', 'Observação focal igual ou superior a 10 mm não definitivamente benigna, distorção arquitetural parenquimatosa focal, ou trombo vascular novo identificado.', 3, true)
ON CONFLICT DO NOTHING;

-- Recomendações por categoria
INSERT INTO rads_text_options (sistema_codigo, categoria, valor, label, texto, ordem, ativo)
VALUES 
('LIRADS_US', 'lirads_recomendacao', 'US-1', 'Recomendação US-1', 'Manter vigilância ultrassonográfica conforme protocolo institucional, com intervalo de 6 meses.', 1, true),
('LIRADS_US', 'lirads_recomendacao', 'US-2', 'Recomendação US-2', 'Repetir ultrassonografia de vigilância em intervalo de 3 a 6 meses, podendo ser realizada até 2 vezes consecutivas. Caso a observação permaneça inferior a 10 mm ou não seja mais identificada em 2 exames consecutivos de seguimento, pode ser recategorizada como US-1 (Negativo).', 2, true),
('LIRADS_US', 'lirads_recomendacao', 'US-3', 'Recomendação US-3', 'Avaliação diagnóstica complementar com tomografia computadorizada multifásica, ressonância magnética hepatobiliar ou ultrassonografia com contraste (CEUS) para caracterização da lesão segundo critérios LI-RADS CT/MRI diagnóstico.', 3, true)
ON CONFLICT DO NOTHING;

-- VIS-C Recomendações
INSERT INTO rads_text_options (sistema_codigo, categoria, valor, label, texto, ordem, ativo)
VALUES 
('LIRADS_US', 'vis_c_recomendacao', 'sem_fatores_risco', 'VIS-C sem fatores de risco', 'Limitações moderadas a severas na avaliação ultrassonográfica hepática (categoria de visualização C - VIS-C). Recomenda-se repetição do exame ultrassonográfico em prazo máximo de 3 meses. Caso persista classificação VIS-C no exame subsequente, considerar modalidade alternativa de vigilância, como tomografia computadorizada de baixa dose ou ressonância magnética abreviada do fígado.', 1, true),
('LIRADS_US', 'vis_c_recomendacao', 'com_fatores_risco', 'VIS-C com fatores de risco', 'Limitações moderadas a severas na avaliação ultrassonográfica hepática (categoria de visualização C - VIS-C), associadas à presença de fatores de risco para recorrência de limitação técnica (cirrose por esteatohepatite metabólica/alcoólica, classificação Child-Pugh B ou C, ou índice de massa corporal igual ou superior a 35 kg/m²). Considerando alta probabilidade de limitação técnica persistente em exame ultrassonográfico subsequente, recomenda-se avaliar indicação de modalidade alternativa de vigilância (tomografia computadorizada de baixa dose ou ressonância magnética abreviada) sem necessidade de aguardar repetição do exame ultrassonográfico.', 2, true)
ON CONFLICT DO NOTHING;

-- AFP positivo
INSERT INTO rads_text_options (sistema_codigo, categoria, valor, label, texto, ordem, ativo)
VALUES 
('LIRADS_US', 'afp_positivo_texto', 'afp_elevada_sem_us3', 'AFP elevada sem correlato US-3', 'Considerando nível sérico de alfa-fetoproteína elevado (≥ 20 ng/mL) ou com curva ascendente, na ausência de observação focal categorizável como US-3, a ultrassonografia com contraste (CEUS) apresenta utilidade limitada sem correlato morfológico identificável. Recomenda-se avaliação diagnóstica complementar com tomografia computadorizada multifásica ou ressonância magnética hepatobiliar para investigação de carcinoma hepatocelular.', 1, true)
ON CONFLICT DO NOTHING;

-- Veia pérvia (normal)
INSERT INTO rads_text_options (sistema_codigo, categoria, valor, label, texto, ordem, ativo)
VALUES 
('LIRADS_US', 'veia_pervia', 'normal', 'Veias pérvias', 'Sistema venoso hepático (veias hepáticas e veia porta principal com suas ramificações) exibindo fluxo presente e patência preservada ao estudo Doppler colorido.', 1, true)
ON CONFLICT DO NOTHING;