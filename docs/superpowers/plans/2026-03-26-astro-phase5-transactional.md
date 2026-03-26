# Phase 5: Make It Transactional — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** Wire auth, checkout, account, and remaining pages so the Astro migration is 100% complete. Uses Astro Actions for server-side form handling.

**Architecture:** Astro Actions for auth/account forms (progressive enhancement, no JS required). React island only for CheckoutForm (needs cart nanostore access). Server-to-client auth bridge via window.__AUTH_STATE__.

**Tech Stack:** Astro 6 Actions, Supabase SSR auth, Zod validation, nanostores

**Design spec:** `docs/superpowers/specs/2026-03-26-astro-phase5-transactional-design.md`

**Config note:** Astro v5+ merges `hybrid` into `static` — `output: 'static'` already supports `export const prerender = false` per page. No `experimental.actions` flag needed. The current `astro.config.mjs` requires zero changes for Actions to work.

---

## Task 1: Astro Actions foundation — middleware + barrel export + supabase-server

**Files to create:**
- `src/actions/index.ts`
- `src/lib/supabase-server.ts`

**Files to modify:**
- `src/middleware.ts`
- `src/env.d.ts`

**Why:** Astro Actions need the POST/Redirect/GET middleware pattern to avoid "Confirm Form Resubmission" browser dialogs. The actions barrel file is required by Astro's convention (`src/actions/index.ts` exporting `server`). The service-role helper is needed for elevated DB operations.

### 1a. Create `src/actions/index.ts`

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

### 1b. Create `src/lib/supabase-server.ts`

```ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

/**
 * Service-role Supabase client for elevated operations.
 * Use context.locals.supabase for user-scoped operations instead.
 */
export function createServiceClient() {
  return createClient<Database>(
    import.meta.env.SUPABASE_URL,
    import.meta.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}
```

### 1c. Rewrite `src/middleware.ts`

Replace the entire file. The new middleware uses `sequence()` to chain two concerns: (1) Supabase auth session management, (2) Astro Action POST/Redirect/GET pattern.

Key changes from the current file:
- Import `sequence` and `getActionContext` from Astro
- Split into `supabaseMiddleware` and `actionMiddleware`
- Use `context.cookies.getAll()` instead of `context.cookies.headers()` (cleaner API)
- Cookie-based POST/Redirect/GET for action results
- Keep existing protected path redirects in supabaseMiddleware

```ts
import { defineMiddleware, sequence } from 'astro:middleware';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { getActionContext } from 'astro:actions';

const supabaseMiddleware = defineMiddleware(async (context, next) => {
  const supabaseUrl = import.meta.env.SUPABASE_URL ?? import.meta.env.PUBLIC_SUPABASE_URL;
  const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY ?? import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    context.locals.user = null;
    context.locals.supabase = null;
    return next();
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return context.cookies.getAll().map((c) => ({
          name: c.name,
          value: c.value,
        }));
      },
      setAll(cookies: { name: string; value: string; options?: CookieOptions }[]) {
        for (const cookie of cookies) {
          context.cookies.set(cookie.name, cookie.value, cookie.options as any);
        }
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();
  context.locals.user = user;
  context.locals.supabase = supabase as any;

  const pathname = context.url.pathname;
  const protectedPaths = ['/account', '/checkout', '/order-confirmation', '/rewards', '/wishlist'];
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));
  const isOps = pathname.startsWith('/ops') && pathname !== '/ops/login';

  if (isProtected && !user) {
    return context.redirect(`/login?redirect=${encodeURIComponent(pathname)}`);
  }

  if (isOps && !user) {
    return context.redirect('/ops/login');
  }

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
      if (!referer) throw new Error('Internal: Referer missing from Action POST request.');
      return context.redirect(referer);
    }

    return context.redirect(context.originPathname);
  }

  return next();
});

export const onRequest = sequence(supabaseMiddleware, actionMiddleware);
```

