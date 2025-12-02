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

// Free plan defaults
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
    feature_priority_support: false
  }
};

// Helper to find plan by Stripe price ID (checks both test and live fields)
async function findPlanByStripePriceId(supabaseAdmin: any, stripePriceId: string) {
  // First try test price ID
  let { data: priceData } = await supabaseAdmin
    .from('subscription_prices')
    .select('subscription_plans(*)')
    .eq('stripe_price_id_test', stripePriceId)
    .single();

  if (priceData?.subscription_plans) {
    logStep('Found plan by test price ID', { stripePriceId });
    return priceData;
  }

  // Then try live price ID
  ({ data: priceData } = await supabaseAdmin
    .from('subscription_prices')
    .select('subscription_plans(*)')
    .eq('stripe_price_id_live', stripePriceId)
    .single());

  if (priceData?.subscription_plans) {
    logStep('Found plan by live price ID', { stripePriceId });
    return priceData;
  }

  // Fallback: try legacy stripe_price_id field
  ({ data: priceData } = await supabaseAdmin
    .from('subscription_prices')
    .select('subscription_plans(*)')
    .eq('stripe_price_id', stripePriceId)
    .single());

  if (priceData?.subscription_plans) {
    logStep('Found plan by legacy price ID', { stripePriceId });
    return priceData;
  }

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
          feature_priority_support
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
          feature_priority_support: plan.feature_priority_support
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

          // Find plan by Stripe price ID (checks both test and live fields)
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
                feature_priority_support: plan.feature_priority_support
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
