/**
 * AI Payload Builder Utility
 * Dynamically constructs OpenAI API payloads based on model capabilities
 */

export interface AIModelConfig {
  model_name: string;
  max_tokens: number;
  temperature: number | null;
  reasoning_effort: string | null;
  supports_temperature: boolean;
  supports_reasoning: boolean;
  is_legacy: boolean;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIPayload {
  model: string;
  messages: ChatMessage[];
  max_tokens?: number;
  max_completion_tokens?: number;
  temperature?: number;
  reasoning_effort?: string;
  stream?: boolean;
}

/**
 * Builds an AI API payload dynamically based on model capabilities
 * 
 * - Legacy models (GPT-4o, GPT-4o-mini): Use temperature + max_tokens
 * - Reasoning models (GPT-5, O3, O4, GPT-4.1): Use reasoning_effort + max_completion_tokens
 * 
 * @param config Model configuration with capability flags
 * @param messages Chat messages array
 * @param options Additional options like streaming
 * @returns Formatted payload ready for OpenAI API
 */
export function buildAIPayload(
  config: AIModelConfig,
  messages: ChatMessage[],
  options: { stream?: boolean } = {}
): AIPayload {
  const payload: AIPayload = {
    model: config.model_name,
    messages,
  };

  // Add streaming if requested
  if (options.stream) {
    payload.stream = true;
  }

  // Build parameters based on model capabilities
  if (config.supports_reasoning && !config.is_legacy) {
    // Reasoning models: GPT-5, O3, O4, GPT-4.1
    // These use max_completion_tokens and reasoning_effort, NOT temperature
    payload.max_completion_tokens = config.max_tokens;
    
    if (config.reasoning_effort) {
      payload.reasoning_effort = config.reasoning_effort;
    }
    
    // CRITICAL: DO NOT include temperature for reasoning models
    // It will cause an API error
  } else if (config.supports_temperature || config.is_legacy) {
    // Legacy models: GPT-4o, GPT-4o-mini, GPT-3.5
    // These use max_tokens and temperature, NOT reasoning_effort
    payload.max_tokens = config.max_tokens;
    
    if (config.temperature !== null && config.temperature !== undefined) {
      payload.temperature = config.temperature;
    } else {
      payload.temperature = 0.7; // Default for legacy models
    }
    
    // CRITICAL: DO NOT include reasoning_effort for legacy models
  } else {
    // Unknown model type - fallback to safe defaults
    payload.max_completion_tokens = config.max_tokens;
  }

  return payload;
}

/**
 * Helper to determine if a model supports temperature parameter
 * Based on model naming conventions
 */
export function modelSupportsTemperature(modelName: string): boolean {
  const legacyModels = ['gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo', 'gpt-4-turbo'];
  return legacyModels.some(legacy => modelName.includes(legacy));
}

/**
 * Helper to determine if a model supports reasoning_effort parameter
 * Based on model naming conventions
 */
export function modelSupportsReasoning(modelName: string): boolean {
  const reasoningPatterns = ['gpt-5', 'gpt-4.1', 'o3', 'o4'];
  return reasoningPatterns.some(pattern => modelName.includes(pattern));
}

/**
 * Derives model capabilities from model name when database metadata is unavailable
 * Useful for fallback scenarios
 */
export function inferModelCapabilities(modelName: string): Pick<AIModelConfig, 'supports_temperature' | 'supports_reasoning' | 'is_legacy'> {
  const isLegacy = modelSupportsTemperature(modelName);
  const supportsReasoning = modelSupportsReasoning(modelName);
  
  return {
    supports_temperature: isLegacy,
    supports_reasoning: supportsReasoning,
    is_legacy: isLegacy,
  };
}
