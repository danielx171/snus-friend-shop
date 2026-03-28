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

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        try {
          return context.cookies.getAll().map(c => ({ name: c.name ?? '', value: c.value }));
        } catch {
          return [];
        }
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

  const { data: { user } } = await supabase.auth.getUser();
  context.locals.user = user;
  context.locals.supabase = supabase as any;

  const pathname = context.url.pathname;
  // Only protect SSR pages here — SSG pages skip middleware (isPrerendered check above)
  // /rewards and /wishlist are SSG with client-side auth checks, so not listed here
  const protectedPaths = ['/account', '/checkout', '/order-confirmation'];
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));

  if (isProtected && !user) {
    return context.redirect(`/login?redirect=${encodeURIComponent(pathname)}`);
  }

  return next();
});
