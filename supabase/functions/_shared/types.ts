/**
 * Shared Types for AI Edge Functions
 * Centralized type definitions used across all AI-related Edge Functions
 */

// ==================== TOKEN USAGE ====================

export interface TokenUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  estimated_cost?: number;
}

// ==================== API RESPONSE ====================

export interface NormalizedAPIResponse {
  success: boolean;
  content: string;
  usage: TokenUsage;
  finish_reason: string;
  tool_calls?: ToolCall[];
  raw_response?: unknown;
}

export interface ToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;
  };
}

export interface APICallResult {
  success: boolean;
  content: string;
  usage?: TokenUsage;
  finish_reason?: string;
  tool_calls?: ToolCall[];
  raw_response?: unknown;
  error?: string;
  error_code?: string;
}

// ==================== LOADED CONFIG FROM DATABASE ====================

export interface LoadedProviderConfig {
  id: string;
  name: string;
  display_name: string;
  api_base_url: string;
  api_key_secret_name: string;
  auth_header: string;
  auth_prefix: string;
  extra_headers: Record<string, string> | null;
  api_version: string | null;
  default_timeout_ms: number | null;
  supports_streaming: boolean | null;
  supports_batch: boolean | null;
}

export interface LoadedModelConfig {
  id: string;
  name: string;
  api_name: string | null;
  model_family: string | null;
  provider: string;
  context_window: number | null;
  max_output_tokens: number | null;
  default_max_tokens: number | null;
  input_cost_per_1m: number | null;
  output_cost_per_1m: number | null;
  // Capabilities
  supports_temperature: boolean | null;
  supports_reasoning: boolean | null;
  supports_extended_thinking: boolean | null;
  supports_thinking_budget: boolean | null;
  supports_top_p: boolean | null;
  supports_top_k: boolean | null;
  supports_frequency_penalty: boolean | null;
  supports_presence_penalty: boolean | null;
  supports_stop_sequences: boolean | null;
  supports_seed: boolean | null;
  supports_json_mode: boolean | null;
  supports_tools: boolean | null;
  supports_streaming: boolean | null;
  supports_vision: boolean | null;
  is_legacy: boolean | null;
  is_active: boolean | null;
}

export interface LoadedPromptConfig {
  id: string;
  function_name: string;
  display_name: string;
  description: string | null;
  system_prompt: string;
  user_prompt_template: string | null;
  // Model reference
  model_id: string | null;
  model_name: string | null;
  provider_id: string | null;
  // Parameters
  max_tokens: number | null;
  temperature: number | null;
  reasoning_effort: string | null;
  top_p: number | null;
  top_k: number | null;
  frequency_penalty: number | null;
  presence_penalty: number | null;
  stop_sequences: string[] | null;
  seed: number | null;
  thinking_budget: number | null;
  response_format: string | null;
  json_schema: Record<string, unknown> | null;
  // Streaming & Tools
  enable_streaming: boolean | null;
  tools_enabled: boolean | null;
  // Resilience
  timeout_ms: number | null;
  retry_count: number | null;
  fallback_model_id: string | null;
  // Metadata
  is_active: boolean | null;
  version: number | null;
}

/**
 * Complete loaded AI configuration from database
 * Combines prompt config + model + provider in a single object
 */
export interface LoadedAIConfig {
  // Function identification
  function_name: string;
  display_name: string;
  description: string | null;
  
  // Prompts
  system_prompt: string;
  user_prompt_template: string | null;
  
  // Parameters (from prompt config, with model defaults as fallback)
  max_tokens: number;
  temperature: number | null;
  reasoning_effort: string | null;
  top_p: number | null;
  top_k: number | null;
  frequency_penalty: number | null;
  presence_penalty: number | null;
  stop_sequences: string[] | null;
  seed: number | null;
  thinking_budget: number | null;
  response_format: string | null;
  json_schema: Record<string, unknown> | null;
  
  // Streaming & Tools
  enable_streaming: boolean;
  tools_enabled: boolean;
  
  // Resilience
  timeout_ms: number;
  retry_count: number;
  fallback_model_id: string | null;
  
  // Model info
  model: {
    id: string;
    name: string;
    api_name: string;
    model_family: string | null;
    context_window: number | null;
    max_output_tokens: number | null;
    input_cost_per_1m: number | null;
    output_cost_per_1m: number | null;
    capabilities: ModelCapabilities;
  };
  
  // Provider info
  provider: {
    id: string;
    name: string;
    display_name: string;
    api_base_url: string;
    api_key_secret_name: string;
    auth_header: string;
    auth_prefix: string;
    extra_headers: Record<string, string> | null;
    api_version: string | null;
    default_timeout_ms: number | null;
  };
}

export interface ModelCapabilities {
  supports_temperature: boolean;
  supports_reasoning: boolean;
  supports_extended_thinking: boolean;
  supports_thinking_budget: boolean;
  supports_top_p: boolean;
  supports_top_k: boolean;
  supports_frequency_penalty: boolean;
  supports_presence_penalty: boolean;
  supports_stop_sequences: boolean;
  supports_seed: boolean;
  supports_json_mode: boolean;
  supports_tools: boolean;
  supports_streaming: boolean;
  supports_vision: boolean;
  is_legacy: boolean;
}

// ==================== LOGGING ====================

export interface AIUsageLogEntry {
  user_id: string;
  function_name: string;
  model_id: string;
  provider_id: string;
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  latency_ms: number;
  success: boolean;
  error_message?: string;
  estimated_cost?: number;
  metadata?: Record<string, unknown>;
}

// ==================== CALL OPTIONS ====================

export interface CallAPIOptions {
  stream?: boolean;
  tools?: unknown[];
  tool_choice?: unknown;
  signal?: AbortSignal;
  timeout_override?: number;
}

// ==================== ERROR TYPES ====================

export class AIConfigError extends Error {
  constructor(
    message: string,
    public code: 'NOT_FOUND' | 'INACTIVE' | 'MISSING_MODEL' | 'MISSING_PROVIDER' | 'MISSING_API_KEY' | 'DATABASE_ERROR'
  ) {
    super(message);
    this.name = 'AIConfigError';
  }
}

export class AIProviderError extends Error {
  constructor(
    message: string,
    public code: 'RATE_LIMIT' | 'TIMEOUT' | 'INVALID_REQUEST' | 'SERVER_ERROR' | 'NETWORK_ERROR' | 'UNKNOWN',
    public status?: number,
    public provider?: string
  ) {
    super(message);
    this.name = 'AIProviderError';
  }
}
