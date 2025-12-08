/**
 * Multi-Provider AI Payload Builder
 * Dynamically constructs API payloads based on provider and model capabilities
 * Supports: OpenAI, Anthropic, Google Gemini, Groq, Lovable Gateway
 */

// ==================== TYPES ====================

export type AIProvider = 'openai' | 'anthropic' | 'google' | 'groq' | 'lovable' | 'openrouter';

export interface AIModelCapabilities {
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

export interface AIConfig {
  // Provider info
  provider: AIProvider;
  provider_name: string;
  api_base_url: string;
  api_key_secret_name: string;
  auth_header: string;
  auth_prefix: string;
  
  // Model info
  model_name: string;
  api_name: string;
  model_family: string;
  
  // Parameters
  max_tokens: number;
  temperature?: number | null;
  reasoning_effort?: string | null;
  top_p?: number | null;
  top_k?: number | null;
  frequency_penalty?: number | null;
  presence_penalty?: number | null;
  stop_sequences?: string[] | null;
  seed?: number | null;
  thinking_budget?: number | null;
  response_format?: string | null;
  json_schema?: Record<string, unknown> | null;
  
  // Capabilities
  capabilities: Partial<AIModelCapabilities>;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface BuildPayloadOptions {
  stream?: boolean;
  tools?: unknown[];
  tool_choice?: unknown;
}

// ==================== PROVIDER PAYLOADS ====================

export interface OpenAIPayload {
  model: string;
  messages: ChatMessage[];
  max_tokens?: number;
  max_completion_tokens?: number;
  temperature?: number;
  reasoning_effort?: string;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stop?: string[];
  seed?: number;
  response_format?: { type: string; json_schema?: unknown };
  stream?: boolean;
  tools?: unknown[];
  tool_choice?: unknown;
}

export interface AnthropicPayload {
  model: string;
  system?: string;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  max_tokens: number;
  temperature?: number;
  top_p?: number;
  top_k?: number;
  stop_sequences?: string[];
  stream?: boolean;
  thinking?: {
    type: 'enabled';
    budget_tokens: number;
  };
  tools?: unknown[];
  tool_choice?: unknown;
}

export interface GeminiPayload {
  contents: Array<{
    role: 'user' | 'model';
    parts: Array<{ text: string }>;
  }>;
  systemInstruction?: {
    parts: Array<{ text: string }>;
  };
  generationConfig: {
    maxOutputTokens: number;
    temperature?: number;
    topP?: number;
    topK?: number;
    stopSequences?: string[];
    responseMimeType?: string;
    responseSchema?: unknown;
    thinkingConfig?: {
      thinkingBudget: number;
    };
  };
}

export interface GroqPayload {
  model: string;
  messages: ChatMessage[];
  max_tokens?: number;
  max_completion_tokens?: number;
  temperature?: number;
  top_p?: number;
  stop?: string[];
  stream?: boolean;
  response_format?: { type: string };
}

// ==================== PAYLOAD BUILDERS ====================

/**
 * Build OpenAI-compatible payload
 * Works for OpenAI, Lovable Gateway, and Groq
 */
export function buildOpenAIPayload(
  config: AIConfig,
  messages: ChatMessage[],
  options: BuildPayloadOptions = {}
): OpenAIPayload {
  const payload: OpenAIPayload = {
    model: config.api_name || config.model_name,
    messages,
  };

  // Add streaming
  if (options.stream) {
    payload.stream = true;
  }

  // Determine if model uses reasoning (new API) or legacy (temperature-based)
  const isReasoning = config.capabilities.supports_reasoning && !config.capabilities.is_legacy;

  if (isReasoning) {
    // Reasoning models: GPT-5, O3, O4, GPT-4.1
    payload.max_completion_tokens = config.max_tokens;
    
    if (config.reasoning_effort) {
      payload.reasoning_effort = config.reasoning_effort;
    }
    
    // Top P supported even for reasoning models
    if (config.top_p !== null && config.top_p !== undefined && config.capabilities.supports_top_p) {
      payload.top_p = config.top_p;
    }
    
    // Seed supported
    if (config.seed !== null && config.seed !== undefined && config.capabilities.supports_seed) {
      payload.seed = config.seed;
    }
    
    // Stop sequences
    if (config.stop_sequences?.length && config.capabilities.supports_stop_sequences) {
      payload.stop = config.stop_sequences;
    }
    
    // CRITICAL: DO NOT include temperature for reasoning models
  } else {
    // Legacy models: GPT-4o, GPT-4o-mini, GPT-3.5
    payload.max_tokens = config.max_tokens;
    
    if (config.temperature !== null && config.temperature !== undefined) {
      payload.temperature = config.temperature;
    } else if (config.capabilities.supports_temperature) {
      payload.temperature = 0.7; // Default
    }
    
    if (config.top_p !== null && config.top_p !== undefined && config.capabilities.supports_top_p) {
      payload.top_p = config.top_p;
    }
    
    if (config.frequency_penalty !== null && config.frequency_penalty !== undefined && config.capabilities.supports_frequency_penalty) {
      payload.frequency_penalty = config.frequency_penalty;
    }
    
    if (config.presence_penalty !== null && config.presence_penalty !== undefined && config.capabilities.supports_presence_penalty) {
      payload.presence_penalty = config.presence_penalty;
    }
    
    if (config.stop_sequences?.length && config.capabilities.supports_stop_sequences) {
      payload.stop = config.stop_sequences;
    }
    
    if (config.seed !== null && config.seed !== undefined && config.capabilities.supports_seed) {
      payload.seed = config.seed;
    }
  }

  // Response format (JSON mode)
  if (config.response_format === 'json_object' && config.capabilities.supports_json_mode) {
    payload.response_format = { type: 'json_object' };
  } else if (config.response_format === 'json_schema' && config.json_schema) {
    payload.response_format = { type: 'json_schema', json_schema: config.json_schema };
  }

  // Tools
  if (options.tools?.length && config.capabilities.supports_tools) {
    payload.tools = options.tools;
    if (options.tool_choice) {
      payload.tool_choice = options.tool_choice;
    }
  }

  return payload;
}

/**
 * Build Anthropic Claude payload
 * Separates system message, supports extended thinking
 */
export function buildAnthropicPayload(
  config: AIConfig,
  messages: ChatMessage[],
  options: BuildPayloadOptions = {}
): AnthropicPayload {
  // Extract system message
  const systemMessage = messages.find(m => m.role === 'system');
  const conversationMessages = messages
    .filter(m => m.role !== 'system')
    .map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));

