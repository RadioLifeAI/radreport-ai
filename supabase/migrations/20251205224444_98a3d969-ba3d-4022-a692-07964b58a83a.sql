
-- Corrigir mapeamento de valores português → inglês para consistência com TypeScript
-- APENAS UPDATEs (sem INSERTs duplicados)

-- curva_dce: tipo_1/2/3 → type_1/2/3
UPDATE rads_text_options SET valor = 'type_1' WHERE sistema_codigo = 'ORADS_MRI' AND categoria = 'curva_dce' AND valor = 'tipo_1';
UPDATE rads_text_options SET valor = 'type_2' WHERE sistema_codigo = 'ORADS_MRI' AND categoria = 'curva_dce' AND valor = 'tipo_2';
UPDATE rads_text_options SET valor = 'type_3' WHERE sistema_codigo = 'ORADS_MRI' AND categoria = 'curva_dce' AND valor = 'tipo_3';
UPDATE rads_text_options SET valor = 'not_performed' WHERE sistema_codigo = 'ORADS_MRI' AND categoria = 'curva_dce' AND valor = 'nao_realizado';

-- tecido_solido: ausente → none
UPDATE rads_text_options SET valor = 'none' WHERE sistema_codigo = 'ORADS_MRI' AND categoria = 'tecido_solido' AND valor = 'ausente';
UPDATE rads_text_options SET valor = 'papillary_projection' WHERE sistema_codigo = 'ORADS_MRI' AND categoria = 'tecido_solido' AND valor = 'projecao_papilar';
UPDATE rads_text_options SET valor = 'mural_nodule' WHERE sistema_codigo = 'ORADS_MRI' AND categoria = 'tecido_solido' AND valor = 'nodulo_mural';
UPDATE rads_text_options SET valor = 'irregular_septum' WHERE sistema_codigo = 'ORADS_MRI' AND categoria = 'tecido_solido' AND valor = 'septo_irregular';
UPDATE rads_text_options SET valor = 'irregular_wall' WHERE sistema_codigo = 'ORADS_MRI' AND categoria = 'tecido_solido' AND valor = 'parede_irregular';
UPDATE rads_text_options SET valor = 'large_solid' WHERE sistema_codigo = 'ORADS_MRI' AND categoria = 'tecido_solido' AND valor = 'grande_solido';

-- conteudo_fluido: valores em português → inglês
UPDATE rads_text_options SET valor = 'simple' WHERE sistema_codigo = 'ORADS_MRI' AND categoria = 'conteudo_fluido' AND valor = 'simples';
UPDATE rads_text_options SET valor = 'proteinaceous' WHERE sistema_codigo = 'ORADS_MRI' AND categoria = 'conteudo_fluido' AND valor = 'proteinaceo';
UPDATE rads_text_options SET valor = 'hemorrhagic' WHERE sistema_codigo = 'ORADS_MRI' AND categoria = 'conteudo_fluido' AND valor = 'hemorragico';
UPDATE rads_text_options SET valor = 'mucinous' WHERE sistema_codigo = 'ORADS_MRI' AND categoria = 'conteudo_fluido' AND valor = 'mucinoso';
UPDATE rads_text_options SET valor = 'endometriotic' WHERE sistema_codigo = 'ORADS_MRI' AND categoria = 'conteudo_fluido' AND valor = 'endometriotico';
UPDATE rads_text_options SET valor = 'fat' WHERE sistema_codigo = 'ORADS_MRI' AND categoria = 'conteudo_fluido' AND valor = 'lipidico';

-- sinal_t2: valores em português → inglês
UPDATE rads_text_options SET valor = 'low' WHERE sistema_codigo = 'ORADS_MRI' AND categoria = 'sinal_t2' AND valor = 'hipointenso';
UPDATE rads_text_options SET valor = 'intermediate' WHERE sistema_codigo = 'ORADS_MRI' AND categoria = 'sinal_t2' AND valor = 'intermediario';
UPDATE rads_text_options SET valor = 'high' WHERE sistema_codigo = 'ORADS_MRI' AND categoria = 'sinal_t2' AND valor = 'hiperintenso';
UPDATE rads_text_options SET valor = 'very_low' WHERE sistema_codigo = 'ORADS_MRI' AND categoria = 'sinal_t2' AND valor = 'dark_t2_dark_dwi';

-- status_menopausal: pre/pos → premenopausal/postmenopausal
UPDATE rads_text_options SET valor = 'premenopausal' WHERE sistema_codigo = 'ORADS_MRI' AND categoria = 'status_menopausal' AND valor = 'pre';
UPDATE rads_text_options SET valor = 'postmenopausal' WHERE sistema_codigo = 'ORADS_MRI' AND categoria = 'status_menopausal' AND valor = 'pos';
UPDATE rads_text_options SET valor = 'unknown' WHERE sistema_codigo = 'ORADS_MRI' AND categoria = 'status_menopausal' AND valor = 'incerto';

