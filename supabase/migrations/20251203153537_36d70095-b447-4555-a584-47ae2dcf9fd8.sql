-- Tabela de favoritos para calculadoras
CREATE TABLE user_favorite_calculators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  calculator_id VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, calculator_id)
);

-- Tabela de favoritos para tabelas
CREATE TABLE user_favorite_tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  table_id VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, table_id)
);

-- RLS Policies para calculadoras
ALTER TABLE user_favorite_calculators ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own calculator favorites"
  ON user_favorite_calculators
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies para tabelas
ALTER TABLE user_favorite_tables ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own table favorites"
  ON user_favorite_tables
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);