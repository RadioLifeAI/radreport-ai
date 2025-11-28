-- =====================================================
-- SISTEMA DE FAVORITOS E HISTÓRICO DO USUÁRIO
-- =====================================================

-- Tabela: user_favorite_templates
-- Armazena favoritos de templates por usuário
CREATE TABLE IF NOT EXISTS public.user_favorite_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id UUID NOT NULL REFERENCES public.system_templates(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, template_id)
);

CREATE INDEX idx_user_favorite_templates_user_id ON public.user_favorite_templates(user_id);
CREATE INDEX idx_user_favorite_templates_template_id ON public.user_favorite_templates(template_id);

-- RLS para user_favorite_templates
ALTER TABLE public.user_favorite_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own favorite templates"
  ON public.user_favorite_templates
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add their own favorite templates"
  ON public.user_favorite_templates
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own favorite templates"
  ON public.user_favorite_templates
  FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================

-- Tabela: user_favorite_frases
-- Armazena favoritos de frases por usuário
CREATE TABLE IF NOT EXISTS public.user_favorite_frases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  frase_id UUID NOT NULL REFERENCES public.frases_modelo(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, frase_id)
);

CREATE INDEX idx_user_favorite_frases_user_id ON public.user_favorite_frases(user_id);
CREATE INDEX idx_user_favorite_frases_frase_id ON public.user_favorite_frases(frase_id);

-- RLS para user_favorite_frases
ALTER TABLE public.user_favorite_frases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own favorite frases"
  ON public.user_favorite_frases
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add their own favorite frases"
  ON public.user_favorite_frases
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own favorite frases"
  ON public.user_favorite_frases
  FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================

-- Tabela: user_template_usage
-- Histórico de uso de templates (para "recentes")
CREATE TABLE IF NOT EXISTS public.user_template_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id UUID NOT NULL REFERENCES public.system_templates(id) ON DELETE CASCADE,
  used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  report_id UUID REFERENCES public.reports(id) ON DELETE SET NULL,
  usage_count INTEGER DEFAULT 1
);

CREATE INDEX idx_user_template_usage_user_id ON public.user_template_usage(user_id);
CREATE INDEX idx_user_template_usage_template_id ON public.user_template_usage(template_id);
CREATE INDEX idx_user_template_usage_used_at ON public.user_template_usage(used_at DESC);

-- RLS para user_template_usage
ALTER TABLE public.user_template_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own template usage"
  ON public.user_template_usage
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own template usage"
  ON public.user_template_usage
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own template usage"
  ON public.user_template_usage
  FOR UPDATE
  USING (auth.uid() = user_id);

-- =====================================================

-- Tabela: user_frase_usage
-- Histórico de uso de frases (para "recentes")
CREATE TABLE IF NOT EXISTS public.user_frase_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  frase_id UUID NOT NULL REFERENCES public.frases_modelo(id) ON DELETE CASCADE,
  used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  report_id UUID REFERENCES public.reports(id) ON DELETE SET NULL,
  usage_count INTEGER DEFAULT 1
);

CREATE INDEX idx_user_frase_usage_user_id ON public.user_frase_usage(user_id);
CREATE INDEX idx_user_frase_usage_frase_id ON public.user_frase_usage(frase_id);
CREATE INDEX idx_user_frase_usage_used_at ON public.user_frase_usage(used_at DESC);

-- RLS para user_frase_usage
ALTER TABLE public.user_frase_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own frase usage"
  ON public.user_frase_usage
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own frase usage"
  ON public.user_frase_usage
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own frase usage"
  ON public.user_frase_usage
  FOR UPDATE
  USING (auth.uid() = user_id);

-- =====================================================
-- COMENTÁRIOS PARA DOCUMENTAÇÃO
-- =====================================================

COMMENT ON TABLE public.user_favorite_templates IS 'Armazena favoritos de templates por usuário para acesso rápido';
COMMENT ON TABLE public.user_favorite_frases IS 'Armazena favoritos de frases modelo por usuário';
COMMENT ON TABLE public.user_template_usage IS 'Histórico de uso de templates para ordenação por "recentes" e estatísticas';
COMMENT ON TABLE public.user_frase_usage IS 'Histórico de uso de frases modelo para ordenação por "recentes"';