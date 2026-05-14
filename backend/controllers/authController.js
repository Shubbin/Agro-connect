import { supabase } from '../config/db.js';
import bcrypt from 'bcryptjs';

// 1. Login
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error || !user) {
      return res.status(404).json({ error: 'Account not found' });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Standardizing on User ID as the token
    const { password: _pw, ...safeUser } = user;
    res.json({ message: 'Login successful', user: safeUser, token: user.id });
  } catch (error) {
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
    // Check if user already exists
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    
    // Insert new user - REQUIRES SERVICE ROLE KEY
    const { data: newUser, error } = await supabase
      .from('users')
      .insert([{ 
        name, 
        email, 
        phone, 
        password: hashedPassword, 
        role,
        is_verified: false,
        verification_status: 'pending'
      }])
      .select()
      .single();

    if (error) {
      console.error('[REGISTRATION] Supabase Error:', error);
      throw new Error(error.message);
    }

    const { password: _pw, ...safeUser } = newUser;
    return res.json({ user: safeUser, token: newUser.id });
  } catch (err) {
    console.error('[REGISTRATION] System Error:', err.message);
    res.status(500).json({ error: 'Registration failed: ' + err.message });
  }
};

// Helpers
export const logout = async (_req, res) => res.json({ message: 'Signed out' });
export const forgotPassword = async (req, res) => res.json({ message: 'Reset email sent' });
export const getProfile = async (req, res) => res.json(req.user);
