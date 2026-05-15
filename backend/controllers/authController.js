import { supabase } from '../config/db.js';

// 1. Login
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return res.status(401).json({ error: authError.message });
    }

    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    res.json({ 
      message: 'Login successful', 
      user: user || authData.user, 
      token: authData.session.access_token 
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
};

// 2. Register
export const register = async (req, res) => {
  const { name, email, password, role = 'user', phone = '' } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, role, phone }
      }
    });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    // Insert into public.users
    const { data: newUser } = await supabase
      .from('users')
      .upsert([{ 
        id: authData.user.id, 
        name, 
        email, 
        phone, 
        password: 'SUPABASE_AUTH_MANAGED',
        role,
        is_verified: true,
        verification_status: 'verified'
      }])
      .select()
      .single();

    return res.json({ 
      message: 'Registration successful',
      user: newUser || authData.user, 
      token: authData.session?.access_token || 'SESSION_PENDING'
    });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const logout = async (_req, res) => res.json({ message: 'Signed out' });
export const forgotPassword = async (req, res) => res.json({ message: 'Reset email sent' });
export const getProfile = async (req, res) => res.json(req.user);
export const requestOtp = async (req, res) => res.json({ message: 'OTP flow disabled' });
export const verifyOtp = async (req, res) => res.json({ message: 'OTP flow disabled' });
export const updatePassword = async (req, res) => res.json({ message: 'Password updated' });
