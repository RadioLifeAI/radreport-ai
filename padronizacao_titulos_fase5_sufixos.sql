-- =====================================================
-- FASE 5: Remoção de Sufixos Desnecessários
-- =====================================================
-- Remove "(Normal)", "001", "002" dos títulos
-- Corrige categoria quando necessário
-- =====================================================

-- 1. Remover "(Normal)" de todos os títulos (templates normais não precisam disso)
UPDATE system_templates 
SET titulo = REGEXP_REPLACE(titulo, '\s*\(Normal\)\s*$', '', 'i')
WHERE titulo LIKE '%(Normal)%'
  AND ativo = true;

-- 2. Remover sufixos numéricos "001", "002", etc. que são legados
UPDATE system_templates 
SET titulo = REGEXP_REPLACE(titulo, '\s+\d{3}\s*$', '')
WHERE titulo ~ '\s+\d{3}\s*$'
  AND ativo = true;

-- 3. Remover sufixos "Normal 001", "Normal 002" combinados
UPDATE system_templates 
SET titulo = REGEXP_REPLACE(titulo, '\s+Normal\s+\d{3}\s*$', '', 'i')
WHERE titulo ~ '\s+Normal\s+\d{3}\s*$'
  AND ativo = true;

-- 4. Corrigir categoria de templates que têm patologia mas estão como 'normal'
UPDATE system_templates 
SET categoria = 'alterado'
WHERE titulo LIKE '%—%'
  AND titulo NOT LIKE '%Com Contraste%'
  AND titulo NOT LIKE '%Protocolo%'
  AND categoria = 'normal';

-- 5. Corrigir templates que dizem "(Alterado)" no título mas categoria = normal
UPDATE system_templates 
SET categoria = 'alterado'
WHERE titulo LIKE '%(Alterado)%'
  AND categoria = 'normal';

-- 6. Remover "(Alterado)" do título quando já está como categoria alterado
-- (a patologia no título já indica que é alterado)
UPDATE system_templates 
SET titulo = REGEXP_REPLACE(titulo, '\s*\(Alterado\)\s*', '', 'i')
WHERE titulo LIKE '%(Alterado)%'
  AND titulo LIKE '%—%'  -- tem patologia específica
  AND ativo = true;

-- =====================================================
-- FIM FASE 5 - Total: ~30 templates atualizados
-- =====================================================
