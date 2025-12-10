import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client with user token
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabaseUser = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Verify user
    const { data: { user }, error: userError } = await supabaseUser.auth.getUser();
    if (userError || !user) {
      console.error('[generate-mobile-token] Auth error:', userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get request body
    const { session_id } = await req.json();
    if (!session_id) {
      return new Response(
        JSON.stringify({ error: 'Missing session_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('[generate-mobile-token] Generating token for session:', session_id, 'user:', user.id);

    // Verify session belongs to user
    const { data: session, error: sessionError } = await supabaseAdmin
      .from('mobile_audio_sessions')
      .select('*')
      .eq('id', session_id)
      .eq('user_id', user.id)
      .eq('status', 'pending')
      .single();

    if (sessionError || !session) {
      console.error('[generate-mobile-token] Session not found:', sessionError);
      return new Response(
        JSON.stringify({ error: 'Session not found or already used' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate temporary JWT-like token (simple secure token for pairing)
    const tokenData = {
      session_id: session.id,
      user_id: user.id,
      user_email: user.email,
      created_at: Date.now(),
      expires_at: Date.now() + 5 * 60 * 1000, // 5 minutes
    };
    
    // Encode token data as base64
    const tempJwt = btoa(JSON.stringify(tokenData));

    // Get client IP from headers (best effort)
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     req.headers.get('x-real-ip') || 
                     null;

    console.log('[generate-mobile-token] Client IP detected:', clientIp);

    // Store token in session
    const { data: updated, error: updateError } = await supabaseAdmin.rpc('prepare_mobile_session_auth', {
      p_session_id: session_id,
      p_temp_jwt: tempJwt,
      p_desktop_ip: clientIp,
      p_user_email: user.email,
    });

    if (updateError || !updated) {
      console.error('[generate-mobile-token] Failed to update session:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to prepare session' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('[generate-mobile-token] Token generated successfully');

    return new Response(
      JSON.stringify({
        success: true,
        temp_jwt: tempJwt,
        expires_in: 300, // 5 minutes
        user_email: user.email,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[generate-mobile-token] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
