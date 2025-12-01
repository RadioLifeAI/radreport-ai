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

const systemPrompt = `Revisor de qualidade de laudos radiológicos brasileiros (CBR).

# Tarefa
Revisão checkpoint: identificar inconsistências e corrigir. Não reescrever.

# Regras
- Métodos de imagem por extenso (nunca abreviar)
- Corrigir termos anatômicos/radiológicos incorretos
- Medidas: vírgula decimal, 1 casa, "x" como separador
- Classificações RADS completas com conduta ACR
- Detectar {{variáveis}} não preenchidas
- Preservar HTML

# Impressão = Diagnóstico Categórico
PADRÕES (usar um por achado):
a) "[Achado]." → Cisto hepático.
b) "Sinais de [condição]." → Sinais de hepatopatia crônica.
c) "[Estrutura] sugestivo de [diagnóstico]." → Nódulo hepático sugestivo de hemangioma.
d) "[Achado]. Considerar [ddx]. Sugere-se [exame]." → Lesão hepática indeterminada. Considerar metástase, HNF, hemangioma atípico. Sugere-se ressonância magnética.
e) "[Nome]: variante anatômica."

FORMATO: Lista com "-", um diagnóstico por linha
PROIBIDO: medidas, segmentos específicos, descrições técnicas, achados normais
Se normal: "- Estudo dentro dos limites da normalidade."

# Output Format
SEMPRE retornar ambas seções, mesmo se laudo estiver correto:
<section id="improved">[Laudo corrigido OU original em HTML]</section>
<section id="notes">[Lista com "-" do que foi corrigido OU "- Laudo sem alterações necessárias."]</section>

# Examples
ANTES: "Nódulo hipoecogenico medindo 1.5 cm. IMPRESSÃO: Nódulo no segmento VI medindo 1,5 cm."
DEPOIS: "Nódulo hipoecogênico medindo 1,5 cm. IMPRESSÃO: - Nódulo hepático sugestivo de hemangioma."

ANTES: "Vesícula ausente. Fígado normal. IMPRESSÃO: Vesícula ausente. Fígado sem alterações."
DEPOIS: "Vesícula ausente. Fígado normal. IMPRESSÃO: - Sinais de colecistectomia."

ANTES: "Lesão heterogênea hepática. IMPRESSÃO: Lesão indeterminada, correlacionar com TC."
DEPOIS: "Lesão heterogênea hepática. IMPRESSÃO: - Lesão hepática indeterminada. Considerar metástase, HNF, hemangioma atípico. Sugere-se tomografia computadorizada."

# Notes
- Não inventar achados
- Não remover informações dos ACHADOS
- Se laudo correto: retornar laudo original nas seções`.trim()

Deno.serve(async (req: Request) => {
  const corsHeaders = getCorsHeaders(req);
  
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders })
  if (req.method !== "POST")
    return new Response("Method Not Allowed", { status: 405, headers: { ...getAllHeaders(req), "Content-Type": "application/json" } })

  const apiKey = Deno.env.get("OPENAI_API_KEY") || Deno.env.get("OPENAI_KEY") || ""
  if (!apiKey) return new Response("OPENAI KEY missing", { status: 500, headers: { ...getAllHeaders(req), "Content-Type": "application/json" } })

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

  let body: { full_report?: string; user_id?: string } = {}
  
  try {
    body = await req.json()
    const text = String(body.full_report || "").slice(0, 8000)

    console.log("Processing report, input length:", text.length)

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
    
    // Logging para debug
    console.log("OpenAI raw response length:", raw.length)
    
    // Extrair seções
    const improvedMatch = cleaned.match(/<section[^>]*id=["']improved["'][^>]*>([\s\S]*?)<\/section>/i)
    const notesMatch = cleaned.match(/<section[^>]*id=["']notes["'][^>]*>([\s\S]*?)<\/section>/i)
    
    console.log("Improved match found:", !!improvedMatch)
    console.log("Notes match found:", !!notesMatch)
    
    // Fallback: se raw tem conteúdo mas regex falhou, usar texto original
    const improved = improvedMatch ? improvedMatch[1].trim() : (raw.length > 50 ? text : '')
    const notes = notesMatch ? notesMatch[1] : (raw.length > 50 ? '- Não foi possível processar a revisão.' : '')

    console.log("Final improved length:", improved.length)

    // SUPABASE LOG — sucesso
    const supabaseUrl = Deno.env.get("SUPABASE_URL")
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
    if (supabaseUrl && supabaseServiceKey && body.user_id) {
      const sb = createClient(supabaseUrl, supabaseServiceKey)
      await sb.from("ai_review_log").insert({
        user_id: body.user_id,
        size: text.length,
        response_size: improved.length,
        status: "ok",
        model: "gpt-5-nano",
      })
    }

    return new Response(JSON.stringify({ improved, notes, status: "ok" }), { 
      status: 200, 
      headers: { ...getAllHeaders(req), "Content-Type": "application/json" } 
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

    return new Response("Erro ao revisar laudo", { status: 500, headers: { ...getAllHeaders(req), "Content-Type": "application/json" } })
  }
})
