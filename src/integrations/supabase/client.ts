// Supabase client — safe to edit. Types are in ./types.ts.
import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const missingSupabaseEnvVars = [
  !SUPABASE_URL ? 'VITE_SUPABASE_URL' : null,
  !SUPABASE_PUBLISHABLE_KEY ? 'VITE_SUPABASE_PUBLISHABLE_KEY' : null,
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

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = hasSupabaseEnv
  ? createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: {
        storage: localStorage,
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : createMissingEnvClient();
