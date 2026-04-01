import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Shared auth hook for React islands.
 *
 * Checks two auth channels:
 * 1. `window.__AUTH_STATE__` — set by Shop.astro on SSR pages (immediate, no async)
 * 2. `supabase.auth.getSession()` — client-side session from localStorage (async fallback)
 *
 * This solves the problem where server-side login sets cookies but the
 * client-side Supabase JS uses localStorage — two separate channels.
 * On SSR pages like /account, __AUTH_STATE__ has the user immediately.
 * On SSG pages like /rewards, we fall back to the Supabase client.
 */
export function useAuthUser() {
  const [userId, setUserId] = useState<string | null>(() => {
    // Sync check — available immediately on SSR pages
    if (typeof window !== 'undefined') {
      const serverAuth = (window as any).__AUTH_STATE__;
      if (serverAuth?.id) return serverAuth.id;
    }
    return null;
  });
  const [authChecked, setAuthChecked] = useState(() => {
    if (typeof window !== 'undefined') {
      const serverAuth = (window as any).__AUTH_STATE__;
      return !!(serverAuth?.id);
    }
    return false;
  });

  useEffect(() => {
    // If we already got the user from __AUTH_STATE__, skip the async check
    if (userId) {
      setAuthChecked(true);
      return;
    }

    // Async fallback — check Supabase client session (localStorage)
    supabase.auth.getSession().then(({ data }) => {
      setUserId(data.session?.user?.id ?? null);
      setAuthChecked(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
      setAuthChecked(true);
    });

    return () => subscription.unsubscribe();
  }, [userId]);

  return { userId, authChecked };
}
