import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// HashRouter fix: Supabase puts tokens in URL hash (#access_token=...)
// but HashRouter uses # for routing (#/reset-password). When both combine,
// the token gets lost. This extracts and processes it manually.
;(async () => {
  const hash = window.location.hash
  const tokenMatch = hash.match(/access_token=([^&]+)/)
  const refreshMatch = hash.match(/refresh_token=([^&]+)/)
  if (tokenMatch && refreshMatch) {
    await supabase.auth.setSession({
      access_token: tokenMatch[1],
      refresh_token: refreshMatch[1],
    })
    // Clean up URL — keep only the route part
    const routePart = hash.split('#')[1]?.split('?')[0] || '/'
    window.location.hash = '#' + routePart
  }
})()
