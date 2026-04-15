import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter your email and password' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Wrong email or password. Please check and try again.' });
    }

    const token = 'agro_token_' + crypto.randomBytes(20).toString('hex');

    // Update token
    user.auth_token = token;
    await user.save();

    const userData = user.toObject();
    const { password: _pw, ...safeUser } = userData;
    return res.json({ user: safeUser, token });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Something went wrong on our end. Please try again later.' });
  }
};

export const register = async (req, res) => {
  const { name, email, password, role = 'user', phone = '' } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please fill in all the details' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const token = 'agro_token_' + crypto.randomBytes(20).toString('hex');

  try {
    const user = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
      auth_token: token
    });

    await user.save();

    const userData = user.toObject();
    const { password: _pw, ...safeUser } = userData;

    return res.json({ user: safeUser, token });
  } catch (err) {
    console.error('Register error detail:', err);
    if (err.code === 11000) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }
    return res.status(500).json({ message: 'Something went wrong: ' + err.message });
  }
};

export const logout = (_req, res) => {
  return res.json({ message: 'You have signed out' });
};


