/**
 * Shared Module Barrel Export
 * Centralizes all exports from _shared for clean imports in Edge Functions
 * 
 * Usage in Edge Functions:
 * import { loadAIConfig, callProviderAPI, getCorsHeaders } from '../_shared/index.ts';
 */

// ==================== TYPES ====================
export type {
  TokenUsage,
  NormalizedAPIResponse,
  ToolCall,
  APICallResult,
  LoadedProviderConfig,
  LoadedModelConfig,
  LoadedPromptConfig,
  LoadedAIConfig,
  ModelCapabilities,
  AIUsageLogEntry,
  CallAPIOptions,
} from './types.ts';

export { AIConfigError, AIProviderError } from './types.ts';

// ==================== AI CONFIG LOADER ====================
export {
  loadAIConfig,
  loadFallbackConfig,
  getAPIKey,
  buildAIConfigFromLoaded,
  buildUserPrompt,
  estimateCost,
} from './aiConfigLoader.ts';

// ==================== AI PAYLOAD BUILDER ====================
export type {
  AIConfig,
  AIProvider,
  AIModelCapabilities,
  ChatMessage,
  BuildPayloadOptions,
  ProviderEndpoint,
  OpenAIPayload,
  AnthropicPayload,
  GeminiPayload,
  GroqPayload,
} from './aiPayloadBuilder.ts';

export {
  buildMultiProviderPayload,
  buildOpenAIPayload,
  buildAnthropicPayload,
  buildGeminiPayload,
  buildGroqPayload,
  getProviderEndpoint,
  normalizeProvider,
  inferModelCapabilities,
  getDefaultCapabilities,
  modelSupportsTemperature,
  modelSupportsReasoning,
  // New API caller functions
  callProviderAPI,
  callProviderAPIStream,
  normalizeAPIResponse,
  getProviderEndpointDynamic,
} from './aiPayloadBuilder.ts';

// ==================== CORS ====================
export {
  getCorsHeaders,
  getAllHeaders,
} from './cors.ts';

// ==================== AUTH ====================
export {
  validateAuth,
  unauthorizedResponse,
} from './auth.ts';

export type { AuthResult } from './auth.ts';

// ==================== SUPABASE CLIENTS ====================
export { getSupabaseAdmin } from './supabaseAdmin.ts';
export { createSupabaseClient } from './supabaseClient.ts';
