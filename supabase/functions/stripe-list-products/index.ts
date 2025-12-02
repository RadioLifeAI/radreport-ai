import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ProductPrice {
  id: string;
  amount: number;
  currency: string;
  interval: string;
  interval_count: number;
  nickname: string | null;
}

interface ProductWithPrices {
  id: string;
  name: string;
  description: string | null;
  prices: ProductPrice[];
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse environment parameter from request body
    const body = await req.json().catch(() => ({}));
    const environment = body.environment === 'live' ? 'live' : 'test';
    
    console.log(`[stripe-list-products] Fetching for environment: ${environment}`);

    // Select correct API key based on environment
    const stripeKey = environment === 'live'
      ? Deno.env.get("STRIPE_SECRET_KEY")
      : Deno.env.get("STRIPE_SECRET_KEY_TEST") || Deno.env.get("STRIPE_SECRET_KEY");
      
    if (!stripeKey) {
      throw new Error(`Stripe key for ${environment} environment not configured. Set STRIPE_SECRET_KEY${environment === 'test' ? '_TEST' : ''}.`);
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // OPTIMIZED: Single request with expand to include product data
    console.log("[stripe-list-products] Fetching prices with expanded product data (single request)...");
    
    const pricesResponse = await stripe.prices.list({
      active: true,
      limit: 100,
      expand: ['data.product'],
    });

    console.log(`[stripe-list-products] Found ${pricesResponse.data.length} prices`);

    // Group prices by product using Map
    const productsMap = new Map<string, ProductWithPrices>();

    for (const price of pricesResponse.data) {
      const product = price.product as Stripe.Product;
      
      // Skip if product is just an ID string (not expanded)
      if (typeof price.product === 'string') continue;
      
      // Skip inactive products
      if (!product.active) continue;

      const productId = product.id;

      if (!productsMap.has(productId)) {
        productsMap.set(productId, {
          id: product.id,
          name: product.name,
          description: product.description,
          prices: []
        });
      }

      productsMap.get(productId)!.prices.push({
        id: price.id,
        amount: price.unit_amount || 0,
        currency: price.currency,
        interval: price.recurring?.interval || 'one_time',
        interval_count: price.recurring?.interval_count || 1,
        nickname: price.nickname,
      });
    }

    // Convert Map to array and sort prices by amount
    const productsWithPrices = Array.from(productsMap.values())
      .map(product => ({
        ...product,
        prices: product.prices.sort((a, b) => a.amount - b.amount)
      }))
      .filter(p => p.prices.length > 0);

    console.log(`[stripe-list-products] Returning ${productsWithPrices.length} products with prices (${environment})`);

    return new Response(
      JSON.stringify({ 
        products: productsWithPrices,
        environment,
        count: productsWithPrices.length
      }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("[stripe-list-products] Error:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
