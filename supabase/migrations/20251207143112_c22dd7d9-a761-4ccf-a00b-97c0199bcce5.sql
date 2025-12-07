-- =====================================================
-- FASE 1: Limpeza de Funções SQL Não Utilizadas
-- Total estimado: ~729 funções
-- Justificativa: Sistema de "laudos dinâmicos via SQL" nunca integrado
-- O sistema atual usa templates + frases_modelo + variáveis JSON no frontend
-- =====================================================

-- 1. Excluir funções componente_* (~474 funções)
DO $$
DECLARE
    r RECORD;
    dropped_count INTEGER := 0;
BEGIN
    FOR r IN 
        SELECT p.oid, n.nspname, p.proname, pg_get_function_identity_arguments(p.oid) as args
        FROM pg_proc p 
        JOIN pg_namespace n ON n.oid = p.pronamespace 
        WHERE n.nspname = 'public' AND p.proname LIKE 'componente_%'
    LOOP
        EXECUTE 'DROP FUNCTION IF EXISTS public.' || quote_ident(r.proname) || '(' || r.args || ') CASCADE';
        dropped_count := dropped_count + 1;
    END LOOP;
    RAISE NOTICE 'Dropped % componente_* functions', dropped_count;
END $$;

-- 2. Excluir funções avaliar_* (~89 funções)
DO $$
DECLARE
    r RECORD;
    dropped_count INTEGER := 0;
BEGIN
    FOR r IN 
        SELECT p.oid, n.nspname, p.proname, pg_get_function_identity_arguments(p.oid) as args
        FROM pg_proc p 
        JOIN pg_namespace n ON n.oid = p.pronamespace 
        WHERE n.nspname = 'public' AND p.proname LIKE 'avaliar_%'
    LOOP
        EXECUTE 'DROP FUNCTION IF EXISTS public.' || quote_ident(r.proname) || '(' || r.args || ') CASCADE';
        dropped_count := dropped_count + 1;
    END LOOP;
    RAISE NOTICE 'Dropped % avaliar_* functions', dropped_count;
END $$;

-- 3. Excluir funções rm_craneo_* (~67 funções)
DO $$
DECLARE
    r RECORD;
    dropped_count INTEGER := 0;
BEGIN
    FOR r IN 
        SELECT p.oid, n.nspname, p.proname, pg_get_function_identity_arguments(p.oid) as args
        FROM pg_proc p 
        JOIN pg_namespace n ON n.oid = p.pronamespace 
        WHERE n.nspname = 'public' AND p.proname LIKE 'rm_craneo_%'
    LOOP
        EXECUTE 'DROP FUNCTION IF EXISTS public.' || quote_ident(r.proname) || '(' || r.args || ') CASCADE';
        dropped_count := dropped_count + 1;
    END LOOP;
    RAISE NOTICE 'Dropped % rm_craneo_* functions', dropped_count;
END $$;

-- 4. Excluir funções classificar_* (~64 funções)
DO $$
DECLARE
    r RECORD;
    dropped_count INTEGER := 0;
BEGIN
    FOR r IN 
        SELECT p.oid, n.nspname, p.proname, pg_get_function_identity_arguments(p.oid) as args
        FROM pg_proc p 
        JOIN pg_namespace n ON n.oid = p.pronamespace 
        WHERE n.nspname = 'public' AND p.proname LIKE 'classificar_%'
    LOOP
        EXECUTE 'DROP FUNCTION IF EXISTS public.' || quote_ident(r.proname) || '(' || r.args || ') CASCADE';
        dropped_count := dropped_count + 1;
    END LOOP;
    RAISE NOTICE 'Dropped % classificar_* functions', dropped_count;
END $$;

-- 5. Excluir funções calcular_* (~29 funções)
-- NOTA: Mantém calcular_* que são usadas (verificar dependências)
DO $$
DECLARE
    r RECORD;
    dropped_count INTEGER := 0;
BEGIN
    FOR r IN 
        SELECT p.oid, n.nspname, p.proname, pg_get_function_identity_arguments(p.oid) as args
        FROM pg_proc p 
        JOIN pg_namespace n ON n.oid = p.pronamespace 
        WHERE n.nspname = 'public' AND p.proname LIKE 'calcular_%'
    LOOP
        EXECUTE 'DROP FUNCTION IF EXISTS public.' || quote_ident(r.proname) || '(' || r.args || ') CASCADE';
        dropped_count := dropped_count + 1;
    END LOOP;
    RAISE NOTICE 'Dropped % calcular_* functions', dropped_count;
END $$;

-- 6. Excluir funções gerar_* (~3 funções)
DO $$
DECLARE
    r RECORD;
    dropped_count INTEGER := 0;
BEGIN
    FOR r IN 
        SELECT p.oid, n.nspname, p.proname, pg_get_function_identity_arguments(p.oid) as args
        FROM pg_proc p 
        JOIN pg_namespace n ON n.oid = p.pronamespace 
        WHERE n.nspname = 'public' AND p.proname LIKE 'gerar_%'
    LOOP
        EXECUTE 'DROP FUNCTION IF EXISTS public.' || quote_ident(r.proname) || '(' || r.args || ') CASCADE';
        dropped_count := dropped_count + 1;
    END LOOP;
    RAISE NOTICE 'Dropped % gerar_* functions', dropped_count;
END $$;

-- 7. Excluir funções analise_* (~2 funções)
DO $$
DECLARE
    r RECORD;
    dropped_count INTEGER := 0;
BEGIN
    FOR r IN 
        SELECT p.oid, n.nspname, p.proname, pg_get_function_identity_arguments(p.oid) as args
        FROM pg_proc p 
        JOIN pg_namespace n ON n.oid = p.pronamespace 
        WHERE n.nspname = 'public' AND p.proname LIKE 'analise_%'
    LOOP
        EXECUTE 'DROP FUNCTION IF EXISTS public.' || quote_ident(r.proname) || '(' || r.args || ') CASCADE';
        dropped_count := dropped_count + 1;
    END LOOP;
    RAISE NOTICE 'Dropped % analise_* functions', dropped_count;
END $$;

-- 8. Excluir funções buscar_* (~1 função)
DO $$
DECLARE
    r RECORD;
    dropped_count INTEGER := 0;
BEGIN
    FOR r IN 
        SELECT p.oid, n.nspname, p.proname, pg_get_function_identity_arguments(p.oid) as args
        FROM pg_proc p 
        JOIN pg_namespace n ON n.oid = p.pronamespace 
        WHERE n.nspname = 'public' AND p.proname LIKE 'buscar_%'
    LOOP
        EXECUTE 'DROP FUNCTION IF EXISTS public.' || quote_ident(r.proname) || '(' || r.args || ') CASCADE';
        dropped_count := dropped_count + 1;
    END LOOP;
    RAISE NOTICE 'Dropped % buscar_* functions', dropped_count;
END $$;

-- 9. Excluir funções legacy específicas não utilizadas
DROP FUNCTION IF EXISTS public.get_ai_function_config(text) CASCADE;
DROP FUNCTION IF EXISTS public.generate_report_number() CASCADE;
DROP FUNCTION IF EXISTS public.create_report_version(uuid, text, text, text) CASCADE;
DROP FUNCTION IF EXISTS public.auto_save_report(uuid, text, jsonb) CASCADE;

-- Verificação final: contar funções restantes
DO $$
DECLARE
    remaining_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO remaining_count
    FROM pg_proc p 
    JOIN pg_namespace n ON n.oid = p.pronamespace 
    WHERE n.nspname = 'public';
    
    RAISE NOTICE 'Remaining functions in public schema: %', remaining_count;
END $$;