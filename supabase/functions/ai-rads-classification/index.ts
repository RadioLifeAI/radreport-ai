import { createClient } from "npm:@supabase/supabase-js@2";
import { getCorsHeaders, getAllHeaders } from '../_shared/cors.ts'
import { AI_CREDIT_COSTS, checkAICredits, consumeAICredits, insufficientCreditsResponse } from '../_shared/aiCredits.ts'

// ============= Utility Functions (preserved) =============

function sanitizeInputHtml(html: string): string {
  if (!html) return ""
  let out = String(html)
  out = out.replace(/<\/?(script|style|iframe|meta|head|html|body)[^>]*>/gi, "")
  out = out.replace(/\son[a-zA-Z]+\s*=\s*"[^"]*"/gi, "")
  out = out.replace(/\son[a-zA-Z]+\s*=\s*'[^']*'/gi, "")
  out = out.replace(/(href|src)\s*=\s*"(javascript:[^"]*)"/gi, '$1="#"')
  out = out.replace(/(href|src)\s*=\s*'(javascript:[^']*)'/gi, "$1='#'")
  return out.trim()
}

function wrapAsParagraph(html: string): string {
  const trimmed = (html || "").trim()
  if (!trimmed) return "<p></p>"
  const hasBlock = /<(p|h[1-6]|ul|ol|li|blockquote|pre|table)\b/i.test(trimmed)
  if (hasBlock) return trimmed
  return `<p>${trimmed}</p>`
}

function normalizeLineBreaks(html: string): string {
  return html.replace(/<br\s*\/?>/gi, '<br/>')
}

function splitHtmlIntoParagraphs(html: string): string[] {
  const ps = Array.from(html.matchAll(/<p[^>]*>[\s\S]*?<\/p>/gi)).map((m) => m[0].trim())
  if (ps.length > 0) return ps
  const byBr = html.split(/<br\s*\/?\s*>/i).map((s) => s.trim()).filter(Boolean)
  if (byBr.length > 1) return byBr.map((s) => `<p>${s}</p>`)
  const byDouble = html.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean)
  if (byDouble.length > 1) return byDouble.map((s) => `<p>${s}</p>`)
  return [`<p>${html.trim()}</p>`]
}

const FEATURE_NAME = 'ai-rads-classification';
const CREDITS_REQUIRED = AI_CREDIT_COSTS[FEATURE_NAME];

// ============= Main Handler =============

