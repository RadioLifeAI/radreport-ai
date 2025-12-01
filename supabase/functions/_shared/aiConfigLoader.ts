/**
 * AI Config Loader
 * Dynamically loads AI configuration from database
 * Supports: ai_prompt_configs, ai_models, ai_providers tables
 */

import { getSupabaseAdmin } from './supabaseAdmin.ts';
import type {
  LoadedAIConfig,
  LoadedPromptConfig,
  LoadedModelConfig,
  LoadedProviderConfig,
  ModelCapabilities,
  AIConfigError,
} from './types.ts';
import { AIConfigError as ConfigError } from './types.ts';

// ==================== API KEY RETRIEVAL ====================

/**
 * Get API key from environment by secret name
 * Maps provider secret names to actual environment variable names
 */
export function getAPIKey(secretName: string): string {
  // Map common secret names to environment variables
  const secretMap: Record<string, string> = {
    'OPENAI_API_KEY': 'OPENAI_API_KEY',
    'ANTHROPIC_API_KEY': 'ANTHROPIC_API_KEY',
    'GOOGLE_API_KEY': 'GOOGLE_API_KEY',
    'GEMINI_API_KEY': 'GOOGLE_API_KEY',
    'GROQ_API_KEY': 'GROQ_API_KEY',
    'LOVABLE_API_KEY': 'LOVABLE_API_KEY',
  };

  const envVarName = secretMap[secretName] || secretName;
  const apiKey = Deno.env.get(envVarName);

  if (!apiKey) {
    throw new ConfigError(
      `API key not found for secret: ${secretName}. Please ensure ${envVarName} is configured.`,
      'MISSING_API_KEY'
    );
  }

  return apiKey;
}

// ==================== MAIN CONFIG LOADER ====================

/**
 * Load complete AI configuration for a function from database
 * Performs JOINs on ai_prompt_configs, ai_models, ai_providers
 */
export async function loadAIConfig(functionName: string): Promise<LoadedAIConfig> {
  const supabase = getSupabaseAdmin();

  // Query prompt config with model and provider JOINs
  const { data: promptConfig, error: promptError } = await supabase
    .from('ai_prompt_configs')
    .select(`
      *,
      model:ai_models!ai_prompt_configs_model_id_fkey (
        id,
        name,
        api_name,
        model_family,
        provider,
        context_window,
        max_output_tokens,
        default_max_tokens,
        input_cost_per_1m,
        output_cost_per_1m,
        supports_temperature,
        supports_reasoning,
        supports_extended_thinking,
        supports_thinking_budget,
        supports_top_p,
        supports_top_k,
        supports_frequency_penalty,
        supports_presence_penalty,
        supports_stop_sequences,
        supports_seed,
        supports_json_mode,
        supports_tools,
        supports_streaming,
        supports_vision,
        is_legacy,
        is_active
      ),
      provider:ai_providers!ai_prompt_configs_provider_id_fkey (
        id,
        name,
        display_name,
        api_base_url,
        api_key_secret_name,
        auth_header,
        auth_prefix,
        extra_headers,
        api_version,
        default_timeout_ms,
        supports_streaming,
        supports_batch,
        is_active
      )
    `)
    .eq('function_name', functionName)
    .eq('is_active', true)
    .single();

  if (promptError) {
    console.error(`[aiConfigLoader] Database error for ${functionName}:`, promptError);
    throw new ConfigError(
      `Failed to load config for function: ${functionName}. Error: ${promptError.message}`,
      'DATABASE_ERROR'
    );
  }

  if (!promptConfig) {
    throw new ConfigError(
      `No active configuration found for function: ${functionName}`,
      'NOT_FOUND'
    );
  }

  // Validate model exists
  if (!promptConfig.model) {
    throw new ConfigError(
      `No model configured for function: ${functionName}. Please set model_id in ai_prompt_configs.`,
      'MISSING_MODEL'
    );
  }

  // Validate provider exists
  if (!promptConfig.provider) {
    throw new ConfigError(
      `No provider configured for function: ${functionName}. Please set provider_id in ai_prompt_configs.`,
      'MISSING_PROVIDER'
    );
  }

  // Check if model is active
  if (promptConfig.model.is_active === false) {
    throw new ConfigError(
      `Model ${promptConfig.model.name} is inactive for function: ${functionName}`,
      'INACTIVE'
    );
  }

  // Check if provider is active
  if (promptConfig.provider.is_active === false) {
    throw new ConfigError(
      `Provider ${promptConfig.provider.name} is inactive for function: ${functionName}`,
      'INACTIVE'
    );
  }

  // Build complete config
  return buildLoadedConfig(promptConfig, promptConfig.model, promptConfig.provider);
}

