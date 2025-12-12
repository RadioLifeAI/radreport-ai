-- Add missing columns to whisper_usage_log for complete logging
ALTER TABLE whisper_usage_log 
ADD COLUMN IF NOT EXISTS segments_filtered INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS avg_confidence NUMERIC,
ADD COLUMN IF NOT EXISTS text_length INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS segments_total INTEGER DEFAULT 0;