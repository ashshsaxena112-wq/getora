import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://wmbzexgvughqlvmpabgf.supabase.co';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_PAkNqmVJ9JfbNReerNxnXw_-bry-UUA';

export const isSupabaseConfigured = () => {
  return (
    typeof supabaseUrl === 'string' &&
    supabaseUrl.startsWith('https://') &&
    typeof supabaseAnonKey === 'string' &&
    supabaseAnonKey.length > 20
  );
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});
