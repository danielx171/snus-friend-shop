import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { percentageToAmount } from '../_shared/discount-distribution.ts';
import { getCorsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req.headers.get('Origin'));

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'METHOD_NOT_ALLOWED' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const { code, subtotal } = await req.json();

    if (!code || typeof code !== 'string') {
      return new Response(JSON.stringify({ error: 'INVALID_CODE' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: discount, error: dbError } = await supabase
      .from('discounts')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('active', true)
      .single();

    if (dbError || !discount) {
      return new Response(JSON.stringify({ error: 'INVALID_CODE' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check expiry
    if (discount.valid_until && new Date(discount.valid_until) < new Date()) {
      return new Response(JSON.stringify({ error: 'EXPIRED' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check not-yet-valid
    if (discount.valid_from && new Date(discount.valid_from) > new Date()) {
      return new Response(JSON.stringify({ error: 'INVALID_CODE' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check max uses
    if (discount.max_uses !== null && discount.used_count >= discount.max_uses) {
      return new Response(JSON.stringify({ error: 'MAX_USES_REACHED' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check minimum order value
    const subtotalNum = typeof subtotal === 'number' ? subtotal : parseFloat(subtotal) || 0;
    if (discount.min_order_value && subtotalNum < parseFloat(discount.min_order_value)) {
      return new Response(
        JSON.stringify({
          error: 'MIN_ORDER_NOT_MET',
          min_order: parseFloat(discount.min_order_value),
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    // Calculate discount amount
    let discountAmount: number;
    if (discount.type === 'percentage') {
      const subtotalCents = Math.round(subtotalNum * 100);
      discountAmount = percentageToAmount(subtotalCents, parseFloat(discount.value)) / 100;
    } else {
      // fixed_amount
      discountAmount = parseFloat(discount.value);
    }

    // Don't let discount exceed subtotal
    discountAmount = Math.min(discountAmount, subtotalNum);

    return new Response(
      JSON.stringify({
        valid: true,
        code: discount.code,
        type: discount.type,
        value: parseFloat(discount.value),
        discount_amount: Math.round(discountAmount * 100) / 100,
        currency: discount.currency,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch {
    return new Response(
      JSON.stringify({ error: 'INTERNAL_ERROR', message: 'Failed to validate discount code' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});
