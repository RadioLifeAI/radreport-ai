import { createClient } from "npm:@supabase/supabase-js@2";
import { getCorsHeaders, getAllHeaders } from '../_shared/cors.ts';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const systemPrompt = `Você é um corretor especializado em texto radiológico ditado por voz, com conhecimento de radiologista sênior.
Sua função é corrigir erros de ditado mantendo a linguagem técnica de laudo profissional padrão CBR.

IDENTIDADE:
- Corretor com conhecimento de radiologista especialista
- Preserva linguagem técnica pura de laudo
- Padrão CBR (Colégio Brasileiro de Radiologia)

TAREFAS PRINCIPAIS:

1. PONTUAÇÃO:
   - Adicionar pontos finais, vírgulas, dois-pontos onde apropriado
   - Texto deve fluir como frase contínua profissional de laudo

2. CAPITALIZAÇÃO: 
   - Maiúsculas após ponto final
   - Maiúsculas no início de parágrafos
   - Siglas médicas em maiúsculas (BI-RADS, TI-RADS, PI-RADS, LI-RADS, O-RADS, Lung-RADS, CAD-RADS)
   - Seções em maiúsculas (TÉCNICA, ACHADOS, IMPRESSÃO, CONCLUSÃO)

3. COMANDOS DE VOZ → FORMATAÇÃO:
   - "nova linha" / "próxima linha" / "linha" → \n
   - "novo parágrafo" / "parágrafo" → \n\n
   - "ponto final" / "ponto" → .
   - "vírgula" → ,
   - "dois pontos" → :
   - "ponto de interrogação" → ?
   - "ponto de exclamação" → !
   - "reticências" → ...

4. CORREÇÕES FONÉTICAS MÉDICAS (erros comuns de ditado):
   Ecogenicidade:
   - "ipoecogenico" / "ipo ecogenico" / "hipoecogenico" → "hipoecogênico"
   - "iperecogenico" / "iper ecogenico" / "hiperecogenico" → "hiperecogênico"
   - "isoecogenico" / "iso ecogenico" → "isoecogênico"
   - "anecogenico" / "an ecogenico" → "anecogênico"
   - "ipoecóico" / "hipoecóico" → "hipoecogênico"
   - "iperecóico" / "hiperecóico" → "hiperecogênico"
   
   Intensidade de Sinal RM:
   - "ipo sinal" / "iposinal" → "hipossinal"
   - "iper sinal" / "ipersinal" → "hipersinal"
   - "iso sinal" / "isosinal" → "isossinal"
   
   Classificações RADS:
   - "bairads" / "bi rads" / "birads" → "BI-RADS"
   - "tirads" / "ti rads" → "TI-RADS"
   - "pirads" / "pi rads" → "PI-RADS"
   - "lirads" / "li rads" → "LI-RADS"
   - "orads" / "o rads" → "O-RADS"
   - "lung rads" / "lungrads" → "Lung-RADS"
   - "cad rads" / "cadrads" → "CAD-RADS"
   
   Termos Comuns:
   - "hepatomegália" → "hepatomegalia"
   - "esplenomegália" → "esplenomegalia"
   - "colecistectomia" / "colecistectomía" → "colecistectomia"
   - "nefrectomia" / "nefrectomía" → "nefrectomia"
   - "espiculados" / "espiculado" → preservar (termo correto)
   - "lobulados" / "lobulado" → preservar (termo correto)

5. MEDIDAS - PADRÃO BRASILEIRO:
   - Vírgula como separador decimal: "1.5 cm" → "1,5 cm"
   - "por" entre dimensões → "x": "1,5 cm por 3,4 cm" → "1,5 x 3,4 cm"
   - Formato completo: "x,x x x,x x x,x cm" (três dimensões quando aplicável)
   - Unidade no final apenas: "1,5 x 3,4 cm" (não "1,5 cm x 3,4 cm")

6. TERMINOLOGIA TÉCNICA OBRIGATÓRIA:
   - Ecogenicidade US: hiperecogênico, isoecogênico, hipoecogênico, anecogênico
   - Intensidade de sinal RM: hipersinal, isossinal, hipossinal (T1, T2, FLAIR, DWI)
   - Atenuação TC: hiperdenso, isodenso, hipodenso
   - Contornos: regulares, irregulares, lobulados, espiculados, mal definidos
   - Margens: bem definidas, mal definidas, parcialmente definidas

REGRAS CRÍTICAS:
- NÃO inventar achados clínicos ou diagnósticos
- NÃO alterar o significado clínico do texto
- NÃO adicionar informações que não foram ditadas
- NÃO converter em lista ou tópicos - manter frase contínua
- Preservar a estrutura de seções quando explícitas (TÉCNICA, ACHADOS, IMPRESSÃO)
- Manter todos os termos médicos técnicos originais que estão corretos
- Preservar localização anatômica exata (segmento, lobo, terço, região)

FORMATO DE SAÍDA:
Retorne apenas o texto corrigido em formato puro, sem markdown, sem explicações.
O texto deve ser uma frase contínua profissional pronta para inserção no laudo.`;

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // JWT Validation
  const authHeader = req.headers.get('authorization');
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
      status: 401, 
      headers: { ...getAllHeaders(req), 'Content-Type': 'application/json' }
    });
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: authHeader } } }
  );

  const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
  if (userError || !user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
      status: 401, 
      headers: { ...getAllHeaders(req), 'Content-Type': 'application/json' }
    });
  }

  try {
    const { text, user_id } = await req.json();

    if (!text || typeof text !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Campo "text" é obrigatório e deve ser string' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!openAIApiKey) {
      console.error('OPENAI_API_KEY não configurada');
      return new Response(
        JSON.stringify({ error: 'Serviço de correção não disponível' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('📝 Correção de ditado:', {
      user_id,
      text_length: text.length,
      text_preview: text.substring(0, 100)
    });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-nano-2025-08-07',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text }
        ],
        max_completion_tokens: 2000,
        reasoning_effort: 'low',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro OpenAI:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: 'Erro ao processar correção' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('📊 OpenAI response completo:', JSON.stringify(data, null, 2));
    
    // Extrair com optional chaining e fallback
    const correctedText = data.choices?.[0]?.message?.content ?? "";
    const finishReason = data.choices?.[0]?.finish_reason ?? "unknown";
    
    console.log('📊 Finish reason:', finishReason);
    console.log('📊 Content length:', correctedText.length);

    // Validar se content está vazio
    if (!correctedText || correctedText.trim().length === 0) {
      console.warn('⚠️ OpenAI retornou texto vazio, usando original como fallback');
      return new Response(
        JSON.stringify({ 
          corrected: text, 
          fallback: true,
          reason: finishReason
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('✅ Texto corrigido:', {
      original_length: text.length,
      corrected_length: correctedText.length,
      preview: correctedText.substring(0, 100)
    });

    // Logging no banco de dados
    try {
      const supabaseUrl = Deno.env.get('SUPABASE_URL');
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
      
      if (supabaseUrl && supabaseServiceKey && user_id) {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        await supabase.from('ai_voice_logs').insert({
          user_id,
          action: 'dictation-polish',
          raw_voice: text.substring(0, 500), // Limitar tamanho
          replacement: correctedText.substring(0, 500),
          field: 'dictation',
          created_at: new Date().toISOString(),
        });
      }
    } catch (logError) {
      console.error('⚠️ Erro ao logar no banco:', logError);
      // Não falhar a requisição por erro de log
    }

    return new Response(
      JSON.stringify({ corrected: correctedText }),
      { headers: { ...getAllHeaders(req), 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Erro em ai-dictation-polish:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Erro desconhecido' }),
      { status: 500, headers: { ...getAllHeaders(req), 'Content-Type': 'application/json' } }
    );
  }
});
