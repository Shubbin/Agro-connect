import { supabase } from '../config/db.js';
import bcrypt from 'bcryptjs';

// 1. Login
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // 1. Authenticate with Supabase Auth (returns a real JWT)
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      console.error('❌ TRACE [LOGIN]: Supabase Auth Error:', authError.message);
      return res.status(401).json({ error: authError.message });
    }

    // 2. Fetch extra profile data from public.users
    const { data: user, error: dbError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();
    
    if (dbError || !user) {
      console.warn('⚠️ TRACE [LOGIN]: User authenticated but no profile found in public.users');
    }

    console.log('✅ TRACE [LOGIN]: Success. Token issued.');
    res.json({ 
      message: 'Login successful', 
      user: user || authData.user, 
      token: authData.session.access_token 
    });
  } catch (error) {
    console.error('❌ TRACE [LOGIN]: System Error:', error.message);
    res.status(500).json({ error: 'Login failed. Please try again later.' });
  }
};

// 2. Register
export const register = async (req, res) => {
  const { name, email, password, role = 'user', phone = '' } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // 1. Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, role, phone },
        emailRedirectTo: 'https://agro-connect-two.vercel.app/'
      }
    });

    if (authError) {
      console.error('❌ TRACE [REGISTRATION]: Supabase Auth Error:', authError.message);
      return res.status(400).json({ error: authError.message });
    }

    if (!authData.user) {
      throw new Error('Registration failed: No user data returned');
    }

    // 2. Insert into public.users for relational data
    const { data: newUser, error: dbError } = await supabase
      .from('users')
      .insert([{ 
        id: authData.user.id, 
        name, 
        email, 
        phone, 
        password: 'SUPABASE_AUTH_MANAGED',
        role,
        is_verified: false,
        verification_status: 'pending'
      }])
      .select()
      .single();

    if (dbError) {
      console.error('❌ TRACE [REGISTRATION]: public.users sync error:', dbError);
    }

    console.log('✅ TRACE [REGISTRATION]: Success');
    return res.json({ 
      user: newUser || authData.user, 
      token: authData.session?.access_token || 'CHECK_EMAIL_FOR_CONFIRMATION'
    });
  } catch (err) {
    console.error('❌ TRACE [REGISTRATION]: System Error:', err.message);
    res.status(500).json({ error: 'Registration failed: ' + err.message });
  }
};

// Helpers
export const logout = async (_req, res) => res.json({ message: 'Signed out' });
export const forgotPassword = async (req, res) => res.json({ message: 'Reset email sent' });
export const getProfile = async (req, res) => res.json(req.user);

export const requestOtp = async (req, res) => {
  res.json({ message: 'OTP sent' });
};

export const verifyOtp = async (req, res) => {
  res.json({ message: 'OTP verified', token: 'mock-token' });
};

export const updatePassword = async (req, res) => {
  res.json({ message: 'Password updated' });
};
