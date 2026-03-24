import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("CRITICAL: Supabase environment variables are missing in this environment.")
}

// We pass fallback empty strings so createClient doesn't crash on boot if env vars delay.
// We also explicitly disable auth persistence to prevent the Vite minifier 'S' crash.
export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "", {
  auth: {
    storage: typeof window !== 'undefined' ? window.localStorage : null,
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
})