### 1d. Update `src/env.d.ts` — add `__AUTH_STATE__` to Window

Add to the existing `declare global` block:

```ts
// In the existing Window interface, add:
__AUTH_STATE__?: { id: string; email: string; name: string };
```

The full `declare global` block becomes:

```ts
declare global {
  interface Window {
    __pwaInstallPromptEvent: BeforeInstallPromptEvent | null;
    __AUTH_STATE__?: { id: string; email: string; name: string };
  }
}
```

### Verification

```bash
bun run build 2>&1 | head -30
```

Build should pass. Actions are registered but have no handlers yet (stubs will be added in Task 2). If `import './auth'` fails because `src/actions/auth.ts` does not exist yet, create empty stub files first:

```ts
// src/actions/auth.ts (stub)
export const auth = {};

// src/actions/checkout.ts (stub)
export const checkout = {};

// src/actions/account.ts (stub)
export const account = {};
```

---

## Task 2: Auth actions — login, register, forgotPassword, updatePassword, logout

**Files to create/replace:**
- `src/actions/auth.ts`

**Why:** All auth mutations must run server-side via Astro Actions. Supabase SSR client in middleware manages cookies automatically. No anon key exposed to browser for auth operations.

### Full `src/actions/auth.ts`

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

### Verification

```bash
bun run build 2>&1 | tail -20
```

Build should pass with all 5 auth actions registered. No pages consume them yet -- that is Task 3.

---

## Task 3: Wire auth pages — login, register, forgot-password, update-password

**Files to modify:**
- `src/pages/login.astro`
- `src/pages/register.astro`
- `src/pages/forgot-password.astro`

**Files to create:**
- `src/pages/update-password.astro`

**Why:** Current auth pages are static HTML forms with no submit handlers. This task wires them to the Astro Actions defined in Task 2. Forms use native `method="POST"` with `action={actions.auth.*}` and work without JavaScript. Progressive enhancement scripts add loading states and client-side validation.

### 3a. Rewrite `src/pages/login.astro`

Key changes from current file:
- Add `export const prerender = false;` (required for Actions)
- Import `actions` from `astro:actions`
- Redirect if already logged in
- Use `Astro.getActionResult()` to check action results
- Add `method="POST" action={actions.auth.login}` to form
- Add hidden `redirect` input from URL param
- Add `messageParam` handling for password-updated flow
- Add progressive enhancement script for loading state

Full file content — see design spec section 3b for the complete template. The form uses:
- `method="POST"` and `action={actions.auth.login}`
- Hidden input `<input type="hidden" name="redirect" value={redirectParam} />`
- Error display from `result?.error?.message`
- Success redirect via `Astro.redirect(result.data.redirectTo)`
- Script: disable button + show "Signing in..." on submit

### 3b. Rewrite `src/pages/register.astro`

Key changes from current file:
- Add `export const prerender = false;`
- Import `actions` from `astro:actions`
- Redirect if already logged in
- Use `Astro.getActionResult(actions.auth.register)` for success/error states
- On success: show "Check Your Email" confirmation with the email address
- On error: show error message above form
- Form uses `method="POST" action={actions.auth.register}`
- Field names must match Zod schema exactly: `name`, `email`, `password`, `confirmPassword`, `ageVerified`, `termsAccepted`, `referralCode`
- Hidden referralCode input from `?ref=` URL param
- Progressive enhancement: client-side password match check, button loading state

Full file content — see design spec section 3c for the complete template.

**Critical field name changes from current register.astro:**
- `confirm-password` -> `confirmPassword` (Zod schema uses camelCase)
- `age-verification` -> `ageVerified`
- `terms-agreement` -> `termsAccepted`

### 3c. Rewrite `src/pages/forgot-password.astro`

Key changes from current file:
- Add `export const prerender = false;`
- Import `actions` from `astro:actions`
- Redirect if already logged in
- On success: show "Check Your Inbox" confirmation (server-rendered, not client JS toggle)
- Remove the hidden `#success-message` div and client JS that toggles it
- Form uses `method="POST" action={actions.auth.forgotPassword}`

