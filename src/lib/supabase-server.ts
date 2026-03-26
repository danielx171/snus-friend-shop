// Server-side Supabase client using service role key.
// For use in Astro Actions, API routes, and server-side rendering.
// Never import this from client-side code — the service role key bypasses RLS.
import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.SUPABASE_URL ?? import.meta.env.PUBLIC_SUPABASE_URL ?? '';
const key = import.meta.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

export function getServiceClient() {
  if (!url || !key) {
    throw new Error('Supabase server credentials not configured');
  }
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
