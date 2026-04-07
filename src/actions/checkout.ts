import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro/zod';

const cartItemSchema = z.object({
  sku: z.string(),
  slug: z.string(),
  quantity: z.number().int().positive(),
  product_name: z.string(),
  brand: z.string(),
  image_url: z.string(),
  pack_label: z.string(),
  unit_price: z.number().positive(),
});

export const checkout = {
  createCheckout: defineAction({
    accept: 'json', // Called via fetch() from React island, not native form POST
    input: z.object({
      items: z.array(cartItemSchema).min(1, 'Cart is empty'),
      customer: z.object({
        email: z.string().email(),
        firstname: z.string().min(1),
        lastname: z.string().min(1),
      }),
      billing_address: z.object({
        address: z.string().min(1),
        postcode: z.string().min(1),
        city: z.string().min(1),
        country: z.string().length(2),
      }),
      shipping_method: z.string().min(1),
      discount_code: z.string().optional(),
      display_total: z.number().positive(),
      display_currency: z.string(),
    }),
    handler: async (input, context) => {
      if (!context.locals.supabase) {
        throw new ActionError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not configured' });
      }

      // Auth is optional — guests can checkout without an account
      let authToken: string | null = null;
      const user = context.locals.user;
      if (user) {
        const { data: { session } } = await context.locals.supabase.auth.getSession();
        authToken = session?.access_token ?? null;
      }

      const payload = {
        ...input,
        idempotency_key: crypto.randomUUID(),
      };

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const res = await fetch(
        `${import.meta.env.SUPABASE_URL}/functions/v1/create-nyehandel-checkout`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
        },
      );

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const errorMap: Record<string, string> = {
          items_required: 'Your cart is empty.',
          item_sku_required: 'One or more products are unavailable.',
          customer_fields_required: 'Please fill in all contact fields.',
          address_fields_required: 'Please fill in your full shipping address.',
          invalid_shipping_method: 'Please select a valid shipping method.',
          nyehandel_api_error: 'Payment provider error. Please try again.',
        };

        const msg = errorMap[body.error] || 'Something went wrong. Please try again.';
        throw new ActionError({ code: 'BAD_REQUEST', message: msg });
      }

      const { redirect_url } = await res.json();

      // Save last address for logged-in users (pre-fill on next checkout)
      if (user && context.locals.supabase) {
        context.locals.supabase.auth.updateUser({
          data: {
            last_address: {
              firstname: input.customer.firstname,
              lastname: input.customer.lastname,
              ...input.billing_address,
            },
          },
        }).catch(() => {}); // Fire-and-forget — don't block checkout
      }

      return { redirect_url };
    },
  }),
};
