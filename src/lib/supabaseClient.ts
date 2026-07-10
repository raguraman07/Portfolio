import { createClient } from '@supabase/supabase-js';

// For Vite: prefer VITE_ env vars (import.meta.env). Fall back to NEXT_PUBLIC_ variants if present.
const supabaseUrl = (import.meta.env && import.meta.env.VITE_SUPABASE_URL) ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = (import.meta.env && import.meta.env.VITE_SUPABASE_ANON_KEY) ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Warn at runtime if env is missing
  console.warn('Supabase env vars not found. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (or NEXT_PUBLIC_ variants).');
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '');
export default supabase;
