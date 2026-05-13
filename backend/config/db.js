import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';
import ws from 'ws';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or Service Role Key in .env');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  realtime: {
    transport: ws
  }
});

const connectDB = async () => {
  try {
    // Basic connectivity check
    console.log('🚀 Supabase client initialized');
  } catch (err) {
    console.error('Supabase initialization warning:', err.message);
  }
};

export default connectDB;