Full file content — see design spec section 3d for the complete template.

### 3d. Create `src/pages/update-password.astro`

New page for password reset callback. When user clicks the reset link in email, Supabase redirects here with recovery tokens. Middleware exchanges tokens for a session, so `Astro.locals.user` is set if valid.

Three states:
1. **Success** (`result && !result.error`): Show "Password Updated" with link to `/login?message=password-updated`
2. **Invalid/expired link** (`!hasValidSession`): Show error with link to `/forgot-password`
3. **Valid session, form not submitted**: Show password form

Form uses `method="POST" action={actions.auth.updatePassword}` with fields `password` and `confirmPassword`.

Full file content — see design spec section 3e for the complete template.

### Verification

```bash
bun run build 2>&1 | tail -20
```

All four auth pages should build as SSR (non-prerendered) pages. Test locally with `bun run dev`, navigate to `/login`, submit with invalid credentials, and verify error message appears without page resubmission dialog on refresh.

---

## Task 4: Auth bridge in Shop.astro + auth store hydration + Header auth link

**Files to modify:**
- `src/layouts/Shop.astro`
- `src/stores/auth.ts`
- `src/components/astro/Header.astro`

**Why:** React islands (cart drawer, header) need to know auth state. Instead of an AuthProvider island that calls `supabase.auth.getSession()` on every page, we pass server state to client via `window.__AUTH_STATE__` and hydrate the nanostore from it. The header shows Account/Login based on server-rendered `Astro.locals.user`.

### 4a. Modify `src/layouts/Shop.astro`

Add the auth bridge script. Insert it just before the closing `</Base>` tag, after the React islands.

Add to frontmatter:
```astro
const user = Astro.locals.user;
```

Add inline script before `</Base>`:
```astro
<!-- Server-to-client auth bridge -->
<script define:vars={{ userId: user?.id ?? null, userEmail: user?.email ?? null, userName: user?.user_metadata?.full_name ?? null }}>
  if (userId) {
    window.__AUTH_STATE__ = { id: userId, email: userEmail, name: userName };
  }
</script>
```

The full modified file:

```astro
---
import Base from './Base.astro';
import Header from '@/components/astro/Header.astro';
import Footer from '@/components/astro/Footer.astro';
import AgeGate from '@/components/astro/AgeGate.astro';
import ToastProvider from '@/components/react/ToastProvider';
import CookieConsentBanner from '@/components/react/CookieConsentBanner';
import CartDrawer from '@/components/react/CartDrawer';
import MobileMenu from '@/components/react/MobileMenu';

interface Props {
  title?: string;
  description?: string;
  ogImage?: string;
  ogType?: string;
  canonical?: string;
  noindex?: boolean;
}

const props = Astro.props;
const user = Astro.locals.user;
---

<Base {...props}>
  <AgeGate />
  <div class="flex min-h-screen flex-col">
    <Header />
    <main class="flex-1">
      <slot />
    </main>
    <Footer />
  </div>
  <CartDrawer client:load />
  <MobileMenu client:load />
  <ToastProvider client:load />
  <CookieConsentBanner client:idle />

  <!-- Server-to-client auth bridge -->
  <script define:vars={{ userId: user?.id ?? null, userEmail: user?.email ?? null, userName: user?.user_metadata?.full_name ?? null }}>
    if (userId) {
      window.__AUTH_STATE__ = { id: userId, email: userEmail, name: userName };
    }
  </script>
</Base>
```

### 4b. Modify `src/stores/auth.ts`

Add hydration from `window.__AUTH_STATE__` at module load time. This runs when any React island imports the auth store.

