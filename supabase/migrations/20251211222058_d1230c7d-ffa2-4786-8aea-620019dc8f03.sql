-- ============================================
-- FASE 1: Corrigir Divergências de Nomenclatura
-- ============================================

-- 1.1 Normalizar frases_modelo: abdomen → abdome, pelvis → pelve
UPDATE frases_modelo SET regiao_codigo = 'abdome' WHERE regiao_codigo = 'abdomen';
UPDATE frases_modelo SET regiao_codigo = 'pelve' WHERE regiao_codigo = 'pelvis';

-- 1.2 Normalizar system_templates restantes
UPDATE system_templates SET regiao_codigo = 'ext_inferior' WHERE regiao_codigo IN ('CALCANE0', 'arcos_costais');
UPDATE system_templates SET regiao_codigo = 'torax' WHERE regiao_codigo = 'geral';