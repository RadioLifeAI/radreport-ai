import { createClient } from "npm:@supabase/supabase-js@2";
import { getCorsHeaders, getAllHeaders } from '../_shared/cors.ts';

// ============= MULTI-PROVIDER CONFIGURATION =============
interface ProviderConfig {
  url: string;
  model: string;
  apiKeyEnv: string;
  maxPromptTokens: number | null; // null = unlimited
  supportsVerboseJson: boolean;
  supportsLogprobs: boolean;
  supportsStreaming: boolean;
}

const PROVIDERS: Record<string, ProviderConfig> = {
  groq: {
    url: 'https://api.groq.com/openai/v1/audio/transcriptions',
    model: 'whisper-large-v3-turbo',
    apiKeyEnv: 'GROQ_API_KEY',
    maxPromptTokens: 224, // ~850 chars
    supportsVerboseJson: true,
    supportsLogprobs: false,
    supportsStreaming: false,
  },
  openai: {
    url: 'https://api.openai.com/v1/audio/transcriptions',
    model: 'gpt-4o-transcribe',
    apiKeyEnv: 'OPENAI_API_KEY',
    maxPromptTokens: null, // Unlimited
    supportsVerboseJson: false, // Uses 'json' or 'text'
    supportsLogprobs: true,
    supportsStreaming: true,
  },
  openai_mini: {
    url: 'https://api.openai.com/v1/audio/transcriptions',
    model: 'gpt-4o-mini-transcribe',
    apiKeyEnv: 'OPENAI_API_KEY',
    maxPromptTokens: null,
    supportsVerboseJson: false,
    supportsLogprobs: true,
    supportsStreaming: true,
  },
};

// ============= DEFAULT CONFIGURATION =============
interface WhisperConfig {
  provider: string;
  model: string;
  system_prompt: string;
  language: string;
  temperature: number;
  response_format: string;
  no_speech_prob_threshold: number;
  avg_logprob_threshold: number;
  credit_cost_per_minute: number;
  max_credits_per_audio: number;
  min_audio_seconds: number;
  remove_fillers: boolean;
  normalize_measurements: boolean;
  provider_gratuito: string;
  provider_basico: string;
  provider_profissional: string;
  provider_premium: string;
  use_previous_context: boolean;
  previous_context_chars: number;
  enable_streaming: boolean;
  version: number;
}

const DEFAULT_CONFIG: WhisperConfig = {
  provider: 'groq',
  model: 'whisper-large-v3-turbo',
  system_prompt: `Você é um transcritor médico radiológico brasileiro de alta precisão.

REGRAS CRÍTICAS:
1. Remova TODAS hesitações e vícios de fala: é, ééé, hã, hmm, né, tipo, assim, então, é isso, ahn, ah
2. Mantenha apenas conteúdo médico significativo
3. Use vírgula como separador decimal (3,2 não 3.2)
4. Separador de medidas: "x" (10 x 8 x 6 cm)
5. Unidades: mm, cm, ml, HU

TERMINOLOGIA MÉDICA (transcreva exatamente):
hepatomegalia, esplenomegalia, esteatose, colecistite, colelitíase,
pancreatite, hidronefrose, hipoecogênico, hiperecogênico, heterogêneo,
linfonodomegalia, BI-RADS, TI-RADS, PI-RADS, LI-RADS, O-RADS,
parênquima, neoplasia, nódulo, cisto, lesão, dilatação, estenose,
trombose, edema, hematoma, calcificação, aneurisma, ateromatose,
adenopatia, ascite, derrame pleural, pneumotórax, consolidação,
atelectasia, bronquiectasia, enfisema, fibrose, metástase

FORMATO: Português BR, pronto para inserção direta no laudo.`,
  language: 'pt',
  temperature: 0.0,
  response_format: 'verbose_json',
  no_speech_prob_threshold: 0.5,
  avg_logprob_threshold: -0.5,
  credit_cost_per_minute: 1,
  max_credits_per_audio: 5,
  min_audio_seconds: 2,
  remove_fillers: true,
  normalize_measurements: true,
  provider_gratuito: 'groq',
  provider_basico: 'openai_mini',
  provider_profissional: 'openai',
  provider_premium: 'openai',
  use_previous_context: true,
  previous_context_chars: 200,
  enable_streaming: false,
  version: 1,
};

