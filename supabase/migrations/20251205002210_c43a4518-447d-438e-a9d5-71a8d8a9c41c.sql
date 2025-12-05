-- Fase 1: Correções e adições no banco rads_text_options

-- 1.1 Corrigir texto de mastectomia (BI-RADS USG)
UPDATE rads_text_options 
SET texto = 'Mama {lado} ausente (status pós-cirúrgico).',
    variaveis = '["{lado}"]'::jsonb
WHERE sistema_codigo = 'BIRADS_USG' 
  AND categoria = 'tipoCirurgia' 
  AND valor = 'mastectomia';

-- 1.2 Corrigir textos de reconstrução
UPDATE rads_text_options 
SET texto = 'Reconstrução mamária com prótese.'
WHERE sistema_codigo = 'BIRADS_USG' 
  AND categoria = 'tipoReconstrucao' 
  AND valor = 'protese';

UPDATE rads_text_options 
SET texto = 'Reconstrução mamária com retalho miocutâneo.'
WHERE sistema_codigo = 'BIRADS_USG' 
  AND categoria = 'tipoReconstrucao' 
  AND valor = 'retalho';

-- 1.3 Adicionar opções faltantes de calcificações (BI-RADS MG)
INSERT INTO rads_text_options (sistema_codigo, categoria, valor, label, texto, suspeicao, ordem, ativo) VALUES
('BIRADS_MG', 'calcificacoes', 'benignas_vasculares', 'Benignas, algumas vasculares', 'Calcificações de características tipicamente benignas, algumas vasculares', 'benigno', 2, true),
('BIRADS_MG', 'calcificacoes', 'vasculares', 'Calcificações vasculares', 'Calcificações vasculares', 'benigno', 3, true),
('BIRADS_MG', 'calcificacoes', 'leite_calcio', 'Aspecto de "leite de cálcio"', 'Calcificações de características tipicamente benignas, algumas assumindo morfologia linear no perfil, sugerindo "leite de cálcio" intracístico', 'benigno', 4, true),
('BIRADS_MG', 'calcificacoes', 'mastopatia', 'Mastopatia secretória', 'Calcificações compatíveis com mastopatia secretória', 'benigno', 5, true)
ON CONFLICT DO NOTHING;

-- 1.4 Adicionar morfologia puntiforme
INSERT INTO rads_text_options (sistema_codigo, categoria, valor, label, texto, suspeicao, ordem, ativo) VALUES
('BIRADS_MG', 'morfologiaCalcificacoes', 'puntiforme', 'Puntiforme', 'de morfologia puntiforme', 'indeterminado', 2, true)
ON CONFLICT DO NOTHING;

-- 1.5 Adicionar localização prolongamento axilar se não existir
INSERT INTO rads_text_options (sistema_codigo, categoria, valor, label, texto, ordem, ativo) VALUES
('BIRADS_MG', 'localizacaoMG', 'prolongamento', 'Prolongamento axilar', 'no prolongamento axilar', 10, true)
ON CONFLICT DO NOTHING;

-- 1.6 Adicionar recomendações BI-RADS 0 faltantes
INSERT INTO rads_text_options (sistema_codigo, categoria, valor, label, texto, ordem, ativo) VALUES
('BIRADS_MG', 'recomendacoesBirads0', '0-nodulo-usg', 'Nódulo → Ultrassonografia', 'Avaliação adicional com ultrassonografia mamária recomendada para caracterização do nódulo.', 3, true),
('BIRADS_MG', 'recomendacoesBirads0', '0-comparacao', 'Necessita comparação', 'Necessária comparação com exames anteriores.', 4, true)
ON CONFLICT DO NOTHING;

-- 1.7 Adicionar categorias faltantes para BI-RADS USG expandido
INSERT INTO rads_text_options (sistema_codigo, categoria, valor, label, texto, suspeicao, ordem, ativo) VALUES
-- Tipo indicação expandida
('BIRADS_USG', 'tipoIndicacao', 'rastreamento', 'Rastreamento', 'Rastreamento mamário', 'neutro', 1, true),
('BIRADS_USG', 'tipoIndicacao', 'diagnostico', 'Diagnóstico', 'Avaliação diagnóstica', 'neutro', 2, true),
('BIRADS_USG', 'tipoIndicacao', 'seguimento', 'Seguimento', 'Controle evolutivo', 'neutro', 3, true),
('BIRADS_USG', 'tipoIndicacao', 'pre_operatorio', 'Pré-operatório', 'Avaliação pré-operatória', 'neutro', 4, true),
('BIRADS_USG', 'tipoIndicacao', 'pos_tratamento', 'Pós-tratamento', 'Avaliação pós-tratamento oncológico', 'neutro', 5, true),
('BIRADS_USG', 'tipoIndicacao', 'guia_procedimento', 'Guia de procedimento', 'Guia para procedimento intervencionista', 'neutro', 6, true),
('BIRADS_USG', 'tipoIndicacao', 'complementar_mg', 'Complementar à mamografia', 'Complementação à mamografia', 'neutro', 7, true)
ON CONFLICT DO NOTHING;

