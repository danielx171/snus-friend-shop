# Phase 5: Make It Transactional — Design Spec

> **Date:** 2026-03-26
> **Status:** Ready for implementation
> **Depends on:** `2026-03-26-astro-phase4-seo-launch-design.md` (Phases 1-4 complete)
> **Branch:** `feat/astro-migration` (continue existing branch)
> **Goal:** Wire auth, checkout, and account management so users can register, buy products, and manage their accounts. This is the FINAL phase of the Astro migration.

### Architecture Decision: Astro Actions over React Islands

This spec uses **Astro Actions** for all server-side mutations (auth, checkout, account settings) instead of React islands with client-side Supabase calls. Rationale:

- **Progressive enhancement:** Forms work without JavaScript. JS adds inline validation and loading states.
- **Server-side secrets:** Actions run on the server and have direct access to `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `context.locals.supabase` — no need to expose anon keys to the browser for auth operations.
- **Simpler mental model:** Auth cookies are managed server-side by middleware. No `AuthProvider` island, no `onAuthStateChange` listener, no localStorage session juggling.
- **SEO-safe forms:** Server-rendered HTML forms with proper `<noscript>` fallbacks. Google can see form structure.
- **Fewer islands:** Auth pages need zero client JS for core functionality. Only the cart drawer, checkout form UI, and interactive quiz remain as React islands.

---

## Table of Contents

1. [Current State](#1-current-state)
2. [Astro Actions Foundation](#2-astro-actions-foundation)
3. [Auth via Actions (P0)](#3-auth-via-actions-p0)
4. [Checkout Flow (P0)](#4-checkout-flow-p0)
5. [Account Page (P0)](#5-account-page-p0)
6. [Order Confirmation Enhancement (P1)](#6-order-confirmation-enhancement-p1)
7. [Homepage Wiring (P1)](#7-homepage-wiring-p1)
8. [Missing Pages (P1)](#8-missing-pages-p1)
9. [Auth State for Client-Side Islands](#9-auth-state-for-client-side-islands)
10. [Final Cleanup](#10-final-cleanup)
11. [File Structure](#11-file-structure)
12. [Success Criteria](#12-success-criteria)
13. [Implementation Order](#13-implementation-order)

---

## 1. Current State

After Phase 4 the site has:

- **32 Astro pages:** SSG catalog, SSR checkout/order-confirmation, category pages, search
- **11 React islands:** `ProductCard`, `CartIsland`, `HeaderCartButton`, `AddToCartButton`, `WishlistIsland`, `FilterableProductGrid`, `SearchIsland`, `CartDrawer`, `MobileMenu`, `ToastProvider`, `CookieConsentBanner`
- **8 nanostores:** cart, theme, auth, wishlist, easter, cookie-consent, language, ui
- **Auth pages exist** (`login.astro`, `register.astro`, `forgot-password.astro`) but forms are HTML-only with no submit handlers
- **Checkout page** is a stub spinner that reads `Astro.locals.user` for auth gating but has no form
- **Order confirmation** shows a static "thank you" with no order data
- **No account page** exists
- **Homepage** Best Sellers section shows skeleton placeholders instead of real products
- **Supabase browser client** exists at `src/lib/supabase-browser.ts` with auth persistence via localStorage
- **Auth store** exists at `src/stores/auth.ts` with `$user`, `$session`, `$isAuthenticated` atoms and `setAuth()`/`clearAuth()` helpers — but nothing calls them on page load
- **Middleware** at `src/middleware.ts` creates `context.locals.supabase` and `context.locals.user` via `@supabase/ssr`

### What changes with Astro Actions

All auth and account mutations move to **Astro Actions** — server-side functions defined in `src/actions/`. Forms use native `method="POST"` with `action={actions.auth.login}` and work without client JavaScript. Progressive enhancement adds inline validation and loading states via small `<script>` blocks.

The checkout form remains a React island (needs cart nanostore state) but its **submission** goes through an Astro Action via `fetch()`.

No `AuthProvider` island is needed — the middleware handles session cookies server-side, and `Astro.locals.user` is available on every SSR page.

---

## 2. Astro Actions Foundation

### 2a. Action Middleware for POST/Redirect/GET

Astro Actions called from HTML forms render the result on the same page after a POST. To avoid the "Confirm Form Resubmission" browser dialog on refresh, we use the cookie-based POST/Redirect/GET pattern in middleware.

**File:** `src/middleware.ts` (extend existing middleware)

```ts
import { defineMiddleware, sequence } from 'astro:middleware';
import { createServerClient } from '@supabase/ssr';
import { getActionContext } from 'astro:actions';

const supabaseMiddleware = defineMiddleware(async (context, next) => {
  const supabase = createServerClient(
    import.meta.env.SUPABASE_URL,
    import.meta.env.SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => context.cookies.getAll().map(c => ({
          name: c.name,
          value: c.value,
        })),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            context.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const { data: { user } } = await supabase.auth.getUser();
  context.locals.user = user;
  context.locals.supabase = supabase;

  return next();
});

const actionMiddleware = defineMiddleware(async (context, next) => {
  if (context.isPrerendered) return next();

  const { action, setActionResult, serializeActionResult } = getActionContext(context);

  // Restore action result from cookie (POST/Redirect/GET pattern)
  const payload = context.cookies.get('ACTION_PAYLOAD');
  if (payload) {
    const { actionName, actionResult } = payload.json();
    setActionResult(actionName, actionResult);
    context.cookies.delete('ACTION_PAYLOAD', { path: '/' });
    return next();
  }

  // Handle form-submitted actions
  if (action?.calledFrom === 'form') {
    const actionResult = await action.handler();

    context.cookies.set('ACTION_PAYLOAD', {
      actionName: action.name,
      actionResult: serializeActionResult(actionResult),
    }, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60,
    });

    if (actionResult.error) {
      const referer = context.request.headers.get('Referer');
      if (!referer) throw new Error('Referer missing from Action POST request.');
      return context.redirect(referer);
    }

    return context.redirect(context.originPathname);
  }

  return next();
});

export const onRequest = sequence(supabaseMiddleware, actionMiddleware);
```

### 2b. Supabase Server Client Helper

**File:** `src/lib/supabase-server.ts`

A standalone helper for creating a service-role Supabase client in Actions and frontmatter. Used for operations that need elevated privileges (e.g., reading orders for any user, admin operations).

```ts
import { createClient } from '@supabase/supabase-js';