```ts
import { atom } from 'nanostores';
import type { User, Session } from '@supabase/supabase-js';

export const $user = atom<User | null>(null);
export const $session = atom<Session | null>(null);
export const $isAuthenticated = atom(false);

export function setAuth(user: User | null, session: Session | null) {
  $user.set(user);
  $session.set(session);
  $isAuthenticated.set(!!user);
}

export function clearAuth() {
  $user.set(null);
  $session.set(null);
  $isAuthenticated.set(false);
}

// Hydrate from server-injected auth state (set by Shop.astro layout)
if (typeof window !== 'undefined' && window.__AUTH_STATE__) {
  const { id, email, name } = window.__AUTH_STATE__;
  // Create a minimal User-like object for islands that read $user
  setAuth(
    { id, email, user_metadata: { full_name: name } } as unknown as User,
    null,
  );
}
```

### 4c. Modify `src/components/astro/Header.astro`

Add a server-rendered auth link. No React island needed — `Astro.locals.user` provides auth state at render time. On SSG pages, `user` is null (shows "Login"), which is correct for public catalog pages.

Add to frontmatter:
```astro
const user = Astro.locals.user;
```

Add a user icon/link in the `#header-islands` div, before the `HeaderCartButton`:

```astro
<div id="header-islands" class="flex items-center gap-3">
  {user ? (
    <a href="/account" class="text-muted-foreground hover:text-foreground transition" aria-label="My account">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    </a>
  ) : (
    <a href="/login" class="text-muted-foreground hover:text-foreground transition" aria-label="Sign in">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    </a>
  )}
  <HeaderCartButton client:load />
</div>
```

### Verification

```bash
bun run build 2>&1 | tail -10
bun run dev
```

Navigate to `/login`, sign in, verify header shows account icon linking to `/account`. On a static page like `/products`, header should show the login icon (expected for SSG pages).

---

## Task 5: Account actions + account page

**Files to create:**
- `src/actions/account.ts`
- `src/pages/account.astro`

**Why:** Users need to view orders, update profile, change password, see membership points, and log out. All data is fetched server-side in frontmatter. Mutations use Astro Actions with native form POSTs. No React islands needed.

### 5a. Create `src/actions/account.ts`

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

### 5b. Create `src/pages/account.astro`

SSR page with three tabs: Orders, Settings, Membership. All data fetched server-side in frontmatter. Tab selection via `?tab=` query param.

Frontmatter:
- `export const prerender = false;`
- Auth check with redirect to `/login?redirect=/account`
- Fetch orders from `orders` table filtered by `user_id`
- Fetch points balance from `points_balances` table
- Check action results for profile/password/logout
- On logout success, redirect to `/`

Template: Three tab sections conditionally rendered based on `tab` param.
- **Orders tab**: List of order cards with status badges, dates, tracking links. Empty state with "Browse Products" CTA.
- **Settings tab**: Profile form (fullName + phone, email disabled), Change password form, Logout button. Shows success/error messages from action results.
- **Membership tab**: Points balance display with encouragement text.

Progressive enhancement script: Client-side password match check on the change-password form.

Full file content — see design spec section 5b for the complete template (approx 120 lines of Astro).

### Verification

```bash
bun run build 2>&1 | tail -10
```

Account page should render as SSR. Test: log in, navigate to `/account`, verify orders tab shows (empty list or real data). Switch to Settings tab, update name, verify success message. Switch to Membership tab, verify points display.

---

## Task 6: Checkout action + CheckoutForm React island

**Files to create:**
- `src/actions/checkout.ts`
- `src/components/react/CheckoutForm.tsx`

**Files to modify:**
- `src/pages/checkout.astro`

**Why:** Checkout requires both server-side validation (Astro Action calling the Nyehandel edge function) and client-side cart state (nanostores). The form is a React island; submission calls the Action via `fetch()` (JSON mode, not form POST).

### 6a. Create `src/actions/checkout.ts`

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
    accept: 'json',  // Called via fetch() from React island, not native form POST
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

### 6b. Create `src/components/react/CheckoutForm.tsx`

