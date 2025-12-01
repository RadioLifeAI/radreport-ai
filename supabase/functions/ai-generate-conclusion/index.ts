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
  const trimmed = (html || "").trim()
  if (!trimmed) return "<p></p>"
  const hasBlock = /<(p|h[1-6]|ul|ol|li|blockquote|pre|table)\b/i.test(trimmed)
  if (hasBlock) {
    const m = trimmed.match(/<p[\s\S]*?<\/p>/i)
    if (m) return m[0]
    return trimmed
  }
  return `<p>${trimmed}</p>`
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

const SYSTEM_PROMPT = `Você é um radiologista sênior brasileiro com 20+ anos de experiência.
Sua função é gerar IMPRESSÃO DIAGNÓSTICA com linguagem de laudo profissional padrão CBR.

IDENTIDADE:
- Radiologista especialista, não assistente genérico
- Linguagem técnica pura de conclusão de laudo
- Padrão CBR (Colégio Brasileiro de Radiologia)

REGRAS ABSOLUTAS:

1. **APENAS achados POSITIVOS/ANORMAIS** - OMITIR completamente achados normais/negativos
2. **Formato lista "-"** - Um diagnóstico por linha, cada item iniciando com "-"
3. **SEM MEDIDAS** - Nunca incluir dimensões na conclusão
4. **SEM SEGMENTOS ESPECÍFICOS** - Usar apenas "lobo direito/esquerdo" ou localização genérica
5. Se TODOS normais: "- Estudo de [MODALIDADE] dentro dos limites da normalidade."

PADRÕES DE LINGUAGEM (usar conforme o achado):

- **Diagnóstico definitivo**: "- [Nome direto]."
  Exemplo: "- Cisto hepático simples."
  
- **Achado indireto/pós-operatório**: "- Sinais de [procedimento]."
  Exemplo: "- Sinais de nefrectomia total à direita."
  Exemplo: "- Sinais de colecistectomia."
  
- **Achado sugestivo com alta probabilidade**: "- [Achado] sugestivo(s) de [diagnóstico]."
  Exemplo: "- Nódulo hepático sugestivo de hemangioma."
  Exemplo: "- Nódulos pulmonares sugestivos de processo granulomatoso."

- **Achado com diagnóstico diferencial**: "- [Achado]. Considerar possibilidade de [diagnóstico]."
  Exemplo: "- Coleção hepática. Considerar possibilidade de abscesso."
  
- **Achado indeterminado**: "- [Achado], indeterminado. A critério clínico, [método] poderá trazer informações adicionais."
  Exemplo: "- Nódulo hepático, indeterminado. A critério clínico, a TC ou RM poderá trazer informações adicionais."
  
- **Variante anatômica**: "- [Nome]: variante anatômica."
  Exemplo: "- Lobo de Riedel: variante anatômica."
  
- **Com recomendação de complementar**: "- [Achado]. Conveniente complementar com [método]."
  Exemplo: "- Massa hepática. Conveniente complementar com TC."

INFERÊNCIA DIAGNÓSTICA (analisar características para concluir):
- Hipoecogênico, homogêneo, margens regulares, sem fluxo → "sugestivo de hemangioma"
- Hiperecogênico com sombra acústica posterior → "sugestivo de calcificação"
- Anecóide, paredes finas, regulares → "cisto simples"
- Cístico-espesso, paredes irregulares, debris → "Considerar possibilidade de abscesso"
- Ausência de órgão → nomear cirurgia prévia ("Sinais de colecistectomia", "Sinais de nefrectomia")

PROIBIÇÕES:
- NÃO repetir descrição dos achados
- NÃO incluir medidas ou dimensões
- NÃO mencionar segmentos hepáticos específicos (I a VIII)
- NÃO usar linguagem explicativa ou didática
- NÃO inventar achados não descritos

FORMATO DE SAÍDA:
JSON: {"field":"impressao","replacement":"<p>- Diagnóstico 1.<br>- Diagnóstico 2.</p>","notes":[]}

EXEMPLOS DE CONCLUSÕES CORRETAS:

ACHADOS: "Nódulo hipoecogênico 1,5cm segmento VI, homogêneo, sem fluxo. Vesícula biliar ausente."
IMPRESSÃO: "<p>- Nódulo no lobo hepático direito, sugestivo de hemangioma.<br>- Sinais de colecistectomia.</p>"

ACHADOS: "Rim direito não visualizado em topografia habitual. Rim esquerdo vicariante."
IMPRESSÃO: "<p>- Sinais de nefrectomia à direita.</p>"

ACHADOS: "Coleção no lobo hepático direito, paredes espessas irregulares, debris internos, 5,2cm. Pequena quantidade de líquido livre em pelve."
IMPRESSÃO: "<p>- Coleção hepática. Considerar possibilidade de abscesso hepático.<br>- Pequena quantidade de líquido livre na pelve.</p>"

ACHADOS: "Múltiplas imagens nodulares hiperecogênicas hepáticas, a maior 2,3cm no segmento IV. Fígado de dimensões aumentadas."
IMPRESSÃO: "<p>- Hepatomegalia.<br>- Múltiplos nódulos hepáticos sugestivos de hemangiomas.</p>"

ACHADOS: "Linfonodos levemente aumentados no mesentério periumbilical, até 1,2cm. Apêndice não caracterizado."
IMPRESSÃO: "<p>- Linfonodos intraperitoneais levemente aumentados. Considerar possibilidade de adenite mesentérica.</p>"
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
  const user_id = body.user_id ?? null
  const modality = (body.modality ?? "unspecified").toString()
  const format = (body.format ?? "telegraphic").toString()

  const findingsHtml = sanitizeInputHtml(rawFindings)
  const paragraphs = splitHtmlIntoParagraphs(findingsHtml)
  const paragraphsText = paragraphs.map((p, i) => `PAR_${i + 1}:\n${p}`).join("\n\n")

  const userPrompt = `Modalidade: ${modality}
Formato: ${format}
Título do Exame: ${examTitle ?? "não informado"}

=== ACHADOS DO LAUDO (para análise) ===
${paragraphsText}
=== FIM DOS ACHADOS ===

TAREFA: Gerar IMPRESSÃO DIAGNÓSTICA sintetizando APENAS os achados positivos/relevantes acima.
NÃO repita os achados - SINTETIZE em diagnósticos concisos.

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
        replacement = `<p>Estudo de ${examTitle ?? "exame"} dentro dos padrões da normalidade.</p>`
      } else {
        const concls = alteredParagraphs.map((t) => {
          const s = t.split(/[.;]/)[0]
          return s.charAt(0).toUpperCase() + s.slice(1)
        })
        replacement = `<p>${concls.join('; ')}.</p>`
      }

      parsed = { field: "impressao", replacement: wrapAsParagraph(replacement), notes }
    } else {
      parsed.field = parsed.field || "impressao"
      parsed.replacement = wrapAsParagraph(String(parsed.replacement || ""))
      if (!Array.isArray(parsed.notes)) parsed.notes = parsed.notes ? [String(parsed.notes)] : []
      const replacementText = parsed.replacement.replace(/<[^>]*>/g, "").trim().toLowerCase()
      if (replacementText.includes("dentro dos padrões") && examTitle && !replacementText.includes(examTitle.toLowerCase())) {
        parsed.replacement = wrapAsParagraph(`<p>Estudo de ${examTitle} dentro dos padrões da normalidade.</p>`)
      }
    }

    parsed.replacement = sanitizeInputHtml(parsed.replacement)

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
