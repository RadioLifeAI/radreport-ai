-- =====================================================
-- VAULT SECURITY CONFIGURATION & API KEYS SETUP
-- =====================================================
-- This migration configures Vault permissions and creates
-- API key secrets for the dynamic AI system.
-- =====================================================

-- =====================================================
-- STEP 1: VAULT PERMISSIONS (CRITICAL SECURITY)
-- =====================================================
-- Ensure ONLY service_role can access decrypted secrets
-- Without this, anon/authenticated users could see API keys!

REVOKE ALL ON vault.decrypted_secrets FROM public, authenticated, anon;
GRANT SELECT ON vault.decrypted_secrets TO service_role;

-- =====================================================
-- STEP 2: CREATE API KEY SECRETS IN VAULT
-- =====================================================
-- Replace placeholder values with your actual API keys
-- Format: vault.create_secret(secret_value, secret_name, description)

-- OpenAI API Key (for GPT models via Lovable Gateway)
SELECT vault.create_secret(
  'REPLACE_WITH_YOUR_OPENAI_API_KEY',
  'OPENAI_API_KEY',
  'API key for OpenAI GPT models'
);

-- Groq API Key (for Whisper transcription)
SELECT vault.create_secret(
  'REPLACE_WITH_YOUR_GROQ_API_KEY',
  'GROQ_API_KEY',
  'API key for Groq Whisper transcription'
);

-- Anthropic API Key (optional - for Claude models)
SELECT vault.create_secret(
  'REPLACE_WITH_YOUR_ANTHROPIC_API_KEY',
  'ANTHROPIC_API_KEY',
  'API key for Anthropic Claude models'
);

-- Google API Key (optional - for Gemini models)
SELECT vault.create_secret(
  'REPLACE_WITH_YOUR_GOOGLE_API_KEY',
  'GOOGLE_API_KEY',
  'API key for Google Gemini models'
);

-- =====================================================
-- STEP 3: GRANT EXECUTE ON RPC
-- =====================================================
-- Ensure service_role can execute the build_ai_request function

GRANT EXECUTE ON FUNCTION build_ai_request(TEXT, JSONB) TO service_role;

-- =====================================================
-- VERIFICATION QUERIES (run after migration)
-- =====================================================
-- Check secrets were created:
-- SELECT name, description, created_at FROM vault.decrypted_secrets;
--
-- Test RPC:
-- SELECT build_ai_request(
--   'ai-generate-conclusion',
--   '{"modality": "Ultrassonografia", "examTitle": "USG Abdome", "findingsHtml": "<p>Fígado normal.</p>"}'::jsonb
-- );