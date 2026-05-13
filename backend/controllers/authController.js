import { supabase } from '../config/db.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

/**
 * Auth Controller
 * Handles Password-based, OTP-based, and Password Management flows.
 */

// 1. Direct Login (No OTP required for now)
export const login = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    // Check if user exists in our DB
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (fetchError || !user) {
      // Auto-register if user doesn't exist (Quick Onboarding)
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([{ email, name: email.split('@')[0], role: 'user' }])
        .select()
        .single();
      
      if (createError) throw createError;
      return res.json({ message: 'Welcome to Agro-Connect!', user: newUser, token: newUser.id });
    }

    // Direct success - using User ID as the token for now to bypass Supabase Auth issues
    res.json({ message: 'Login successful', user, token: user.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Request OTP (Stub for Direct Login)
export const requestOtp = async (req, res) => {
  const { email } = req.body;
  console.log(`[Auth] OTP requested for ${email} - bypassing and returning success`);
  res.json({ message: 'OTP sent to your email (Bypassed for development)' });
};

// 2. Verify OTP
export const verifyOtp = async (req, res) => {
  const { email, token } = req.body;
  if (!email || !token) return res.status(400).json({ error: 'Email and token are required' });

  try {
    const { data, error } = await supabase.auth.verifyOtp({ email, token, type: 'email' });
    if (error) throw error;
    res.json({ message: 'Login successful', session: data.session, user: data.user });
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// 3. Forgot Password
export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${process.env.FRONTEND_URL}/reset-password`,
        });
        if (error) throw error;
        res.json({ message: 'Reset instructions sent.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 4. Update Password
export const updatePassword = async (req, res) => {
    const { newPassword } = req.body;
    try {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) throw error;
        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 5. Legacy Login (Password-based)
export const legacyLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { data: user, error } = await supabase.from('users').select('*').eq('email', email).single();
    if (error || !user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    // Standardizing on User ID as the token to match enhanced middleware
    const token = user.id;
    const { password: _pw, ...safeUser } = user;
    return res.json({ user: safeUser, token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// 6. Legacy Register
export const register = async (req, res) => {
  const { name, email, password, role = 'user', phone = '' } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    const { data: user, error } = await supabase
      .from('users')
      .insert([{ name, email, phone, password: hashedPassword, role }])
      .select().single();

    if (error) throw error;
    // Standardizing on User ID as the token to match enhanced middleware
    const token = user.id;
    const { password: _pw, ...safeUser } = user;
    return res.json({ user: safeUser, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const logout = async (_req, res) => {
  await supabase.auth.signOut();
  return res.json({ message: 'Signed out' });
};
