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

// Tool definition for structured radiology responses (structural schema, kept in code)
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

    // Initialize Supabase client for user operations
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

    // Create admin client for RPC call
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Build AI request via RPC (prompts and API key from database/Vault)
    const { data: config, error: rpcError } = await supabaseAdmin.rpc('build_ai_request', {
      fn_name: 'radreport-chat',
      user_data: {
        messages: messages
      }
    });

    if (rpcError || !config) {
      console.error('RPC build_ai_request error:', rpcError);
      throw new Error(`Falha ao construir requisição AI: ${rpcError?.message}`);
    }

    console.log('RPC config received, calling API:', config.api_url);

    // Merge tools into config body (tools are structural schema, not prompt content)
    const finalBody = {
      ...config.body,
      tools: tools,
      tool_choice: { type: "function", function: { name: "format_radiology_response" } }
    };

    // Call AI API with config from RPC + tools
    const toolResponse = await fetch(config.api_url, {
      method: 'POST',
      headers: config.headers,
      body: JSON.stringify(finalBody),
    });

    if (!toolResponse.ok) {
      const errorText = await toolResponse.text();
      console.error('AI API error:', toolResponse.status, errorText);
      throw new Error(`AI API error: ${errorText}`);
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
