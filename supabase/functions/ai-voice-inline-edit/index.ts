import { createClient } from "npm:@supabase/supabase-js@2";
import { getCorsHeaders, getAllHeaders } from '../_shared/cors.ts'
import { AI_CREDIT_COSTS, checkAICredits, consumeAICredits, insufficientCreditsResponse } from '../_shared/aiCredits.ts'

const FEATURE_NAME = 'ai-voice-inline-edit';
const CREDITS_REQUIRED = AI_CREDIT_COSTS[FEATURE_NAME];

Deno.serve(async (req: Request) => {
  const corsHeaders = getCorsHeaders(req);
  
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders })
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: { ...getAllHeaders(req), "Content-Type": "application/json" } })

  // JWT Validation
  const authHeader = req.headers.get('authorization');
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
      status: 401, 
      headers: { ...getAllHeaders(req), "Content-Type": "application/json" }
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
      headers: { ...getAllHeaders(req), "Content-Type": "application/json" }
    });
  }

  // Create admin client for RPC call
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  // ========== CREDIT CHECK ==========
  const creditCheck = await checkAICredits(supabaseAdmin, user.id, CREDITS_REQUIRED);
  if (!creditCheck.hasCredits) {
    console.log(`[${FEATURE_NAME}] Insufficient credits: ${creditCheck.balance}/${CREDITS_REQUIRED}`);
    return insufficientCreditsResponse(corsHeaders, creditCheck.balance, CREDITS_REQUIRED);
  }

  try {
    const { voiceText, selectedField, currentSectionText, user_id } = await req.json()

    if (!voiceText || !selectedField) {
      return new Response(
        JSON.stringify({ error: "Campos obrigatórios: voiceText, selectedField" }),
        { status: 400, headers: corsHeaders }
      )
    }

    // Build AI request via RPC (prompts and API key from database/Vault)
    const { data: config, error: rpcError } = await supabaseAdmin.rpc('build_ai_request', {
      fn_name: FEATURE_NAME,
      user_data: {
        voice_text: voiceText,
        selected_field: selectedField,
        current_section_text: currentSectionText || ""
      }
    });

    if (rpcError || !config) {
      console.error('RPC build_ai_request error:', rpcError);
      return new Response(
        JSON.stringify({ error: 'Falha ao construir requisição AI', details: rpcError?.message }),
        { status: 500, headers: { ...getAllHeaders(req), "Content-Type": "application/json" } }
      );
    }

    console.log('AI Voice Inline Edit - calling API:', config.api_url);

    // Call AI API with config from RPC
    const response = await fetch(config.api_url, {
      method: "POST",
      headers: config.headers,
      body: JSON.stringify(config.body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: 'Erro na API AI', details: errorText }),
        { status: response.status, headers: { ...getAllHeaders(req), "Content-Type": "application/json" } }
      );
    }

    const completion = await response.json()
    const content = completion.choices?.[0]?.message?.content || ""
    const parsed = JSON.parse(content || "{}")

    // ========== CONSUME CREDITS AFTER SUCCESS ==========
    const consumeResult = await consumeAICredits(supabaseAdmin, user.id, CREDITS_REQUIRED, FEATURE_NAME, 'Edição por voz AI');
    console.log(`[${FEATURE_NAME}] Credits consumed:`, consumeResult);

    // Log to ai_voice_logs
    await supabaseAdmin.from("ai_voice_logs").insert({
      user_id: user.id,
      action: "voice-inline-edit",
      raw_voice: String(voiceText),
      field: String(parsed.field || selectedField),
      replacement: String(parsed.replacement || ""),
      created_at: new Date().toISOString(),
    })

    return new Response(JSON.stringify({ ...parsed, credits_remaining: consumeResult.balanceAfter }), {
      status: 200,
      headers: { ...getAllHeaders(req), "Content-Type": "application/json" },
    })
  } catch (err) {
    console.error("ai/voice-inline-edit error:", err)
    return new Response(JSON.stringify({ error: "Erro interno", details: String((err as any)?.message || err) }), {
      status: 500,
      headers: { ...getAllHeaders(req), "Content-Type": "application/json" },
    })
  }
})