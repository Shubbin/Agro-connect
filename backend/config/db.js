import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';
import ws from 'ws';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // MUST be the Service Role Secret for Backend

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ CRITICAL: Missing Supabase URL or Service Role Key in .env');
}

console.log('🔍 BACKEND: ENV CHECK:', {
  hasUrl: !!supabaseUrl,
  hasService: !!supabaseKey,
  hasAnon: !!process.env.SUPABASE_ANON_KEY
});
console.log('🔍 BACKEND: SUPABASE URL:', supabaseUrl);

export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      },
      realtime: {
        transport: ws
      }
    })
  : null;

const connectDB = async () => {
  try {
    console.log('🚀 Supabase client initialized (Backend Mode)');
  } catch (err) {
    console.error('Supabase initialization warning:', err.message);
  }
};

export default connectDB;
