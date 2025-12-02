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

    // Create admin client for RPC call
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Build AI request via RPC (gets prompt from database, API key from Vault)
    const { data: config, error: rpcError } = await supabaseAdmin.rpc('build_ai_request', {
      fn_name: 'ai-inline-edit',
      user_data: {
        user_request: String(userRequest || ""),
        selection: selectionHtml,
        section_rules: sectionRules
      }
    });

    if (rpcError || !config) {
      console.error('RPC build_ai_request error:', rpcError);
      throw new Error(`RPC error: ${rpcError?.message || 'No config returned'}`);
    }

    console.log('ai-inline-edit: RPC config received, calling AI API...');

    // Call AI API with config from RPC
    const response = await fetch(config.api_url, {
      method: "POST",
      headers: config.headers,
      body: JSON.stringify(config.body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const completion = await response.json()
    const raw = completion.choices?.[0]?.message?.content || ""
    let html = ensureSectionTag(sec, raw)
    html = sanitizeFragment(html)
    const headers = { ...getAllHeaders(req), "Content-Type": "text/html" }

    // LOG SUPABASE (success)
    if (userId) {
      await supabaseAdmin.from("ai_inline_edits_log").insert({
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
    
    // LOG SUPABASE ERROR
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    try {
      const bodyText = await req.clone().text();
      const { userId, userRequest, section } = JSON.parse(bodyText || '{}');
      if (userId) {
        await supabaseAdmin.from("ai_inline_edits_log").insert({
          user_id: userId,
          command: String(userRequest || ""),
          selection_size: 0,
          response_size: 0,
          status: "error",
          metadata: { section, message: String((err as any)?.message || err) },
        })
      }
    } catch (logErr) {
      console.error("Error logging to database:", logErr);
    }
    
    return new Response("Erro ao processar edição", { status: 500, headers: { ...getAllHeaders(req), "Content-Type": "application/json" } })
  }
})