-- tipo_lesao_mri: valores em português → inglês
UPDATE rads_text_options SET valor = 'follicle' WHERE sistema_codigo = 'ORADS_MRI' AND categoria = 'tipo_lesao_mri' AND valor = 'foliculo';
UPDATE rads_text_options SET valor = 'corpus_luteum' WHERE sistema_codigo = 'ORADS_MRI' AND categoria = 'tipo_lesao_mri' AND valor = 'corpo_luteo';
UPDATE rads_text_options SET valor = 'hemorrhagic_cyst' WHERE sistema_codigo = 'ORADS_MRI' AND categoria = 'tipo_lesao_mri' AND valor = 'cisto_hemorragico';
UPDATE rads_text_options SET valor = 'unilocular_cyst' WHERE sistema_codigo = 'ORADS_MRI' AND categoria = 'tipo_lesao_mri' AND valor = 'cisto_unilocular';
UPDATE rads_text_options SET valor = 'multilocular_cyst' WHERE sistema_codigo = 'ORADS_MRI' AND categoria = 'tipo_lesao_mri' AND valor = 'cisto_multilocular';
UPDATE rads_text_options SET valor = 'paraovarian_cyst' WHERE sistema_codigo = 'ORADS_MRI' AND categoria = 'tipo_lesao_mri' AND valor = 'cisto_paraovariano';
UPDATE rads_text_options SET valor = 'hydrosalpinx' WHERE sistema_codigo = 'ORADS_MRI' AND categoria = 'tipo_lesao_mri' AND valor = 'hidrossalpinge';
UPDATE rads_text_options SET valor = 'fat_containing' WHERE sistema_codigo = 'ORADS_MRI' AND categoria = 'tipo_lesao_mri' AND valor = 'lesao_lipidica';
UPDATE rads_text_options SET valor = 'solid' WHERE sistema_codigo = 'ORADS_MRI' AND categoria = 'tipo_lesao_mri' AND valor = 'lesao_solida';
UPDATE rads_text_options SET valor = 'mixed' WHERE sistema_codigo = 'ORADS_MRI' AND categoria = 'tipo_lesao_mri' AND valor = 'lesao_mista';

-- ascite: ausente → none
UPDATE rads_text_options SET valor = 'none' WHERE sistema_codigo = 'ORADS_MRI' AND categoria = 'ascite' AND valor = 'ausente';
UPDATE rads_text_options SET valor = 'small' WHERE sistema_codigo = 'ORADS_MRI' AND categoria = 'ascite' AND valor = 'pequena';
UPDATE rads_text_options SET valor = 'moderate' WHERE sistema_codigo = 'ORADS_MRI' AND categoria = 'ascite' AND valor = 'moderada';
UPDATE rads_text_options SET valor = 'large' WHERE sistema_codigo = 'ORADS_MRI' AND categoria = 'ascite' AND valor = 'volumosa';

-- nodularidade_peritoneal: ausente → none
UPDATE rads_text_options SET valor = 'none' WHERE sistema_codigo = 'ORADS_MRI' AND categoria = 'nodularidade_peritoneal' AND valor = 'ausente';
UPDATE rads_text_options SET valor = 'present' WHERE sistema_codigo = 'ORADS_MRI' AND categoria = 'nodularidade_peritoneal' AND valor = 'presente';
UPDATE rads_text_options SET valor = 'extensive' WHERE sistema_codigo = 'ORADS_MRI' AND categoria = 'nodularidade_peritoneal' AND valor = 'extensa';

-- linfonodos: normais → normal
UPDATE rads_text_options SET valor = 'normal' WHERE sistema_codigo = 'ORADS_MRI' AND categoria = 'linfonodos' AND valor = 'normais';
UPDATE rads_text_options SET valor = 'enlarged' WHERE sistema_codigo = 'ORADS_MRI' AND categoria = 'linfonodos' AND valor = 'aumentados';
UPDATE rads_text_options SET valor = 'suspicious' WHERE sistema_codigo = 'ORADS_MRI' AND categoria = 'linfonodos' AND valor = 'suspeitos';

-- comparativo: sem_previo → no_prior
UPDATE rads_text_options SET valor = 'no_prior' WHERE sistema_codigo = 'ORADS_MRI' AND categoria = 'comparativo' AND valor = 'sem_previo';
UPDATE rads_text_options SET valor = 'stable' WHERE sistema_codigo = 'ORADS_MRI' AND categoria = 'comparativo' AND valor = 'estavel';
UPDATE rads_text_options SET valor = 'increased' WHERE sistema_codigo = 'ORADS_MRI' AND categoria = 'comparativo' AND valor = 'aumentado';
UPDATE rads_text_options SET valor = 'decreased' WHERE sistema_codigo = 'ORADS_MRI' AND categoria = 'comparativo' AND valor = 'diminuido';
UPDATE rads_text_options SET valor = 'new' WHERE sistema_codigo = 'ORADS_MRI' AND categoria = 'comparativo' AND valor = 'novo';
