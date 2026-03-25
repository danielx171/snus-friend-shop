// Server-side only — NEVER import this in client code.
// Uses SUPABASE_SERVICE_ROLE_KEY for read-only data fetching in +data.ts files.

import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/integrations/supabase/types'

const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !key) {
  console.warn('[supabase-server] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY — SSR data fetching will fail')
}

export const supabaseServer = createClient<Database>(url ?? '', key ?? '', {
  auth: { persistSession: false },
})
