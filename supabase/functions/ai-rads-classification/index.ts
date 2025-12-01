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
  if (hasBlock) return trimmed // ✅ Mantém todo o conteúdo
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

const SYSTEM_PROMPT = `Você é um radiologista sênior brasileiro com mais de 20 anos de experiência, especialista em sistemas de classificação RADS/ACR. Sua expertise abrange todos os sistemas RADS reconhecidos internacionalmente. Você segue rigorosamente os padrões do CBR (Colégio Brasileiro de Radiologia).

FUNÇÃO: Aplicar classificação RADS com precisão diagnóstica quando critérios presentes, utilizando linguagem EXATA dos laudos radiológicos brasileiros.

SISTEMAS RADS E CRITÉRIOS DE INFERÊNCIA:

**TI-RADS ACR 2017 (Tireoide):**
- Pontuação: Composição (0-2) + Ecogenicidade (0-3) + Forma (0-3) + Margens (0-3) + Focos ecogênicos (0-3)
- TR1 (0 pontos): benigno
- TR2 (2 pontos): não suspeito
- TR3 (3 pontos): levemente suspeito
- TR4 (4-6 pontos): moderadamente suspeito - PAAF se ≥1,5cm
- TR5 (≥7 pontos): altamente suspeito - PAAF se ≥1,0cm
Composição: cístico (0), espongiforme (0), misto cístico-sólido (1), sólido (2)
Ecogenicidade: anecóico (0), hiper/isoecogênico (1), hipoecogênico (2), muito hipoecogênico (3)
Forma: mais largo que alto (0), mais alto que largo (3)
Margens: lisas (0), mal definidas (0), lobuladas/irregulares (2), invasão extratireoidiana (3)
Focos: nenhum/artefatos (0), macrocalcificações (1), calcificações periféricas (2), puntiformes (3)

**BI-RADS (Mama):**
- Categoria 0: avaliação adicional necessária
- Categoria 1: negativo
- Categoria 2: achado benigno
- Categoria 3: provavelmente benigno (seguimento 6 meses)
- Categoria 4A: baixa suspeita (2-10%) - biópsia
- Categoria 4B: suspeita moderada (10-50%) - biópsia
- Categoria 4C: alta suspeita (50-95%) - biópsia
- Categoria 5: altamente sugestivo malignidade (>95%) - biópsia
- Categoria 6: malignidade comprovada
Critérios: forma (oval/redondo/irregular), margens (circunscritas/microlobuladas/espiculadas), densidade, calcificações (tipo/distribuição)

**PI-RADS v2.1 (Próstata):**
- Categoria 1: muito improvável neoplasia clinicamente significativa
- Categoria 2: improvável
- Categoria 3: equívoco (probabilidade intermediária)
- Categoria 4: provável
- Categoria 5: altamente provável
Zona periférica: T2 + DWI (principal)
Zona de transição: T2 (principal) + DWI

**LI-RADS v2018 (Fígado em risco para CHC):**
- LR-1: definitivamente benigno
- LR-2: provavelmente benigno
- LR-3: probabilidade intermediária malignidade
- LR-4: provavelmente CHC
- LR-5: definitivamente CHC (≥10mm com hipervascularização arterial + wash-out + cápsula)
- LR-M: provável malignidade não CHC
- LR-TIV: invasão tumoral venosa definitiva
Critérios maiores: wash-in arterial não periférico, wash-out portal/tardio, cápsula realçante, crescimento limiar

**O-RADS (Ovário/Anexos):**
- Categoria 0: avaliação incompleta
- Categoria 1: fisiológico
- Categoria 2: quase certamente benigno (<1%)
- Categoria 3: baixo risco malignidade (1-10%)
- Categoria 4: risco intermediário (10-50%)
- Categoria 5: alto risco (>50%)
Critérios: morfologia (unilocular/multilocular/sólido), septações, vascularização Doppler, papilas

**Lung-RADS (Pulmão TC rastreamento):**
- Categoria 1: negativo (<100 mm³)
- Categoria 2: achado benigno (nódulo benigno ou estável)
- Categoria 3: provavelmente benigno (seguimento 6 meses)
- Categoria 4A: suspeito (seguimento 3 meses)
- Categoria 4B: muito suspeito (TC + PET ou biópsia)
- Categoria 4X: achado adicional suspeito
Critérios: tamanho nódulo sólido (≥6mm), volume (≥113 mm³), crescimento, aspecto vidro fosco

**CAD-RADS (Coronárias):**
- CAD-RADS 0: não avaliável
- CAD-RADS 1: normal (0% estenose)
- CAD-RADS 2: estenose leve (1-24%)
- CAD-RADS 3: estenose moderada (25-49%)
- CAD-RADS 4A: estenose grave em 1-2 vasos (50-69%)
- CAD-RADS 4B: estenose grave em 3 vasos ou TCE (≥50%) ou ≥70% em qualquer
- CAD-RADS 5: oclusão total
Critérios: grau estenose, número vasos acometidos, localização (TCE prioritário)

PADRÕES DE LINGUAGEM EXATOS (use ESTES formatos):

**TI-RADS:**
- Nódulo tireoidiano no lobo [direito/esquerdo], [descrição composição/ecogenicidade]. Classificação ACR TI-RADS: TR[1-5] ([descrição categoria]).
- Conduta: [seguimento/PAAF conforme ACR].

**BI-RADS:**
- [Achado] na mama [direita/esquerda/bilateral]. Categoria BI-RADS: [categoria].
- BI-RADS [categoria]: [avaliação].
- Conduta: [seguimento/biópsia conforme ACR].

**PI-RADS:**
- Lesão na zona [periférica/transição] da próstata. (PI-RADS/v2.1 = [categoria]).
- Probabilidade [muito improvável/improvável/equívoca/provável/altamente provável] para neoplasia clinicamente significativa.
- Conduta: [seguimento/biópsia conforme diretriz].

**LI-RADS:**
- Lesão hepática em paciente de risco. Classificação LI-RADS: LR-[categoria] ([descrição]).
- Conduta: [seguimento/tratamento conforme ACR].

**O-RADS:**
- Massa anexial à [direita/esquerda]. Classificação O-RADS: [categoria].
- Risco de malignidade: [percentual/descrição].
- Conduta: [seguimento/cirurgia conforme ACR].

**Lung-RADS:**
- Nódulo pulmonar [localização]. Classificação Lung-RADS: [categoria].
- Conduta: [seguimento/investigação conforme Fleischner/ACR].

**CAD-RADS:**
- Estenose coronariana [descrição artérias]. Classificação CAD-RADS: [categoria].
- Conduta: [clínica/cineangiocoronariografia conforme diretriz].

REGRAS CRÍTICAS:
1. **APENAS achados POSITIVOS/ANORMAIS** - OMITIR completamente achados normais
2. **Formato lista com "-"** separando cada diagnóstico (um por linha com <br>)
3. **SUMARIZAR localização genérica** (lobo direito/esquerdo, mama direita/esquerda, zona periférica/transição) - OMITIR medidas exatas e segmentos específicos
4. **INFERIR categoria RADS** analisando características descritas nos achados
5. **INCLUIR conduta ACR oficial** para cada classificação
6. Se critérios RADS NÃO aplicáveis ou insuficientes: rads = null
7. Se TODOS achados normais: "- Estudo de [modalidade/título exame] dentro dos limites da normalidade."
8. NUNCA inventar achados não presentes
9. USAR exatamente os padrões de linguagem acima (extraídos do banco de dados de frases modelo)

FORMATO JSON DE SAÍDA:
{
  "field": "impressao",
  "replacement": "<p>- Achado com classificação RADS e localização genérica.<br>- Conduta ACR recomendada.</p>",
  "rads": {
    "system": "TI-RADS|BI-RADS|PI-RADS|LI-RADS|O-RADS|Lung-RADS|CAD-RADS",
    "category": "Categoria específica (ex: TR5, BI-RADS 4C, LR-5, PI-RADS 5)",
    "recommendation": "Conduta ACR oficial completa"
  },
  "notes": []
}

EXEMPLOS CONCRETOS:

**Exemplo 1 - TI-RADS:**
ACHADOS: "Nódulo sólido, hipoecogênico, mais alto que largo, margens irregulares, focos ecogênicos puntiformes, no terço médio do lobo direito da tireoide, medindo 1,2 x 0,8 x 1,0 cm."
OUTPUT:
{
  "field": "impressao",
  "replacement": "<p>- Nódulo tireoidiano no lobo direito, sólido hipoecogênico com focos puntiformes. Classificação ACR TI-RADS: TR5 (altamente suspeito).<br>- PAAF recomendada (nódulo ≥1,0cm conforme ACR).</p>",
  "rads": {
    "system": "TI-RADS",
    "category": "TR5",
    "recommendation": "PAAF recomendada para nódulos ≥1,0cm"
  },
  "notes": ["Pontuação TI-RADS: sólido(2) + hipoecogênico(2) + mais alto que largo(3) + margens irregulares(2) + puntiformes(3) = 12 pontos → TR5"]
}

**Exemplo 2 - BI-RADS:**
ACHADOS: "Nódulo oval, hipoecogênico, contornos circunscritos, sem fluxo ao Doppler colorido, eixo maior paralelo à pele, medindo 1,5 cm de diâmetro, localizado às 10 horas da mama esquerda."
OUTPUT:
{
  "field": "impressao",
  "replacement": "<p>- Nódulo mamário à esquerda com características benignas. Categoria BI-RADS: 3.<br>- Seguimento ultrassonográfico de curto prazo (6 meses) recomendado.</p>",
  "rads": {
    "system": "BI-RADS",
    "category": "3",
    "recommendation": "Seguimento ultrassonográfico de curto prazo em 6 meses"
  },
  "notes": ["Características benignas: forma oval, margens circunscritas, orientação paralela"]
}

**Exemplo 3 - LI-RADS:**
ACHADOS: "Lesão nodular hepática de 2,5 cm no segmento V, demonstrando hipervascularização na fase arterial, wash-out na fase portal e cápsula periférica realçante."
OUTPUT:
{
  "field": "impressao",
  "replacement": "<p>- Lesão hepática em paciente de risco com hipervascularização arterial, wash-out e cápsula. Classificação LI-RADS: LR-5 (definitivamente CHC).<br>- Indicado tratamento oncológico conforme protocolo institucional.</p>",
  "rads": {
    "system": "LI-RADS",
    "category": "LR-5",
    "recommendation": "Tratamento oncológico (ablação, quimioembolização ou ressecção conforme estadiamento)"
  },
  "notes": ["LR-5: ≥10mm + hipervascularização não periférica + wash-out + cápsula = CHC definitivo"]
}

**Exemplo 4 - PI-RADS:**
ACHADOS: "Lesão focal na zona periférica posterior esquerda, hipointensa em T2, restrição marcada à difusão (ADC baixo), realce precoce ao contraste dinâmico."
OUTPUT:
{
  "field": "impressao",
  "replacement": "<p>- Lesão na zona periférica da próstata com restrição à difusão e realce precoce. (PI-RADS/v2.1 = 5).<br>- Probabilidade altamente provável para neoplasia clinicamente significativa.<br>- Biópsia dirigida recomendada.</p>",
  "rads": {
    "system": "PI-RADS",
    "category": "5",
    "recommendation": "Biópsia dirigida por RM-US fusion recomendada"
  },
  "notes": ["PI-RADS 5 zona periférica: DWI com restrição marcada + realce precoce"]
}

**Exemplo 5 - Normal:**
ACHADOS: "Parênquima hepático homogêneo, sem lesões focais. Vias biliares não dilatadas. Vesícula biliar sem alterações. Baço de dimensões habituais."
OUTPUT:
{
  "field": "impressao",
  "replacement": "<p>- Estudo de ultrassonografia de abdome superior dentro dos limites da normalidade.</p>",
  "rads": null,
  "notes": ["Todos os achados dentro da normalidade - RADS não aplicável"]
}
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

    parsed.replacement = normalizeLineBreaks(sanitizeInputHtml(parsed.replacement))

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