export function createServiceClient() {
  return createClient(
    import.meta.env.SUPABASE_URL,
    import.meta.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}
```

**Note:** Most actions should use `context.locals.supabase` (the per-request client from middleware, which runs as the authenticated user). The service client is only for cases where user-scoped RLS is insufficient.

### 2c. Actions Index

**File:** `src/actions/index.ts`

```ts
import { auth } from './auth';
import { checkout } from './checkout';
import { account } from './account';

export const server = {
  auth,
  checkout,
  account,
};
```

---

## 3. Auth via Actions (P0)

### 3a. Auth Actions Definition

**File:** `src/actions/auth.ts`

```ts
import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro/zod';

export const auth = {
  login: defineAction({
    accept: 'form',
    input: z.object({
      email: z.string().email('Invalid email address'),
      password: z.string().min(8, 'Password must be at least 8 characters'),
      redirect: z.string().optional(),
    }),
    handler: async (input, context) => {
      const supabase = context.locals.supabase;

      const { data, error } = await supabase.auth.signInWithPassword({
        email: input.email,
        password: input.password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          throw new ActionError({
            code: 'UNAUTHORIZED',
            message: 'Invalid email or password. Please try again.',
          });
        }
        if (error.message.includes('Email not confirmed')) {
          throw new ActionError({
            code: 'FORBIDDEN',
            message: 'Please check your email and confirm your account first.',
          });
        }
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong. Please try again.',
        });
      }

      // Session cookies are set automatically by the Supabase SSR client
      // via the middleware's cookie handlers
      return {
        redirectTo: input.redirect || '/account',
      };
    },
  }),

  register: defineAction({
    accept: 'form',
    input: z.object({
      name: z.string().min(1, 'Name is required'),
      email: z.string().email('Invalid email address'),
      password: z.string().min(8, 'Password must be at least 8 characters'),
      confirmPassword: z.string().min(8),
      ageVerified: z.literal('on', {
        errorMap: () => ({ message: 'You must confirm you are 18 or older' }),
      }),
      termsAccepted: z.literal('on', {
        errorMap: () => ({ message: 'You must accept the terms of service' }),
      }),
      referralCode: z.string().optional(),
    }).refine(data => data.password === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }),
    handler: async (input, context) => {
      const supabase = context.locals.supabase;

      const metadata: Record<string, string> = { full_name: input.name };
      if (input.referralCode) metadata.referral_code = input.referralCode;

      const { error } = await supabase.auth.signUp({
        email: input.email,
        password: input.password,
        options: { data: metadata },
      });

      if (error) {
        if (error.message.includes('already registered')) {
          throw new ActionError({
            code: 'CONFLICT',
            message: 'An account with this email already exists. Try signing in instead.',
          });
        }
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong. Please try again.',
        });
      }

      return { email: input.email, success: true };
    },
  }),

  forgotPassword: defineAction({
    accept: 'form',
    input: z.object({
      email: z.string().email('Invalid email address'),
    }),
    handler: async (input, context) => {
      const supabase = context.locals.supabase;
      const origin = context.request.headers.get('Origin')
        || context.url.origin;

      await supabase.auth.resetPasswordForEmail(input.email, {
        redirectTo: `${origin}/update-password`,
      });

      // Always return success (don't reveal if email exists)
      return { success: true };
    },
  }),

  updatePassword: defineAction({
    accept: 'form',
    input: z.object({
      password: z.string().min(8, 'Password must be at least 8 characters'),
      confirmPassword: z.string().min(8),
    }).refine(data => data.password === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }),
    handler: async (_input, context) => {
      const supabase = context.locals.supabase;
      const user = context.locals.user;

      if (!user) {
        throw new ActionError({
          code: 'UNAUTHORIZED',
          message: 'Invalid or expired reset link. Please request a new one.',
        });
      }

      const { error } = await supabase.auth.updateUser({
        password: _input.password,
      });

      if (error) {
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update password. Please try again.',
        });
      }

      return { success: true };
    },
  }),

  logout: defineAction({
    accept: 'form',
    input: z.object({}),
    handler: async (_input, context) => {
      const supabase = context.locals.supabase;
      await supabase.auth.signOut();
      return { success: true };
    },
  }),
};
```

### 3b. Login Page

**File:** `src/pages/login.astro`

```astro
---
export const prerender = false;

import { actions } from 'astro:actions';
import Shop from '@/layouts/Shop.astro';
import Breadcrumb from '@/components/astro/Breadcrumb.astro';
import { tenant } from '@/config/tenant';

// If already logged in, redirect away
if (Astro.locals.user) {
  return Astro.redirect('/account');
}

const result = Astro.getActionResult(actions.auth.login);

// On success: redirect to the target page
if (result && !result.error) {
  return Astro.redirect(result.data.redirectTo);
}

const redirectParam = Astro.url.searchParams.get('redirect') || '';
const messageParam = Astro.url.searchParams.get('message') || '';
const errorMessage = result?.error?.message;
---

<Shop title={`Login | ${tenant.name}`} description="Sign in to your account." noindex={true}>
  <section class="bg-background text-foreground">
    <div class="max-w-3xl mx-auto px-4 py-12">
      <Breadcrumb items={[{ label: 'Login' }]} />
      <div class="max-w-md mx-auto">
        <div class="rounded-xl border border-border bg-card/60 backdrop-blur-sm p-8">
          <h1 class="text-3xl font-bold tracking-tight mb-2 text-center">Welcome Back</h1>
          <p class="text-muted-foreground text-center mb-8">
            Sign in to your account to continue.
          </p>

          {messageParam === 'password-updated' && (
            <div class="mb-6 rounded-lg bg-green-500/10 border border-green-500/30 p-4 text-sm text-green-400">
              Password updated successfully. Please sign in with your new password.
            </div>
          )}

          {errorMessage && (
            <div class="mb-6 rounded-lg bg-destructive/10 border border-destructive/30 p-4 text-sm text-destructive" id="form-error">
              {errorMessage}
            </div>
          )}

          <form method="POST" action={actions.auth.login} id="login-form">
            <input type="hidden" name="redirect" value={redirectParam} />

            <div class="space-y-4">
              <div>
                <label for="email" class="block text-sm font-medium mb-1.5">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  autocomplete="email"
                  class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label for="password" class="block text-sm font-medium mb-1.5">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  minlength="8"
                  autocomplete="current-password"
                  class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                class="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
              >
                Sign In
              </button>
            </div>
          </form>

          <div class="mt-6 text-center text-sm text-muted-foreground">
            <a href="/forgot-password" class="text-primary hover:underline">Forgot password?</a>
          </div>
          <div class="mt-2 text-center text-sm text-muted-foreground">
            Don't have an account? <a href="/register" class="text-primary hover:underline">Create one</a>
          </div>
        </div>
      </div>
    </div>
  </section>
</Shop>

<script>
  // Progressive enhancement: disable button on submit, show loading
  const form = document.getElementById('login-form') as HTMLFormElement;
  form?.addEventListener('submit', () => {
    const btn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
    btn.disabled = true;
    btn.textContent = 'Signing in...';
  });
</script>
```

### 3c. Register Page

**File:** `src/pages/register.astro`

```astro
---
export const prerender = false;

import { actions } from 'astro:actions';
import Shop from '@/layouts/Shop.astro';
import Breadcrumb from '@/components/astro/Breadcrumb.astro';
import { tenant } from '@/config/tenant';

if (Astro.locals.user) {
  return Astro.redirect('/account');
}

const result = Astro.getActionResult(actions.auth.register);
const success = result && !result.error;
const errorMessage = result?.error?.message;
const referralCode = Astro.url.searchParams.get('ref') || '';
---

