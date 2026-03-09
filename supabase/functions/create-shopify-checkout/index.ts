declare const Deno: {
  serve: (handler: (req: Request) => Response | Promise<Response>) => void;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type CheckoutItem = {
  shopifyVariantId: string;
  quantity: number;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const items = body?.items;

    if (!Array.isArray(items)) {
      return new Response(JSON.stringify({ error: "'items' must be an array" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const isValidItems = items.every((item: CheckoutItem) => {
      return (
        item &&
        typeof item.shopifyVariantId === "string" &&
        item.shopifyVariantId.trim().length > 0 &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0
      );
    });

    if (!isValidItems) {
      return new Response(
        JSON.stringify({ error: "Each item must include shopifyVariantId (string) and quantity (positive integer)" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    return new Response(
      JSON.stringify({
        checkoutUrl: "https://shopify.com/checkout/mock123",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
