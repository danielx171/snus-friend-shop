import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro/zod';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { siteUrl } from '@/config/site';
import {
  clearPendingReferralCode,
  normalizeReferralCode,
  redeemReferralCodeForUser,
  validateReferralCode,
} from '@/lib/server-referrals';
import {
  buildGuestOrderConfirmRedirect,
  getGuestAccountErrorMessage,
  normalizeGuestOrderEmail,
  verifyGuestOrderEmail,
} from '@/lib/server-guest-orders';

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
        // Parse directly from the raw Cookie header — avoids Astro's URL-decoding
        // which corrupts base64-encoded Supabase JWT session tokens.
        const header = ctx.request.headers.get('cookie') ?? '';
        return header.split(';').filter(Boolean).map((pair) => {
          const eqIdx = pair.indexOf('=');
          return { name: pair.slice(0, eqIdx).trim(), value: pair.slice(eqIdx + 1).trim() };
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
      referralCode: z.string().optional(),
      ageVerified: z.literal('on', { message: 'You must confirm you are 18 or older' }),
      termsAccepted: z.literal('on', { message: 'You must accept the terms and conditions' }),
    }),
    handler: async (input, ctx) => {
      const supabase = createSupabaseFromContext(ctx);
      const referralCode = normalizeReferralCode(input.referralCode);
      if (referralCode) {
        const referralValidation = await validateReferralCode(referralCode);
        if (referralValidation === 'invalid') {
          throw new ActionError({
            code: 'BAD_REQUEST',
            message: 'That referral code is not valid. Check the code and try again.',
          });
        }
      }

      const { data, error } = await supabase.auth.signUp({
        email: input.email,
        password: input.password,
        options: {
          data: {
            full_name: input.fullName,
            ...(referralCode ? { pending_referral_code: referralCode } : {}),
          },
          emailRedirectTo: `${siteUrl}/auth/confirm`,
        },
      });

      if (error) {
        throw new ActionError({
          code: 'BAD_REQUEST',
          message: error.message,
        });
      }

      // If the Supabase project has "Confirm email" OFF, signUp returns a session
      // immediately — log the user in and redirect. Otherwise, surface an inbox
      // screen that echoes the email the link was sent to.
      if (data?.session) {
        if (referralCode && data.user?.id) {
          const redemptionStatus = await redeemReferralCodeForUser(referralCode, data.user.id);
          if (redemptionStatus !== 'unavailable') {
            await clearPendingReferralCode(supabase, data.user.user_metadata).catch(() => {});
          }
        }

        return {
          success: true,
          redirect: '/account',
          email: input.email,
        };
      }

      return {
        success: true,
        message: 'Account created. Please check your email to confirm your address.',
        email: input.email,
      };
    },
  }),

  sendMagicLink: defineAction({
    accept: 'json',
    input: z.object({
      email: z.string().email('Please enter a valid email address'),
    }),
    handler: async (input, ctx) => {
      const supabase = createSupabaseFromContext(ctx);
      // Always return success to avoid leaking whether the email exists
      await supabase.auth.signInWithOtp({
        email: input.email,
        options: {
          emailRedirectTo: `${siteUrl}/auth/confirm`,
        },
      });

      return {
        success: true,
        message: 'Check your inbox — we sent you a login link.',
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
      // Always return success to avoid leaking whether the email exists.
      // Route through /auth/confirm so the server-side session is set before
      // the user reaches the update-password form (PKCE flow).
      await supabase.auth.resetPasswordForEmail(input.email, {
        redirectTo: `${siteUrl}/auth/confirm`,
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

  guestToAccount: defineAction({
    accept: 'json',
    input: z.object({
      email: z.string().email(),
      password: z.string().min(8, 'Password must be at least 8 characters'),
      orderId: z.string().min(1),
    }),
    handler: async (input, ctx) => {
      const supabase = createSupabaseFromContext(ctx);
      const normalizedEmail = normalizeGuestOrderEmail(input.email);
      if (!normalizedEmail) {
        throw new ActionError({
          code: 'BAD_REQUEST',
          message: 'Please use the same email address you entered at checkout.',
        });
      }

      const orderStatus = await verifyGuestOrderEmail(input.orderId, normalizedEmail);

      if (orderStatus === 'missing' || orderStatus === 'mismatch') {
        throw new ActionError({
          code: 'BAD_REQUEST',
          message: "We couldn't verify that order for this email address. Please use the same email you entered at checkout.",
        });
      }

      if (orderStatus === 'unavailable') {
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: "We couldn't verify your order right now. Please try again.",
        });
      }

      const { error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password: input.password,
        options: {
          emailRedirectTo: buildGuestOrderConfirmRedirect(siteUrl, input.orderId, normalizedEmail),
        },
      });

      if (error) {
        throw new ActionError({
          code: 'BAD_REQUEST',
          message: getGuestAccountErrorMessage(error),
        });
      }

      return {
        success: true,
        message: 'Account created! Check your email to confirm, then this order will appear in your account.',
      };
    },
  }),
};
