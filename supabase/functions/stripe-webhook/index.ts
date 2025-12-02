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

          // Get user by email
          const { data: userData } = await supabaseAdmin.auth.admin.listUsers();
          const user = userData?.users?.find(u => u.email === customerEmail);

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

          // Find plan by stripe_price_id
          const { data: priceData } = await supabaseAdmin
            .from('subscription_prices')
            .select('plan_id, subscription_plans(*)')
            .eq('stripe_price_id', priceId)
            .eq('is_active', true)
            .single();

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

          // Initialize credits for the user
          await supabaseAdmin.rpc('renew_monthly_credits', { 
            p_user_id: user.id,
            p_ai_tokens: plan.ai_tokens_monthly || 0,
            p_whisper_credits: plan.whisper_credits_monthly || 0
          });

          logStep('Subscription created successfully', { userId: user.id, planCode: plan.code });
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
            await supabaseAdmin.rpc('renew_monthly_credits', {
              p_user_id: sub.user_id,
              p_ai_tokens: plan.ai_tokens_monthly || 0,
              p_whisper_credits: plan.whisper_credits_monthly || 0
            });

            logStep('Monthly credits renewed', { userId: sub.user_id });
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

    // Log the event for audit
    await supabaseAdmin
      .from('subscription_events_log')
      .insert({
        stripe_event_id: event.id,
        event_type: event.type,
        event_data: event.data.object,
        processed_at: new Date().toISOString()
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
