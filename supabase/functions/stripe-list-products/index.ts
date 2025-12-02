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
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY not configured");
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    console.log("[stripe-list-products] Fetching products and prices...");

    // Fetch active products
    const products = await stripe.products.list({ 
      active: true, 
      limit: 100 
    });
    console.log(`[stripe-list-products] Found ${products.data.length} products`);

    // Fetch active prices
    const prices = await stripe.prices.list({ 
      active: true, 
      limit: 100 
    });
    console.log(`[stripe-list-products] Found ${prices.data.length} prices`);

    // Organize prices by product
    const productsWithPrices: ProductWithPrices[] = products.data.map((product: Stripe.Product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      prices: prices.data
        .filter((price: Stripe.Price) => price.product === product.id)
        .map((price: Stripe.Price): ProductPrice => ({
          id: price.id,
          amount: price.unit_amount || 0,
          currency: price.currency,
          interval: price.recurring?.interval || 'one_time',
          interval_count: price.recurring?.interval_count || 1,
          nickname: price.nickname,
        }))
        .sort((a: ProductPrice, b: ProductPrice) => a.amount - b.amount) // Sort by price ascending
    }));

    // Filter out products without prices
    const productsWithActivePrices = productsWithPrices.filter((p: ProductWithPrices) => p.prices.length > 0);

    console.log(`[stripe-list-products] Returning ${productsWithActivePrices.length} products with prices`);

    return new Response(
      JSON.stringify({ 
        products: productsWithActivePrices,
        environment: stripeKey.startsWith('sk_test_') ? 'test' : 'live'
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
