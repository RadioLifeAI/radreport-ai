import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-client-info, apikey, x-requested-with",
}

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

const systemPrompt = `Revisor de laudos radiológicos.
REGRAS: Retornar HTML. Não inventar achados. Padronizar estilo/gramática. Preservar spans/strong/em.
RESPOSTA:
<section id="improved">laudo revisado</section>
<section id="notes">3-6 comentários objetivos</section>`.trim()

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders })
  if (req.method !== "POST")
    return new Response("Method Not Allowed", { status: 405, headers: corsHeaders })

  const apiKey = Deno.env.get("OPENAI_API_KEY") || Deno.env.get("OPENAI_KEY") || ""
  if (!apiKey) return new Response("OPENAI KEY missing", { status: 500, headers: corsHeaders })

  let body: { full_report?: string; user_id?: string } = {}
  
  try {
    body = await req.json()
    const text = String(body.full_report || "").slice(0, 8000)

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-5-nano-2025-08-07",
        max_completion_tokens: 2000,
        reasoning_effort: 'low',
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Laudo completo para revisão:\n"""${text}"""` },
        ],
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("OpenAI API error:", response.status, errorText)
      throw new Error(`OpenAI error: ${response.status}`)
    }

    const completion = await response.json()
    const raw = completion.choices?.[0]?.message?.content || ""
    const cleaned = sanitizeFragment(raw)
    
    // Extrair seções
    const improvedMatch = cleaned.match(/<section[^>]*id=["']improved["'][^>]*>([\s\S]*?)<\/section>/i)
    const notesMatch = cleaned.match(/<section[^>]*id=["']notes["'][^>]*>([\s\S]*?)<\/section>/i)
    const improved = improvedMatch ? improvedMatch[1] : ''
    const notes = notesMatch ? notesMatch[1] : ''

    // SUPABASE LOG — sucesso
    const supabaseUrl = Deno.env.get("SUPABASE_URL")
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
    if (supabaseUrl && supabaseServiceKey && body.user_id) {
      const sb = createClient(supabaseUrl, supabaseServiceKey)
      await sb.from("ai_review_log").insert({
        user_id: body.user_id,
        size: text.length,
        response_size: cleaned.length,
        status: "ok",
        model: "gpt-5-nano",
      })
    }

    return new Response(JSON.stringify({ improved, notes, status: "ok" }), { 
      status: 200, 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    })
  } catch (err) {
    console.error("Error reviewing report:", err)
    
    // SUPABASE LOG — erro
    const supabaseUrl = Deno.env.get("SUPABASE_URL")
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
    if (supabaseUrl && supabaseServiceKey && body.user_id) {
      const sb = createClient(supabaseUrl, supabaseServiceKey)
      await sb.from("ai_review_log").insert({
        user_id: body.user_id,
        size: 0,
        status: "error",
        metadata: { message: String((err as any)?.message || err) },
        model: "gpt-5-nano",
      })
    }

    return new Response("Erro ao revisar laudo", { status: 500, headers: corsHeaders })
  }
})