<Shop title={`Create Account | ${tenant.name}`} description="Create your account to start shopping." noindex={true}>
  <section class="bg-background text-foreground">
    <div class="max-w-3xl mx-auto px-4 py-12">
      <Breadcrumb items={[{ label: 'Create Account' }]} />
      <div class="max-w-md mx-auto">
        <div class="rounded-xl border border-border bg-card/60 backdrop-blur-sm p-8">

          {success ? (
            <!-- Success state: check your email -->
            <div class="text-center">
              <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                <svg class="h-8 w-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 class="text-2xl font-bold tracking-tight mb-2">Check Your Email</h1>
              <p class="text-muted-foreground mb-6">
                We've sent a confirmation link to <strong class="text-foreground">{result.data.email}</strong>. Click the link to activate your account.
              </p>
              <a href="/login" class="text-primary hover:underline text-sm">Back to login</a>
            </div>
          ) : (
            <!-- Registration form -->
            <Fragment>
              <h1 class="text-3xl font-bold tracking-tight mb-2 text-center">Create Account</h1>
              <p class="text-muted-foreground text-center mb-8">
                Join {tenant.name} to start shopping.
              </p>

              {errorMessage && (
                <div class="mb-6 rounded-lg bg-destructive/10 border border-destructive/30 p-4 text-sm text-destructive">
                  {errorMessage}
                </div>
              )}

              <form method="POST" action={actions.auth.register} id="register-form">
                {referralCode && <input type="hidden" name="referralCode" value={referralCode} />}

                <div class="space-y-4">
                  <div>
                    <label for="name" class="block text-sm font-medium mb-1.5">Full Name</label>
                    <input type="text" id="name" name="name" required autocomplete="name"
                      class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="Your full name" />
                  </div>

                  <div>
                    <label for="email" class="block text-sm font-medium mb-1.5">Email</label>
                    <input type="email" id="email" name="email" required autocomplete="email"
                      class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="you@example.com" />
                  </div>

                  <div>
                    <label for="password" class="block text-sm font-medium mb-1.5">Password</label>
                    <input type="password" id="password" name="password" required minlength="8" autocomplete="new-password"
                      class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="Minimum 8 characters" />
                  </div>

                  <div>
                    <label for="confirmPassword" class="block text-sm font-medium mb-1.5">Confirm Password</label>
                    <input type="password" id="confirmPassword" name="confirmPassword" required minlength="8" autocomplete="new-password"
                      class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="Repeat your password" />
                  </div>

                  <div class="flex items-start gap-2">
                    <input type="checkbox" id="ageVerified" name="ageVerified" required
                      class="mt-1 rounded border-border" />
                    <label for="ageVerified" class="text-sm text-muted-foreground">
                      I confirm that I am 18 years or older
                    </label>
                  </div>

                  <div class="flex items-start gap-2">
                    <input type="checkbox" id="termsAccepted" name="termsAccepted" required
                      class="mt-1 rounded border-border" />
                    <label for="termsAccepted" class="text-sm text-muted-foreground">
                      I accept the <a href="/terms" class="text-primary hover:underline" target="_blank">Terms of Service</a>
                      and <a href="/privacy" class="text-primary hover:underline" target="_blank">Privacy Policy</a>
                    </label>
                  </div>

                  <button type="submit"
                    class="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50">
                    Create Account
                  </button>
                </div>
              </form>

              <div class="mt-6 text-center text-sm text-muted-foreground">
                Already have an account? <a href="/login" class="text-primary hover:underline">Sign in</a>
              </div>
            </Fragment>
          )}
        </div>
      </div>
    </div>
  </section>
</Shop>

<script>
  // Progressive enhancement: client-side password match check
  const form = document.getElementById('register-form') as HTMLFormElement;
  const pw = document.getElementById('password') as HTMLInputElement;
  const cpw = document.getElementById('confirmPassword') as HTMLInputElement;

  form?.addEventListener('submit', (e) => {
    if (pw.value !== cpw.value) {
      e.preventDefault();
      cpw.setCustomValidity('Passwords do not match');
      cpw.reportValidity();
      return;
    }
    cpw.setCustomValidity('');
    const btn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
    btn.disabled = true;
    btn.textContent = 'Creating account...';
  });

  cpw?.addEventListener('input', () => cpw.setCustomValidity(''));
</script>
```

### 3d. Forgot Password Page

**File:** `src/pages/forgot-password.astro`

```astro
---
export const prerender = false;

import { actions } from 'astro:actions';
import Shop from '@/layouts/Shop.astro';
import Breadcrumb from '@/components/astro/Breadcrumb.astro';
import { tenant } from '@/config/tenant';

if (Astro.locals.user) {
  return Astro.redirect('/account');
}

const result = Astro.getActionResult(actions.auth.forgotPassword);
const success = result && !result.error;
const errorMessage = result?.error?.message;
---

<Shop title={`Forgot Password | ${tenant.name}`} description="Reset your password." noindex={true}>
  <section class="bg-background text-foreground">
    <div class="max-w-3xl mx-auto px-4 py-12">
      <Breadcrumb items={[{ label: 'Forgot Password' }]} />
      <div class="max-w-md mx-auto">
        <div class="rounded-xl border border-border bg-card/60 backdrop-blur-sm p-8">

          {success ? (
            <div class="text-center">
              <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                <svg class="h-8 w-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 class="text-2xl font-bold tracking-tight mb-2">Check Your Inbox</h1>
              <p class="text-muted-foreground mb-6">
                If an account exists with that email, we've sent a password reset link.
              </p>
              <a href="/login" class="text-primary hover:underline text-sm">Back to login</a>
            </div>
          ) : (
            <Fragment>
              <h1 class="text-3xl font-bold tracking-tight mb-2 text-center">Forgot Password</h1>
              <p class="text-muted-foreground text-center mb-8">
                Enter your email and we'll send you a reset link.
              </p>

              {errorMessage && (
                <div class="mb-6 rounded-lg bg-destructive/10 border border-destructive/30 p-4 text-sm text-destructive">
                  {errorMessage}
                </div>
              )}

              <form method="POST" action={actions.auth.forgotPassword} id="forgot-form">
                <div class="space-y-4">
                  <div>
                    <label for="email" class="block text-sm font-medium mb-1.5">Email</label>
                    <input type="email" id="email" name="email" required autocomplete="email"
                      class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="you@example.com" />
                  </div>

                  <button type="submit"
                    class="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50">
                    Send Reset Link
                  </button>
                </div>
              </form>

              <div class="mt-6 text-center text-sm text-muted-foreground">
                <a href="/login" class="text-primary hover:underline">Back to login</a>
              </div>
            </Fragment>
          )}
        </div>
      </div>
    </div>
  </section>
</Shop>

<script>
  const form = document.getElementById('forgot-form') as HTMLFormElement;
  form?.addEventListener('submit', () => {
    const btn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
    btn.disabled = true;
    btn.textContent = 'Sending...';
  });
</script>
```

### 3e. Update Password Page

**File:** `src/pages/update-password.astro`

The password reset callback. When a user clicks the reset link in their email, Supabase redirects them here with recovery tokens. The middleware exchanges these tokens for a session (via `supabase.auth.getUser()`), so `Astro.locals.user` will be set if the token is valid.

```astro
---
export const prerender = false;

import { actions } from 'astro:actions';
import Shop from '@/layouts/Shop.astro';
import Breadcrumb from '@/components/astro/Breadcrumb.astro';
import { tenant } from '@/config/tenant';

const result = Astro.getActionResult(actions.auth.updatePassword);
const success = result && !result.error;
const errorMessage = result?.error?.message;
const hasValidSession = !!Astro.locals.user;
---

<Shop title={`Update Password | ${tenant.name}`} description="Set your new password." noindex={true}>
  <section class="bg-background text-foreground">
    <div class="max-w-3xl mx-auto px-4 py-12">
      <Breadcrumb items={[{ label: 'Update Password' }]} />
      <div class="max-w-md mx-auto">
        <div class="rounded-xl border border-border bg-card/60 backdrop-blur-sm p-8">

          {success ? (
            <div class="text-center">
              <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                <svg class="h-8 w-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 class="text-2xl font-bold tracking-tight mb-2">Password Updated</h1>
              <p class="text-muted-foreground mb-6">
                Your password has been changed successfully.
              </p>
              <a href="/login?message=password-updated" class="inline-block rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
                Sign In
              </a>
            </div>
          ) : !hasValidSession ? (
            <div class="text-center">
              <h1 class="text-2xl font-bold tracking-tight mb-2">Invalid Reset Link</h1>
              <p class="text-muted-foreground mb-6">
                This password reset link is invalid or has expired. Please request a new one.
              </p>
              <a href="/forgot-password" class="text-primary hover:underline text-sm">Request new reset link</a>
            </div>
          ) : (
            <Fragment>
              <h1 class="text-3xl font-bold tracking-tight mb-2 text-center">Set New Password</h1>
              <p class="text-muted-foreground text-center mb-8">
                Choose a new password for your account.
              </p>

              {errorMessage && (
                <div class="mb-6 rounded-lg bg-destructive/10 border border-destructive/30 p-4 text-sm text-destructive">
                  {errorMessage}
                </div>
              )}

              <form method="POST" action={actions.auth.updatePassword} id="update-pw-form">
                <div class="space-y-4">
                  <div>
                    <label for="password" class="block text-sm font-medium mb-1.5">New Password</label>
                    <input type="password" id="password" name="password" required minlength="8" autocomplete="new-password"
                      class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="Minimum 8 characters" />
                  </div>

                  <div>
                    <label for="confirmPassword" class="block text-sm font-medium mb-1.5">Confirm New Password</label>
                    <input type="password" id="confirmPassword" name="confirmPassword" required minlength="8" autocomplete="new-password"
                      class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="Repeat your new password" />
                  </div>

                  <button type="submit"
                    class="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50">
                    Update Password
                  </button>
                </div>
              </form>
            </Fragment>
          )}
        </div>
      </div>
    </div>
  </section>