// ============= UTILITY FUNCTIONS =============

function decodeBase64ToUint8Array(base64String: string): Uint8Array {
  const binaryString = atob(base64String);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function isValidWebM(bytes: Uint8Array): boolean {
  if (bytes.length < 4) return false;
  return bytes[0] === 0x1A && bytes[1] === 0x45 && 
         bytes[2] === 0xDF && bytes[3] === 0xA3;
}

// Prepare prompt with optional previous context
function preparePrompt(
  systemPrompt: string, 
  provider: ProviderConfig, 
  previousContext?: string,
  contextChars?: number
): string {
  let finalPrompt = systemPrompt;
  
  // Add previous context if available
  if (previousContext && previousContext.trim().length > 10) {
    const contextToUse = previousContext.slice(-(contextChars || 200));
    finalPrompt = `Contexto anterior do laudo: "${contextToUse}"\n\n${systemPrompt}`;
  }
  
  // Truncate for Groq (224 token limit ≈ 850 chars)
  if (provider.maxPromptTokens && finalPrompt.length > 850) {
    return finalPrompt.substring(0, 850);
  }
  
  return finalPrompt;
}

// Select provider based on user plan
function selectProvider(config: WhisperConfig, userPlan: string): string {
  const planKey = `provider_${userPlan.toLowerCase()}` as keyof WhisperConfig;
  const providerKey = config[planKey] as string | undefined;
  return providerKey && PROVIDERS[providerKey] ? providerKey : config.provider;
}

// Remove speech fillers (ééé, hã, né, tipo, etc.)
const FILLERS_REGEX = /\b(é+|ééé+|hã+|né|tipo|assim|então|é isso|hmm+|ãh+|ah+|ahn+|uhm+|tá|ok|bom|pronto|vamos lá)\b/gi;

function removeFillers(text: string, shouldRemove: boolean): string {
  if (!shouldRemove) return text;
  return text
    .replace(FILLERS_REGEX, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

// Normalize measurements to Brazilian format
function normalizeMeasurements(text: string, shouldNormalize: boolean): string {
  if (!shouldNormalize) return text;
  return text
    // Convert period to comma for decimals (3.2 → 3,2)
    .replace(/(\d)\.(\d)/g, '$1,$2')
    // "por" → "x" in measurements
    .replace(/(\d+,?\d*)\s*(?:por|x)\s*(\d+,?\d*)/gi, '$1 x $2')
    // Ensure lowercase "x"
    .replace(/(\d)\s*X\s*(\d)/g, '$1 x $2');
}

// Get correct response format based on provider
function getResponseFormat(provider: ProviderConfig): string {
  // Groq supports verbose_json (returns segments with confidence)
  if (provider.supportsVerboseJson) {
    return 'verbose_json';
  }
  // OpenAI gpt-4o-transcribe only supports 'json' or 'text'
  return 'json';
}

// ============= MAIN HANDLER =============

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Extract user from JWT
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const userId = user.id;
    const { audio, language = 'pt', previous_context, stream = false } = await req.json();
    
    if (!audio) {
      throw new Error('No audio data provided');
    }

    // ============= FETCH CONFIG FROM DATABASE =============
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: configData } = await supabaseAdmin
      .from('whisper_config')
      .select('*')
      .eq('config_name', 'default')
      .eq('is_active', true)
      .single();

    const config: WhisperConfig = configData ? {
      provider: configData.provider,
      model: configData.model,
      system_prompt: configData.system_prompt,
      language: configData.language || 'pt',
      temperature: Number(configData.temperature) || 0.0,
      response_format: configData.response_format || 'verbose_json',
      no_speech_prob_threshold: Number(configData.no_speech_prob_threshold) || 0.5,
      avg_logprob_threshold: Number(configData.avg_logprob_threshold) || -0.5,
      credit_cost_per_minute: configData.credit_cost_per_minute || 1,
      max_credits_per_audio: configData.max_credits_per_audio || 5,
      min_audio_seconds: configData.min_audio_seconds || 2,
      remove_fillers: configData.remove_fillers ?? true,
      normalize_measurements: configData.normalize_measurements ?? true,
      provider_gratuito: configData.provider_gratuito || 'groq',
      provider_basico: configData.provider_basico || 'openai_mini',
      provider_profissional: configData.provider_profissional || 'openai',
      provider_premium: configData.provider_premium || 'openai',
      use_previous_context: configData.use_previous_context ?? true,
      previous_context_chars: configData.previous_context_chars || 200,
      enable_streaming: configData.enable_streaming ?? false,
      version: configData.version || 1,
    } : DEFAULT_CONFIG;

    console.log('📋 Loaded whisper config v' + config.version);

    // ============= GET USER PLAN =============
    const { data: subscription } = await supabaseAdmin
      .from('user_subscriptions')
      .select('plan_code')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    const userPlan = subscription?.plan_code || 'gratuito';
    console.log('👤 User plan:', userPlan);

    // ============= SELECT PROVIDER =============
    const providerKey = selectProvider(config, userPlan);
    const provider = PROVIDERS[providerKey];
    
    if (!provider) {
      throw new Error(`Invalid provider: ${providerKey}`);
    }

    console.log('🔌 Selected provider:', providerKey, '->', provider.model);

    // ============= AUDIO VALIDATION =============
    const audioSizeBytes = (audio.length * 0.75);
    const estimatedDurationSeconds = Math.ceil(audioSizeBytes / 8000);
    
    console.log('📊 Audio analysis:', {
      estimatedBytes: audioSizeBytes,
      estimatedDurationSeconds,
      minRequired: config.min_audio_seconds
    });
    
    if (estimatedDurationSeconds < config.min_audio_seconds) {
      return new Response(
        JSON.stringify({ 
          text: '', 
          skipped: true,
          reason: `Áudio menor que ${config.min_audio_seconds} segundos`,
          duration: estimatedDurationSeconds
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Calculate credits
    const creditsToConsume = Math.min(
      Math.max(Math.ceil(estimatedDurationSeconds / 60), config.credit_cost_per_minute), 
      config.max_credits_per_audio
    );

    // Check balance
    const { data: balanceCheck, error: balanceError } = await supabaseClient
      .from('user_whisper_balance')
      .select('balance')
      .eq('user_id', userId)
      .single();

    if (balanceError || !balanceCheck || balanceCheck.balance < creditsToConsume) {
      return new Response(
        JSON.stringify({ 
          error: 'Saldo insuficiente de créditos Whisper',
          credits_needed: creditsToConsume,
          current_balance: balanceCheck?.balance || 0
        }),
        { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Decode and validate audio
    const binaryAudio = decodeBase64ToUint8Array(audio);
    
    if (!isValidWebM(binaryAudio)) {
      return new Response(
        JSON.stringify({ error: 'Arquivo de áudio corrompido', text: '', skipped: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // ============= PREPARE REQUEST =============
    const hasPreviousContext = config.use_previous_context && previous_context && previous_context.length > 10;
    const prompt = preparePrompt(
      config.system_prompt, 
      provider, 
      hasPreviousContext ? previous_context : undefined,
      config.previous_context_chars
    );
    
    const apiKey = Deno.env.get(provider.apiKeyEnv);
    
    if (!apiKey) {
      console.error('Missing API key:', provider.apiKeyEnv);
      // Fallback to Groq if primary provider key is missing
      const fallbackProvider = PROVIDERS.groq;
      const fallbackKey = Deno.env.get(fallbackProvider.apiKeyEnv);
      
      if (!fallbackKey) {
        throw new Error('No transcription API keys configured');
      }
      
      console.log('⚠️ Falling back to Groq');
    }

    const formData = new FormData();
    const blob = new Blob([binaryAudio.buffer as ArrayBuffer], { type: 'audio/webm' });
    formData.append('file', blob, 'audio.webm');
    formData.append('model', provider.model);
    formData.append('language', language || config.language);
    formData.append('prompt', prompt);
    formData.append('temperature', String(config.temperature));
    
    // Set correct response format based on provider capability
    const responseFormat = getResponseFormat(provider);
    formData.append('response_format', responseFormat);

    // Check if streaming is requested and supported
    const useStreaming = stream && config.enable_streaming && provider.supportsStreaming;
    if (useStreaming) {
      formData.append('stream', 'true');
    }

    console.log(`📤 Calling ${providerKey}:`, {
      url: provider.url,
      model: provider.model,
      responseFormat,
      hasContext: !!hasPreviousContext,
      streaming: useStreaming
    });

    // ============= CALL TRANSCRIPTION API =============
    const response = await fetch(provider.url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey || Deno.env.get('GROQ_API_KEY')}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`${providerKey} API error:`, errorText);
      throw new Error(`${providerKey} API error: ${errorText}`);
    }

    // ============= HANDLE STREAMING RESPONSE =============
    if (useStreaming && response.body) {
      console.log('📡 Streaming response started');
      
      // Return SSE stream directly to client
      return new Response(response.body, {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        }
      });
    }

    // ============= HANDLE STANDARD RESPONSE =============
    const result = await response.json();

    // ============= POST-PROCESSING =============
    let finalText = result.text;
    let segmentsFiltered = 0;
    let avgConfidence = null;
    
    // Filter segments by confidence (only for verbose_json responses from Groq)
    if (result.segments && Array.isArray(result.segments)) {
      const validSegments = result.segments.filter((segment: any) => {
        const noSpeechOk = segment.no_speech_prob < config.no_speech_prob_threshold;
        const confidenceOk = segment.avg_logprob > config.avg_logprob_threshold;
        return noSpeechOk && confidenceOk;
      });
      
      segmentsFiltered = result.segments.length - validSegments.length;
      
      if (validSegments.length > 0) {
        finalText = validSegments.map((s: any) => s.text).join(' ').trim();
        avgConfidence = validSegments.reduce((sum: number, s: any) => sum + (s.avg_logprob || 0), 0) / validSegments.length;
      }
    }

    // Apply text post-processing
    finalText = removeFillers(finalText, config.remove_fillers);
    finalText = normalizeMeasurements(finalText, config.normalize_measurements);

    console.log('✅ Transcription successful:', finalText.substring(0, 50) + '...');

    // ============= CONSUME CREDITS =============
    const { data: consumeResult } = await supabaseClient.rpc(
      'consume_whisper_credits',
      { p_user_id: userId, p_credits_to_consume: creditsToConsume }
    );

    const creditsRemaining = consumeResult || (balanceCheck.balance - creditsToConsume);

    // ============= LOG USAGE =============
    await supabaseAdmin.from('whisper_usage_log').insert({
      user_id: userId,
      credits_consumed: creditsToConsume,
      audio_duration_seconds: result.duration || estimatedDurationSeconds,
      segments_filtered: segmentsFiltered,
      avg_confidence: avgConfidence,
      language: result.language || language,
      text_length: finalText.length,
      segments_total: result.segments?.length || 0,
      provider: providerKey,
      config_version: config.version,
      has_previous_context: hasPreviousContext,
      streaming_used: useStreaming,
      response_format: responseFormat,
    });

    return new Response(
      JSON.stringify({ 
        text: finalText,
        language: result.language || language,
        duration: result.duration,
        segments_filtered: segmentsFiltered,
        credits_consumed: creditsToConsume,
        credits_remaining: creditsRemaining,
        provider: providerKey,
        has_context: hasPreviousContext,
      }),
      { headers: { ...getAllHeaders(req), 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in transcribe-audio function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
