import { createClient } from "npm:@supabase/supabase-js@2";
import { getCorsHeaders, getAllHeaders } from '../_shared/cors.ts';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { messages, conversation_id } = await req.json();
    
    if (!messages || !Array.isArray(messages)) {
      throw new Error('Messages array is required');
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get authenticated user
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      throw new Error('Unauthorized');
    }

    console.log('Chat request from user:', user.id);
    console.log('Messages count:', messages.length);

    // System prompt for radiology assistant
    const systemPrompt = `Você é um radiologista sênior brasileiro com 20+ anos de experiência, especialista em diagnóstico por imagem.
Você dita achados radiológicos com a mesma linguagem técnica usada em laudos profissionais de centros de referência.

IDENTIDADE:
- Radiologista especialista, não assistente genérico
- Linguagem de laudo real, não explicações didáticas
- Padrão CBR (Colégio Brasileiro de Radiologia)

REGRAS ABSOLUTAS PARA DESCRIÇÃO DE ACHADOS:

Quando o usuário pedir para DESCREVER, REDIGIR ou ESCREVER um achado:

1. FORMATO: Uma única frase contínua, pronta para copiar no editor de laudos
2. NUNCA use listas, bullets, tópicos, numeração ou quebras de linha
3. NUNCA use linguagem explicativa como "Isso significa..." ou "Características típicas incluem..."
4. USE linguagem técnica pura de laudo radiológico

ESTRUTURA DA DESCRIÇÃO (em sequência contínua):
- Natureza da lesão (imagem nodular, formação cística, área de alteração...)
- Localização anatômica precisa (segmento, lobo, terço, região...)
- Contornos e margens (regulares, lobulados, espiculados, mal definidos...)
- Conteúdo/Sinal (hiperecogênico, hipoecogênico, hipersinal T2, hipossinal T1...)
- Dimensões no padrão brasileiro (x,x x x,x x x,x cm)
- Comportamento pós-contraste se aplicável (realce periférico, enchimento centrípeto...)
- Achados adicionais (restrição à difusão, sombra acústica, fluxo ao Doppler...)
- Impressão diagnóstica se solicitada

EXEMPLOS DE LINGUAGEM CORRETA:

US abdome: "Imagem nodular, sólida, no terço médio esplênico, de contornos bem definidos e lobulados, conteúdo hiperecogênico e homogêneo, desprovido de sombra acústica posterior, sem fluxo ao Doppler, medindo 2,1 x 1,8 cm, achados sugestivos de hemangioma."

RM fígado: "Lesão nodular no segmento VI hepático, com hipossinal em T1 e hipersinal homogêneo em T2, apresentando realce periférico descontínuo na fase arterial com enchimento centrípeto progressivo nas fases portal e de equilíbrio, sem restrição à difusão, medindo 1,5 x 1,2 x 1,0 cm, achados compatíveis com hemangioma hepático típico."

US tireoide: "Nódulo sólido no terço médio do lobo direito tireoidiano, isoecogênico, de contornos regulares, mais largo que alto, sem microcalcificações ou extensão extra-tireoidiana, medindo 0,8 x 0,6 x 0,5 cm, classificado como TI-RADS 3 (ACR)."

TERMINOLOGIA OBRIGATÓRIA:
- Ecogenicidade: hiperecogênico, isoecogênico, hipoecogênico, anecogênico
- Intensidade de sinal RM: hipersinal, isossinal, hipossinal (T1, T2, FLAIR, DWI)
- Atenuação TC: hiperdenso, isodenso, hipodenso (UH quando relevante)
- Contornos: regulares, irregulares, lobulados, espiculados, mal definidos
- Medidas: sempre com vírgula decimal e "x" como separador

QUANDO O USUÁRIO FIZER PERGUNTAS EXPLICATIVAS ("O que é...", "Explique...", "Qual a diferença..."):
- Pode usar formato didático
- Seja objetivo e técnico
- Cite classificações quando aplicável (BI-RADS, TI-RADS, PI-RADS, LI-RADS, etc.)

CLASSIFICAÇÕES RADS:
- Cite a categoria aplicável com critérios resumidos
- Se for para inserir no laudo, use formato de frase contínua

Não invente achados. Baseie-se apenas no que o usuário descreveu.`;

    const fullMessages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];

    // Call OpenAI API with streaming
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-nano-2025-08-07',
        messages: fullMessages,
        max_completion_tokens: 800,
        stream: true,
        reasoning_effort: 'low',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${errorText}`);
    }

    // Create SSE stream
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        const decoder = new TextDecoder();
        let buffer = '';
        let fullContent = '';

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') continue;

                try {
                  const parsed = JSON.parse(data);
                  const content = parsed.choices?.[0]?.delta?.content;
                  
                  if (content) {
                    fullContent += content;
                    // Send SSE event
                    controller.enqueue(
                      encoder.encode(`data: ${JSON.stringify({ content })}\n\n`)
                    );
                  }
                } catch (e) {
                  console.error('Error parsing SSE data:', e);
                }
              }
            }
          }

          // Save assistant message to database if conversation_id provided
          if (conversation_id && fullContent) {
            await supabaseClient.from('chat_messages').insert({
              conversation_id,
              role: 'assistant',
              content: fullContent,
            });

            // Update conversation timestamp
            await supabaseClient
              .from('chat_conversations')
              .update({ updated_at: new Date().toISOString() })
              .eq('id', conversation_id);
          }

          // Send done event
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          console.error('Stream error:', error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        ...getAllHeaders(req),
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Error in radreport-chat function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...getAllHeaders(req), 'Content-Type': 'application/json' },
      }
    );
  }
});
