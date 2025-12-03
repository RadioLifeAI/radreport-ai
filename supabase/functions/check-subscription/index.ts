import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

// Free plan defaults - aligned with database and frontend
const FREE_PLAN_RESPONSE = {
  subscribed: false,
  plan_code: 'free',
  plan_name: 'Gratuito',
  status: 'active',
  current_period_end: null,
  cancel_at_period_end: false,
  features: {
    ai_tokens_monthly: 20,
    whisper_credits_monthly: 0,
    feature_ai_conclusion: true,
    feature_ai_rads: false,
    feature_whisper: false,
    feature_priority_support: false,
    feature_ai_chat: false,
    feature_voice_dictation: true,
    feature_templates: true,
    feature_export: true
  }
};

// Helper to find plan by Stripe price ID (checks ALL price fields including annual)
async function findPlanByStripePriceId(supabaseAdmin: any, stripePriceId: string) {
  // Array of all price ID fields to check (monthly and annual, test and live)
  const priceFields = [
    'stripe_price_id_test',
    'stripe_price_id_live',
    'stripe_price_id_annual_test',
    'stripe_price_id_annual_live',
    'stripe_price_id' // legacy fallback
  ];

  for (const field of priceFields) {
    const { data: priceData, error } = await supabaseAdmin
      .from('subscription_prices')
      .select('subscription_plans(*)')
      .eq(field, stripePriceId)
      .single();

    if (priceData?.subscription_plans && !error) {
      logStep(`Found plan by ${field}`, { stripePriceId });
      return priceData;
    }
  }

  logStep('Plan not found for price ID', { stripePriceId });
  return null;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep('Function started');

    // Authenticate user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      logStep('No authorization header - returning free plan');
      return new Response(JSON.stringify(FREE_PLAN_RESPONSE), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      logStep('Auth error or no user - returning free plan');
      return new Response(JSON.stringify(FREE_PLAN_RESPONSE), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    logStep('User authenticated', { userId: user.id, email: user.email });

    // Use admin client for database queries
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // First, check database for subscription
    const { data: subscription, error: subError } = await supabaseAdmin
      .from('user_subscriptions')
      .select(`
        *,
        subscription_plans (
          code,
          name,
          ai_tokens_monthly,
          whisper_credits_monthly,
          feature_ai_conclusion,
          feature_ai_rads,
          feature_whisper,
          feature_priority_support,
          feature_ai_chat,
          feature_voice_dictation,
          feature_templates,
          feature_export
        )
      `)
      .eq('user_id', user.id)
      .in('status', ['active', 'trialing', 'past_due'])
      .single();

    if (subscription && subscription.subscription_plans) {
      const plan = subscription.subscription_plans as any;
      logStep('Subscription found in database', { planCode: plan.code, status: subscription.status });

      return new Response(JSON.stringify({
        subscribed: true,
        plan_code: plan.code,
        plan_name: plan.name,
        status: subscription.status,
        current_period_end: subscription.current_period_end,
        cancel_at_period_end: subscription.cancel_at_period_end,
        features: {
          ai_tokens_monthly: plan.ai_tokens_monthly,
          whisper_credits_monthly: plan.whisper_credits_monthly,
          feature_ai_conclusion: plan.feature_ai_conclusion,
          feature_ai_rads: plan.feature_ai_rads,
          feature_whisper: plan.feature_whisper,
          feature_priority_support: plan.feature_priority_support,
          feature_ai_chat: plan.feature_ai_chat ?? false,
          feature_voice_dictation: plan.feature_voice_dictation ?? true,
          feature_templates: plan.feature_templates ?? true,
          feature_export: plan.feature_export ?? true
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fallback: check Stripe directly
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (stripeKey && user.email) {
      logStep('Checking Stripe directly');
      const stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' });

      const customers = await stripe.customers.list({ email: user.email, limit: 1 });
      
      if (customers.data.length > 0) {
        const customerId = customers.data[0].id;
        const subscriptions = await stripe.subscriptions.list({
          customer: customerId,
          status: 'active',
          limit: 1,
        });

        if (subscriptions.data.length > 0) {
          const stripeSub = subscriptions.data[0];
          const priceId = stripeSub.items.data[0]?.price.id;

          // Find plan by Stripe price ID (checks all fields including annual)
          const priceData = await findPlanByStripePriceId(supabaseAdmin, priceId);

          if (priceData?.subscription_plans) {
            const plan = priceData.subscription_plans as any;
            logStep('Subscription found in Stripe', { planCode: plan.code });

            return new Response(JSON.stringify({
              subscribed: true,
              plan_code: plan.code,
              plan_name: plan.name,
              status: stripeSub.status,
              current_period_end: new Date(stripeSub.current_period_end * 1000).toISOString(),
              cancel_at_period_end: stripeSub.cancel_at_period_end,
              features: {
                ai_tokens_monthly: plan.ai_tokens_monthly,
                whisper_credits_monthly: plan.whisper_credits_monthly,
                feature_ai_conclusion: plan.feature_ai_conclusion,
                feature_ai_rads: plan.feature_ai_rads,
                feature_whisper: plan.feature_whisper,
                feature_priority_support: plan.feature_priority_support,
                feature_ai_chat: plan.feature_ai_chat ?? false,
                feature_voice_dictation: plan.feature_voice_dictation ?? true,
                feature_templates: plan.feature_templates ?? true,
                feature_export: plan.feature_export ?? true
              }
            }), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }
        }
      }
    }

    // No subscription found - return free plan
    logStep('No subscription found - returning free plan');
    return new Response(JSON.stringify(FREE_PLAN_RESPONSE), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logStep('ERROR', { message: errorMessage });
    // On error, return free plan as fallback
    return new Response(JSON.stringify(FREE_PLAN_RESPONSE), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
