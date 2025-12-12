-- =====================================================
-- FASE 7: Verificação e Limpeza Final
-- =====================================================
-- Verificações de consistência e correções finais
-- =====================================================

-- 1. Verificar templates com variáveis no título
SELECT codigo, titulo, categoria
FROM system_templates
WHERE titulo LIKE '%{{%'
  AND ativo = true
ORDER BY titulo;

-- 2. Verificar templates ainda com abreviações
SELECT codigo, titulo, categoria
FROM system_templates
WHERE (titulo LIKE 'RM %' OR titulo LIKE 'Rm %' OR titulo LIKE 'TC %' OR titulo LIKE 'RX %' OR titulo LIKE 'USG %')
  AND ativo = true
ORDER BY titulo;

-- 3. Verificar templates normais COM travessão (possível erro)
SELECT codigo, titulo, categoria
FROM system_templates
WHERE titulo LIKE '%—%'
  AND categoria = 'normal'
  AND titulo NOT LIKE '%— Com Contraste%'
  AND titulo NOT LIKE '%— {{%'  -- variáveis são ok
  AND ativo = true
ORDER BY titulo;

-- 4. Verificar templates alterados SEM travessão (possível erro)
SELECT codigo, titulo, categoria
FROM system_templates
WHERE titulo NOT LIKE '%—%'
  AND titulo NOT LIKE '%(Alterado)%'
  AND categoria = 'alterado'
  AND ativo = true
ORDER BY titulo;

-- 5. Verificar sufixos numéricos restantes
SELECT codigo, titulo, categoria
FROM system_templates
WHERE titulo ~ '\d{3}\s*$'
  AND ativo = true
ORDER BY titulo;

-- 6. Verificar títulos com "(Normal)" ainda presente
SELECT codigo, titulo, categoria
FROM system_templates
WHERE titulo LIKE '%(Normal)%'
  AND ativo = true
ORDER BY titulo;

-- 7. Estatísticas finais
SELECT 
  COUNT(*) as total_templates,
  COUNT(CASE WHEN categoria = 'normal' THEN 1 END) as normais,
  COUNT(CASE WHEN categoria = 'alterado' THEN 1 END) as alterados,
  COUNT(CASE WHEN titulo LIKE '%{{%' THEN 1 END) as com_variaveis,
  COUNT(CASE WHEN titulo LIKE '%—%' THEN 1 END) as com_travessao
FROM system_templates
WHERE ativo = true;

-- =====================================================
-- FIM FASE 7 - Apenas verificações, sem alterações
-- =====================================================
