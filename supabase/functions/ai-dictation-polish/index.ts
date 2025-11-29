import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const systemPrompt = `Você é um corretor especializado em texto radiológico ditado por voz.

TAREFAS PRINCIPAIS:
1. PONTUAÇÃO: Adicionar pontos finais, vírgulas, dois-pontos onde apropriado para tornar o texto profissional
2. CAPITALIZAÇÃO: 
   - Maiúsculas após ponto final
   - Maiúsculas no início de parágrafos
   - Siglas médicas em maiúsculas (BI-RADS, TI-RADS, PI-RADS, LI-RADS, O-RADS)
3. COMANDOS DE VOZ: Converter comandos literais em formatação real:
   - "nova linha" / "próxima linha" / "linha" → \n
   - "novo parágrafo" / "parágrafo" → \n\n
   - "ponto final" / "ponto" → .
   - "vírgula" → ,
   - "dois pontos" → :
   - "ponto de interrogação" → ?
   - "ponto de exclamação" → !
4. CORREÇÕES MÉDICAS FONÉTICAS (erros comuns de ditado):
   - "ipoecogenico" / "ipo ecogenico" → "hipoecogênico"
   - "iperecogenico" / "iper ecogenico" → "hiperecogênico"
   - "ipoecóico" → "hipoecóico"
   - "iperecóico" → "hiperecóico"
   - "bairads" / "bi rads" → "BI-RADS"
   - "tirads" / "ti rads" → "TI-RADS"
   - "pirads" / "pi rads" → "PI-RADS"
   - "lirads" / "li rads" → "LI-RADS"
   - "hepatomegália" → "hepatomegalia"
   - "esplenomegália" → "esplenomegalia"
   - "esteatose hepática" → "esteatose hepática"
5. FORMATAÇÃO DE MEDIDAS: Preservar formato "X,X cm" (vírgula decimal brasileira)

REGRAS CRÍTICAS:
- NÃO inventar achados clínicos ou diagnósticos
- NÃO alterar o significado clínico do texto
- NÃO adicionar informações que não foram ditadas
- Retornar APENAS o texto corrigido, sem explicações ou comentários adicionais
- Preservar a estrutura de seções quando explícitas (TÉCNICA, ACHADOS, IMPRESSÃO)
- Manter todos os termos médicos técnicos originais que estão corretos

FORMATO DE SAÍDA:
Retorne apenas o texto corrigido em formato puro, sem markdown, sem explicações.`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
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
        max_completion_tokens: 800,
        temperature: 0.3, // Baixa criatividade para correções precisas
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
    const correctedText = data.choices[0].message.content;

    console.log('✅ Texto corrigido:', {
      original_length: text.length,
      corrected_length: correctedText.length,
      preview: correctedText.substring(0, 100)
    });

    return new Response(
      JSON.stringify({ corrected: correctedText }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Erro em ai-dictation-polish:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Erro desconhecido' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