  const payload: AnthropicPayload = {
    model: config.api_name || config.model_name,
    messages: conversationMessages,
    max_tokens: config.max_tokens,
  };

  // System instruction
  if (systemMessage) {
    payload.system = systemMessage.content;
  }

  // Temperature (Anthropic supports it)
  if (config.temperature !== null && config.temperature !== undefined) {
    payload.temperature = config.temperature;
  }

  // Top P
  if (config.top_p !== null && config.top_p !== undefined && config.capabilities.supports_top_p) {
    payload.top_p = config.top_p;
  }

  // Top K (Anthropic specific)
  if (config.top_k !== null && config.top_k !== undefined && config.capabilities.supports_top_k) {
    payload.top_k = config.top_k;
  }

  // Stop sequences
  if (config.stop_sequences?.length && config.capabilities.supports_stop_sequences) {
    payload.stop_sequences = config.stop_sequences;
  }

  // Extended thinking (Claude 3.7+)
  if (config.thinking_budget && config.capabilities.supports_extended_thinking) {
    payload.thinking = {
      type: 'enabled',
      budget_tokens: config.thinking_budget,
    };
  }

  // Streaming
  if (options.stream) {
    payload.stream = true;
  }

  // Tools
  if (options.tools?.length && config.capabilities.supports_tools) {
    payload.tools = options.tools;
    if (options.tool_choice) {
      payload.tool_choice = options.tool_choice;
    }
  }

  return payload;
}

/**
 * Build Google Gemini payload
 * Different message format, supports thinking budget
 */
