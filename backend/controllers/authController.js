import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// 1. Direct Login
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (password && !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Standardizing on User ID as the token
    res.json({ message: 'Login successful', user, token: user._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Legacy Register
export const register = async (req, res) => {
  const { name, email, password, role = 'user', phone = '' } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role
    });

    await newUser.save();

    const token = newUser._id;
    return res.json({ user: newUser, token });
  } catch (err) {
    console.error('Registration error:', err.message);
    res.status(500).json({ message: 'Could not complete registration' });
  }
};

// Stubs for other auth functions
export const requestOtp = async (req, res) => res.json({ message: 'Bypassed' });
export const verifyOtp = async (req, res) => res.json({ message: 'Bypassed' });
export const forgotPassword = async (req, res) => res.json({ message: 'Reset link sent' });
export const updatePassword = async (req, res) => res.json({ message: 'Password updated' });
export const logout = async (_req, res) => res.json({ message: 'Signed out' });
