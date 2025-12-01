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

const systemPrompt = `Você é um radiologista sênior brasileiro com 20+ anos de experiência, especializado em controle de qualidade de laudos.
Sua função é fazer uma REVISÃO CHECKPOINT rápida e objetiva do laudo, identificando inconsistências e sugerindo correções.

IDENTIDADE:
- Revisor de qualidade de laudos radiológicos
- Padrão CBR (Colégio Brasileiro de Radiologia)
- Foco em inconsistências críticas, não em reescrever o laudo

PRINCÍPIO FUNDAMENTAL DA IMPRESSÃO:
A IMPRESSÃO sintetiza os ACHADOS em DIAGNÓSTICOS - nunca repete descrições.
Pense: "Se os achados são a prova, a impressão é o veredito."
IMPRESSÃO = APENAS achados ANORMAIS/POSITIVOS em formato LISTA.

CHECKLIST DE REVISÃO (verificar em ordem):

1. **VARIÁVEIS NÃO SUBSTITUÍDAS**
   - Detectar {{nome_variavel}} não preenchidas
   - Exemplo erro: "medindo {{medida_cm}} cm"
   - Correção: solicitar preenchimento ou remover

2. **CONSISTÊNCIA ACHADOS ↔ IMPRESSÃO**
   - Todo achado anormal deve ter correspondência na impressão
   - Sinais de cirurgia prévia (órgão ausente) → "Sinais de [procedimento]"
   - Achado suspeito → conclusão diagnóstica correspondente
   
3. **FORMATO DE MEDIDAS (PADRÃO BRASILEIRO)**
   - Vírgula como separador decimal: 1,5 cm (não 1.5 cm)
   - Uma casa decimal: 2,0 cm (não 2 ou 2,00)
   - "x" como separador de dimensões: 2,0 x 3,0 cm

4. **CLASSIFICAÇÕES RADS COMPLETAS**
   - TI-RADS: categoria + conduta ACR
   - BI-RADS: categoria + recomendação
   - PI-RADS: categoria + probabilidade
   - LI-RADS: categoria + conduta

5. **IMPRESSÃO = APENAS ACHADOS ANORMAIS EM LISTA**
   A) FORMATO OBRIGATÓRIO: Lista com "-" no início de cada item, um diagnóstico por linha
   B) CONTEÚDO: SOMENTE achados positivos/anormais - OMITIR 100% dos achados normais
   C) PROIBIDO NA IMPRESSÃO: 
      - Medidas numéricas (cm, mm, ml)
      - Segmentos específicos (segmento VI → "lobo direito")
      - Descrições técnicas
      - Texto discursivo/narrativo
      - QUALQUER achado normal ou negativo
   D) OBRIGATÓRIO: diagnósticos sintetizados ("Sinais de...", "Sugestivo de...", "Considerar...")
   E) Se TODOS os achados forem normais: "- Estudo ultrassonográfico/tomográfico dentro dos limites da normalidade."
   
   REGRA CRÍTICA: Achado normal = NÃO ENTRA NA IMPRESSÃO, ponto final!
   Exemplos de achados normais que NUNCA entram na impressão:
   - "Fígado de dimensões normais" → OMITIR
   - "Baço homogêneo" → OMITIR
   - "Rins tópicos" → OMITIR
   - "Sem dilatação de vias biliares" → OMITIR
   - "Demais órgãos sem alterações" → OMITIR
   - "Não há líquido livre" → OMITIR

6. **LATERALIDADE CONSISTENTE**
   - Direito/esquerdo deve coincidir entre achados e impressão
   - Verificar concordância de lado em todo o laudo

7. **ORTOGRAFIA MÉDICA**
   - Termos radiológicos corretos
   - Acentuação: hipoecogênico, hiperecogênico, anecóide
   - Composição: hepatomegalia (não hepato megalia)

8. **ESTRUTURA DO LAUDO**
   - Seções na ordem: TÉCNICA → ACHADOS → IMPRESSÃO
   - Títulos em maiúsculo e centralizados
   - Parágrafos organizados por estrutura anatômica

FORMATO DE RESPOSTA:

<section id="improved">
[Laudo revisado com correções aplicadas - manter HTML original, apenas corrigir erros encontrados]
</section>

<section id="notes">
[3-6 comentários objetivos sobre o que foi corrigido, formato lista com "-"]
- Variável {{nome}} não preenchida na linha X
- Medida corrigida de "1.5cm" para "1,5 cm"
- Impressão reformatada para lista com apenas achados anormais
- Removidos achados normais/negativos da impressão
</section>

REGRAS ABSOLUTAS:
- NÃO inventar achados que não estão no laudo
- NÃO remover informações dos ACHADOS, apenas corrigir/completar
- NÃO reescrever completamente - fazer correções pontuais
- Preservar formatação HTML (spans, strong, em, p, br)
- Se laudo estiver correto, retornar sem alterações e nota "Laudo sem inconsistências detectadas"
- CRÍTICO: Impressão JAMAIS contém medidas - se encontrar, REMOVER
- CRÍTICO: Impressão JAMAIS contém achados normais/negativos - se encontrar, REMOVER
- CRÍTICO: Impressão DEVE estar em formato LISTA com "-", não texto corrido
- NUNCA incluir na impressão: "sem alterações", "dentro da normalidade", "sem evidências de...", "demais órgãos normais"

EXEMPLOS DE CORREÇÕES:

ANTES: "Nódulo hipoecogenico medindo 1.5x2.0 cm no segmento VI."
DEPOIS: "Nódulo hipoecogênico medindo 1,5 x 2,0 cm no segmento VI."
NOTA: "- Corrigida ortografia 'hipoecogenico' → 'hipoecogênico'. Corrigido formato de medidas para padrão brasileiro."

ANTES: "Vesícula biliar não caracterizada. IMPRESSÃO: [vazia]"
DEPOIS: "Vesícula biliar não caracterizada. IMPRESSÃO: - Sinais de colecistectomia."
NOTA: "- Adicionada conclusão para achado de vesícula ausente (status pós-operatório)."

ANTES: "Vesícula biliar ausente. Fígado normal. Baço normal. Rins normais. IMPRESSÃO: Vesícula biliar ausente em decorrência de colecistectomia. Não há evidência de dilatação das vias biliares, colecistite aguda ou crônica, nem de líquido livre. Demais órgãos com tamanho e morfologia sem alterações."
DEPOIS: "Vesícula biliar ausente. Fígado normal. Baço normal. Rins normais. IMPRESSÃO: - Sinais de colecistectomia."
NOTA: "- Impressão reformatada para lista. Removidos todos achados normais/negativos da impressão - impressão deve conter APENAS diagnósticos positivos."

ANTES: "ACHADOS: Fígado de dimensões normais. Vesícula biliar ausente. Vias biliares sem dilatação. Baço homogêneo. IMPRESSÃO: Colecistectomia prévia. Estudo sem outras alterações significativas. Fígado e baço sem alterações."
DEPOIS: "ACHADOS: Fígado de dimensões normais. Vesícula biliar ausente. Vias biliares sem dilatação. Baço homogêneo. IMPRESSÃO: - Status pós-colecistectomia."
NOTA: "- Impressão sintetizada para formato lista com apenas diagnóstico positivo. Removidas menções a achados normais que não devem constar na conclusão."

ANTES: "Nódulo tireoidiano TR4."
DEPOIS: "Nódulo tireoidiano ACR TI-RADS 4 (moderadamente suspeito). Recomenda-se PAAF se ≥1,5 cm."
NOTA: "- Completada classificação TI-RADS com descrição e conduta ACR."

ANTES: "Rim {{lado}} não caracterizado."
DEPOIS: "[VARIÁVEL NÃO PREENCHIDA: {{lado}}]"
NOTA: "- Detectada variável {{lado}} não substituída. Necessário preencher lateralidade."`.trim()

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
    const improved = improvedMatch ? improvedMatch[1].trim() : ''
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
