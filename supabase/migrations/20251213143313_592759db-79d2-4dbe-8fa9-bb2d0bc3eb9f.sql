-- =====================================================
-- FASE 1: Criar tabelas de conteúdo do usuário
-- =====================================================

-- Tabela de templates do usuário (simplificada)
CREATE TABLE IF NOT EXISTS public.user_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  titulo VARCHAR(255) NOT NULL,
  texto TEXT NOT NULL,
  modalidade_codigo VARCHAR(10) NOT NULL,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela de frases do usuário (simplificada)
CREATE TABLE IF NOT EXISTS public.user_frases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  titulo VARCHAR(255) NOT NULL,
  texto TEXT NOT NULL,
  conclusao TEXT,
  modalidade_codigo VARCHAR(10) NOT NULL,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- FASE 2: Habilitar RLS e criar políticas
-- =====================================================

ALTER TABLE public.user_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_frases ENABLE ROW LEVEL SECURITY;

-- Políticas para user_templates
CREATE POLICY "Users can view own templates" ON public.user_templates
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own templates" ON public.user_templates
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own templates" ON public.user_templates
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own templates" ON public.user_templates
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para user_frases
CREATE POLICY "Users can view own frases" ON public.user_frases
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own frases" ON public.user_frases
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own frases" ON public.user_frases
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own frases" ON public.user_frases
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- FASE 3: Índices para performance
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_user_templates_user_id ON public.user_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_user_templates_modalidade ON public.user_templates(modalidade_codigo);
CREATE INDEX IF NOT EXISTS idx_user_frases_user_id ON public.user_frases(user_id);
CREATE INDEX IF NOT EXISTS idx_user_frases_modalidade ON public.user_frases(modalidade_codigo);

-- =====================================================
-- FASE 4: Adicionar limites na tabela subscription_plans
-- =====================================================

ALTER TABLE public.subscription_plans 
ADD COLUMN IF NOT EXISTS max_user_templates INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS max_user_frases INTEGER DEFAULT 10;

-- Atualizar limites por plano
UPDATE public.subscription_plans SET max_user_templates = 5, max_user_frases = 10 WHERE code = 'free';
UPDATE public.subscription_plans SET max_user_templates = 20, max_user_frases = 50 WHERE code = 'basic';
UPDATE public.subscription_plans SET max_user_templates = 100, max_user_frases = 200 WHERE code = 'professional';
UPDATE public.subscription_plans SET max_user_templates = 9999, max_user_frases = 9999 WHERE code = 'premium';

-- =====================================================
-- FASE 5: Trigger para updated_at
-- =====================================================

CREATE OR REPLACE FUNCTION public.update_user_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_templates_updated_at
  BEFORE UPDATE ON public.user_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_user_content_updated_at();

CREATE TRIGGER update_user_frases_updated_at
  BEFORE UPDATE ON public.user_frases
  FOR EACH ROW EXECUTE FUNCTION public.update_user_content_updated_at();