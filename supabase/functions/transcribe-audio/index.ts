import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.84.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Process base64 in chunks to prevent memory issues
function processBase64Chunks(base64String: string, chunkSize = 32768) {
  const chunks: Uint8Array[] = [];
  let position = 0;
  
  while (position < base64String.length) {
    const chunk = base64String.slice(position, position + chunkSize);
    const binaryChunk = atob(chunk);
    const bytes = new Uint8Array(binaryChunk.length);
    
    for (let i = 0; i < binaryChunk.length; i++) {
      bytes[i] = binaryChunk.charCodeAt(i);
    }
    
    chunks.push(bytes);
    position += chunkSize;
  }

  const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;

  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }

  return result;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Extract user_id from JWT
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const userId = user.id;
    
    const { audio, language = 'pt' } = await req.json();
    
    if (!audio) {
      throw new Error('No audio data provided');
    }

    // Estimate audio duration: WebM Opus típico ~8KB/s (não 16KB/s como raw audio)
    const audioSizeBytes = (audio.length * 0.75); // base64 to bytes
    const estimatedDurationSeconds = Math.ceil(audioSizeBytes / 8000); // Corrigido para WebM Opus
    
    console.log('📊 Audio analysis:', {
      base64Length: audio.length,
      estimatedBytes: audioSizeBytes,
      estimatedDurationSeconds,
      minRequired: 5
    });
    
    // 🆕 Validação mínima 5s (Groq cobra mínimo 10s, mas aceitamos 5s+ para não perder áudio útil)
    if (estimatedDurationSeconds < 5) {
      console.log('⏭️ Audio too short:', estimatedDurationSeconds, 's (min: 5s)');
      return new Response(
        JSON.stringify({ 
          text: '', 
          skipped: true,
          reason: 'Audio menor que 5 segundos - não processado',
          duration: estimatedDurationSeconds
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Calculate credits: 1 credit per minute, min 1, max 5
    const creditsToConsume = Math.min(Math.max(Math.ceil(estimatedDurationSeconds / 60), 1), 5);
    
    console.log('📥 Whisper request:', JSON.stringify({
      audioSizeKB: Math.round(audioSizeBytes / 1024),
      estimatedDurationSec: estimatedDurationSeconds,
      creditsNeeded: creditsToConsume
    }));

    // Check balance BEFORE consuming (don't consume yet)
    const { data: balanceCheck, error: balanceError } = await supabaseClient
      .from('user_whisper_balance')
      .select('balance')
      .eq('user_id', userId)
      .single();

    if (balanceError || !balanceCheck || balanceCheck.balance < creditsToConsume) {
      console.error('Insufficient credits:', balanceCheck?.balance || 0);
      return new Response(
        JSON.stringify({ 
          error: 'Saldo insuficiente de créditos Whisper',
          credits_needed: creditsToConsume,
          current_balance: balanceCheck?.balance || 0
        }),
        {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('Transcribing audio with Groq Whisper API...');
    
    // Process audio in chunks
    const binaryAudio = processBase64Chunks(audio);
    
    // Optimized prompt: <224 tokens (~850 chars) to comply with Groq limit
    const medicalPrompt = 'Laudo radiológico brasileiro. Termos: hepatomegalia, esplenomegalia, esteatose, colecistite, colelitíase, pancreatite, hidronefrose, hipoecogênico, hiperecogênico, heterogêneo, linfonodomegalia, BI-RADS, TI-RADS, PI-RADS, LI-RADS, parênquima, neoplasia, nódulo, cisto, lesão, dilatação, estenose, trombose, edema, hematoma. Medidas em cm/mm/ml.';
    
    // Prepare form data
    const formData = new FormData();
    const blob = new Blob([binaryAudio], { type: 'audio/webm' });
    formData.append('file', blob, 'audio.webm');
    formData.append('model', 'whisper-large-v3-turbo');
    formData.append('language', language);
    formData.append('prompt', medicalPrompt);
    formData.append('temperature', '0.0');
    formData.append('response_format', 'verbose_json');
    // timestamp_granularities[] removido - sintaxe incompatível com FormData
    // verbose_json já retorna metadados necessários (avg_logprob, no_speech_prob, segments)

    // Send to Groq Whisper API
    const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('GROQ_API_KEY')}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error:', errorText);
      throw new Error(`Groq API error: ${errorText}`);
    }

    const result = await response.json();

    // 🆕 FASE 2: Filter noise/silence segments using no_speech_prob AND avg_logprob
    let finalText = result.text;
    let segmentsFiltered = 0;
    let avgConfidence = null;
    
    if (result.segments && Array.isArray(result.segments)) {
      const validSegments = result.segments.filter(
        (segment: any) => {
          const noSpeechOk = segment.no_speech_prob < 0.5;
          const confidenceOk = segment.avg_logprob > -0.5; // 🆕 Alta confiança
          
          if (!confidenceOk) {
            console.log('⚠️ Low confidence segment filtered:', segment.avg_logprob);
          }
          
          return noSpeechOk && confidenceOk;
        }
      );
      
      segmentsFiltered = result.segments.length - validSegments.length;
      
      if (validSegments.length > 0) {
        finalText = validSegments.map((s: any) => s.text).join(' ').trim();
        avgConfidence = validSegments.reduce((sum: number, s: any) => sum + (s.avg_logprob || 0), 0) / validSegments.length;
        console.log(`Filtered ${segmentsFiltered} noise/low-confidence segments out of ${result.segments.length}`);
      }
    }

    console.log('✅ Transcription successful:', finalText.substring(0, 50));

    // NOW consume credits AFTER successful transcription
    const { data: consumeResult, error: consumeError } = await supabaseClient.rpc(
      'consume_whisper_credits',
      { 
        p_user_id: userId,
        p_credits_to_consume: creditsToConsume 
      }
    );

    if (consumeError) {
      console.error('Failed to consume credits after transcription:', consumeError);
      // Transcription succeeded but couldn't deduct credits - log and continue
    }

    const creditsRemaining = consumeResult || (balanceCheck.balance - creditsToConsume);

    // 🆕 FASE 5: Log estruturado JSON com métricas detalhadas
    await supabaseClient.from('whisper_usage_log').insert({
      user_id: userId,
      credits_consumed: creditsToConsume,
      audio_duration_seconds: result.duration || estimatedDurationSeconds,
      segments_filtered: segmentsFiltered,
      avg_confidence: avgConfidence,
      language: result.language || language,
      text_length: finalText.length,
      segments_total: result.segments?.length || 0
    });

    return new Response(
      JSON.stringify({ 
        text: finalText,
        language: result.language || language,
        duration: result.duration,
        segments_filtered: segmentsFiltered,
        credits_consumed: creditsToConsume,
        credits_remaining: creditsRemaining
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in transcribe-audio function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});