export function buildGeminiPayload(
  config: AIConfig,
  messages: ChatMessage[],
  _options: BuildPayloadOptions = {}
): GeminiPayload {
  // Extract system message
  const systemMessage = messages.find(m => m.role === 'system');
  
  // Convert messages to Gemini format
  const contents = messages
    .filter(m => m.role !== 'system')
    .map(m => ({
      role: m.role === 'assistant' ? 'model' as const : 'user' as const,
      parts: [{ text: m.content }],
    }));

  const payload: GeminiPayload = {
    contents,
    generationConfig: {
      maxOutputTokens: config.max_tokens,
    },
  };

  // System instruction
  if (systemMessage) {
    payload.systemInstruction = {
      parts: [{ text: systemMessage.content }],
    };
  }

  // Temperature
  if (config.temperature !== null && config.temperature !== undefined) {
    payload.generationConfig.temperature = config.temperature;
  }

  // Top P
  if (config.top_p !== null && config.top_p !== undefined && config.capabilities.supports_top_p) {
    payload.generationConfig.topP = config.top_p;
  }

  // Top K (Gemini specific)
  if (config.top_k !== null && config.top_k !== undefined && config.capabilities.supports_top_k) {
    payload.generationConfig.topK = config.top_k;
  }

  // Stop sequences
  if (config.stop_sequences?.length && config.capabilities.supports_stop_sequences) {
    payload.generationConfig.stopSequences = config.stop_sequences;
  }

  // Thinking budget (Gemini 2.5+)
  if (config.thinking_budget && config.capabilities.supports_thinking_budget) {
    payload.generationConfig.thinkingConfig = {
      thinkingBudget: config.thinking_budget,
    };
  }

  // JSON mode
  if (config.response_format === 'json_object' && config.capabilities.supports_json_mode) {
    payload.generationConfig.responseMimeType = 'application/json';
  }

  return payload;
}

/**
 * Build Groq payload
 * OpenAI-compatible but with some differences
 */
export function buildGroqPayload(
  config: AIConfig,
  messages: ChatMessage[],
  options: BuildPayloadOptions = {}
): GroqPayload {
  const payload: GroqPayload = {
    model: config.api_name || config.model_name,
    messages,
  };

  // Groq uses max_tokens for most models
  payload.max_tokens = config.max_tokens;

  // Temperature
  if (config.temperature !== null && config.temperature !== undefined) {
    payload.temperature = config.temperature;
  }

  // Top P
  if (config.top_p !== null && config.top_p !== undefined) {
    payload.top_p = config.top_p;
  }

  // Stop sequences
  if (config.stop_sequences?.length) {
    payload.stop = config.stop_sequences;
  }

  // Streaming
  if (options.stream) {
    payload.stream = true;
  }

  // JSON mode
  if (config.response_format === 'json_object' && config.capabilities.supports_json_mode) {
    payload.response_format = { type: 'json_object' };
  }

  return payload;
}

// ==================== MAIN ROUTER ====================

/**
 * Build payload for any provider dynamically
 * Routes to correct payload builder based on provider
 */
export function buildMultiProviderPayload(
  config: AIConfig,
  messages: ChatMessage[],
  options: BuildPayloadOptions = {}
): OpenAIPayload | AnthropicPayload | GeminiPayload | GroqPayload {
  const provider = config.provider.toLowerCase() as AIProvider;

  switch (provider) {
    case 'anthropic':
      return buildAnthropicPayload(config, messages, options);
    
    case 'google':
      return buildGeminiPayload(config, messages, options);
    
    case 'groq':
      return buildGroqPayload(config, messages, options);
    
    case 'openrouter':
      // OpenRouter uses OpenAI-compatible format
      return buildOpenAIPayload(config, messages, options);
    
    case 'openai':
    case 'lovable':
    default:
      return buildOpenAIPayload(config, messages, options);
  }
}

// ==================== PROVIDER ENDPOINTS ====================

export interface ProviderEndpoint {
  url: string;
  authHeader: string;
  authPrefix: string;
  contentType: string;
}

/**
 * Get provider endpoint configuration
 */
export function getProviderEndpoint(provider: AIProvider, modelName?: string): ProviderEndpoint {
  switch (provider) {
    case 'anthropic':
      return {
        url: 'https://api.anthropic.com/v1/messages',
        authHeader: 'x-api-key',
        authPrefix: '',
        contentType: 'application/json',
      };
    
    case 'google':
      // Gemini uses model-specific URLs
      const geminiModel = modelName || 'gemini-2.5-flash';
      return {
        url: `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent`,
        authHeader: 'x-goog-api-key',
        authPrefix: '',
        contentType: 'application/json',
      };
    
    case 'groq':
      return {
        url: 'https://api.groq.com/openai/v1/chat/completions',
        authHeader: 'Authorization',
        authPrefix: 'Bearer ',
        contentType: 'application/json',
      };
    
    case 'lovable':
      return {
        url: 'https://ai.gateway.lovable.dev/v1/chat/completions',
        authHeader: 'Authorization',
        authPrefix: 'Bearer ',
        contentType: 'application/json',
      };
    
    case 'openrouter':
      return {
        url: 'https://openrouter.ai/api/v1/chat/completions',
        authHeader: 'Authorization',
        authPrefix: 'Bearer ',
        contentType: 'application/json',
      };
    
    case 'openai':
    default:
      return {
        url: 'https://api.openai.com/v1/chat/completions',
        authHeader: 'Authorization',
        authPrefix: 'Bearer ',
        contentType: 'application/json',
      };
  }
}