</Shop>

<script>
  const form = document.getElementById('update-pw-form') as HTMLFormElement;
  const pw = document.getElementById('password') as HTMLInputElement;
  const cpw = document.getElementById('confirmPassword') as HTMLInputElement;

  form?.addEventListener('submit', (e) => {
    if (pw?.value !== cpw?.value) {
      e.preventDefault();
      cpw.setCustomValidity('Passwords do not match');
      cpw.reportValidity();
      return;
    }
    cpw?.setCustomValidity('');
    const btn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
    btn.disabled = true;
    btn.textContent = 'Updating...';
  });

  cpw?.addEventListener('input', () => cpw?.setCustomValidity(''));
</script>
```

---

## 4. Checkout Flow (P0)

### 4a. Checkout Action

**File:** `src/actions/checkout.ts`

The checkout action receives form data (including serialized cart items), validates everything server-side, calls the `create-nyehandel-checkout` edge function, and returns the redirect URL.

```ts
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
    accept: 'json',  // Called via fetch() from the React island, not a native form POST
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
```

### 4b. CheckoutForm React Island

The checkout form remains a React island because it needs real-time access to the cart nanostore for displaying line items, quantities, and totals. However, form **submission** calls the Astro Action via `fetch()`.

**File:** `src/components/react/CheckoutForm.tsx`

**Why a React island:**
- Reads `$cartItems` and `$cartTotal` from nanostores in real-time
- Updates order summary as quantities change
- Handles complex conditional shipping method display based on country selection
- Manages multi-step validation UX (highlight first invalid field, scroll to it)

**Submission flow (calls Astro Action via fetch):**

```tsx
import { actions } from 'astro:actions';

async function handleSubmit(formData: CheckoutFormData) {
  setLoading(true);
  setError(null);

  const { data, error } = await actions.checkout.createCheckout({
    items: cartItems.map(item => ({
      sku: resolveSkuFromCart(item),
      quantity: item.quantity,
      product_name: item.product.name,
      pack_label: item.packSize,
      unit_price: item.product.prices[item.packSize],
    })),
    customer: {
      email: formData.email,
      firstname: formData.firstname,
      lastname: formData.lastname,
    },
    billing_address: {
      address: formData.address,
      postcode: formData.postcode,
      city: formData.city,
      country: formData.country,
    },
    shipping_method: formData.shippingMethod,
    display_total: cartTotal,
    display_currency: tenant.currencyCode,
  });

  if (error) {
    setError(error.message);
    setLoading(false);
    return;
  }

  // Clear cart before redirect
  clearCart();
  window.location.href = data.redirect_url;
}
```

### Form Fields

**Contact section:**

| Field | Name | Type | Required | Autocomplete | Pre-fill from |
|-------|------|------|----------|--------------|---------------|
| Email | `email` | email | Yes | `email` | `$user.email` |

**Shipping section:**

| Field | Name | Type | Required | Autocomplete |
|-------|------|------|----------|--------------|
| First name | `firstname` | text | Yes | `given-name` |
| Last name | `lastname` | text | Yes | `family-name` |
| Address | `address` | text | Yes | `street-address` |
| Postcode | `postcode` | text | Yes | `postal-code` |
| City | `city` | text | Yes | `address-level2` |
| Country | `country` | select | Yes | `country` |
| Phone | `phone` | tel | No | `tel` |

**Country dropdown:** Hardcoded EU + EEA countries relevant to the business:

```ts
const SHIPPING_COUNTRIES = [
  { code: 'SE', name: 'Sweden' },
  { code: 'DE', name: 'Germany' },
  { code: 'AT', name: 'Austria' },
  { code: 'DK', name: 'Denmark' },
  { code: 'FI', name: 'Finland' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'BE', name: 'Belgium' },
  { code: 'FR', name: 'France' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' },
  { code: 'PL', name: 'Poland' },
  { code: 'CZ', name: 'Czech Republic' },
  { code: 'IE', name: 'Ireland' },
  { code: 'PT', name: 'Portugal' },
  { code: 'NO', name: 'Norway' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'GB', name: 'United Kingdom' },
] as const;
```

**Shipping method selector:**

Display hardcoded shipping options based on country selection. The available methods must match `VALID_SHIPPING_METHODS` in the edge function:

| Country group | Methods |
|--------------|---------|
| EU countries | "DHL Economy EU", "DHL Express EU" |
| Non-EU (NO, CH, GB) | "DHL Economy (Non EU)", "DHL Express (Non EU)" |
| SE (domestic) | "UPS Standard (J229F1)", "UPS Express Saver" |

**Age verification checkbox:** Required. Label: "I confirm that I am 18 years or older."

**Order summary sidebar:**

- Line items from `$cartItems`: product name, pack size label, quantity, line total
- Subtotal
- Shipping cost (display "Calculated at payment" or hardcode estimates)
- Total

### SKU Resolution

Cart items store `product.id` and `packSize`. The edge function expects a `sku` string. Resolution strategy:

- Products in the Content Layer have variant data including SKUs
- At checkout island mount time, import `getCollection('products')` data or access it via a prop passed from the Astro page
- For each cart item, look up the matching variant: `product.variants.find(v => v.packSize === item.packSize)?.sku`
- If a SKU cannot be resolved, show an error: "Some products in your cart are unavailable. Please update your cart."

**Alternative (simpler):** If the cart store already has sufficient product data (including SKUs in the `Product` type), resolve directly from `item.product`. Check whether `Product.variants` or similar exists on the cart item's product data. If so, no additional lookup is needed.

### Integration with checkout.astro

```astro
---
export const prerender = false;

import Shop from '@/layouts/Shop.astro';
import Breadcrumb from '@/components/astro/Breadcrumb.astro';
import CheckoutForm from '@/components/react/CheckoutForm';
import { tenant } from '@/config/tenant';

const user = Astro.locals.user;
if (!user) {
  return Astro.redirect('/login?redirect=/checkout');
}
---

<Shop title={`Checkout | ${tenant.name}`} description="Complete your purchase securely." noindex={true}>
  <section class="bg-background text-foreground">
    <div class="max-w-5xl mx-auto px-4 py-12">
      <Breadcrumb items={[{ label: 'Cart', href: '/cart' }, { label: 'Checkout' }]} />
      <CheckoutForm client:load userEmail={user.email} />
    </div>
  </section>
</Shop>
```

The `userEmail` prop pre-fills the email field. The island reads cart state from nanostores.

---

## 5. Account Page (P0)

### 5a. Account Actions

**File:** `src/actions/account.ts`

```ts
import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro/zod';

export const account = {
  updateProfile: defineAction({
    accept: 'form',
    input: z.object({
      fullName: z.string().min(1, 'Name is required'),
      phone: z.string().optional(),
    }),
    handler: async (input, context) => {
      if (!context.locals.user) {
        throw new ActionError({ code: 'UNAUTHORIZED' });
      }

      const { error } = await context.locals.supabase.auth.updateUser({
        data: {
          full_name: input.fullName,
          phone: input.phone || undefined,
        },
      });

      if (error) {
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update profile. Please try again.',
        });
      }

      return { success: true };
    },
  }),

  changePassword: defineAction({
    accept: 'form',
    input: z.object({
      newPassword: z.string().min(8, 'Password must be at least 8 characters'),
      confirmPassword: z.string().min(8),
    }).refine(data => data.newPassword === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }),
    handler: async (input, context) => {
      if (!context.locals.user) {
        throw new ActionError({ code: 'UNAUTHORIZED' });
      }

      const { error } = await context.locals.supabase.auth.updateUser({
        password: input.newPassword,
      });

      if (error) {
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to change password. Please try again.',
        });
      }

      return { success: true };
    },
  }),
};
```

Logout uses the `auth.logout` action already defined in `src/actions/auth.ts`.

### 5b. Account Page (SSR with Server-Side Data Fetching)

**File:** `src/pages/account.astro`

The account page fetches orders, profile, and membership data **in the frontmatter** (server-side), then renders everything as server HTML. Settings forms use Astro Actions for mutations.

```astro
---
export const prerender = false;

