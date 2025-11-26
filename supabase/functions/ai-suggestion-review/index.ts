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

const systemPrompt = `
Você é um revisor profissional de laudos radiológicos.
Sua tarefa é melhorar o laudo sem alterar achados, diagnósticos ou conteúdo clínico.

⚕ REGRAS:
- Retornar somente HTML (sem Markdown).
- Não inventar achados, medidas ou diagnósticos.
- Padronizar estilo, coerência e clareza radiológica.
- Corrigir redundâncias, gramática e consistência.
- Preservar spans, strong, em e estilos inline.
- Não inserir classes, IDs extras ou novos blocos desnecessários.

Formato da resposta:
<section id="improved">… laudo revisado …</section>
<section id="notes">… comentários objetivos (3–6 itens) …</section>
`.trim()

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders })
  if (req.method !== "POST")
    return new Response("Method Not Allowed", { status: 405, headers: corsHeaders })

  const apiKey = Deno.env.get("OPENAI_API_KEY") || Deno.env.get("OPENAI_KEY") || ""
  if (!apiKey) return new Response("OPENAI KEY missing", { status: 500, headers: corsHeaders })

  try {
    const { fullReport, userId } = await req.json()
    const text = String(fullReport || "").slice(0, 20000)

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Laudo completo para revisão:\n"""${text}"""` },
        ],
      }),
    })

    const completion = await response.json()
    const raw = completion.choices?.[0]?.message?.content || ""
    const cleaned = sanitizeFragment(raw)
    const headers = { ...corsHeaders, "Content-Type": "text/html" }

    // SUPABASE LOG — sucesso (opcional)
    const supabaseUrl = Deno.env.get("SUPABASE_URL")
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
    if (supabaseUrl && supabaseServiceKey && userId) {
      const sb = createClient(supabaseUrl, supabaseServiceKey)
      await sb.from("ai_review_log").insert({
        user_id: userId,
        size: text.length,
        response_size: cleaned.length,
        status: "ok",
        model: "gpt-4o-mini",
      })
    }

    return new Response(cleaned, { status: 200, headers })
  } catch (err) {
    console.error("Error reviewing report:", err)
    
    // SUPABASE LOG — erro
    const supabaseUrl = Deno.env.get("SUPABASE_URL")
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
    const { userId } = await req.json().catch(() => ({}))
    if (supabaseUrl && supabaseServiceKey && userId) {
      const sb = createClient(supabaseUrl, supabaseServiceKey)
      await sb.from("ai_review_log").insert({
        user_id: userId,
        size: 0,
        status: "error",
        metadata: { message: String((err as any)?.message || err) },
        model: "gpt-4o-mini",
      })
    }

    return new Response("Erro ao revisar laudo", { status: 500, headers: corsHeaders })
  }
})
