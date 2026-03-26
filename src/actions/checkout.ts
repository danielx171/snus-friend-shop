import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro/zod';

const cartItemSchema = z.object({
  sku: z.string(),
  quantity: z.number().int().positive(),
  product_name: z.string(),
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
      display_total: z.number().positive(),
      display_currency: z.string(),
    }),
    handler: async (input, context) => {
      if (!context.locals.supabase) {
        throw new ActionError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not configured' });
      }

      const user = context.locals.user;
      if (!user) {
        throw new ActionError({
          code: 'UNAUTHORIZED',
          message: 'You must be logged in to checkout.',
        });
      }

      // Get a fresh access token from the session
      const { data: { session } } = await context.locals.supabase.auth.getSession();
      if (!session) {
        throw new ActionError({
          code: 'UNAUTHORIZED',
          message: 'Session expired. Please log in again.',
        });
      }

      const payload = {
        ...input,
        idempotency_key: crypto.randomUUID(),
      };

      const res = await fetch(
        `${import.meta.env.SUPABASE_URL}/functions/v1/create-nyehandel-checkout`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
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
          shipping_method_invalid: 'Please select a valid shipping method.',
          nyehandel_api_error: 'Payment provider error. Please try again.',
        };

        const msg = errorMap[body.error] || 'Something went wrong. Please try again.';
        throw new ActionError({ code: 'BAD_REQUEST', message: msg });
      }

      const { redirect_url } = await res.json();
      return { redirect_url };
    },
  }),
};
