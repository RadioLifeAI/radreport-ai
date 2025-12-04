import { getAllHeaders } from '../_shared/cors.ts';

const CLOUDFLARE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: getAllHeaders(req) });
  }

  try {
    const { token } = await req.json();
    
    if (!token) {
      console.warn('Turnstile verification attempted without token');
      return new Response(
        JSON.stringify({ success: false, error: 'Token não fornecido' }),
        { status: 400, headers: { ...getAllHeaders(req), 'Content-Type': 'application/json' } }
      );
    }

    const secretKey = Deno.env.get('CLOUDFLARE_TURNSTILE_SECRET_KEY');
    
    if (!secretKey) {
      console.error('CLOUDFLARE_TURNSTILE_SECRET_KEY not configured in Supabase secrets');
      return new Response(
        JSON.stringify({ success: false, error: 'Configuração do servidor inválida' }),
        { status: 500, headers: { ...getAllHeaders(req), 'Content-Type': 'application/json' } }
      );
    }

    // Validate token with Cloudflare
    const formData = new FormData();
    formData.append('secret', secretKey);
    formData.append('response', token);

    const cfResponse = await fetch(CLOUDFLARE_VERIFY_URL, {
      method: 'POST',
      body: formData,
    });

    const cfResult = await cfResponse.json();

    console.log('Turnstile validation result:', { 
      success: cfResult.success, 
      errorCodes: cfResult['error-codes'] 
    });

    if (cfResult.success) {
      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...getAllHeaders(req), 'Content-Type': 'application/json' } }
      );
    } else {
      console.warn('Turnstile validation failed:', cfResult['error-codes']);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Verificação de segurança falhou',
          codes: cfResult['error-codes'] 
        }),
        { status: 400, headers: { ...getAllHeaders(req), 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Erro interno de verificação' }),
      { status: 500, headers: { ...getAllHeaders(req), 'Content-Type': 'application/json' } }
    );
  }
});
