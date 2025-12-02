import { createClient } from "npm:@supabase/supabase-js@2";
import { getCorsHeaders, getAllHeaders } from '../_shared/cors.ts';

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

    console.log('📝 Correção de ditado:', {
      user_id,
      text_length: text.length,
      text_preview: text.substring(0, 100)
    });

    // ========== RPC: Buscar configuração do banco ==========
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: config, error: rpcError } = await supabaseAdmin.rpc('build_ai_request', {
      fn_name: 'ai-dictation-polish',
      user_data: { text }
    });

    if (rpcError || !config) {
      console.error('❌ Erro RPC build_ai_request:', rpcError);
      return new Response(
        JSON.stringify({ error: 'Erro ao carregar configuração AI' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('✅ Config RPC carregada:', {
      api_url: config.api_url,
      model: config.body?.model,
      max_tokens: config.body?.max_completion_tokens
    });

    // ========== Chamada API com config do RPC ==========
    const response = await fetch(config.api_url, {
      method: 'POST',
      headers: config.headers,
      body: JSON.stringify(config.body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro API AI:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: 'Erro ao processar correção' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('📊 AI response completo:', JSON.stringify(data, null, 2));
    
    // Extrair com optional chaining e fallback
    const correctedText = data.choices?.[0]?.message?.content ?? "";
    const finishReason = data.choices?.[0]?.finish_reason ?? "unknown";
    
    console.log('📊 Finish reason:', finishReason);
    console.log('📊 Content length:', correctedText.length);

    // Validar se content está vazio
    if (!correctedText || correctedText.trim().length === 0) {
      console.warn('⚠️ AI retornou texto vazio, usando original como fallback');
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
      if (user_id) {
        await supabaseAdmin.from('ai_voice_logs').insert({
          user_id,
          action: 'dictation-polish',
          raw_voice: text.substring(0, 500),
          replacement: correctedText.substring(0, 500),
          field: 'dictation',
          created_at: new Date().toISOString(),
        });
      }
    } catch (logError) {
      console.error('⚠️ Erro ao logar no banco:', logError);
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
