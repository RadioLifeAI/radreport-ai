import { createClient } from "npm:@supabase/supabase-js@2";
import { getCorsHeaders, getAllHeaders } from '../_shared/cors.ts'

// ============= HTML Sanitization Utilities =============
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
  const byDoubleNewline = html.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean)
  if (byDoubleNewline.length > 1) return byDoubleNewline.map((s) => `<p>${s}</p>`)
  return [`<p>${html.trim()}</p>`]
}

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

  // Service role client for RPC and logging
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  )

  let body: any
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), { status: 400, headers: corsHeaders })
  }

  const rawFindings = String(body.findingsHtml || "").slice(0, 8000)
  const examTitle = body.examTitle ? String(body.examTitle).trim() : null
  const user_id = user.id
  const modality = (body.modality ?? "unspecified").toString()

  const findingsHtml = sanitizeInputHtml(rawFindings)
  const paragraphs = splitHtmlIntoParagraphs(findingsHtml)
  const paragraphsText = paragraphs.map((p, i) => `PAR_${i + 1}:\n${p}`).join("\n\n")

  console.log("Processing conclusion, modality:", modality, "input length:", findingsHtml.length)

  try {
    // Build AI request via RPC (gets prompt, model, API key from database)
    const { data: config, error: rpcError } = await supabase.rpc('build_ai_request', {
      fn_name: 'ai-generate-conclusion',
      user_data: {
        findings: paragraphsText,
        modality: modality,
        exam_title: examTitle ?? "não informado"
      }
    });

    if (rpcError || !config) {
      console.error("RPC build_ai_request error:", rpcError);
      throw new Error(`RPC error: ${rpcError?.message || 'No config returned'}`);
    }

    console.log("RPC config received, calling AI API...");

    // Call AI API with config from RPC
    const response = await fetch(config.api_url, {
      method: "POST",
      headers: config.headers,
      body: JSON.stringify(config.body),
    });

    if (!response.ok) {
      const errorText = await response.text()
      console.error("AI API error:", response.status, errorText)
      throw new Error(`AI API error: ${response.status}`)
    }

    const completion = await response.json()
    const raw = completion.choices?.[0]?.message?.content ?? ""
    const finishReason = completion.choices?.[0]?.finish_reason

    console.log("AI response length:", raw.length, "finish_reason:", finishReason)

    // Parse JSON response
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

    console.log("JSON parsed successfully:", !!parsed)

    // Fallback if JSON parsing fails
    if (!parsed) {
      const notes: string[] = []
      const alteredParagraphs: string[] = []
      const abnormalKeywords = [
        "espess", "massa", "cisto", "lesão", "nódulo", "hematoma", "realce", "estenose",
        "obstru", "edema", "derrame", "tromb", "aneurisma", "calcificação", "irregular",
      ]
      paragraphs.forEach((p, idx) => {
        const text = p.replace(/<[^>]*>/g, "").toLowerCase()
        const matched = abnormalKeywords.some((k) => text.includes(k))
        if (matched) {
          notes.push(`Parágrafo ${idx + 1}: ALTERADO - ${text.slice(0, 120)}...`)
          alteredParagraphs.push(text)
        } else {
          notes.push(`Parágrafo ${idx + 1}: NORMAL`)
        }
      })

      let replacement = ""
      if (alteredParagraphs.length === 0) {
        replacement = `<p>- Estudo de ${examTitle ?? modality} dentro dos limites da normalidade.</p>`
      } else {
        const concls = alteredParagraphs.map((t) => {
          const s = t.split(/[.;]/)[0]
          return `- ${s.charAt(0).toUpperCase() + s.slice(1)}`
        })
        replacement = `<p>${concls.join('<br>')}</p>`
      }

      parsed = { field: "impressao", replacement: wrapAsParagraph(replacement), notes }
    } else {
      parsed.field = parsed.field || "impressao"
      parsed.replacement = wrapAsParagraph(String(parsed.replacement || ""))
      if (!Array.isArray(parsed.notes)) parsed.notes = parsed.notes ? [String(parsed.notes)] : []
      const replacementText = parsed.replacement.replace(/<[^>]*>/g, "").trim().toLowerCase()
      if (replacementText.includes("dentro dos") && examTitle && !replacementText.includes(examTitle.toLowerCase())) {
        parsed.replacement = wrapAsParagraph(`<p>- Estudo de ${examTitle} dentro dos limites da normalidade.</p>`)
      }
    }

    parsed.replacement = normalizeLineBreaks(sanitizeInputHtml(parsed.replacement))

    console.log("Final replacement length:", parsed.replacement.length)

    // Log to database
    try {
      await supabase.from("ai_conclusion_logs").insert({
        user_id,
        modality,
        input_size: findingsHtml.length,
        output_size: String(parsed.replacement).length,
        raw_model_output: raw,
        status: "ok",
        created_at: new Date().toISOString(),
      })
    } catch (err) {
      console.error("Error logging to Supabase:", err)
    }

    return new Response(JSON.stringify(parsed), { status: 200, headers: { ...getAllHeaders(req), "Content-Type": "application/json" } })
  } catch (err: any) {
    console.error("Error generating conclusion:", err)
    
    try {
      await supabase.from("ai_conclusion_logs").insert({
        user_id,
        modality,
        input_size: findingsHtml.length,
        output_size: 0,
        raw_model_output: String(err?.message || err),
        status: "error",
        created_at: new Date().toISOString(),
      })
    } catch {}

    return new Response(JSON.stringify({ error: "Erro interno ao gerar conclusão" }), { status: 500, headers: { ...getAllHeaders(req), "Content-Type": "application/json" } })
  }
})
