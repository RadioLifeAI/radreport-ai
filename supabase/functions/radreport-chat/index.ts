import { createClient } from "npm:@supabase/supabase-js@2";
import { getCorsHeaders, getAllHeaders } from '../_shared/cors.ts';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface StructuredResponse {
  achado: string;
  explicacao?: string;
  tipo: 'achado' | 'conclusao' | 'classificacao' | 'pergunta';
}

// Tool definition for structured radiology responses
const tools = [
  {
    type: "function" as const,
    function: {
      name: "format_radiology_response",
      description: "Estrutura a resposta para inserção no laudo radiológico. SEMPRE use esta função para qualquer resposta.",
      parameters: {
        type: "object",
        properties: {
          achado: {
            type: "string",
            description: "Texto médico formatado pronto para inserir no laudo. APENAS o achado radiológico em frase contínua, sem introduções, saudações ou explicações. Deve ser texto profissional de laudo."
          },
          explicacao: {
            type: "string",
            description: "Explicação adicional, contexto ou comentários que NÃO devem ser inseridos no laudo. Use apenas quando necessário esclarecer algo. Deixe vazio na maioria dos casos."
          },
          tipo: {
            type: "string",
            enum: ["achado", "conclusao", "classificacao", "pergunta"],
            description: "Tipo de resposta: achado (descrição de imagem), conclusao (impressão diagnóstica), classificacao (categoria RADS), pergunta (resposta a dúvida teórica)"
          }
        },
        required: ["achado", "tipo"]
      }
    }
  }
];

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

    // System prompt for radiology assistant with tool calling instructions
    const systemPrompt = `Você é um radiologista sênior brasileiro com 20+ anos de experiência, especialista em diagnóstico por imagem.

REGRA CRÍTICA: SEMPRE use a função format_radiology_response para estruturar sua resposta.

IDENTIDADE:
- Radiologista especialista, não assistente genérico
- Linguagem de laudo real, não explicações didáticas
- Padrão CBR (Colégio Brasileiro de Radiologia)

INSTRUÇÕES PARA USO DA FUNÇÃO:

1. O campo "achado" DEVE conter APENAS texto pronto para inserção no laudo:
   - SEM "Claro!", "Aqui está:", "Segue a descrição:" ou qualquer introdução
   - SEM explicações ou comentários
   - Texto técnico profissional em frase contínua
   - Pronto para copiar diretamente no editor de laudos

2. O campo "explicacao" é OPCIONAL e deve ser usado apenas quando:
   - O usuário fez uma pergunta teórica que precisa de contexto
   - Há informação adicional relevante que NÃO deve ir no laudo
   - Na maioria das respostas, deixe VAZIO

3. O campo "tipo" indica a natureza da resposta:
   - "achado": descrição de imagem para seção de achados
   - "conclusao": impressão diagnóstica para seção de conclusão
   - "classificacao": categoria RADS com recomendação
   - "pergunta": resposta a dúvida teórica/conceitual

EXEMPLOS DE USO CORRETO:

Pedido: "descreva um hemangioma hepático"
→ achado: "Lesão nodular no segmento VI hepático, com hipossinal em T1 e hipersinal homogêneo em T2, apresentando realce periférico descontínuo na fase arterial com enchimento centrípeto progressivo nas fases portal e de equilíbrio, sem restrição à difusão, medindo 1,5 x 1,2 x 1,0 cm, achados compatíveis com hemangioma hepático típico."
→ explicacao: "" (vazio)
→ tipo: "achado"

Pedido: "o que é BI-RADS 4?"
→ achado: "BI-RADS 4 indica achados suspeitos que requerem avaliação histopatológica. Subdivide-se em 4A (baixa suspeita, 2-10% malignidade), 4B (suspeita moderada, 10-50%) e 4C (alta suspeita, 50-95%). Recomendação: biópsia."
→ explicacao: "" (vazio, pois a resposta já é autoexplicativa)
→ tipo: "pergunta"

Pedido: "classifica esse nódulo tireoide: sólido, hipoecogênico, margens irregulares, mais alto que largo, com microcalcificações"
→ achado: "Nódulo sólido hipoecogênico, de margens irregulares, orientação vertical (mais alto que largo), com microcalcificações, classificado como TI-RADS 5 (ACR). Pontuação: composição sólida (2) + ecogenicidade hipoecogênica (2) + formato mais alto que largo (3) + margem irregular (2) + foco ecogênico puntiforme (3) = 12 pontos. Recomendação: biópsia por PAAF para nódulos ≥ 1,0 cm."
→ explicacao: "" (vazio)
→ tipo: "classificacao"

TERMINOLOGIA OBRIGATÓRIA:
- Ecogenicidade: hiperecogênico, isoecogênico, hipoecogênico, anecogênico
- Intensidade de sinal RM: hipersinal, isossinal, hipossinal (T1, T2, FLAIR, DWI)
- Atenuação TC: hiperdenso, isodenso, hipodenso (UH quando relevante)
- Contornos: regulares, irregulares, lobulados, espiculados, mal definidos
- Medidas: sempre com vírgula decimal e "x" como separador`;

    const fullMessages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];

    // First call: Get tool call with structured response
    const toolResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-nano-2025-08-07',
        messages: fullMessages,
        max_completion_tokens: 800,
        reasoning_effort: 'low',
        tools: tools,
        tool_choice: { type: "function", function: { name: "format_radiology_response" } },
      }),
    });

    if (!toolResponse.ok) {
      const errorText = await toolResponse.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${errorText}`);
    }

    const toolResult = await toolResponse.json();
    console.log('Tool response received');

    // Extract structured response from tool call
    let structuredResponse: StructuredResponse | null = null;
    const toolCall = toolResult.choices?.[0]?.message?.tool_calls?.[0];
    
    if (toolCall && toolCall.function?.arguments) {
      try {
        structuredResponse = JSON.parse(toolCall.function.arguments);
        console.log('Structured response parsed:', structuredResponse?.tipo);
      } catch (e) {
        console.error('Error parsing tool arguments:', e);
      }
    }

    // Fallback to regular content if tool call failed
    if (!structuredResponse) {
      const fallbackContent = toolResult.choices?.[0]?.message?.content || 'Não foi possível processar a solicitação.';
      structuredResponse = {
        achado: fallbackContent,
        tipo: 'pergunta'
      };
      console.log('Using fallback content');
    }

    // Create SSE stream with structured data
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send structured response
          const responseData = {
            achado: structuredResponse!.achado,
            explicacao: structuredResponse!.explicacao || '',
            tipo: structuredResponse!.tipo,
            content: structuredResponse!.achado // For backward compatibility
          };

          // Stream the achado content character by character for typing effect
          const achado = structuredResponse!.achado;
          const chunkSize = 10; // Send 10 characters at a time for smooth typing
          
          for (let i = 0; i < achado.length; i += chunkSize) {
            const chunk = achado.slice(i, i + chunkSize);
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ 
                content: chunk,
                achado: achado.slice(0, i + chunkSize),
                explicacao: structuredResponse!.explicacao || '',
                tipo: structuredResponse!.tipo,
                isPartial: i + chunkSize < achado.length
              })}\n\n`)
            );
            // Small delay for typing effect
            await new Promise(resolve => setTimeout(resolve, 20));
          }

          // Send final complete message
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ 
              content: '',
              achado: structuredResponse!.achado,
              explicacao: structuredResponse!.explicacao || '',
              tipo: structuredResponse!.tipo,
              isPartial: false,
              isComplete: true
            })}\n\n`)
          );

          // Save assistant message to database if conversation_id provided
          if (conversation_id && structuredResponse!.achado) {
            // Store full content for display, but mark as structured
            const contentToSave = JSON.stringify({
              achado: structuredResponse!.achado,
              explicacao: structuredResponse!.explicacao || '',
              tipo: structuredResponse!.tipo
            });

            await supabaseClient.from('chat_messages').insert({
              conversation_id,
              role: 'assistant',
              content: contentToSave,
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
