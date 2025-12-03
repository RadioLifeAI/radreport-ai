-- Tabela para tracking de uso de calculadoras
CREATE TABLE IF NOT EXISTS user_calculator_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  calculator_id VARCHAR NOT NULL,
  used_at TIMESTAMPTZ DEFAULT NOW(),
  usage_count INTEGER DEFAULT 1,
  UNIQUE(user_id, calculator_id)
);

-- Tabela para tracking de uso de tabelas
CREATE TABLE IF NOT EXISTS user_table_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  table_id VARCHAR NOT NULL,
  used_at TIMESTAMPTZ DEFAULT NOW(),
  usage_count INTEGER DEFAULT 1,
  UNIQUE(user_id, table_id)
);

-- Enable RLS
ALTER TABLE user_calculator_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_table_usage ENABLE ROW LEVEL SECURITY;

-- RLS policies for calculator usage
CREATE POLICY "Users can manage own calculator usage" 
ON user_calculator_usage 
FOR ALL 
USING (auth.uid() = user_id);

-- RLS policies for table usage
CREATE POLICY "Users can manage own table usage" 
ON user_table_usage 
FOR ALL 
USING (auth.uid() = user_id);