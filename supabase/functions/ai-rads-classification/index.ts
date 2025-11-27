import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const OPENAI_KEY = Deno.env.get("OPENAI_API_KEY") ?? ""

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-client-info, apikey, x-requested-with",
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

const SYSTEM_PROMPT = `Você é médico radiologista especialista em sistemas de classificação RADS (American College of Radiology).

FUNÇÃO: Aplicar classificação RADS apropriada aos achados descritos quando critérios estiverem presentes.

═══════════════════════════════════════════════════════════════════
SISTEMAS RADS E CRITÉRIOS ESPECÍFICOS
═══════════════════════════════════════════════════════════════════

📋 BI-RADS (Mama - ACR 5ª edição 2013):
┌─────────────────────────────────────────────────────────────────┐
│ 0: Incompleto - avaliação adicional e/ou comparação com exames  │
│ 1: Negativo - mamas simétricas, sem massas/distorções/calcif.   │
│ 2: Achado benigno - fibroadenoma calcificado, cistos, linfonodos│
│ 3: Provavelmente benigno (<2% malignidade) - nódulo circunscrito│
│ 4A: Baixa suspeita (2-10%) - nódulo palpável circunscrito       │
│ 4B: Suspeita intermediária (10-50%) - parcialmente definido     │
│ 4C: Alta suspeita (50-95%) - margens irregulares, calcif.pleomór│
│ 5: Altamente sugestivo (>95%) - massa espiculada                │
│ 6: Malignidade comprovada por biópsia                           │
└─────────────────────────────────────────────────────────────────┘

📋 TI-RADS ACR 2017 (Tireoide - pontuação por características):
┌─────────────────────────────────────────────────────────────────┐
│ COMPOSIÇÃO: Cístico/espongiforme(0), Misto(1), Sólido(2)        │
│ ECOGENICIDADE: Anecóico(0), Hiper/iso(1), Hipo(2), M.hipo(3)   │
│ FORMA: Mais largo(0), Mais alto que largo(3)                    │
│ MARGENS: Lisas(0), Mal definidas(0), Lobuladas(2), Invasão(3)  │
│ FOCOS: Nenhum(0), Macrocalcif.(1), Periférico(2), Puntiforme(3)│
│                                                                  │
│ TR1 (0 pts): Benigno                                            │
│ TR2 (2 pts): Não suspeito                                       │
│ TR3 (3 pts): Levemente suspeito                                 │
│ TR4 (4-6 pts): Moderadamente suspeito - PAAF se ≥1,0-1,5 cm    │
│ TR5 (≥7 pts): Altamente suspeito - PAAF se ≥1,0 cm             │
└─────────────────────────────────────────────────────────────────┘

📋 PI-RADS v2.1 (Próstata - RM multiparamétrica):
┌─────────────────────────────────────────────────────────────────┐
│ 1: Muito baixa probabilidade câncer clinicamente significativo  │
│ 2: Baixa probabilidade                                          │
│ 3: Probabilidade intermediária (equívoca)                       │
│ 4: Alta probabilidade - considerar biópsia dirigida             │
│ 5: Muito alta probabilidade - biópsia altamente recomendada     │
│                                                                  │
│ Sequências dominantes: DWI (zona periférica), T2 (zona trans.)  │
└─────────────────────────────────────────────────────────────────┘

📋 LI-RADS v2018 (Fígado - pacientes de risco para CHC):
┌─────────────────────────────────────────────────────────────────┐
│ LR-1: Definitivamente benigno (cisto simples, hemangioma)       │
│ LR-2: Provavelmente benigno                                     │
│ LR-3: Probabilidade intermediária de CHC                        │
│ LR-4: Provavelmente CHC                                         │
│ LR-5: Definitivamente CHC (wash-in arterial + wash-out portal/  │
│       tardio + cápsula OU crescimento limiar >50% em <6 meses)  │
│ LR-M: Provavelmente/definitivamente maligno, NÃO CHC            │
│ LR-TIV: Trombose tumoral em veia                                │
└─────────────────────────────────────────────────────────────────┘

📋 O-RADS (Anexos ovarianos - US):
┌─────────────────────────────────────────────────────────────────┐
│ 1: Fisiológico/normal (ausência de anexos ou cistos simples)    │
│ 2: Quase certamente benigno (<1% malignidade)                   │
│ 3: Baixo risco (1-10%)                                          │
│ 4: Risco intermediário (10-50%) - avaliar RM/TC se necessário   │
│ 5: Alto risco (>50%) - encaminhamento oncológico recomendado    │
└─────────────────────────────────────────────────────────────────┘

📋 Outros RADS:
- Lung-RADS (nódulos pulmonares em TC de rastreamento)
- C-RADS (colonografia por TC)
- NI-RADS (pescoço pós-tratamento câncer cabeça/pescoço)
- CAD-RADS (coronárias em angioTC)
- VI-RADS (vesical - bexiga em RM)

═══════════════════════════════════════════════════════════════════
REGRAS DE CLASSIFICAÇÃO
═══════════════════════════════════════════════════════════════════

1. Identificar modalidade de imagem e órgão/estrutura dos achados
2. Selecionar sistema RADS correspondente
3. Aplicar critérios específicos do sistema escolhido
4. Justificar categoria com base nos critérios objetivos descritos
5. Incluir recomendação de conduta conforme protocolo ACR da categoria
6. Se achados NORMAIS ou sem critérios RADS aplicáveis: retornar rads = null

═══════════════════════════════════════════════════════════════════
FORMATO DE SAÍDA JSON
═══════════════════════════════════════════════════════════════════

{
  "field": "impressao",
  "replacement": "<p>Impressão diagnóstica incluindo classificação RADS e conduta recomendada...</p>",
  "rads": {
    "system": "BI-RADS|TI-RADS|PI-RADS|LI-RADS|O-RADS|VI-RADS|Lung-RADS|C-RADS|NI-RADS|CAD-RADS",
    "category": "Categoria específica do sistema (ex: BI-RADS 4A, TI-RADS TR5, PI-RADS 4, LR-5)",
    "score": número_da_pontuação_se_aplicável,
    "justification": "Critérios objetivos que embasam a classificação (ex: margens irregulares, calcificações pleomórficas, realce heterogêneo)",
    "recommendation": "Conduta recomendada conforme protocolo ACR (ex: biópsia, seguimento em 6 meses, correlação clínica)"
  },
  "notes": []
}

Se não houver critérios para classificação RADS, retornar:
{
  "field": "impressao",
  "replacement": "<p>Impressão diagnóstica geral...</p>",
  "rads": null,
  "notes": []
}

═══════════════════════════════════════════════════════════════════
EXEMPLOS DE ESTILO RADIOLÓGICO
═══════════════════════════════════════════════════════════════════

Exemplo 1 (BI-RADS):
"Nódulo irregular de margens espiculadas no quadrante súpero-externo da mama direita medindo 1,8 cm, associado a microcalcificações pleomórficas agrupadas. Classificação BI-RADS 5. Recomenda-se biópsia."

Exemplo 2 (TI-RADS):
"Nódulo sólido hipoecogênico no lobo direito da tireoide, medindo 1,4 cm, com margens irregulares, mais alto que largo, e múltiplas calcificações puntiformes. Pontuação TI-RADS: 2+2+3+0+3 = 10 pontos (TR5). Classificação TI-RADS 5. Altamente suspeito. Recomenda-se punção aspirativa por agulha fina (PAAF) para análise citológica."

Exemplo 3 (LI-RADS):
"Nódulo hepático no segmento VII medindo 2,3 cm, com realce arterial intenso e wash-out na fase portal, apresentando cápsula periférica realçante. Classificação LI-RADS LR-5 (definitivamente carcinoma hepatocelular). Recomenda-se estadiamento oncológico e avaliação para tratamento."
`.trim()

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders })
  if (req.method !== "POST") return new Response(JSON.stringify({ error: "Method Not Allowed" }), { status: 405, headers: corsHeaders })

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
    return new Response(JSON.stringify(emptyResp), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } })
  }

  const paragraphs = splitHtmlIntoParagraphs(findingsHtml)
  const paragraphsText = paragraphs.map((p, i) => `PAR_${i + 1}:\n${p}`).join("\n\n")
  const userPrompt = `Modality: ${modality}\nExam: ${examTitle ?? "não informado"}\n\nAchados:\n${paragraphsText}\n\nRetorne JSON.`

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-5-nano-2025-08-07",
        max_completion_tokens: 500,
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
