import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro/zod';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

/** Create a Supabase client bound to the request's cookies (anon key, respects RLS). */
function createSupabaseFromContext(ctx: { cookies: any; request: Request }) {
  const url = import.meta.env.SUPABASE_URL ?? import.meta.env.PUBLIC_SUPABASE_URL;
  const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY ?? import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new ActionError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Supabase credentials not configured',
    });
  }

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        // Astro action ctx.cookies may not have getAll() — use headers fallback
        try {
          if (typeof ctx.cookies.getAll === 'function') {
            return ctx.cookies.getAll().map((c: any) => ({ name: c.name ?? '', value: c.value }));
          }
        } catch { /* fall through */ }

        // Fallback: parse cookies from the request header
        const header = ctx.request.headers.get('cookie') ?? '';
        return header.split(';').filter(Boolean).map((pair) => {
          const [name, ...rest] = pair.trim().split('=');
          return { name: name ?? '', value: rest.join('=') };
        });
      },
      setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            ctx.cookies.set(name, value, options as any);
          }
        } catch { /* cookies may be read-only in some contexts */ }
      },
    },
  });
}

export const auth = {
  login: defineAction({
    accept: 'form',
    input: z.object({
      email: z.string().email('Please enter a valid email address'),
      password: z.string().min(1, 'Password is required'),
      redirect: z.string().optional(),
    }),
    handler: async (input, ctx) => {
      const supabase = createSupabaseFromContext(ctx);
      const { error } = await supabase.auth.signInWithPassword({
        email: input.email,
        password: input.password,
      });

      if (error) {
        throw new ActionError({
          code: 'UNAUTHORIZED',
          message: error.message,
        });
      }

      return { success: true, redirect: input.redirect || '/account' };
    },
  }),

  register: defineAction({
    accept: 'form',
    input: z.object({
      email: z.string().email('Please enter a valid email address'),
      password: z.string().min(8, 'Password must be at least 8 characters'),
      fullName: z.string().min(1, 'Full name is required'),
      ageVerified: z.literal('on', {
        errorMap: () => ({ message: 'You must confirm you are 18 or older' }),
      }),
      termsAccepted: z.literal('on', {
        errorMap: () => ({ message: 'You must accept the terms and conditions' }),
      }),
    }),
    handler: async (input, ctx) => {
      const supabase = createSupabaseFromContext(ctx);
      const { error } = await supabase.auth.signUp({
        email: input.email,
        password: input.password,
        options: {
          data: { full_name: input.fullName },
        },
      });

      if (error) {
        throw new ActionError({
          code: 'BAD_REQUEST',
          message: error.message,
        });
      }

      return {
        success: true,
        message: 'Account created. Please check your email to confirm your address.',
      };
    },
  }),

  forgotPassword: defineAction({
    accept: 'form',
    input: z.object({
      email: z.string().email('Please enter a valid email address'),
    }),
    handler: async (input, ctx) => {
      const supabase = createSupabaseFromContext(ctx);
      const siteUrl =
        import.meta.env.PUBLIC_SITE_URL ??
        import.meta.env.VITE_SITE_URL ??
        'https://snusfriends.com';

      // Always return success to avoid leaking whether the email exists.
      await supabase.auth.resetPasswordForEmail(input.email, {
        redirectTo: `${siteUrl}/update-password`,
      });

      return {
        success: true,
        message: 'If an account with that email exists, you will receive a password reset link.',
      };
    },
  }),

  updatePassword: defineAction({
    accept: 'form',
    input: z.object({
      password: z.string().min(8, 'Password must be at least 8 characters'),
      confirmPassword: z.string().min(1, 'Please confirm your password'),
    }),
    handler: async (input, ctx) => {
      if (input.password !== input.confirmPassword) {
        throw new ActionError({
          code: 'BAD_REQUEST',
          message: 'Passwords do not match',
        });
      }

      const supabase = createSupabaseFromContext(ctx);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new ActionError({ code: 'UNAUTHORIZED', message: 'Not authenticated' });
      const { error } = await supabase.auth.updateUser({
        password: input.password,
      });

      if (error) {
        throw new ActionError({
          code: 'BAD_REQUEST',
          message: error.message,
        });
      }

      return { success: true, message: 'Password updated successfully.' };
    },
  }),

  logout: defineAction({
    accept: 'form',
    input: z.object({}),
    handler: async (_input, ctx) => {
      const supabase = createSupabaseFromContext(ctx);
      await supabase.auth.signOut();
      return { redirect: '/' };
    },
  }),
};
