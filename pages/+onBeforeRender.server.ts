// pages/+onBeforeRender.server.ts
// Reads auth and theme cookies from the HTTP request.
// Populates pageContext.supabaseSession and pageContext.theme.
import { createClient } from '@supabase/supabase-js'

export async function onBeforeRender(pageContext) {
  const cookie = pageContext.headers?.cookie ?? ''

  // Parse theme cookie
  const themeMatch = cookie.match(/theme=(\w+)/)
  const theme = themeMatch?.[1] ?? 'velo'

  // Parse Supabase auth from cookies (if present)
  let supabaseSession = null
  try {
    const url = process.env.SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (url && key) {
      // Extract access_token and refresh_token from cookies
      const accessToken = cookie.match(/sb-access-token=([^;]+)/)?.[1]
      const refreshToken = cookie.match(/sb-refresh-token=([^;]+)/)?.[1]
      if (accessToken && refreshToken) {
        const supabase = createClient(url, key, { auth: { persistSession: false } })
        const { data } = await supabase.auth.getUser(accessToken)
        if (data?.user) {
          supabaseSession = { user: data.user, accessToken }
        }
      }
    }
  } catch {
    // Auth cookie parsing failed — continue without session
  }

  return {
    pageContext: {
      theme,
      supabaseSession,
    },
  }
}
