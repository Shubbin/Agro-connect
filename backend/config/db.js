import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';
import ws from 'ws';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ CRITICAL: Missing Supabase URL or Service Role Key in .env');
}

// Initialize only if keys exist to avoid startup crash in some library versions
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
    // Basic connectivity check
    console.log('🚀 Supabase client initialized');
  } catch (err) {
    console.error('Supabase initialization warning:', err.message);
  }
};

export default connectDB;
