
-- Tabela de categorias de referência (tabelas e calculadoras)
CREATE TABLE IF NOT EXISTS reference_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR NOT NULL UNIQUE,
  name VARCHAR NOT NULL,
  icon VARCHAR,
  type VARCHAR NOT NULL CHECK (type IN ('table', 'calculator')),
  display_order INT DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela de tabelas de referência radiológica
CREATE TABLE IF NOT EXISTS radiology_tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR NOT NULL UNIQUE,
  name VARCHAR NOT NULL,
  category VARCHAR NOT NULL,
  subcategory VARCHAR,
  type VARCHAR DEFAULT 'informative' CHECK (type IN ('informative', 'dynamic')),
  modalities TEXT[],
  html_content TEXT NOT NULL,
  reference_text TEXT,
  reference_url TEXT,
  display_order INT DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela de calculadoras radiológicas (metadados)
CREATE TABLE IF NOT EXISTS radiology_calculators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR NOT NULL UNIQUE,
  name VARCHAR NOT NULL,
  category VARCHAR NOT NULL,
  description TEXT,
  reference_text TEXT,
  reference_url TEXT,
  output_template TEXT,
  info_purpose TEXT,
  info_usage JSONB DEFAULT '[]'::jsonb,
  info_grading JSONB DEFAULT '[]'::jsonb,
  display_order INT DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_radiology_tables_category ON radiology_tables(category);
CREATE INDEX IF NOT EXISTS idx_radiology_tables_ativo ON radiology_tables(ativo);
CREATE INDEX IF NOT EXISTS idx_radiology_calculators_category ON radiology_calculators(category);
CREATE INDEX IF NOT EXISTS idx_radiology_calculators_ativo ON radiology_calculators(ativo);

-- RLS
ALTER TABLE reference_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE radiology_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE radiology_calculators ENABLE ROW LEVEL SECURITY;

-- Políticas de leitura pública
CREATE POLICY "Reference categories readable by all" ON reference_categories
  FOR SELECT USING (true);

CREATE POLICY "Radiology tables readable by all" ON radiology_tables
  FOR SELECT USING (ativo = true);

CREATE POLICY "Radiology calculators readable by all" ON radiology_calculators
  FOR SELECT USING (ativo = true);

-- Políticas de admin
CREATE POLICY "Admins can manage reference categories" ON reference_categories
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage radiology tables" ON radiology_tables
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage radiology calculators" ON radiology_calculators
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_reference_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_reference_categories_updated_at
  BEFORE UPDATE ON reference_categories
  FOR EACH ROW EXECUTE FUNCTION update_reference_updated_at();

CREATE TRIGGER update_radiology_tables_updated_at
  BEFORE UPDATE ON radiology_tables
  FOR EACH ROW EXECUTE FUNCTION update_reference_updated_at();

CREATE TRIGGER update_radiology_calculators_updated_at
  BEFORE UPDATE ON radiology_calculators
  FOR EACH ROW EXECUTE FUNCTION update_reference_updated_at();

-- Inserir categorias iniciais
INSERT INTO reference_categories (code, name, icon, type, display_order) VALUES
  ('rads', 'Classificações RADS', 'Award', 'table', 1),
  ('obstetricia', 'Obstetrícia', 'Baby', 'table', 2),
  ('vascular', 'Vascular', 'Heart', 'table', 3),
  ('neuro', 'Neurorradiologia', 'Brain', 'table', 4),
  ('oncologia', 'Oncologia', 'Target', 'table', 5),
  ('geral', 'Geral', 'Calculator', 'calculator', 1),
  ('neuro-calc', 'Neurologia', 'Brain', 'calculator', 2),
  ('obstetricia-calc', 'Obstetrícia', 'Baby', 'calculator', 3),
  ('vascular-calc', 'Vascular', 'Heart', 'calculator', 4),
  ('oncologia-calc', 'Oncologia', 'Target', 'calculator', 5)
ON CONFLICT (code) DO NOTHING;