// ==================== FALLBACK CONFIG LOADER ====================

/**
 * Load fallback model configuration by model ID
 * Used when primary model fails
 */
export async function loadFallbackConfig(
  modelId: string,
  originalConfig: LoadedAIConfig
): Promise<LoadedAIConfig | null> {
  const supabase = getSupabaseAdmin();

  // Query model with provider
  const { data: model, error: modelError } = await supabase
    .from('ai_models')
    .select(`
      *,
      provider:ai_providers!ai_models_provider_id_fkey (
        id,
        name,
        display_name,
        api_base_url,
        api_key_secret_name,
        auth_header,
        auth_prefix,
        extra_headers,
        api_version,
        default_timeout_ms,
        supports_streaming,
        supports_batch,
        is_active
      )
    `)
    .eq('id', modelId)
    .eq('is_active', true)
    .single();

  if (modelError || !model || !model.provider) {
    console.warn(`[aiConfigLoader] Failed to load fallback model ${modelId}:`, modelError);
    return null;
  }

  // Build fallback config using original prompts but new model/provider
  return {
    ...originalConfig,
    fallback_model_id: null, // Prevent infinite fallback loop
    model: {
      id: model.id,
      name: model.name,
      api_name: model.api_name || model.name,
      model_family: model.model_family,
      context_window: model.context_window,
      max_output_tokens: model.max_output_tokens,
      input_cost_per_1m: model.input_cost_per_1m,
      output_cost_per_1m: model.output_cost_per_1m,
      capabilities: buildCapabilities(model),
    },
    provider: {
      id: model.provider.id,
      name: model.provider.name,
      display_name: model.provider.display_name,
      api_base_url: model.provider.api_base_url,
      api_key_secret_name: model.provider.api_key_secret_name,
      auth_header: model.provider.auth_header || 'Authorization',
      auth_prefix: model.provider.auth_prefix || 'Bearer ',
      extra_headers: model.provider.extra_headers,
      api_version: model.provider.api_version,
      default_timeout_ms: model.provider.default_timeout_ms,
    },
    // Use model's default max tokens if original config's max_tokens exceeds new model's limit
    max_tokens: Math.min(
      originalConfig.max_tokens,
      model.max_output_tokens || model.default_max_tokens || originalConfig.max_tokens
    ),
  };
}

// ==================== CONFIG BUILDER ====================

/**
 * Build LoadedAIConfig from database query results
 */
function buildLoadedConfig(
  prompt: LoadedPromptConfig,
  model: LoadedModelConfig,
  provider: LoadedProviderConfig
): LoadedAIConfig {
  return {
    // Function identification
    function_name: prompt.function_name,
    display_name: prompt.display_name,
    description: prompt.description,

    // Prompts
    system_prompt: prompt.system_prompt,
    user_prompt_template: prompt.user_prompt_template,

    // Parameters (with fallbacks to model defaults)
    max_tokens: prompt.max_tokens || model.default_max_tokens || 2000,
    temperature: prompt.temperature,
    reasoning_effort: prompt.reasoning_effort,
    top_p: prompt.top_p,
    top_k: prompt.top_k,
    frequency_penalty: prompt.frequency_penalty,
    presence_penalty: prompt.presence_penalty,
    stop_sequences: prompt.stop_sequences,
    seed: prompt.seed,
    thinking_budget: prompt.thinking_budget,
    response_format: prompt.response_format,
    json_schema: prompt.json_schema,

    // Streaming & Tools
    enable_streaming: prompt.enable_streaming ?? false,
    tools_enabled: prompt.tools_enabled ?? false,

    // Resilience
    timeout_ms: prompt.timeout_ms || provider.default_timeout_ms || 30000,
    retry_count: prompt.retry_count ?? 1,
    fallback_model_id: prompt.fallback_model_id,

    // Model info
    model: {
      id: model.id,
      name: model.name,
      api_name: model.api_name || model.name,
      model_family: model.model_family,
      context_window: model.context_window,
      max_output_tokens: model.max_output_tokens,
      input_cost_per_1m: model.input_cost_per_1m,
      output_cost_per_1m: model.output_cost_per_1m,
      capabilities: buildCapabilities(model),
    },

    // Provider info
    provider: {
      id: provider.id,
      name: provider.name,
      display_name: provider.display_name,
      api_base_url: provider.api_base_url,
      api_key_secret_name: provider.api_key_secret_name,
      auth_header: provider.auth_header || 'Authorization',
      auth_prefix: provider.auth_prefix ?? 'Bearer ',
      extra_headers: provider.extra_headers,
      api_version: provider.api_version,
      default_timeout_ms: provider.default_timeout_ms,
    },
  };
}

