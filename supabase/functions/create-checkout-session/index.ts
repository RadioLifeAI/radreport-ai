import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

// Helper to get environment mode
async function getEnvironmentMode(supabaseAdmin: any): Promise<boolean> {
  const { data } = await supabaseAdmin
    .from('stripe_settings')
    .select('setting_value')
    .eq('setting_key', 'environment_mode')
    .single();

  const isTestMode = data?.setting_value === 'test';
  logStep('Environment config', { isTestMode, mode: data?.setting_value });
  return isTestMode;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep('Function started');

    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) throw new Error('STRIPE_SECRET_KEY not configured');

    // Authenticate user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('No authorization header');

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user?.email) {
      throw new Error('User not authenticated or email not available');
    }
    logStep('User authenticated', { userId: user.id, email: user.email });

    // Get request body with optional embedded flag
    const { price_id, embedded = false } = await req.json();
    if (!price_id) throw new Error('price_id is required');
    logStep('Price ID received', { price_id, embedded });

    // Initialize admin client for database queries
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Get environment mode
    const isTestMode = await getEnvironmentMode(supabaseAdmin);
    logStep('Using mode', { isTestMode });

    // Get price data with both test and live IDs
    const { data: priceData, error: priceError } = await supabaseAdmin
      .from('subscription_prices')
      .select('id, stripe_price_id, stripe_price_id_test, stripe_price_id_live, subscription_plans(code, name)')
      .eq('id', price_id)
      .eq('is_active', true)
      .single();

    if (priceError || !priceData) {
      logStep('Price query error', { error: priceError?.message });
      throw new Error('Price not found or inactive');
    }

    // Select the appropriate Stripe price ID based on environment
    const stripePriceId = isTestMode 
      ? (priceData.stripe_price_id_test || priceData.stripe_price_id)
      : (priceData.stripe_price_id_live || priceData.stripe_price_id);

    if (!stripePriceId) {
      logStep('Missing Stripe price ID', { isTestMode, priceData });
      throw new Error(`Stripe price ID not configured for ${isTestMode ? 'test' : 'live'} environment. Please configure it in the admin panel.`);
    }
    logStep('Price found', { stripePriceId, plan: priceData.subscription_plans });

    const stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' });

    // Check if customer exists in Stripe
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId: string | undefined;

    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep('Existing Stripe customer found', { customerId });
    }

    // Create checkout session
    const origin = req.headers.get('origin') || 'https://radreport.com.br';
    
    // Build session config based on embedded mode
    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      metadata: {
        user_id: user.id,
        price_id: price_id,
        environment: isTestMode ? 'test' : 'live'
      },
      subscription_data: {
        metadata: {
          user_id: user.id
        }
      }
    };

    // Configure URLs based on mode
    if (embedded) {
      sessionConfig.ui_mode = 'embedded';
      sessionConfig.return_url = `${origin}/assinaturas?session_id={CHECKOUT_SESSION_ID}`;
    } else {
      sessionConfig.success_url = `${origin}/assinaturas?session_id={CHECKOUT_SESSION_ID}`;
      sessionConfig.cancel_url = `${origin}/assinaturas?checkout=canceled`;
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);
    logStep('Checkout session created', { 
      sessionId: session.id, 
      url: session.url,
      clientSecret: embedded ? 'present' : 'not applicable',
      embedded 
    });

    // Return appropriate response based on mode
    const response: Record<string, any> = {
      sessionId: session.id,
    };

    if (embedded) {
      response.clientSecret = session.client_secret;
    } else {
      response.url = session.url;
    }

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logStep('ERROR', { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
