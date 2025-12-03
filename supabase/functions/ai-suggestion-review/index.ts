import { createClient } from "npm:@supabase/supabase-js@2";
import { getCorsHeaders, getAllHeaders } from '../_shared/cors.ts'
import { AI_CREDIT_COSTS, checkAICredits, consumeAICredits, insufficientCreditsResponse } from '../_shared/aiCredits.ts'

// Sanitização HTML específica (mantida)
function sanitizeFragment(html: string): string {
  let out = String(html || "")
  out = out.replace(/<\/?(html|head|body|script|style|iframe|meta)[^>]*>/gi, "")
  out = out.replace(/(href|src)\s*=\s*"(javascript:[^"]*)"/gi, '$1="#"')
  out = out.replace(/(href|src)\s*=\s*'(javascript:[^']*)'/gi, "$1='#'")
  out = out.replace(/\son[a-z]+\s*=\s*"[^"]*"/gi, "")
  out = out.replace(/\son[a-z]+\s*=\s*'[^']*'/gi, "")
  out = out.replace(/\son[a-z]+\s*=\s*[^\s>]+/gi, "")
  return out.trim()
}

const FEATURE_NAME = 'ai-suggestion-review';
const CREDITS_REQUIRED = AI_CREDIT_COSTS[FEATURE_NAME];

Deno.serve(async (req: Request) => {
  const corsHeaders = getCorsHeaders(req);
  
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders })
  if (req.method !== "POST")
    return new Response("Method Not Allowed", { status: 405, headers: { ...getAllHeaders(req), "Content-Type": "application/json" } })

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

  // Admin client for RPC calls
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

  let body: { full_report?: string; user_id?: string } = {}
  
  try {
    body = await req.json()
    const text = String(body.full_report || "").slice(0, 8000)

    console.log("[ai-suggestion-review] Processing report, input length:", text.length)

    // Chamar RPC para obter configuração completa
    const { data: aiConfig, error: configError } = await supabaseAdmin.rpc('build_ai_request', {
      fn_name: FEATURE_NAME,
      user_data: { full_report: text }
    });

    if (configError || !aiConfig) {
      console.error("[ai-suggestion-review] RPC error:", configError);
      throw new Error('Falha ao obter configuração AI');
    }

    console.log("[ai-suggestion-review] RPC config received, calling:", aiConfig.api_url);

    // Fetch usando config retornado pelo RPC
    const response = await fetch(aiConfig.api_url, {
      method: 'POST',
      headers: aiConfig.headers,
      body: JSON.stringify(aiConfig.body)
    });

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[ai-suggestion-review] AI API error:", response.status, errorText)
      throw new Error(`AI error: ${response.status}`)
    }

    const completion = await response.json()
    const raw = completion.choices?.[0]?.message?.content || ""
    const cleaned = sanitizeFragment(raw)
    
    console.log("[ai-suggestion-review] Response length:", raw.length)
    
    // Extrair seções
    const improvedMatch = cleaned.match(/<section[^>]*id=["']improved["'][^>]*>([\s\S]*?)<\/section>/i)
    const notesMatch = cleaned.match(/<section[^>]*id=["']notes["'][^>]*>([\s\S]*?)<\/section>/i)
    
    console.log("[ai-suggestion-review] Improved match:", !!improvedMatch, "Notes match:", !!notesMatch)
    
    // Fallback: se raw tem conteúdo mas regex falhou, usar texto original
    const improved = improvedMatch ? improvedMatch[1].trim() : (raw.length > 50 ? text : '')
    const notes = notesMatch ? notesMatch[1] : (raw.length > 50 ? '- Não foi possível processar a revisão.' : '')

    // ========== CONSUME CREDITS AFTER SUCCESS ==========
    const consumeResult = await consumeAICredits(supabaseAdmin, user.id, CREDITS_REQUIRED, FEATURE_NAME, 'Revisão de sugestões AI');
    console.log(`[${FEATURE_NAME}] Credits consumed:`, consumeResult);

    // Log sucesso
    await supabaseAdmin.from("ai_review_log").insert({
      user_id: user.id,
      size: text.length,
      response_size: improved.length,
      status: "ok",
      model: aiConfig.config?.model_name || "gpt-5-nano",
    })

    return new Response(JSON.stringify({ improved, notes, status: "ok", credits_remaining: consumeResult.balanceAfter }), { 
      status: 200, 
      headers: { ...getAllHeaders(req), "Content-Type": "application/json" } 
    })
  } catch (err) {
    console.error("[ai-suggestion-review] Error:", err)
    
    // Log erro
    await supabaseAdmin.from("ai_review_log").insert({
      user_id: user.id,
      size: 0,
      status: "error",
      metadata: { message: String((err as any)?.message || err) },
      model: "unknown",
    })

    return new Response(JSON.stringify({ error: "Erro ao revisar laudo" }), { 
      status: 500, 
      headers: { ...getAllHeaders(req), "Content-Type": "application/json" } 
    })
  }
})