/**
 * Build capabilities object from model data
 */
function buildCapabilities(model: LoadedModelConfig): ModelCapabilities {
  return {
    supports_temperature: model.supports_temperature ?? true,
    supports_reasoning: model.supports_reasoning ?? false,
    supports_extended_thinking: model.supports_extended_thinking ?? false,
    supports_thinking_budget: model.supports_thinking_budget ?? false,
    supports_top_p: model.supports_top_p ?? true,
    supports_top_k: model.supports_top_k ?? false,
    supports_frequency_penalty: model.supports_frequency_penalty ?? false,
    supports_presence_penalty: model.supports_presence_penalty ?? false,
    supports_stop_sequences: model.supports_stop_sequences ?? true,
    supports_seed: model.supports_seed ?? false,
    supports_json_mode: model.supports_json_mode ?? false,
    supports_tools: model.supports_tools ?? false,
    supports_streaming: model.supports_streaming ?? true,
    supports_vision: model.supports_vision ?? false,
    is_legacy: model.is_legacy ?? false,
  };
}

// ==================== CONFIG TO AICONFIG CONVERTER ====================

import type { AIConfig, AIProvider } from './aiPayloadBuilder.ts';

/**
 * Convert LoadedAIConfig to AIConfig format for payload builder
 * This bridges the database config with the existing payload builder
 */
export function buildAIConfigFromLoaded(loaded: LoadedAIConfig): AIConfig {
  return {
    // Provider info
    provider: normalizeProviderName(loaded.provider.name),
    provider_name: loaded.provider.display_name,
    api_base_url: loaded.provider.api_base_url,
    api_key_secret_name: loaded.provider.api_key_secret_name,
    auth_header: loaded.provider.auth_header,
    auth_prefix: loaded.provider.auth_prefix,

    // Model info
    model_name: loaded.model.name,
    api_name: loaded.model.api_name,
    model_family: loaded.model.model_family || '',

    // Parameters
    max_tokens: loaded.max_tokens,
    temperature: loaded.temperature,
    reasoning_effort: loaded.reasoning_effort,
    top_p: loaded.top_p,
    top_k: loaded.top_k,
    frequency_penalty: loaded.frequency_penalty,
    presence_penalty: loaded.presence_penalty,
    stop_sequences: loaded.stop_sequences,
    seed: loaded.seed,
    thinking_budget: loaded.thinking_budget,
    response_format: loaded.response_format,
    json_schema: loaded.json_schema,

    // Capabilities
    capabilities: loaded.model.capabilities,
  };
}

/**
 * Normalize provider name to AIProvider type
 */
function normalizeProviderName(name: string): AIProvider {
  const normalized = name.toLowerCase().trim();
  const providerMap: Record<string, AIProvider> = {
    'openai': 'openai',
    'anthropic': 'anthropic',
    'google': 'google',
    'gemini': 'google',
    'groq': 'groq',
    'lovable': 'lovable',
  };
  return providerMap[normalized] || 'openai';
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Build user prompt from template and variables
 * Replaces {{variable}} placeholders with actual values
 */
export function buildUserPrompt(
  template: string | null,
  variables: Record<string, string>
): string {
  if (!template) {
    // If no template, just concatenate all variables
    return Object.values(variables).filter(Boolean).join('\n\n');
  }

  let result = template;
  
  for (const [key, value] of Object.entries(variables)) {
    const placeholder = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'gi');
    result = result.replace(placeholder, value || '');
  }

  // Remove any remaining unreplaced placeholders
  result = result.replace(/\{\{\s*\w+\s*\}\}/g, '');

  return result.trim();
}

/**
 * Estimate cost for a request based on token usage and model pricing
 */
export function estimateCost(
  promptTokens: number,
  completionTokens: number,
  inputCostPer1M: number | null,
  outputCostPer1M: number | null
): number {
  if (!inputCostPer1M || !outputCostPer1M) {
    return 0;
  }

  const inputCost = (promptTokens / 1_000_000) * inputCostPer1M;
  const outputCost = (completionTokens / 1_000_000) * outputCostPer1M;

  return inputCost + outputCost;
}
