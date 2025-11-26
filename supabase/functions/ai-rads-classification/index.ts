import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const OPENAI_KEY = Deno.env.get("OPENAI_API_KEY") ?? ""
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? ""
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

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
  const t = (html || "").trim()
  if (!t) return "<p></p>"
  const hasBlock = /<(p|h[1-6]|ul|ol|li|blockquote|pre|table)\b/i.test(t)
  if (hasBlock) {
    const m = t.match(/<p[\s\S]*?<\/p>/i)
    if (m) return m[0]
    return t
  }
  return `<p>${t}</p>`
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

const SYSTEM_PROMPT = `
Você é um radiologista experiente especializado em aplicar sistemas RADS (ex.: BI-RADS, TI-RADS, PI-RADS, LI-RADS, O-RADS, VI-RADS).
Entrada: seção "Achados" (findings) em HTML (ou texto). Recebe 'modality' e 'examTitle'.
Tarefa:
1) Analise parágrafo a parágrafo e classifique cada um como NORMAL ou ALTERADO.
2) Para parágrafos ALTERADOS, determine se aplicável um sistema RADS apropriado (p.ex. BI-RADS para mama, O-RADS para ovário, TI-RADS para tireoide, PI-RADS para próstata, LI-RADS para fígado, VI-RADS para bexiga).
3) Atribua CATEGORIA RADS apenas se houver critérios suficientes; caso contrário, informe insuficiência de dados.
4) Não invente medidas/lateralidade/realce.
5) Saída: APENAS JSON válido:
{
  "field": "impressao",
  "replacement": "<p>Conclusão clínica (1–3 frases).</p>",
  "rads": { "system": "BI-RADS", "category": "BI-RADS 2", "score": 2, "confidence": 0.85, "details": "opcional" } | null,
  "notes": ["Parágrafo 1: NORMAL", "Parágrafo 2: ALTERADO — …"]
}
Se NENHUM ALTERADO: replacement deve ser "Estudo de <EXAM_TITLE> dentro dos padrões da normalidade." (use examTitle se informado).
`

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders })
  if (req.method !== "POST") return new Response(JSON.stringify({ error: "Method Not Allowed" }), { status: 405, headers: corsHeaders })

  let body: any
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), { status: 400, headers: corsHeaders })
  }

  const rawFindings = String(body.findingsHtml || "").slice(0, 40000)
  const examTitle = body.examTitle ? String(body.examTitle).trim() : null
  const modality = (body.modality ?? "unspecified").toString()
  const user_id = body.user_id ?? null

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
    return new Response(JSON.stringify(emptyResp), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } })
  }

  const paragraphs = splitHtmlIntoParagraphs(findingsHtml)
  const paragraphsText = paragraphs.map((p, i) => `PAR_${i + 1}:\n${p}`).join("\n\n")
  const userPrompt = `Modality: ${modality}\nExam title: ${examTitle ?? "not provided"}\n\nAchados:\n${paragraphsText}\n\nClassifique e aplique RADS conforme critérios; retorne APENAS JSON conforme sistema.`

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        max_tokens: 500,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
      }),
    })

    const completion = await response.json()
    const raw = completion.choices?.[0]?.message?.content ?? ""

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

    if (!parsed) {
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
      parsed.field = parsed.field || "impressao"
      parsed.replacement = wrapAsParagraph(String(parsed.replacement || ""))
      if (!("rads" in parsed)) parsed.rads = null
      if (!Array.isArray(parsed.notes)) parsed.notes = parsed.notes ? [String(parsed.notes)] : []
      const repText = parsed.replacement.replace(/<[^>]*>/g, "").toLowerCase()
      if (repText.includes("dentro dos padrões") && examTitle && !repText.includes(examTitle.toLowerCase())) {
        parsed.replacement = wrapAsParagraph(`<p>Estudo de ${examTitle} dentro dos padrões da normalidade.</p>`)
      }
    }

    parsed.replacement = sanitizeInputHtml(parsed.replacement)

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
      console.error("Error logging to Supabase:", err)
    }

    return new Response(JSON.stringify(parsed), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } })
  } catch (err: any) {
    console.error("Error generating RADS:", err)
    
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

    return new Response(JSON.stringify({ error: "Erro interno ao gerar RADS" }), { status: 500, headers: corsHeaders })
  }
})
