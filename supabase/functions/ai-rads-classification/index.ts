import { createClient } from "npm:@supabase/supabase-js@2";
import { getCorsHeaders, getAllHeaders } from '../_shared/cors.ts'

const OPENAI_KEY = Deno.env.get("OPENAI_API_KEY") ?? ""

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

const SYSTEM_PROMPT = `Radiologista especialista em sistemas RADS (ACR).

FUNÇÃO: Aplicar classificação RADS quando critérios presentes.

SISTEMAS RADS:
- BI-RADS (mama): 0-6 baseado em forma, margens, densidade, calcificações
- TI-RADS ACR (tireoide): TR1-TR5 por pontuação (composição, ecogenicidade, forma, margens, focos)
- PI-RADS (próstata RM): 1-5 baseado em DWI/T2
- LI-RADS (fígado risco CHC): LR-1 a LR-5, LR-M, LR-TIV (wash-in/wash-out)
- O-RADS (ovário US): 1-5 por características morfológicas
- Lung-RADS (pulmão TC): nódulos pulmonares
- CAD-RADS (coronárias angioTC): estenose coronariana

REGRAS:
1. **APENAS achados POSITIVOS/ANORMAIS** - OMITIR normais
2. **Formato lista "-"** um diagnóstico por linha
3. **SUMARIZAR**: omitir medidas, usar localização genérica (lobo direito/esquerdo)
4. **INFERIR RADS** analisando características:
   - Mama: margens espiculadas, calcificações pleomórficas → BI-RADS 4C/5
   - Tireoide: sólido hipoecogênico + mais alto que largo + puntiformes → TI-RADS 5
   - Fígado: wash-in arterial + wash-out → LI-RADS 4/5
5. Se critérios RADS NÃO aplicáveis: rads = null
6. Se TODOS normais: "- Estudo de [MODALIDADE] dentro dos limites da normalidade."
7. NÃO inventar achados

JSON:
{
  "field": "impressao",
  "replacement": "<p>- Diagnóstico com classificação RADS<br>- Conduta recomendada</p>",
  "rads": {
    "system": "BI-RADS|TI-RADS|PI-RADS|LI-RADS|O-RADS",
    "category": "Categoria (ex: 4C, TR5, LR-5)",
    "recommendation": "Conduta ACR"
  },
  "notes": []
}

EXEMPLO:
ACHADOS: "Nódulo sólido hipoecogênico no lobo direito da tireoide, mais alto que largo, margens irregulares, calcificações puntiformes."
IMPRESSÃO: "<p>- Nódulo tireoidiano no lobo direito, TI-RADS 5 (altamente suspeito)<br>- Recomenda-se PAAF</p>"
`.trim()

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
    return new Response(JSON.stringify(emptyResp), { status: 200, headers: { ...getAllHeaders(req), "Content-Type": "application/json" } })
  }

  const paragraphs = splitHtmlIntoParagraphs(findingsHtml)
  const paragraphsText = paragraphs.map((p, i) => `PAR_${i + 1}:\n${p}`).join("\n\n")
  const userPrompt = `Modalidade: ${modality}
Título do Exame: ${examTitle ?? "não informado"}

=== ACHADOS DO LAUDO (para análise) ===
${paragraphsText}
=== FIM DOS ACHADOS ===

TAREFA: Aplicar classificação RADS se critérios aplicáveis estiverem presentes nos achados acima.
NÃO repita os achados - SINTETIZE em impressão diagnóstica com classificação.

Retorne JSON no formato especificado.`

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-5-nano-2025-08-07",
        max_completion_tokens: 2000,
        reasoning_effort: 'low',
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("OpenAI API error:", response.status, errorText)
      throw new Error(`OpenAI error: ${response.status}`)
    }

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

    return new Response(JSON.stringify(parsed), { status: 200, headers: { ...getAllHeaders(req), "Content-Type": "application/json" } })
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

    return new Response(JSON.stringify({ error: "Erro interno ao gerar RADS" }), { status: 500, headers: { ...getAllHeaders(req), "Content-Type": "application/json" } })
  }
})
