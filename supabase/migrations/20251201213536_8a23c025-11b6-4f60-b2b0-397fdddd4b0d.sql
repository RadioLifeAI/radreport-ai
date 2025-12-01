-- 1. Create ENUM for roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- 2. Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    granted_by UUID REFERENCES auth.users(id),
    UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- 3. Create SECURITY DEFINER function
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 4. Create ai_models table
CREATE TABLE public.ai_models (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    provider VARCHAR(50) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    default_max_tokens INTEGER DEFAULT 2000,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.ai_models ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view active models" ON public.ai_models
  FOR SELECT TO authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage models" ON public.ai_models
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 5. Create ai_prompt_configs table
CREATE TABLE public.ai_prompt_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    function_name VARCHAR(100) NOT NULL UNIQUE,
    display_name VARCHAR(200) NOT NULL,
    description TEXT,
    system_prompt TEXT NOT NULL,
    model_id UUID REFERENCES public.ai_models(id),
    model_name VARCHAR(100) DEFAULT 'gpt-5-nano-2025-08-07',
    max_tokens INTEGER DEFAULT 2000,
    reasoning_effort VARCHAR(20) DEFAULT 'low',
    temperature NUMERIC(3,2) DEFAULT 0.7,
    is_active BOOLEAN DEFAULT true,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.ai_prompt_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read configs" ON public.ai_prompt_configs
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage prompt configs" ON public.ai_prompt_configs
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 6. Create ai_prompt_config_history table
CREATE TABLE public.ai_prompt_config_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    config_id UUID REFERENCES public.ai_prompt_configs(id) ON DELETE SET NULL,
    function_name VARCHAR(100) NOT NULL,
    previous_prompt TEXT,
    new_prompt TEXT NOT NULL,
    previous_model VARCHAR(100),
    new_model VARCHAR(100),
    change_reason TEXT,
    changed_by UUID REFERENCES auth.users(id),
    changed_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.ai_prompt_config_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view prompt history" ON public.ai_prompt_config_history
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert prompt history" ON public.ai_prompt_config_history
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 7. Insert default AI models
INSERT INTO public.ai_models (name, provider, description, default_max_tokens) VALUES
  ('gpt-5-nano-2025-08-07', 'openai', 'GPT-5 Nano - Otimizado para tarefas radiológicas', 2000),
  ('gpt-4o-mini', 'openai', 'GPT-4o Mini - Modelo de custo-benefício', 4000),
  ('gpt-4o', 'openai', 'GPT-4o - Modelo avançado', 4000);

-- 8. Insert default prompt configs
INSERT INTO public.ai_prompt_configs (function_name, display_name, description, system_prompt, model_name, max_tokens, reasoning_effort) VALUES
  ('ai-suggestion-review', 'Revisão de Sugestões', 'Revisa laudos radiológicos', 'Você é um radiologista sênior brasileiro com 20+ anos de experiência.', 'gpt-5-nano-2025-08-07', 2000, 'low'),
  ('ai-dictation-polish', 'Corretor de Ditado', 'Corrige texto ditado', 'Você é um radiologista sênior brasileiro especializado em transcrição.', 'gpt-5-nano-2025-08-07', 2000, 'low'),
  ('ai-generate-conclusion', 'Gerador de Conclusão', 'Gera conclusões', 'Você é um radiologista sênior brasileiro.', 'gpt-5-nano-2025-08-07', 2000, 'low'),
  ('ai-rads-classification', 'Classificação RADS', 'Classifica usando RADS', 'Você é um radiologista sênior brasileiro especialista em RADS.', 'gpt-5-nano-2025-08-07', 2000, 'low'),
  ('ai-inline-edit', 'Edição Inline', 'Edita seções do laudo', 'Você é um radiologista sênior brasileiro.', 'gpt-5-nano-2025-08-07', 1500, 'low'),
  ('ai-voice-inline-edit', 'Edição por Voz', 'Processa comandos de voz', 'Você é um radiologista sênior brasileiro.', 'gpt-5-nano-2025-08-07', 500, 'low'),
  ('radreport-chat', 'Chat Radiológico', 'Assistente de chat', 'Você é um radiologista sênior brasileiro.', 'gpt-5-nano-2025-08-07', 800, 'low');