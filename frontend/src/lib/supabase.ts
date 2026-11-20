import { createClient } from "@supabase/supabase-js";

// Supabase environment variables from envsupabase.md
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://naaqlrghezshrxctqlkj.supabase.co";

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "sb_publishable_ykgldbYXFgtjlUlgcUrNsw_3LuN7iPS";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

