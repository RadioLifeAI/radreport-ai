-- Add missing feature columns to subscription_plans
ALTER TABLE subscription_plans
ADD COLUMN IF NOT EXISTS feature_ai_chat BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS feature_voice_dictation BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS feature_templates BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS feature_export BOOLEAN DEFAULT true;

-- Update values for existing plans based on tier
UPDATE subscription_plans SET 
  feature_ai_chat = CASE WHEN code IN ('professional', 'premium') THEN true ELSE false END,
  feature_voice_dictation = true,
  feature_templates = true,
  feature_export = true
WHERE feature_ai_chat IS NULL OR feature_voice_dictation IS NULL;

-- Fix feature_ai_conclusion for free plan (should be true as per frontend)
UPDATE subscription_plans 
SET feature_ai_conclusion = true 
WHERE code = 'free';

-- Add comment for documentation
COMMENT ON COLUMN subscription_plans.feature_ai_chat IS 'Access to AI chat assistant (Professional/Premium only)';
COMMENT ON COLUMN subscription_plans.feature_voice_dictation IS 'Access to voice dictation (all plans)';
COMMENT ON COLUMN subscription_plans.feature_templates IS 'Access to templates library (all plans)';
COMMENT ON COLUMN subscription_plans.feature_export IS 'Access to export reports (all plans)';