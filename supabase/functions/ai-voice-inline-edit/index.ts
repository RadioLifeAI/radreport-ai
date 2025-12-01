import { createClient } from "npm:@supabase/supabase-js@2";
import { getCorsHeaders, getAllHeaders } from '../_shared/cors.ts'

Deno.serve(async (req: Request) => {
  const corsHeaders = getCorsHeaders(req);
  
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders })
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: { ...getAllHeaders(req), "Content-Type": "application/json" } })

  const apiKey = Deno.env.get("OPENAI_API_KEY") || ""
  if (!apiKey) return new Response(JSON.stringify({ error: "OPENAI_API_KEY not configured" }), { status: 500, headers: { ...getAllHeaders(req), "Content-Type": "application/json" } })

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
    const { voiceText, selectedField, currentSectionText, user_id } = await req.json()

    if (!voiceText || !selectedField) {
      return new Response(
        JSON.stringify({ error: "Campos obrigatórios: voiceText, selectedField, currentSectionText" }),
        { status: 400, headers: corsHeaders }
      )
    }

    const systemPrompt = `Você é um radiologista sênior altamente especializado.
Sua função: transformar comandos ditados em texto radiológico FORMATADO, ESPECÍFICO, OBJETIVO E SEM ALUCINAÇÃO.

Regras:
1) Edite apenas o CAMPO SELECIONADO informado.
2) Não altere outras partes do laudo.
3) Use terminologia padronizada (ESR, ACR, PI-RADS, BI-RADS, O-RADS, Fleischner).
4) Medidas no padrão "x.x x y.y x z.z cm" quando ditas.
5) Não invente achados; refine apenas o que foi dito.
6) Não conclua; descreva o achado.
7) Retorne APENAS JSON no formato:
{"field":"<nome do campo>","replacement":"<texto revisado para substituir no TipTap>"}`

    const userPrompt = `Texto ditado: "${String(voiceText)}"
Campo selecionado: ${String(selectedField)}
Texto atual do campo: "${String(currentSectionText || "")}"

Tarefa:
• Interpretar o comando de voz.
• Gerar revisão clara e técnica para substituir apenas este campo.
• Não inventar medidas, lateralidade, regiões ou graus não ditos.
• Retornar APENAS o JSON solicitado.`

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-5-nano-2025-08-07",
        max_completion_tokens: 500,
        reasoning_effort: 'low',
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    })

    const completion = await response.json()
    const content = completion.choices?.[0]?.message?.content || ""
    const parsed = JSON.parse(content || "{}")

    // Log opcional
    const supabaseUrl = Deno.env.get("SUPABASE_URL")
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
    if (supabaseUrl && supabaseServiceKey && user_id) {
      const sb = createClient(supabaseUrl, supabaseServiceKey)
      await sb.from("ai_voice_logs").insert({
        user_id,
        action: "voice-inline-edit",
        raw_voice: String(voiceText),
        field: String(parsed.field || selectedField),
        replacement: String(parsed.replacement || ""),
        created_at: new Date().toISOString(),
      })
    }

    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: { ...getAllHeaders(req), "Content-Type": "application/json" },
    })
  } catch (err) {
    console.error("ai/voice-inline-edit error:", err)
    return new Response(JSON.stringify({ error: "Erro interno", details: String((err as any)?.message || err) }), {
      status: 500,
      headers: { ...getAllHeaders(req), "Content-Type": "application/json" },
    })
  }
})
