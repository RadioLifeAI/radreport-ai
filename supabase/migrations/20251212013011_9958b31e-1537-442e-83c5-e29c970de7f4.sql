-- Fix search_path on trigger function
DROP FUNCTION IF EXISTS update_whisper_config_updated_at CASCADE;

CREATE FUNCTION update_whisper_config_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  NEW.version = OLD.version + 1;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER whisper_config_updated_at
BEFORE UPDATE ON whisper_config
FOR EACH ROW
EXECUTE FUNCTION update_whisper_config_updated_at();