-- Tipo cirurgia expandido
INSERT INTO rads_text_options (sistema_codigo, categoria, valor, label, texto, suspeicao, usa_lado, ordem, ativo) VALUES
('BIRADS_USG', 'tipoCirurgia', 'nenhuma', 'Nenhuma', '', 'neutro', false, 0, true),
('BIRADS_USG', 'tipoCirurgia', 'setorectomia', 'Setorectomia', 'Status pós-setorectomia em mama {lado}.', 'neutro', true, 2, true),
('BIRADS_USG', 'tipoCirurgia', 'quadrantectomia', 'Quadrantectomia', 'Status pós-quadrantectomia em mama {lado}.', 'neutro', true, 3, true),
('BIRADS_USG', 'tipoCirurgia', 'tumorectomia', 'Tumorectomia', 'Status pós-tumorectomia em mama {lado}.', 'neutro', true, 4, true),
('BIRADS_USG', 'tipoCirurgia', 'mamoplastia_redutora', 'Mamoplastia redutora', 'Status pós-mamoplastia redutora.', 'neutro', false, 5, true),
('BIRADS_USG', 'tipoCirurgia', 'mamoplastia_aumento', 'Mamoplastia de aumento', 'Status pós-mamoplastia de aumento com próteses.', 'neutro', false, 6, true)
ON CONFLICT DO NOTHING;

-- Tipo reconstrução expandido
INSERT INTO rads_text_options (sistema_codigo, categoria, valor, label, texto, ordem, ativo) VALUES
('BIRADS_USG', 'tipoReconstrucao', 'nenhuma', 'Nenhuma', '', 0, true),
('BIRADS_USG', 'tipoReconstrucao', 'expansor', 'Expansor tecidual', 'Reconstrução mamária com expansor tecidual.', 3, true),
('BIRADS_USG', 'tipoReconstrucao', 'tram', 'Retalho TRAM', 'Reconstrução mamária com retalho TRAM.', 4, true),
('BIRADS_USG', 'tipoReconstrucao', 'diep', 'Retalho DIEP', 'Reconstrução mamária com retalho DIEP.', 5, true),
('BIRADS_USG', 'tipoReconstrucao', 'grande_dorsal', 'Retalho grande dorsal', 'Reconstrução mamária com retalho do grande dorsal.', 6, true)
ON CONFLICT DO NOTHING;

-- Padrão parenquima
INSERT INTO rads_text_options (sistema_codigo, categoria, valor, label, texto, ordem, ativo) VALUES
('BIRADS_USG', 'padraoParenquima', 'homogeneo_adiposo', 'Homogêneo adiposo', 'Parênquima mamário homogêneo, predominantemente adiposo.', 1, true),
('BIRADS_USG', 'padraoParenquima', 'homogeneo_fibroglandular', 'Homogêneo fibroglandular', 'Parênquima mamário homogêneo, fibroglandular.', 2, true),
('BIRADS_USG', 'padraoParenquima', 'heterogeneo', 'Heterogêneo', 'Parênquima mamário heterogêneo.', 3, true)
ON CONFLICT DO NOTHING;

-- Ectasia ductal
INSERT INTO rads_text_options (sistema_codigo, categoria, valor, label, texto, ordem, ativo) VALUES
('BIRADS_USG', 'ectasiaDuctal', 'ausente', 'Ausente', '', 0, true),
('BIRADS_USG', 'ectasiaDuctal', 'leve', 'Ectasia leve', 'Ectasia ductal leve.', 1, true),
('BIRADS_USG', 'ectasiaDuctal', 'moderada', 'Ectasia moderada', 'Ectasia ductal moderada.', 2, true),
('BIRADS_USG', 'ectasiaDuctal', 'acentuada', 'Ectasia acentuada', 'Ectasia ductal acentuada.', 3, true)
ON CONFLICT DO NOTHING;

-- Distorção arquitetural
INSERT INTO rads_text_options (sistema_codigo, categoria, valor, label, texto, suspeicao, ordem, ativo) VALUES
('BIRADS_USG', 'distorcaoArquitetural', 'ausente', 'Ausente', '', 'neutro', 0, true),
('BIRADS_USG', 'distorcaoArquitetural', 'presente', 'Presente', 'Distorção arquitetural identificada.', 'suspeito', 1, true),
('BIRADS_USG', 'distorcaoArquitetural', 'cicatricial', 'Cicatricial', 'Distorção arquitetural de aspecto cicatricial.', 'indeterminado', 2, true)
ON CONFLICT DO NOTHING;

-- Implante mamário
INSERT INTO rads_text_options (sistema_codigo, categoria, valor, label, texto, ordem, ativo) VALUES
('BIRADS_USG', 'implanteMamario', 'ausente', 'Ausente', '', 0, true),
('BIRADS_USG', 'implanteMamario', 'retroglandular', 'Retroglandular', 'Implantes mamários em posição retroglandular, íntegros.', 1, true),
('BIRADS_USG', 'implanteMamario', 'retromuscular', 'Retromuscular', 'Implantes mamários em posição retromuscular, íntegros.', 2, true),
('BIRADS_USG', 'implanteMamario', 'duplo_plano', 'Duplo plano', 'Implantes mamários em posição de duplo plano, íntegros.', 3, true)
ON CONFLICT DO NOTHING;

-- Linfonodomegalia
INSERT INTO rads_text_options (sistema_codigo, categoria, valor, label, texto, suspeicao, ordem, ativo) VALUES
('BIRADS_USG', 'linfonodomegalia', 'ausente', 'Ausente', 'Ausência de linfonodomegalias axilares.', 'benigno', 0, true),
('BIRADS_USG', 'linfonodomegalia', 'reacional', 'Reacional', 'Linfonodos axilares de aspecto reacional.', 'benigno', 1, true),
('BIRADS_USG', 'linfonodomegalia', 'suspeita', 'Suspeita', 'Linfonodomegalia axilar de aspecto suspeito.', 'suspeito', 2, true)
ON CONFLICT DO NOTHING;