import { actions } from 'astro:actions';
import Shop from '@/layouts/Shop.astro';
import Breadcrumb from '@/components/astro/Breadcrumb.astro';
import { tenant } from '@/config/tenant';

const user = Astro.locals.user;
if (!user) {
  return Astro.redirect('/login?redirect=/account');
}

const supabase = Astro.locals.supabase;

// Fetch orders
const { data: orders } = await supabase
  .from('orders')
  .select('*')
  .eq('user_id', user.id)
  .order('created_at', { ascending: false });

// Fetch points balance
const { data: balance } = await supabase
  .from('points_balances')
  .select('*')
  .eq('user_id', user.id)
  .single();

// Check for action results (settings updates)
const profileResult = Astro.getActionResult(actions.account.updateProfile);
const passwordResult = Astro.getActionResult(actions.account.changePassword);
const logoutResult = Astro.getActionResult(actions.auth.logout);

if (logoutResult && !logoutResult.error) {
  return Astro.redirect('/');
}

// Active tab from URL hash (default: orders)
const tab = Astro.url.searchParams.get('tab') || 'orders';
const userName = user.user_metadata?.full_name || '';
const userPhone = user.user_metadata?.phone || '';
---

<Shop title={`My Account | ${tenant.name}`} description="Manage your orders, settings, and membership." noindex={true}>
  <section class="bg-background text-foreground">
    <div class="max-w-4xl mx-auto px-4 py-12">
      <Breadcrumb items={[{ label: 'Account' }]} />

      <h1 class="text-3xl font-bold tracking-tight mb-8">My Account</h1>

      <!-- Tab navigation -->
      <div class="flex gap-1 border-b border-border mb-8">
        <a href="/account?tab=orders"
          class:list={["px-4 py-2 text-sm font-medium border-b-2 transition", tab === 'orders' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground']}>
          Orders
        </a>
        <a href="/account?tab=settings"
          class:list={["px-4 py-2 text-sm font-medium border-b-2 transition", tab === 'settings' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground']}>
          Settings
        </a>
        <a href="/account?tab=membership"
          class:list={["px-4 py-2 text-sm font-medium border-b-2 transition", tab === 'membership' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground']}>
          Membership
        </a>
      </div>

      <!-- Orders tab -->
      {tab === 'orders' && (
        <div>
          {!orders || orders.length === 0 ? (
            <div class="text-center py-12">
              <p class="text-muted-foreground mb-4">No orders yet. Start shopping!</p>
              <a href="/products" class="inline-block rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
                Browse Products
              </a>
            </div>
          ) : (
            <div class="space-y-4">
              {orders.map((order: any) => (
                <div class="rounded-xl border border-border bg-card/60 backdrop-blur-sm p-6">
                  <div class="flex items-center justify-between mb-2">
                    <span class="font-semibold">Order #{order.id?.slice(0, 8)}</span>
                    <span class:list={["text-xs font-medium px-2 py-1 rounded-full",
                      order.status === 'shipped' ? 'bg-green-500/10 text-green-400' :
                      order.status === 'confirmed' ? 'bg-blue-500/10 text-blue-400' :
                      'bg-yellow-500/10 text-yellow-400'
                    ]}>
                      {order.status}
                    </span>
                  </div>
                  <p class="text-sm text-muted-foreground mb-2">
                    {new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                  {order.tracking_url && (
                    <a href={order.tracking_url} target="_blank" rel="noopener noreferrer"
                      class="text-sm text-primary hover:underline">
                      Track Order
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <!-- Settings tab -->
      {tab === 'settings' && (
        <div class="space-y-8">
          <!-- Profile form -->
          <div class="rounded-xl border border-border bg-card/60 backdrop-blur-sm p-6">
            <h2 class="text-lg font-semibold mb-4">Profile</h2>

            {profileResult && !profileResult.error && (
              <div class="mb-4 rounded-lg bg-green-500/10 border border-green-500/30 p-3 text-sm text-green-400">
                Profile updated successfully.
              </div>
            )}
            {profileResult?.error && (
              <div class="mb-4 rounded-lg bg-destructive/10 border border-destructive/30 p-3 text-sm text-destructive">
                {profileResult.error.message}
              </div>
            )}

            <form method="POST" action={actions.account.updateProfile}>
              <div class="space-y-4">
                <div>
                  <label for="fullName" class="block text-sm font-medium mb-1.5">Full Name</label>
                  <input type="text" id="fullName" name="fullName" required value={userName}
                    class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1.5 text-muted-foreground">Email</label>
                  <input type="email" disabled value={user.email}
                    class="w-full rounded-lg border border-border bg-muted px-4 py-2.5 text-muted-foreground cursor-not-allowed" />
                </div>
                <div>
                  <label for="phone" class="block text-sm font-medium mb-1.5">Phone (optional)</label>
                  <input type="tel" id="phone" name="phone" value={userPhone}
                    class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
                <button type="submit"
                  class="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
                  Save Changes
                </button>
              </div>
            </form>
          </div>

          <!-- Change password form -->
          <div class="rounded-xl border border-border bg-card/60 backdrop-blur-sm p-6">
            <h2 class="text-lg font-semibold mb-4">Change Password</h2>

            {passwordResult && !passwordResult.error && (
              <div class="mb-4 rounded-lg bg-green-500/10 border border-green-500/30 p-3 text-sm text-green-400">
                Password changed successfully.
              </div>
            )}
            {passwordResult?.error && (
              <div class="mb-4 rounded-lg bg-destructive/10 border border-destructive/30 p-3 text-sm text-destructive">
                {passwordResult.error.message}
              </div>
            )}

            <form method="POST" action={actions.account.changePassword} id="change-pw-form">
              <div class="space-y-4">
                <div>
                  <label for="newPassword" class="block text-sm font-medium mb-1.5">New Password</label>
                  <input type="password" id="newPassword" name="newPassword" required minlength="8"
                    class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Minimum 8 characters" />
                </div>
                <div>
                  <label for="confirmPassword" class="block text-sm font-medium mb-1.5">Confirm New Password</label>
                  <input type="password" id="confirmPassword" name="confirmPassword" required minlength="8"
                    class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Repeat new password" />
                </div>
                <button type="submit"
                  class="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
                  Change Password
                </button>
              </div>
            </form>
          </div>

          <!-- Logout -->
          <div class="rounded-xl border border-border bg-card/60 backdrop-blur-sm p-6">
            <form method="POST" action={actions.auth.logout}>
              <button type="submit"
                class="rounded-lg border border-destructive px-6 py-2.5 text-sm font-semibold text-destructive transition hover:bg-destructive/10">
                Sign Out
              </button>
            </form>
          </div>
        </div>
      )}

      <!-- Membership tab -->
      {tab === 'membership' && (
        <div class="rounded-xl border border-border bg-card/60 backdrop-blur-sm p-6">
          {balance ? (
            <div>
              <div class="flex items-baseline justify-between mb-4">
                <h2 class="text-lg font-semibold">Your Points</h2>
                <span class="text-3xl font-bold text-primary">{balance.balance ?? 0}</span>
              </div>
              <!-- Tier progress bar and benefits would go here -->
              <p class="text-sm text-muted-foreground">Earn points with every purchase to unlock rewards and tier benefits.</p>
            </div>
          ) : (
            <div class="text-center py-8">
              <p class="text-muted-foreground mb-2">Welcome! Earn points with every purchase.</p>
              <p class="text-sm text-muted-foreground">Start shopping to build your membership status.</p>
            </div>
          )}
        </div>
      )}
    </div>
  </section>
</Shop>

<script>
  // Progressive enhancement: password match validation
  const form = document.getElementById('change-pw-form') as HTMLFormElement;
  const npw = document.getElementById('newPassword') as HTMLInputElement;
  const cpw = document.getElementById('confirmPassword') as HTMLInputElement;

  form?.addEventListener('submit', (e) => {
    if (npw?.value !== cpw?.value) {
      e.preventDefault();
      cpw.setCustomValidity('Passwords do not match');
      cpw.reportValidity();
      return;
    }
    cpw?.setCustomValidity('');
  });

  cpw?.addEventListener('input', () => cpw?.setCustomValidity(''));
</script>
```

**Key difference from the React island approach:** All data is fetched server-side in the frontmatter. No `useEffect` data loading, no loading spinners, no hydration delay. The page renders with full order history, profile data, and membership info on first paint. Mutations go through Astro Actions with native form POSTs.

---

## 6. Order Confirmation Enhancement (P1)

**File:** `src/pages/order-confirmation.astro`

The order confirmation page is now fully SSR — it fetches order data server-side and renders it as static HTML. No React island needed.

```astro
---
export const prerender = false;

import Shop from '@/layouts/Shop.astro';
import Breadcrumb from '@/components/astro/Breadcrumb.astro';
import { tenant } from '@/config/tenant';

const orderId = Astro.url.searchParams.get('order');

let order = null;
if (orderId && Astro.locals.user) {
  const { data } = await Astro.locals.supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .eq('user_id', Astro.locals.user.id)
    .single();
  order = data;
}

const lineItems = order?.line_items_snapshot ? JSON.parse(order.line_items_snapshot) : [];
---

<Shop title={`Order Confirmation | ${tenant.name}`} description="Thank you for your order." noindex={true}>
  <section class="bg-background text-foreground">
    <div class="max-w-3xl mx-auto px-4 py-12">
      <Breadcrumb items={[{ label: 'Order Confirmation' }]} />

      <div class="text-center mb-8">
        <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
          <svg class="h-8 w-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 class="text-3xl font-bold tracking-tight mb-2">Thank You!</h1>
        <p class="text-muted-foreground">Your order has been placed successfully.</p>
      </div>

      {order ? (
        <div class="rounded-xl border border-border bg-card/60 backdrop-blur-sm p-6 space-y-6">
          <div class="flex justify-between items-center">
            <div>
              <p class="text-sm text-muted-foreground">Order number</p>
              <p class="font-semibold">#{order.id?.slice(0, 8)}</p>
            </div>
            <div class="text-right">
              <p class="text-sm text-muted-foreground">Date</p>
              <p class="font-semibold">{new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
            </div>
          </div>

          {lineItems.length > 0 && (
            <div>
              <h2 class="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Items</h2>
              <div class="space-y-2">
                {lineItems.map((item: any) => (
                  <div class="flex justify-between text-sm">
                    <span>{item.product_name} ({item.pack_label}) x {item.quantity}</span>
                    <span class="font-medium">{item.unit_price * item.quantity} {order.currency || 'SEK'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {order.status && (
            <div>
              <p class="text-sm text-muted-foreground">Status</p>
              <p class="font-semibold capitalize">{order.status}</p>
            </div>
          )}

          <div class="pt-4 border-t border-border">
            <h2 class="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">What Happens Next</h2>
            <ol class="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
              <li>We'll send you an email confirmation shortly.</li>
              <li>Your order will be packed and shipped within 1-2 business days.</li>
              <li>You'll receive a tracking link by email when your order ships.</li>
            </ol>
          </div>
        </div>
      ) : (
        <div class="rounded-xl border border-border bg-card/60 backdrop-blur-sm p-6 text-center">
          <p class="text-muted-foreground mb-4">Your order is being processed.</p>
        </div>
      )}

      <div class="flex justify-center gap-4 mt-8">
        <a href="/products" class="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
          Continue Shopping
        </a>
        <a href="/account" class="rounded-lg border border-border px-6 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted/50">
          View Orders
        </a>
      </div>
    </div>
  </section>
</Shop>

<script>
  // Clear the cart after successful order (client-side nanostore cleanup)
  import { clearCart } from '@/stores/cart';
  clearCart();
</script>
```

---

## 7. Homepage Wiring (P1)

### Best Sellers Section

**Current state:** 8 skeleton placeholder `<div>` elements with pulse animation.

**Target:** Real ProductCard components showing top-rated products.

**Implementation:**

```astro
---
import { getCollection } from 'astro:content';
import ProductCard from '@/components/react/ProductCard';

const allProducts = await getCollection('products');
const bestSellers = allProducts
  .filter(p => p.data.inStock !== false)
  .sort((a, b) => (b.data.rating ?? 0) - (a.data.rating ?? 0))
  .slice(0, 8);
---

<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:gap-6">
  {bestSellers.map((product) => (
    <ProductCard client:visible product={product.data} />
  ))}
</div>
```

**Fallback:** If fewer than 8 products have ratings, fill remaining slots with most recently added products. If Content Layer has no products at all (build-time issue), show a "Products loading..." message instead of skeletons.

### Shop by Brand Section

**Current state:** Placeholder or missing.

**Target:** Brand cards linking to `/brands/[slug]` pages.

```astro
---
const allBrands = await getCollection('brands');
const featuredBrands = allBrands.slice(0, 6);
---

<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
  {featuredBrands.map((brand) => (
    <a href={`/brands/${brand.data.slug}`} class="group rounded-xl border border-border bg-card/50 p-6 text-center backdrop-blur transition hover:border-primary/30 hover:shadow-lg">
      {brand.data.logo && (
        <img src={brand.data.logo} alt={brand.data.name} class="mx-auto mb-3 h-12 w-auto object-contain" loading="lazy" />
      )}
      <p class="text-sm font-medium text-foreground">{brand.data.name}</p>
    </a>
  ))}
</div>
```

---

## 8. Missing Pages (P1)

### 8a. /terms.astro

Static legal page. Content is placeholder until solicitor sign-off.

```astro
---
import Shop from '@/layouts/Shop.astro';
import Breadcrumb from '@/components/astro/Breadcrumb.astro';
import { tenant } from '@/config/tenant';
---

<Shop title={`Terms of Service | ${tenant.name}`} description={`Terms and conditions for using ${tenant.name}.`}>
  <section class="bg-background text-foreground">
    <div class="max-w-3xl mx-auto px-4 py-12">
      <Breadcrumb items={[{ label: 'Terms of Service' }]} />
      <div class="prose prose-invert max-w-none">
        <h1>Terms of Service</h1>
        <p class="text-muted-foreground">Last updated: [DATE]</p>
        <!-- Placeholder content -- replace with solicitor-approved text -->
        <p>Terms of service content pending legal review.</p>
      </div>
    </div>
  </section>
</Shop>
```

### 8b. /privacy.astro

Same pattern as terms. Static legal page.

### 8c. /cookies.astro

Same pattern. Cookie policy page.

### 8d. /flavor-quiz.astro

Renders the FlavorQuizIsland -- port the quiz logic from the legacy SPA.

```astro
---
import Shop from '@/layouts/Shop.astro';
import FlavorQuizIsland from '@/components/react/FlavorQuizIsland';
import { tenant } from '@/config/tenant';
---

<Shop title={`Flavor Quiz | ${tenant.name}`} description="Find your perfect nicotine pouch flavor with our personalized quiz.">
  <section class="bg-background text-foreground">
    <div class="max-w-3xl mx-auto px-4 py-12">
      <FlavorQuizIsland client:load />
    </div>
  </section>
</Shop>
```

**FlavorQuizIsland.tsx:** Port from the legacy SPA quiz component. Multi-step questionnaire (flavor preferences, strength preference, usage frequency) that recommends products from the Content Layer catalog. This is a separate implementation task and can be a simplified version initially.

### 8e. /whats-new.astro

Static changelog/announcements page. Can be simple Astro markdown content.

---

## 9. Auth State for Client-Side Islands

With Astro Actions handling auth server-side, there is still a need for client-side islands (cart drawer, header) to know whether the user is logged in. The strategy:

### Server-to-Client Auth Bridge

Instead of an invisible `AuthProvider` React island that calls `supabase.auth.getSession()` on every page load, pass auth state from the server to the client via a small inline script in the layout.

**In `Shop.astro` layout:**

```astro
---
const user = Astro.locals.user;
---

<!-- Pass server auth state to client-side stores -->
<script define:vars={{ userId: user?.id, userEmail: user?.email, userName: user?.user_metadata?.full_name }}>
  if (userId) {
    window.__AUTH_STATE__ = { id: userId, email: userEmail, name: userName };
  }
</script>
```

**In `src/stores/auth.ts` (update initialization):**

```ts
// Hydrate from server-injected state on page load
if (typeof window !== 'undefined' && window.__AUTH_STATE__) {
  const { id, email, name } = window.__AUTH_STATE__;
  setAuth({ id, email, user_metadata: { full_name: name } }, null);
}
```

This gives all React islands (cart drawer, header auth button, checkout form) immediate access to auth state without any async calls or hydration delays.

### Header Auth State

**File:** `src/components/react/HeaderAuthButton.tsx`

Small React island that reads `$isAuthenticated` and `$user` from the auth store:

- If authenticated: show "Account" link pointing to `/account`
- If not authenticated: show "Login" link pointing to `/login`
- Mount in `Header.astro` with `client:load`

**Alternative (simpler, no island needed):** Render the header auth link directly in `Header.astro` using `Astro.locals.user`:

```astro
---
const user = Astro.locals.user;
---

{user ? (
  <a href="/account" class="text-sm font-medium hover:text-primary transition">Account</a>
) : (
  <a href="/login" class="text-sm font-medium hover:text-primary transition">Login</a>
)}
```

This is simpler and avoids a React island entirely. The header already server-renders, so this works perfectly on SSR pages. For SSG pages, the header falls back to showing "Login" (since `Astro.locals.user` is null at build time), which is acceptable because SSG pages are public catalog pages where seeing "Login" is correct.

**Recommendation:** Use the server-rendered approach for the header. No `HeaderAuthButton` React island needed.

---

## 10. Final Cleanup

### 10a. Remove Legacy SPA Entry Points

After all pages are migrated and working:

- **Delete `src/App.tsx`** -- legacy React SPA root component
- **Delete `src/main.tsx`** -- legacy Vite SPA entry point
- **Delete legacy page components** -- any remaining React Router page components that have been fully replaced by Astro pages

Verify no imports reference these files before deleting.

### 10b. Edge Function Connectivity

All 20+ edge functions are called server-side from Astro Actions (checkout) or client-side from React islands (cart operations). Verify:

- `SUPABASE_URL` (server-side, no `PUBLIC_` prefix) is set in Vercel environment variables
- `PUBLIC_SUPABASE_URL` is set for any remaining client-side island calls
- CORS headers in `supabase/functions/_shared/cors.ts` allow the Astro domain (`snusfriends.com` and preview URLs)
- `ALLOWED_ORIGIN` in Supabase Vault must be set (noted as a pre-launch blocker in CLAUDE.md)

### 10c. Sitemap Update

Update `public/sitemap.xml` generation to include new pages:

- `/account` -- **exclude** (noindex, user-specific)
- `/update-password` -- **exclude** (noindex)
- `/terms` -- **include**
- `/privacy` -- **include**
- `/cookies` -- **include**
- `/flavor-quiz` -- **include**
- `/whats-new` -- **include**

### 10d. SEO Meta Tags

| Page | `noindex` | Title | Canonical |
|------|-----------|-------|-----------|
| `/login` | Yes | Login \| SnusFriend | - |
| `/register` | Yes | Create Account \| SnusFriend | - |
| `/forgot-password` | Yes | Forgot Password \| SnusFriend | - |
| `/update-password` | Yes | Update Password \| SnusFriend | - |
| `/checkout` | Yes | Checkout \| SnusFriend | - |
| `/account` | Yes | My Account \| SnusFriend | - |
| `/order-confirmation` | Yes | Order Confirmation \| SnusFriend | - |
| `/terms` | No | Terms of Service \| SnusFriend | Yes |
| `/privacy` | No | Privacy Policy \| SnusFriend | Yes |
| `/cookies` | No | Cookie Policy \| SnusFriend | Yes |
| `/flavor-quiz` | No | Flavor Quiz \| SnusFriend | Yes |
| `/whats-new` | No | What's New \| SnusFriend | Yes |

---

## 11. File Structure

### New Files

```
src/
  actions/
    index.ts                    # Re-exports all action groups
    auth.ts                     # login, register, forgotPassword, updatePassword, logout
    checkout.ts                 # createCheckout
    account.ts                  # updateProfile, changePassword
  lib/
    supabase-server.ts          # Service-role client for elevated operations
  components/react/
    CheckoutForm.tsx             # React island (needs cart nanostore state)
    HeaderAuthButton.tsx         # Auth-aware header button (optional — can be server-rendered)
    FlavorQuizIsland.tsx         # Flavor recommendation quiz
  pages/
    account.astro                # SSR — server-rendered account with tabs
    update-password.astro        # SSR — password reset callback
    terms.astro                  # SSG — legal terms
    privacy.astro                # SSG — privacy policy
    cookies.astro                # SSG — cookie policy
    flavor-quiz.astro            # SSG — quiz page
    whats-new.astro              # SSG — changelog
```

### Modified Files

```
src/
  middleware.ts                  # Add action middleware (POST/Redirect/GET pattern)
  layouts/Shop.astro             # Add server-to-client auth bridge script
  stores/auth.ts                 # Hydrate from window.__AUTH_STATE__
  pages/
    login.astro                  # Rewrite with form action={actions.auth.login}
    register.astro               # Rewrite with form action={actions.auth.register}
    forgot-password.astro        # Rewrite with form action={actions.auth.forgotPassword}
    checkout.astro               # Replace spinner with CheckoutForm island
    order-confirmation.astro     # SSR order data fetch (no React island)
    index.astro                  # Wire Best Sellers + Shop by Brand to Content Layer
  components/astro/
    Header.astro                 # Server-rendered auth link (or HeaderAuthButton island)
```

### Deleted Files (after verification)

```
src/
  App.tsx                        # Legacy SPA root
  main.tsx                       # Legacy Vite entry
```

### What is NOT needed (compared to React island approach)

```
# These React islands are replaced by Astro Actions + server-rendered pages:
  components/react/AuthProvider.tsx           # Replaced by middleware + auth bridge script
  components/react/LoginIsland.tsx            # Replaced by login.astro form + action
  components/react/RegisterIsland.tsx         # Replaced by register.astro form + action
  components/react/ForgotPasswordIsland.tsx   # Replaced by forgot-password.astro form + action
  components/react/UpdatePasswordIsland.tsx   # Replaced by update-password.astro form + action
  components/react/AccountIsland.tsx          # Replaced by account.astro SSR page
  components/react/OrderConfirmationIsland.tsx # Replaced by order-confirmation.astro SSR
```

**Net result:** 7 fewer React islands. The only new React components are `CheckoutForm.tsx` (needs cart state) and `FlavorQuizIsland.tsx` (interactive multi-step UI).

---

## 12. Success Criteria

1. **Auth flow works end-to-end:** Users can register, receive confirmation email, login, reset password, and update password — all via native HTML forms with Astro Actions
2. **Forms work without JavaScript:** Core auth flows (login, register, reset) function with JS disabled. Progressive enhancement adds loading states and inline validation.
3. **Checkout completes:** Users can fill checkout form, submit via Astro Action, and be redirected to Nyehandel payment page
4. **Account page functional:** Users can view order history (server-rendered), edit profile settings, change password, and see membership status — all via native forms
5. **Header reflects auth:** Shows "Account" when logged in, "Login" when logged out (server-rendered, no flash)
6. **Homepage shows real products:** Best Sellers section displays actual products from Content Layer
7. **Legal pages exist:** `/terms`, `/privacy`, `/cookies` all render with placeholder content
8. **Order confirmation shows data:** After payment, order details are fetched server-side and displayed — no loading spinner
9. **Build passes:** 35+ Astro pages, all TypeScript compiles, no build errors
10. **SEO correct:** User-specific pages have `noindex`, public pages have proper titles and descriptions
11. **Edge functions reachable:** Checkout edge function callable from Astro Action; any remaining client-side calls have correct CORS
12. **Cart clears after checkout:** Successful payment flow clears the cart store
13. **No AuthProvider island:** Auth state comes from server middleware, not client-side session polling
14. **POST/Redirect/GET pattern:** No "Confirm Form Resubmission" dialogs on page refresh after form submission

---

## 13. Implementation Order

Tasks are ordered by dependency chain. P0 tasks block launch; P1 tasks can follow immediately after.

### Phase 5a — Actions Foundation + Auth (P0)

| # | Task | Depends on | Est. |
|---|------|-----------|------|
| 1 | Define `src/actions/index.ts`, `auth.ts`, `checkout.ts`, `account.ts` action stubs | - | 20 min |
| 2 | Extend `src/middleware.ts` with action POST/Redirect/GET middleware | - | 20 min |
| 3 | Create `src/lib/supabase-server.ts` service-role helper | - | 5 min |
| 4 | Rewrite `login.astro` with `action={actions.auth.login}` form | Tasks 1-2 | 25 min |
| 5 | Rewrite `register.astro` with `action={actions.auth.register}` form | Tasks 1-2 | 30 min |
| 6 | Rewrite `forgot-password.astro` with `action={actions.auth.forgotPassword}` form | Tasks 1-2 | 15 min |
| 7 | Create `update-password.astro` with `action={actions.auth.updatePassword}` form | Tasks 1-2 | 20 min |
| 8 | Add server-to-client auth bridge in `Shop.astro` + update `stores/auth.ts` | Task 2 | 15 min |
| 9 | Update `Header.astro` with server-rendered auth link | Task 2 | 10 min |

### Phase 5b — Checkout (P0)

| # | Task | Depends on | Est. |
|---|------|-----------|------|
| 10 | Implement `checkout.createCheckout` action with edge function call | 5a complete | 30 min |
| 11 | Create `CheckoutForm.tsx` React island with form fields + validation | Task 10 | 60 min |
| 12 | Wire SKU resolution from cart items | Task 11 | 20 min |
| 13 | Update `checkout.astro` to use `CheckoutForm` island | Tasks 10-12 | 10 min |

### Phase 5c — Account (P0)

| # | Task | Depends on | Est. |
|---|------|-----------|------|
| 14 | Implement `account.updateProfile` and `account.changePassword` actions | 5a complete | 15 min |
| 15 | Create `account.astro` with SSR data fetch + Orders tab | Task 14 | 45 min |
| 16 | Add Settings tab with profile + password forms | Task 15 | 25 min |
| 17 | Add Membership tab with points display | Task 15 | 15 min |

### Phase 5d — Polish (P1)

| # | Task | Depends on | Est. |
|---|------|-----------|------|
| 18 | Rewrite `order-confirmation.astro` with SSR order data fetch | 5b complete | 20 min |
| 19 | Wire homepage Best Sellers to Content Layer | - | 20 min |
| 20 | Wire homepage Shop by Brand to Content Layer | - | 15 min |
| 21 | Create `/terms.astro`, `/privacy.astro`, `/cookies.astro` | - | 15 min |
| 22 | Create `/flavor-quiz.astro` + `FlavorQuizIsland.tsx` | - | 45 min |
| 23 | Create `/whats-new.astro` | - | 10 min |

### Phase 5e — Cleanup (P1)

| # | Task | Depends on | Est. |
|---|------|-----------|------|
| 24 | Verify CORS / ALLOWED_ORIGIN for edge functions | 5b complete | 15 min |
| 25 | Update sitemap with new pages | 5d complete | 10 min |
| 26 | Delete `src/App.tsx` and `src/main.tsx` | All tasks | 5 min |
| 27 | Full build verification + smoke test | All tasks | 15 min |

**Total estimated time: ~8.5 hours**

---

## Appendix: Key Integration Points

### Supabase Client Usage

| Context | Client | Import |
|---------|--------|--------|
| Astro Actions | `context.locals.supabase` | Available via middleware |
| Astro frontmatter (SSR pages) | `Astro.locals.supabase` | Available via middleware |
| React islands (client-side) | `supabase` from browser client | `import { supabase } from '@/lib/supabase-browser'` |
| Elevated operations (service role) | `createServiceClient()` | `import { createServiceClient } from '@/lib/supabase-server'` |

### Nanostore Usage (React islands only)

```ts
import { useStore } from '@nanostores/react';
import { $user, $isAuthenticated } from '@/stores/auth';
import { $cartItems, $cartTotal, clearCart } from '@/stores/cart';
```

### Edge Function Base URL

```ts
// Server-side (Actions, frontmatter):
const FUNCTIONS_URL = `${import.meta.env.SUPABASE_URL}/functions/v1`;

// Client-side (React islands):
const FUNCTIONS_URL = `${import.meta.env.PUBLIC_SUPABASE_URL}/functions/v1`;
```

### Nyehandel Requirements (from CLAUDE.md)

- `X-Language: en` header REQUIRED on all Nyehandel API calls
- Edge function handles all Nyehandel communication — neither Actions nor islands call Nyehandel directly
- Shipping methods must exactly match `VALID_SHIPPING_METHODS` in the edge function

### Astro Actions Quick Reference

```ts
// Defining an action (src/actions/auth.ts)
import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro/zod';

export const auth = {
  login: defineAction({
    accept: 'form',           // native form data
    input: z.object({ ... }), // Zod validation
    handler: async (input, context) => {
      // context.locals.supabase — per-request Supabase client
      // context.locals.user — current user (from middleware)
      // context.cookies — read/write cookies
      // context.request — raw Request object
      // context.url — parsed URL
      // throw new ActionError({ code, message }) — typed errors
      return { data };
    },
  }),
};

// Using in Astro page
import { actions } from 'astro:actions';
const result = Astro.getActionResult(actions.auth.login);
// result is { data, error } | undefined

// HTML form
<form method="POST" action={actions.auth.login}>
  <input name="email" />
  <button type="submit">Login</button>
</form>

// Calling from React island (JSON actions only)
import { actions } from 'astro:actions';
const { data, error } = await actions.checkout.createCheckout({ ... });
```