// ==================== HELPERS ====================

/**
 * Helper to determine if a model supports temperature parameter
 */
export function modelSupportsTemperature(modelName: string): boolean {
  const legacyModels = ['gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo', 'gpt-4-turbo'];
  return legacyModels.some(legacy => modelName.includes(legacy));
}

/**
 * Helper to determine if a model supports reasoning_effort parameter
 */
export function modelSupportsReasoning(modelName: string): boolean {
  const reasoningPatterns = ['gpt-5', 'gpt-4.1', 'o3', 'o4'];
  return reasoningPatterns.some(pattern => modelName.includes(pattern));
}

/**
 * Infer model capabilities from model name when database metadata unavailable
 */
export function inferModelCapabilities(modelName: string): Partial<AIModelCapabilities> {
  const isLegacy = modelSupportsTemperature(modelName);
  const supportsReasoning = modelSupportsReasoning(modelName);
  const isAnthropic = modelName.includes('claude');
  const isGemini = modelName.includes('gemini');
  const isGroq = modelName.includes('llama') || modelName.includes('mixtral') || modelName.includes('whisper');
  
  return {
    supports_temperature: isLegacy || isAnthropic || isGemini || isGroq,
    supports_reasoning: supportsReasoning,
    supports_extended_thinking: isAnthropic && (modelName.includes('3.7') || modelName.includes('4')),
    supports_thinking_budget: isGemini && modelName.includes('2.5'),
    supports_top_p: true,
    supports_top_k: isAnthropic || isGemini,
    supports_frequency_penalty: !isAnthropic && !isGemini,
    supports_presence_penalty: !isAnthropic && !isGemini,
    supports_stop_sequences: true,
    supports_seed: !isAnthropic,
    supports_json_mode: true,
    supports_tools: true,
    supports_streaming: true,
    supports_vision: !modelName.includes('nano'),
    is_legacy: isLegacy,
  };
}

/**
 * Get default capabilities for a provider
 */
export function getDefaultCapabilities(provider: AIProvider): Partial<AIModelCapabilities> {
  switch (provider) {
    case 'anthropic':
      return {
        supports_temperature: true,
        supports_top_p: true,
        supports_top_k: true,
        supports_stop_sequences: true,
        supports_tools: true,
        supports_streaming: true,
        supports_vision: true,
        supports_extended_thinking: false,
        is_legacy: false,
      };
    
    case 'google':
      return {
        supports_temperature: true,
        supports_top_p: true,
        supports_top_k: true,
        supports_stop_sequences: true,
        supports_json_mode: true,
        supports_streaming: true,
        supports_vision: true,
        supports_thinking_budget: false,
        is_legacy: false,
      };
    
    case 'groq':
      return {
        supports_temperature: true,
        supports_top_p: true,
        supports_stop_sequences: true,
        supports_json_mode: true,
        supports_streaming: true,
        is_legacy: false,
      };
    
    case 'openrouter':
      // OpenRouter supports all major capabilities via OpenAI-compatible API
      return {
        supports_temperature: true,
        supports_top_p: true,
        supports_frequency_penalty: true,
        supports_presence_penalty: true,
        supports_stop_sequences: true,
        supports_seed: true,
        supports_json_mode: true,
        supports_tools: true,
        supports_streaming: true,
        supports_vision: true,
        is_legacy: false,
      };
    
    case 'openai':
    case 'lovable':
    default:
      return {
        supports_temperature: true,
        supports_top_p: true,
        supports_frequency_penalty: true,
        supports_presence_penalty: true,
        supports_stop_sequences: true,
        supports_seed: true,
        supports_json_mode: true,
        supports_tools: true,
        supports_streaming: true,
        supports_vision: true,
        is_legacy: false,
      };
  }
}

/**
 * Map provider string to AIProvider type
 */
export function normalizeProvider(provider: string): AIProvider {
  const normalized = provider.toLowerCase().trim();
  const providerMap: Record<string, AIProvider> = {
    'openai': 'openai',
    'anthropic': 'anthropic',
    'google': 'google',
    'gemini': 'google',
    'groq': 'groq',
    'lovable': 'lovable',
    'openrouter': 'openrouter',
  };
  return providerMap[normalized] || 'openai';
}
