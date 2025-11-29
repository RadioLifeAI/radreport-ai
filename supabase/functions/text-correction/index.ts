import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { text } = await req.json()

    if (!text || typeof text !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Text is required and must be a string' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Limite de 8000 caracteres (suficiente para laudos médicos)
    if (text.length > 8000) {
      return new Response(
        JSON.stringify({ error: 'Text too long (max 8000 characters)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY')
    if (!GROQ_API_KEY) {
      console.error('❌ GROQ_API_KEY not configured')
      return new Response(
        JSON.stringify({ error: 'GROQ_API_KEY not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('🔄 Correcting text with Groq LLM (length:', text.length, ')')

    // Prompt especializado em correção de laudos radiológicos
    const systemPrompt = `Você é um assistente especializado em correção de laudos radiológicos em português brasileiro.

Sua função é corrigir:
- Erros de transcrição de voz (palavras mal reconhecidas)
- Terminologia médica incorreta
- Pontuação inadequada
- Capitalização incorreta
- Espaçamento e formatação

Mantenha:
- Tom profissional e objetivo
- Estilo telegráfico radiológico
- Estrutura original do texto
- Acrônimos médicos em maiúsculas (BI-RADS, TI-RADS, etc.)

Retorne APENAS o texto corrigido, sem comentários ou explicações.`

    // Chamar Groq LLM via API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Corrija este texto de laudo radiológico:\n\n${text}` }
        ],
        temperature: 0.3, // Baixa criatividade, maior precisão
        max_tokens: 2000,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Groq API error:', response.status, errorText)
      return new Response(
        JSON.stringify({ 
          error: 'Groq API error',
          details: errorText,
          original: text 
        }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const data = await response.json()
    const corrected = data.choices?.[0]?.message?.content?.trim() || text

    console.log('✅ Text corrected successfully')

    // Calcular diffs básicos (opcional - pode ser feito no frontend)
    const corrections = []
    if (text !== corrected) {
      corrections.push({
        original: text,
        corrected: corrected,
        type: 'full_text',
      })
    }

    return new Response(
      JSON.stringify({
        original: text,
        corrected: corrected,
        corrections: corrections,
        model: 'llama-3.3-70b-versatile',
        timestamp: new Date().toISOString(),
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('❌ Text correction error:', error)
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
