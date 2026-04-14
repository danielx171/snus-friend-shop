import process from 'node:process';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let cachedClient: SupabaseClient | null = null;

const resolveSupabaseUrl = () =>
  process.env.SUPABASE_URL?.trim() ||
  process.env.PUBLIC_SUPABASE_URL?.trim() ||
  process.env.VITE_SUPABASE_URL?.trim() ||
  null;

export const getSupabaseAdmin = () => {
  if (cachedClient) return cachedClient;

  const supabaseUrl = resolveSupabaseUrl();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || null;

  if (!supabaseUrl) {
    throw new Error(
      'Missing SUPABASE_URL (or PUBLIC_SUPABASE_URL/VITE_SUPABASE_URL fallback) for SEO sync scripts.',
    );
  }

  if (!serviceRoleKey) {
    throw new Error(
      'Missing SUPABASE_SERVICE_ROLE_KEY. SEO sync scripts need a server-side key to write audit data.',
    );
  }

  cachedClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      headers: {
        'x-snusfriend-script': 'seo-audit-sync',
      },
    },
  });

  return cachedClient;
};

export const chunk = <T>(items: T[], size: number) => {
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
};
