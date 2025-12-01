import { createClient } from "npm:@supabase/supabase-js@2";
import { getCorsHeaders, getAllHeaders } from '../_shared/cors.ts'

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

function ensureSectionTag(section: string | undefined, html: string): string {
  const sec = (section || "").toLowerCase()
  let frag = html.trim()

  const hasBlock = /<(p|h[1-6]|ul|ol|li|blockquote|pre|table)\b/i.test(frag)
  if (!hasBlock) frag = `<p>${frag}</p>`

  if (sec === "titulo") {
    const inner = frag.replace(/^<p>|<\/p>$/g, "")
    return `<h2>${inner}</h2>`
  }

  if (sec === "impressao" || sec === "conclusao") {
    const p = frag.match(/<p[\s\S]*?<\/p>/i)
    if (p) return p[0]
    return `<p>${frag}</p>`
  }

  return frag
}

Deno.serve(async (req: Request) => {
  const corsHeaders = getCorsHeaders(req);
  
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders })
  if (req.method !== "POST")
    return new Response("Method Not Allowed", { status: 405, headers: { ...getAllHeaders(req), "Content-Type": "application/json" } })

  const apiKey = Deno.env.get("OPENAI_API_KEY") || Deno.env.get("OPENAI_KEY") || ""
  if (!apiKey)
    return new Response("OPENAI key missing", { status: 500, headers: { ...getAllHeaders(req), "Content-Type": "application/json" } })

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

  try {
    const { userRequest, selection, fullDocument, userId, section } = await req.json()

    const sec = (section || "").toLowerCase()
    let selectionHtml = selection && String(selection).trim().length > 0 ? String(selection) : String(fullDocument || "")
    if (!selectionHtml) selectionHtml = ""
    if (selectionHtml.length > 5000) selectionHtml = selectionHtml.slice(0, 5000)

    /* -------- Regras por seção -------- */
    const sectionRules =
      sec === "titulo"
        ? `Seção: TÍTULO — manter frase curta, objetiva, sem adornos.`
        : sec === "tecnica"
        ? `Seção: TÉCNICA — descrever técnica de aquisição de forma padronizada.`
        : sec === "achados"
        ? `Seção: ACHADOS — formular achados radiológicos estruturados, claros e objetivos.`
        : sec === "impressao" || sec === "conclusao"
        ? `Seção: IMPRESSÃO — retornar diagnóstico ou síntese final em parágrafo único.`
        : `Seção não especificada — apenas retornar HTML válido.`

    const systemPrompt = `
Você é um editor profissional de laudos radiológicos integrado ao editor Tiptap.

⚕ ESPECIALIZAÇÃO:
- RM, TC, US, RX, Mamografia, Angio, Elastografia
- Classificações: ORADS, BI-RADS, PI-RADS, TI-RADS, Lung-RADS, Bosniak
- Processa comandos telegráficos como:
  "cisto ovario esq 3cm orads2",
  "nódulo 12mm segmento 6 hepático realçar tardio",
  "aneurisma aorta abdominal 3.2cm",
  "lesão expansiva frontal direita edema perilesional".

🧠 FUNÇÃO:
- Interpretar o comando do usuário e transformar em um achado radiológico formal.
- Preencher automaticamente termos técnicos, padronizados e objetivos.
- Manter apenas a SEMÂNTICA pedida — sem inventar doença ou gravidade.

📌 REGRAS ABSOLUTAS:
- Modificar SOMENTE o trecho selecionado (ou fullDocument se não houver seleção).
- Retornar SOMENTE HTML (sem Markdown).
- Preservar spans, bold, italic, classes, estilos existentes.
- Não adicionar IDs, classes ou atributos.
- Não criar <html>, <body>, <script>, <style>, <iframe> etc.
- Não explicar, não comentar, não adicionar texto fora do bloco.
- Caso o comando seja insuficiente, completar seguindo boas práticas da radiologia.

${sectionRules}

🧪 EXEMPLOS INTERNOS:
"cisto ovario esq 3cm orads2" →
<p>Cisto ovariano simples à esquerda, medindo cerca de 3,0 cm, sem septações ou componentes sólidos. ORADS 2.</p>

"aneurisma aorta 3.2cm" →
<p>Aneurisma fusiforme da aorta abdominal com diâmetro máximo de 3,2 cm.</p>

"nódulo hepático 11mm arterial hipervascular tardio iso" →
<p>Nódulo hepático de 11 mm, hipervascular na fase arterial e isointenso nas fases venosa e tardia, sem características de agressividade.</p>
`

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-5-nano-2025-08-07",
        max_completion_tokens: 1500,
        reasoning_effort: 'low',
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `Comando do usuário:\n"""${String(userRequest || "")}"""\n\nTrecho selecionado:\n"""${selectionHtml}"""`,
          },
        ],
      }),
    })

    const completion = await response.json()
    const raw = completion.choices?.[0]?.message?.content || ""
    let html = ensureSectionTag(sec, raw)
    html = sanitizeFragment(html)
    const headers = { ...getAllHeaders(req), "Content-Type": "text/html" }

    // LOG SUPABASE (opcional)
    const supabaseUrl = Deno.env.get("SUPABASE_URL")
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
    if (supabaseUrl && supabaseServiceKey && userId) {
      const sb = createClient(supabaseUrl, supabaseServiceKey)
      await sb.from("ai_inline_edits_log").insert({
        user_id: userId,
        command: String(userRequest || ""),
        selection_size: selectionHtml.length,
        response_size: html.length,
        status: "ok",
        metadata: { section: sec },
      })
    }

    return new Response(html, { headers })
  } catch (err) {
    console.error("Error processing inline edit:", err)
    
    // LOG SUPABASE ERRO
    const supabaseUrl = Deno.env.get("SUPABASE_URL")
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
    const { userId, userRequest, section } = await req.json().catch(() => ({}))
    if (supabaseUrl && supabaseServiceKey && userId) {
      const sb = createClient(supabaseUrl, supabaseServiceKey)
      await sb.from("ai_inline_edits_log").insert({
        user_id: userId,
        command: String(userRequest || ""),
        status: "error",
        metadata: { section, message: String((err as any)?.message || err) },
      })
    }
    return new Response("Erro ao processar edição", { status: 500, headers: { ...getAllHeaders(req), "Content-Type": "application/json" } })
  }
})