React island that:
- Reads `$cartItems`, `$cartTotal`, `$cartCount` from nanostores via `useStore()`
- Shows order summary sidebar with line items, quantities, totals
- Renders contact fields (email pre-filled from `userEmail` prop), shipping address fields, country dropdown, shipping method selector
- Country dropdown: hardcoded EU + EEA countries (SE, DE, AT, DK, FI, NL, BE, FR, IT, ES, PL, CZ, IE, PT, NO, CH, GB)
- Shipping methods change based on country selection (SE = UPS, EU = DHL Economy/Express EU, Non-EU = DHL Economy/Express Non-EU)
- Age verification checkbox (required)
- Submit via `actions.checkout.createCheckout()` fetch call
- On success: `clearCart()` then `window.location.href = data.redirect_url`
- On error: display error message inline
- Loading state: disable button, show spinner

Props: `userEmail: string` (from checkout.astro frontmatter)

SKU resolution: Cart items store `product.id` and `packSize`. For the initial implementation, construct SKU as `${product.id}-${packSize}` and let the edge function handle the actual SKU mapping. If the `Product` type already includes variant SKUs, use those instead.

The component is approximately 250-300 lines. Key sections:
1. Nanostore imports and `useStore()` hooks
2. `SHIPPING_COUNTRIES` constant array
3. `getShippingMethods(countryCode)` helper
4. Form state management (controlled inputs)
5. `handleSubmit()` async function calling the Astro Action
6. Two-column layout: form (left) + order summary (right)

### 6c. Modify `src/pages/checkout.astro`

Replace the spinner stub with the CheckoutForm island:

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

### Verification

```bash
bun run build 2>&1 | tail -10
```

Checkout page should build. The CheckoutForm island renders client-side. Test: add items to cart, navigate to checkout (must be logged in), verify form displays with cart summary. Full end-to-end payment testing requires Nyehandel sandbox credentials.

---

## Task 7: Order confirmation enhancement

**Files to modify:**
- `src/pages/order-confirmation.astro`

**Why:** Current page shows a static "thank you" with no order data. This task fetches the order server-side and displays line items, status, and date.

### Modify `src/pages/order-confirmation.astro`

Frontmatter changes:
- Fetch order from `orders` table using `orderId` query param + `user_id` check
- Parse `line_items_snapshot` JSON for line item display

Template changes:
- If order found: show order number, date, line items with quantities/prices, status, "What Happens Next" steps
- If order not found: show generic "Your order is being processed" fallback
- Add cart-clearing script: `import { clearCart } from '@/stores/cart'; clearCart();`

Full file content — see design spec section 6 for the complete template.

### Verification

```bash
bun run build 2>&1 | tail -10
```

Page should build as SSR. After a successful checkout, navigating to `/order-confirmation?order=<id>` should show order details.

---

## Task 8: Homepage wiring — Best Sellers + Shop by Brand

**Files to modify:**
- `src/pages/index.astro`

**Why:** Homepage currently shows 8 skeleton pulse-animated placeholders for Best Sellers. This task wires them to real products from the Content Layer.

### 8a. Best Sellers section

Replace the `Array.from({ length: 8 }).map(...)` skeleton block with:

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
```

In the template, replace the skeleton grid with:

```astro
<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:gap-6">
  {bestSellers.length > 0 ? (
    bestSellers.map((product) => (
      <ProductCard client:visible product={product.data} />
    ))
  ) : (
    <p class="col-span-full text-center text-muted-foreground py-8">Products loading...</p>
  )}
