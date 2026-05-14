import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ FRONTEND: Missing Supabase URL or Anon Key');
}

console.log('🔍 FRONTEND SUPABASE URL:', supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
