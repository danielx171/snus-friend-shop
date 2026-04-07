import { defineMiddleware } from 'astro:middleware';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export const onRequest = defineMiddleware(async (context, next) => {
  // Skip auth for prerendered (static) pages — cookies aren't available during build
  if (context.isPrerendered) {
    context.locals.user = null;
    context.locals.supabase = null;
    return next();
  }

  const supabaseUrl = import.meta.env.SUPABASE_URL ?? import.meta.env.PUBLIC_SUPABASE_URL;
  const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY ?? import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    context.locals.user = null;
    context.locals.supabase = null;
    return next();
  }

  // Parse cookies directly from the raw Cookie header — Astro's cookies.getAll()
  // URL-decodes values which corrupts the base64-encoded Supabase JWT session tokens.
  const rawCookieHeader = context.request.headers.get('cookie') ?? '';
  const parsedCookies = rawCookieHeader.split(';').filter(Boolean).map((pair) => {
    const eqIdx = pair.indexOf('=');
    return {
      name: pair.slice(0, eqIdx).trim(),
      value: pair.slice(eqIdx + 1).trim(),
    };
  });

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return parsedCookies;
      },
      setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            context.cookies.set(name, value, options as any);
          }
        } catch {
          // Cookies unavailable during prerender — safe to ignore
        }
      },
    },
  });

  context.locals.supabase = supabase as any;

  const pathname = context.url.pathname;

  // Pages that need auth state (getUser is a network call — skip for pages that don't need it)
  const authRequiredPaths = ['/account', '/checkout', '/order-confirmation', '/suggestions'];
  const needsAuth = authRequiredPaths.some((p) => pathname.startsWith(p));

  if (needsAuth) {
    const { data: { user } } = await supabase.auth.getUser();
    context.locals.user = user;

    // Protect /account — redirect to login if not authenticated
    if (pathname.startsWith('/account') && !user) {
      return context.redirect(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  } else {
    // For login/register/forgot-password/etc: skip the getUser() call entirely
    // This saves 100-300ms per page load
    context.locals.user = null;
  }

  return next();
});