Deno.serve(async (req: Request) => {
  const corsHeaders = getCorsHeaders(req);
  
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders })
  if (req.method !== "POST") return new Response(JSON.stringify({ error: "Method Not Allowed" }), { status: 405, headers: { ...getAllHeaders(req), "Content-Type": "application/json" } })

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

  // Service role client for logging
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  )

  // ========== CREDIT CHECK ==========
  const creditCheck = await checkAICredits(supabase, user.id, CREDITS_REQUIRED);
  if (!creditCheck.hasCredits) {
    console.log(`[${FEATURE_NAME}] Insufficient credits: ${creditCheck.balance}/${CREDITS_REQUIRED}`);
    return insufficientCreditsResponse(corsHeaders, creditCheck.balance, CREDITS_REQUIRED);
  }

  let body: any
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), { status: 400, headers: corsHeaders })
  }

  const rawFindings = String(body.findingsHtml || "").slice(0, 8000)
  const examTitle = body.examTitle ? String(body.examTitle).trim() : null
  const modality = (body.modality ?? "unspecified").toString()
  const user_id = user.id

  const findingsHtml = sanitizeInputHtml(rawFindings)
  if (!findingsHtml || findingsHtml.trim().length === 0) {
    const emptyResp = {
      field: "impressao",
      replacement: `<p>Estudo de ${examTitle ?? "exame"} dentro dos padrões da normalidade.</p>`,
      rads: null,
      notes: ["Entrada vazia ou insuficiente para classificação RADS."],
    }
    try {
      await supabase.from("ai_rads_logs").insert({
        user_id,
        modality,
        exam_title: examTitle,
        status: "insufficient_input",
        input_size: 0,
        output_size: JSON.stringify(emptyResp).length,
        created_at: new Date().toISOString(),
      })
    } catch {}
    return new Response(JSON.stringify(emptyResp), { status: 200, headers: { ...getAllHeaders(req), "Content-Type": "application/json" } })
  }

  const paragraphs = splitHtmlIntoParagraphs(findingsHtml)
  const paragraphsText = paragraphs.map((p, i) => `PAR_${i + 1}:\n${p}`).join("\n\n")

  try {
    // ============= RPC Call to get AI configuration =============
    console.log('[ai-rads-classification] Calling build_ai_request RPC...');
    
    const { data: config, error: rpcError } = await supabase.rpc('build_ai_request', {
      fn_name: FEATURE_NAME,
      user_data: {
        findings: paragraphsText,
        modality: modality,
        exam_title: examTitle ?? 'não informado'
      }
    });

    if (rpcError) {
      console.error('[ai-rads-classification] RPC error:', rpcError);
      throw new Error(`RPC error: ${rpcError.message}`);
    }

    if (!config || !config.api_url) {
      console.error('[ai-rads-classification] Invalid config from RPC:', config);
      throw new Error('Invalid configuration from RPC');
    }

    console.log('[ai-rads-classification] RPC config received, calling AI API...');
    console.log('[ai-rads-classification] Model:', config.body?.model);
    console.log('[ai-rads-classification] Max tokens:', config.body?.max_completion_tokens);

    // ============= AI API Call =============
    const response = await fetch(config.api_url, {
      method: "POST",
      headers: config.headers,
      body: JSON.stringify(config.body),
    });

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[ai-rads-classification] AI API error:", response.status, errorText)
      throw new Error(`AI API error: ${response.status}`)
    }

    const completion = await response.json()
    const raw = completion.choices?.[0]?.message?.content ?? ""
    
    console.log('[ai-rads-classification] Response received, finish_reason:', completion.choices?.[0]?.finish_reason);

    // ============= Response Parsing =============
    let parsed: any
    try {
      parsed = JSON.parse(raw)
    } catch {
      const jsonMatch = raw.match(/({[\s\S]*})/)
      if (jsonMatch) {
        try {
          parsed = JSON.parse(jsonMatch[1])
        } catch {
          parsed = null
        }
      }
    }

    // ============= Fallback Heuristic (preserved) =============
    if (!parsed) {
      console.log('[ai-rads-classification] JSON parsing failed, using fallback heuristic');
      const notes: string[] = []
      const alteredTexts: string[] = []
      const abnormalKeywords = [
        "nódulo", "massa", "cisto", "espicul", "microcalc", "hipervascular", "realce", "estenose",
        "tromb", "edema", "lesão", "infiltr", "derrame", "hemorrag", "aumento de volume", "redução de volume",
      ]
      paragraphs.forEach((p, idx) => {
        const text = p.replace(/<[^>]*>/g, "").toLowerCase()
        const matched = abnormalKeywords.some((k) => text.includes(k))
        if (matched) {
          notes.push(`Parágrafo ${idx + 1}: ALTERADO — ${text.slice(0, 140)}...`)
          alteredTexts.push(text)
        } else {
          notes.push(`Parágrafo ${idx + 1}: NORMAL`)
        }
      })

      let replacement = ""
      let rads = null
      if (alteredTexts.length === 0) {
        replacement = `<p>Estudo de ${examTitle ?? "exame"} dentro dos padrões da normalidade.</p>`
      } else {
        const sums = alteredTexts.map((t) => {
          const s = t.split(/[.;]/)[0]
          return s.charAt(0).toUpperCase() + s.slice(1)
        })
        replacement = `<p>${sums.slice(0, 3).join('; ')}.</p>`
        rads = null
        notes.unshift("RADS não atribuído: fallback heurístico (dados insuficientes).")
      }

      parsed = { field: "impressao", replacement: wrapAsParagraph(replacement), rads, notes }
    } else {
      // Normalize parsed response
      parsed.field = parsed.field || "impressao"
      parsed.replacement = wrapAsParagraph(String(parsed.replacement || ""))
      if (!("rads" in parsed)) parsed.rads = null
      if (!Array.isArray(parsed.notes)) parsed.notes = parsed.notes ? [String(parsed.notes)] : []
      
      // Fix examTitle in normal responses
      const repText = parsed.replacement.replace(/<[^>]*>/g, "").toLowerCase()
      if (repText.includes("dentro dos padrões") && examTitle && !repText.includes(examTitle.toLowerCase())) {
        parsed.replacement = wrapAsParagraph(`<p>Estudo de ${examTitle} dentro dos padrões da normalidade.</p>`)
      }
    }

    parsed.replacement = normalizeLineBreaks(sanitizeInputHtml(parsed.replacement))

    // ========== CONSUME CREDITS AFTER SUCCESS ==========
    const consumeResult = await consumeAICredits(supabase, user_id, CREDITS_REQUIRED, FEATURE_NAME, 'Classificação RADS AI');
    console.log(`[${FEATURE_NAME}] Credits consumed:`, consumeResult);

    // ============= Logging =============
    try {
      await supabase.from("ai_rads_logs").insert({
        user_id,
        modality,
        exam_title: examTitle,
        input_size: findingsHtml.length,
        output_size: String(parsed.replacement).length,
        raw_model_output: raw,
        status: "ok",
        created_at: new Date().toISOString(),
      })
    } catch (err) {
      console.error("[ai-rads-classification] Error logging to Supabase:", err)
    }

    return new Response(JSON.stringify({ ...parsed, credits_remaining: consumeResult.balanceAfter }), { status: 200, headers: { ...getAllHeaders(req), "Content-Type": "application/json" } })
  } catch (err: any) {
    console.error("[ai-rads-classification] Error:", err)
    
    try {
      await supabase.from("ai_rads_logs").insert({
        user_id,
        modality,
        exam_title: examTitle,
        input_size: findingsHtml.length,
        output_size: 0,
        raw_model_output: String(err?.message || err),
        status: "error",
        created_at: new Date().toISOString(),
      })
    } catch {}

    return new Response(JSON.stringify({ error: "Erro interno ao gerar RADS" }), { status: 500, headers: { ...getAllHeaders(req), "Content-Type": "application/json" } })
  }
})