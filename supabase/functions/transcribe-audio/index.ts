import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { audio, language = 'pt' } = await req.json();
    
    if (!audio) {
      throw new Error('No audio data provided');
    }

    console.log('Transcribing audio with Groq Whisper API...');
    
    // Process audio in chunks
    const binaryAudio = processBase64Chunks(audio);
    
    // 🆕 FASE 5: Prompt atualizado para ignorar comandos de voz
    const medicalPrompt = 'Transcrição de laudo radiológico médico brasileiro. Termos técnicos frequentes: hepatomegalia, esplenomegalia, esteatose hepática, cirrose, fibrose, colecistite, colelitíase, coledocolitíase, colangite, pancreatite, nefrolitíase, hidronefrose, pielonefrite, cistite, ascite, derrame pleural, pneumotórax, atelectasia, consolidação pulmonar, bronquiectasia, enfisema, hipoecogênico, hiperecogênico, isoecogênico, anecogênico, heterogêneo, homogêneo, parênquima, ecogenicidade, ecotextura, BI-RADS, TI-RADS, PI-RADS, LI-RADS, O-RADS, Lung-RADS, CAD-RADS, linfonodomegalia, adenomegalia, espessamento parietal, neoplasia, metástase, nódulo, cisto, pólipo, massa, lesão, calcificação, diverticulose, diverticulite, apendicite, hérnia, linfoma, carcinoma, adenocarcinoma, melanoma, sarcoma, lipoma, hemangioma, angioma, teratoma, adenoma, mioma, endometriose, adenomiose, ovário policístico, hérnia discal, espondilose, espondilólise, espondilolistese, osteófito, artrose, artrite, tendinopatia, bursite, sinovite, meniscopatia, condropatia, estenose, aneurisma, trombose, embolia, isquemia, infarto, edema, hematoma, abscesso, fístula, úlcera, erosão, perfuração, obstrução, dilatação. IGNORAR palavras de comando: nova linha, próxima linha, linha, novo parágrafo, próximo parágrafo, parágrafo, ponto parágrafo, ponto final, vírgula, ponto e vírgula, dois pontos. Medidas em centímetros (cm), milímetros (mm), mililitros (ml).';
    
    // Prepare form data
    const formData = new FormData();
    const blob = new Blob([binaryAudio], { type: 'audio/webm' });
    formData.append('file', blob, 'audio.webm');
    formData.append('model', 'whisper-large-v3-turbo');
    formData.append('language', language);
    formData.append('prompt', medicalPrompt);
    formData.append('temperature', '0.0');
    formData.append('response_format', 'verbose_json');

    // Send to Groq Whisper API (10x cheaper than OpenAI)
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

    // Filter noise/silence segments using no_speech_prob from verbose_json
    let finalText = result.text;
    let segmentsFiltered = 0;
    
    if (result.segments && Array.isArray(result.segments)) {
      const validSegments = result.segments.filter(
        (segment: any) => segment.no_speech_prob < 0.5
      );
      
      segmentsFiltered = result.segments.length - validSegments.length;
      
      if (validSegments.length > 0) {
        finalText = validSegments.map((s: any) => s.text).join(' ').trim();
        console.log(`Filtered ${segmentsFiltered} noise segments out of ${result.segments.length}`);
      }
    }

    console.log('Transcription successful:', finalText);

    return new Response(
      JSON.stringify({ 
        text: finalText,
        language: result.language || language,
        duration: result.duration,
        segments_filtered: segmentsFiltered
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