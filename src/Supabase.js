import { createClient } from '@supabase/supabase-js'

// We MUST use import.meta.env for Vite projects on Vercel
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase environment variables are missing!")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)