</div>
```

**Note:** If the Content Layer `products` collection does not yet have a `rating` field, sort by `createdAt` or `name` as a fallback. Check `src/content/config.ts` for the actual schema.

### 8b. Shop by Brand section (optional — only if brands collection exists)

If a `brands` content collection exists, add a brand grid section after "Why Shop With Us":

```astro
---
const allBrands = await getCollection('brands');
const featuredBrands = allBrands.slice(0, 6);
---
```

If the `brands` collection does not exist yet, skip this sub-task and leave a TODO comment in the homepage.

### Verification

```bash
bun run build 2>&1 | tail -10
```

Homepage should build successfully. If products collection has entries, Best Sellers shows real product cards. If empty, shows "Products loading..." message.

---

## Task 9: Missing pages — legal, flavor quiz, what's new

**Files to create:**
- `src/pages/terms.astro`
- `src/pages/privacy.astro`
- `src/pages/cookies.astro`
- `src/pages/flavor-quiz.astro`
- `src/pages/whats-new.astro`

**Why:** Legal pages are required for registration (terms checkbox links to `/terms` and `/privacy`). Flavor quiz and changelog are P1 features for engagement and SEO.

### 9a. Create `src/pages/terms.astro`

Static SSG page with placeholder legal content. Uses Shop layout, Breadcrumb, prose styling.

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
        <p>Terms of service content pending legal review.</p>
      </div>
    </div>
  </section>
</Shop>
```

### 9b. Create `src/pages/privacy.astro`

Same pattern as terms. Title: "Privacy Policy". Description: "How we handle your data."

### 9c. Create `src/pages/cookies.astro`

Same pattern. Title: "Cookie Policy". Description: "How we use cookies."

### 9d. Create `src/pages/flavor-quiz.astro`

SSG page that renders the FlavorQuizIsland React island.

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

**Note:** If `FlavorQuizIsland.tsx` does not exist yet, create a minimal placeholder component:

```tsx
export default function FlavorQuizIsland() {
  return (
    <div className="text-center py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-4">Flavor Quiz</h1>
      <p className="text-muted-foreground">Coming soon — find your perfect nicotine pouch flavor.</p>
    </div>
  );
}
```

### 9e. Create `src/pages/whats-new.astro`

Static changelog page.

```astro
---
import Shop from '@/layouts/Shop.astro';
import Breadcrumb from '@/components/astro/Breadcrumb.astro';
import { tenant } from '@/config/tenant';
---

<Shop title={`What's New | ${tenant.name}`} description="Latest updates and improvements to the shop.">
  <section class="bg-background text-foreground">
    <div class="max-w-3xl mx-auto px-4 py-12">
      <Breadcrumb items={[{ label: "What's New" }]} />
      <div class="prose prose-invert max-w-none">
        <h1>What's New</h1>
        <h2>March 2026</h2>
        <ul>
          <li>Full site rebuild for faster page loads and better SEO</li>
          <li>New checkout experience with streamlined shipping</li>
          <li>Account page with order history and membership status</li>
          <li>Flavor quiz to help you find your perfect pouch</li>
        </ul>
      </div>
    </div>
  </section>
