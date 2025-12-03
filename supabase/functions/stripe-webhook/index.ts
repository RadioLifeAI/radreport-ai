import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
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
      .select('plan_id, subscription_plans(*)')
      .eq(field, stripePriceId)
      .eq('is_active', true)
      .single();

    if (priceData && !error) {
      logStep(`Found plan by ${field}`, { stripePriceId, planId: priceData.plan_id });
      return priceData;
    }
  }

  logStep('Plan not found for price ID', { stripePriceId });
  return null;
}

// Helper to get user by email efficiently (direct query instead of listing all)
async function getUserByEmail(supabaseAdmin: any, email: string) {
  try {
    // Use listUsers with filter - more efficient than loading all users
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({
      filter: `email.eq.${email}`,
      page: 1,
      perPage: 1
    });

    if (error) {
      logStep('Error fetching user by email', { email, error: error.message });
      return null;
    }

    if (data?.users?.length > 0) {
      return data.users[0];
    }

    return null;
  } catch (err) {
    logStep('Exception fetching user by email', { email, error: err instanceof Error ? err.message : 'Unknown' });
    return null;
  }
}

// Helper to renew credits and log result
async function renewCreditsWithLogging(
  supabaseAdmin: any,
  userId: string,
  planCode: string,
  planDetails: { ai_tokens_monthly?: number; whisper_credits_monthly?: number }
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error: creditsError } = await supabaseAdmin.rpc('renew_monthly_credits', { 
      p_user_id: userId,
      p_plan_code: planCode
    });

    if (creditsError) {
      logStep('ERROR: Failed to renew credits', { 
        userId, 
        planCode,
        error: creditsError.message 
      });
      return { success: false, error: creditsError.message };
    }

    logStep('Credits renewed successfully', { 
      userId, 
      planCode,
      ai_tokens: planDetails.ai_tokens_monthly || 0,
      whisper_credits: planDetails.whisper_credits_monthly || 0
    });
    return { success: true };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    logStep('ERROR: Exception renewing credits', { userId, planCode, error: errorMsg });
    return { success: false, error: errorMsg };
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    
    if (!stripeKey) throw new Error('STRIPE_SECRET_KEY not configured');
    if (!webhookSecret) throw new Error('STRIPE_WEBHOOK_SECRET not configured');

    const stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' });
    const signature = req.headers.get('stripe-signature');
    
    if (!signature) {
      logStep('ERROR: Missing stripe-signature header');
      return new Response('Missing signature', { status: 400, headers: corsHeaders });
    }

    const body = await req.text();
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      logStep('ERROR: Signature verification failed', { error: errorMessage });
      return new Response(`Webhook signature verification failed: ${errorMessage}`, { 
        status: 400, 
        headers: corsHeaders 
      });
    }

    logStep('Event received', { type: event.type, id: event.id });

    // Initialize Supabase Admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Idempotency check
    const { data: existingEvent } = await supabaseAdmin
      .from('subscription_events_log')
      .select('id')
      .eq('stripe_event_id', event.id)
      .single();

    if (existingEvent) {
      logStep('Event already processed (idempotency)', { eventId: event.id });
      return new Response(JSON.stringify({ received: true, duplicate: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Track credits result for logging
    let creditsResult: { success: boolean; error?: string } | null = null;
    let creditsGranted: { ai_tokens: number; whisper_credits: number } | null = null;

    // Process event based on type
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        logStep('Processing checkout.session.completed', { sessionId: session.id });

        if (session.mode === 'subscription' && session.subscription && session.customer) {
          const customerId = typeof session.customer === 'string' ? session.customer : session.customer.id;
          const subscriptionId = typeof session.subscription === 'string' ? session.subscription : session.subscription.id;
          const customerEmail = session.customer_email || session.customer_details?.email;

          if (!customerEmail) {
            logStep('ERROR: No customer email in session');
            break;
          }

          // Get user by email - optimized query
          const user = await getUserByEmail(supabaseAdmin, customerEmail);

          if (!user) {
            logStep('ERROR: User not found for email', { email: customerEmail });
            break;
          }

          // Create/update stripe_customers
          await supabaseAdmin
            .from('stripe_customers')
            .upsert({
              user_id: user.id,
              stripe_customer_id: customerId,
              email: customerEmail,
              updated_at: new Date().toISOString()
            }, { onConflict: 'user_id' });

          // Get subscription details from Stripe
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const priceId = subscription.items.data[0]?.price.id;

          // Find plan by stripe_price_id (checks all fields including annual)
          const priceData = await findPlanByStripePriceId(supabaseAdmin, priceId);

          if (!priceData) {
            logStep('ERROR: Price not found', { priceId });
            break;
          }

          const plan = priceData.subscription_plans as any;

          // Create user subscription
          await supabaseAdmin
            .from('user_subscriptions')
            .upsert({
              user_id: user.id,
              plan_id: plan.id,
              stripe_subscription_id: subscriptionId,
              stripe_customer_id: customerId,
              status: subscription.status,
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              cancel_at_period_end: subscription.cancel_at_period_end,
              updated_at: new Date().toISOString()
            }, { onConflict: 'user_id' });

          // Initialize credits for the user using correct RPC signature
          creditsResult = await renewCreditsWithLogging(
            supabaseAdmin,
            user.id,
            plan.code,
            { ai_tokens_monthly: plan.ai_tokens_monthly, whisper_credits_monthly: plan.whisper_credits_monthly }
          );
          
          creditsGranted = {
            ai_tokens: plan.ai_tokens_monthly || 0,
            whisper_credits: plan.whisper_credits_monthly || 0
          };

          logStep('Subscription created successfully', { 
            userId: user.id, 
            planCode: plan.code,
            creditsRenewed: creditsResult.success 
          });
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        logStep('Processing subscription.updated', { subscriptionId: subscription.id });

        const { data: existingSub } = await supabaseAdmin
          .from('user_subscriptions')
          .select('user_id, plan_id')
          .eq('stripe_subscription_id', subscription.id)
          .single();

        if (existingSub) {
          await supabaseAdmin
            .from('user_subscriptions')
            .update({
              status: subscription.status,
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              cancel_at_period_end: subscription.cancel_at_period_end,
              canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
              updated_at: new Date().toISOString()
            })
            .eq('stripe_subscription_id', subscription.id);

          logStep('Subscription updated', { subscriptionId: subscription.id, status: subscription.status });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        logStep('Processing subscription.deleted', { subscriptionId: subscription.id });

        await supabaseAdmin
          .from('user_subscriptions')
          .update({
            status: 'canceled',
            canceled_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('stripe_subscription_id', subscription.id);

        logStep('Subscription canceled', { subscriptionId: subscription.id });
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        logStep('Processing invoice.paid', { invoiceId: invoice.id });

        // Only process subscription renewals (not the first invoice)
        if (invoice.billing_reason === 'subscription_cycle' && invoice.subscription) {
          const subscriptionId = typeof invoice.subscription === 'string' ? invoice.subscription : invoice.subscription.id;

          const { data: sub } = await supabaseAdmin
            .from('user_subscriptions')
            .select('user_id, plan_id, subscription_plans(*)')
            .eq('stripe_subscription_id', subscriptionId)
            .single();

          if (sub) {
            const plan = sub.subscription_plans as any;
            
            // Renew credits using correct RPC signature
            creditsResult = await renewCreditsWithLogging(
              supabaseAdmin,
              sub.user_id,
              plan.code,
              { ai_tokens_monthly: plan.ai_tokens_monthly, whisper_credits_monthly: plan.whisper_credits_monthly }
            );
            
            creditsGranted = {
              ai_tokens: plan.ai_tokens_monthly || 0,
              whisper_credits: plan.whisper_credits_monthly || 0
            };

            logStep('Monthly credits renewed', { 
              userId: sub.user_id,
              planCode: plan.code,
              success: creditsResult.success 
            });
          }
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        logStep('Processing invoice.payment_failed', { invoiceId: invoice.id });

        if (invoice.subscription) {
          const subscriptionId = typeof invoice.subscription === 'string' ? invoice.subscription : invoice.subscription.id;

          await supabaseAdmin
            .from('user_subscriptions')
            .update({
              status: 'past_due',
              updated_at: new Date().toISOString()
            })
            .eq('stripe_subscription_id', subscriptionId);

          logStep('Subscription marked as past_due', { subscriptionId });
        }
        break;
      }

      default:
        logStep('Unhandled event type', { type: event.type });
    }

    // Log the event for audit with credits details
    await supabaseAdmin
      .from('subscription_events_log')
      .insert({
        stripe_event_id: event.id,
        event_type: event.type,
        event_data: event.data.object,
        processed_at: new Date().toISOString(),
        credits_renewed: creditsResult?.success ?? null,
        credits_error: creditsResult?.error ?? null,
        ai_tokens_granted: creditsGranted?.ai_tokens ?? null,
        whisper_credits_granted: creditsGranted?.whisper_credits ?? null
      });

    return new Response(JSON.stringify({ received: true }), {
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
