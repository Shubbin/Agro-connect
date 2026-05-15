import { supabase } from '../config/db.js';

// 1. Login
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      console.error('❌ TRACE [LOGIN]: Auth Failed:', authError.message);
      return res.status(401).json({ message: authError.message });
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
    res.status(500).json({ message: 'Login failed' });
  }
};

// 2. Register
export const register = async (req, res) => {
  const { name, email, password, role = 'user', phone = '' } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Use Admin API to create user with auto-confirmed email
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name, role, phone }
    });

    if (authError) {
      console.error('❌ TRACE [REGISTRATION]: Supabase Admin Auth Error:', {
        message: authError.message,
        status: authError.status,
        code: authError.code
      });
      return res.status(400).json({ message: authError.message });
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
      message: 'Registration successful. You can now log in.',
      user: newUser || authData.user
    });
  } catch (err) {
    console.error('Registration Catch Error:', err);
    res.status(500).json({ message: 'Registration failed' });
  }
};

export const logout = async (_req, res) => res.json({ message: 'Signed out' });
export const forgotPassword = async (req, res) => res.json({ message: 'Reset email sent' });
export const getProfile = async (req, res) => res.json(req.user);
export const requestOtp = async (req, res) => res.json({ message: 'OTP flow disabled' });
export const verifyOtp = async (req, res) => res.json({ message: 'OTP flow disabled' });
export const updatePassword = async (req, res) => res.json({ message: 'Password updated' });