</Shop>
```

### Verification

```bash
bun run build 2>&1 | tail -20
```

All five new pages should appear in the build output. They are all SSG (no `prerender = false`).

---

## Task 10: Final cleanup + verification

**Files to potentially modify:**
- `astro.config.mjs` (sitemap filter)
- `src/pages/index.astro` (if any remaining placeholders)

**Files to potentially delete:**
- `src/App.tsx` (legacy SPA root)
- `src/main.tsx` (legacy Vite entry)

**Why:** Clean up legacy files that are no longer imported anywhere. Update sitemap to include new public pages and exclude user-specific pages. Run full build to verify 38+ pages compile.

### 10a. Verify no imports reference legacy files

```bash
# Check if anything still imports App.tsx or main.tsx
grep -r "from.*['\"].*App['\"]" src/ --include="*.ts" --include="*.tsx" --include="*.astro" || echo "No App.tsx imports found"
grep -r "from.*['\"].*main['\"]" src/ --include="*.ts" --include="*.tsx" --include="*.astro" || echo "No main.tsx imports found"
```

If no imports found, delete both files. If imports exist, trace them and update first.

### 10b. Sitemap configuration

The `@astrojs/sitemap` integration in `astro.config.mjs` should automatically include all SSG pages and exclude SSR pages (those with `prerender = false`). However, verify that:
- `/terms`, `/privacy`, `/cookies`, `/flavor-quiz`, `/whats-new` are included
- `/login`, `/register`, `/forgot-password`, `/update-password`, `/account`, `/checkout`, `/order-confirmation` are excluded (they have `prerender = false` or `noindex`)

If custom filtering is needed, add a `filter` function to the sitemap config:

```js
sitemap({
  filter: (page) => !page.includes('/login') && !page.includes('/register') && !page.includes('/account'),
  i18n: { defaultLocale: 'en', locales: { en: 'en', sv: 'sv' } },
}),
```

### 10c. Full build verification

```bash
bun run build 2>&1 | tail -40
```

Expected output:
- 38+ pages generated
- Zero TypeScript errors
- Zero build warnings about missing modules
- SSR pages listed separately from SSG pages

### 10d. Smoke test checklist

Run `bun run dev` and manually verify:

| Test | Expected |
|------|----------|
| `/` homepage | Best Sellers shows real products (or "loading" placeholder) |
| `/login` | Form renders, submit with invalid creds shows error |
| `/register` | Form renders, all fields present including age/terms checkboxes |
| `/forgot-password` | Form renders, submit shows "Check Your Inbox" |
| `/account` | Redirects to `/login?redirect=/account` when not logged in |
| `/checkout` | Redirects to `/login?redirect=/checkout` when not logged in |
| `/terms` | Static page renders with placeholder content |
| `/privacy` | Static page renders with placeholder content |
| `/cookies` | Static page renders with placeholder content |
| `/whats-new` | Static page renders with changelog |
| `/flavor-quiz` | Quiz island renders (placeholder or full) |
| Header | Shows login icon when logged out, account icon when logged in |

### 10e. CORS / Edge function connectivity

Verify that `SUPABASE_URL` (without `PUBLIC_` prefix) is set in Vercel environment variables for the Astro server runtime. The checkout action calls the edge function server-side, so CORS does not apply. However, any remaining client-side calls from React islands still need `PUBLIC_SUPABASE_URL` and proper CORS headers.

Check that `ALLOWED_ORIGIN` in Supabase Vault includes `https://snusfriends.com` and any preview deploy domains.

---

## Dependency Graph

```
Task 1 (Actions foundation)
├── Task 2 (Auth actions)
│   └── Task 3 (Wire auth pages)
├── Task 4 (Auth bridge)
├── Task 5 (Account actions + page)
└── Task 6 (Checkout action + form)
    └── Task 7 (Order confirmation)

Task 8 (Homepage wiring) — independent
Task 9 (Missing pages) — independent

Task 10 (Cleanup) — depends on all above
```

Tasks 8 and 9 can be done in parallel with Tasks 2-7.

---

## Success Criteria

1. Auth flow works end-to-end: register, confirm email, login, reset password, update password — all via native HTML forms with Astro Actions
2. Forms work without JavaScript: core auth flows function with JS disabled; progressive enhancement adds loading states
3. Checkout completes: form submits via Astro Action, redirects to Nyehandel payment page
4. Account page functional: orders (server-rendered), profile settings, password change, membership status — all via native forms
5. Header reflects auth state: Account icon when logged in, Login icon when logged out (server-rendered)
6. Homepage shows real products from Content Layer
7. Legal pages exist: `/terms`, `/privacy`, `/cookies`
8. Order confirmation shows real order data from Supabase
9. Build passes: 38+ Astro pages, zero TypeScript errors
10. POST/Redirect/GET pattern: no "Confirm Form Resubmission" dialogs on refresh
11. No AuthProvider island: auth state flows server -> `window.__AUTH_STATE__` -> nanostore
12. Cart clears after successful checkout

## Estimated Total Time: ~8.5 hours
