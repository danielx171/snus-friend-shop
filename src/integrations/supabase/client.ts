// Supabase client — single browser client for all React islands and hooks.
// Uses PUBLIC_ env vars (Astro convention) with VITE_ fallback for compatibility.
// Import like: import { supabase } from "@/integrations/supabase/client";
import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL ?? import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.PUBLIC_SUPABASE_ANON_KEY ?? import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const missingSupabaseEnvVars = [
  !SUPABASE_URL ? 'PUBLIC_SUPABASE_URL' : null,
  !SUPABASE_ANON_KEY ? 'PUBLIC_SUPABASE_ANON_KEY' : null,
].filter((value): value is string => Boolean(value));

export const hasSupabaseEnv = missingSupabaseEnvVars.length === 0;
export { missingSupabaseEnvVars };

function createMissingEnvClient(): SupabaseClient<Database> {
  return new Proxy(
    {},
    {
      get() {
        throw new Error(`Missing API Keys: ${missingSupabaseEnvVars.join(', ')}`);
      },
    },
  ) as SupabaseClient<Database>;
}

export const supabase = hasSupabaseEnv
  ? createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        storage: typeof window !== 'undefined' ? localStorage : undefined,
        persistSession: typeof window !== 'undefined',
        autoRefreshToken: typeof window !== 'undefined',
      },
    })
  : createMissingEnvClient();
