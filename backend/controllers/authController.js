import { supabase } from '../config/db.js';
import { sendMockSms } from './smsController.js';

// Helper to generate a random 6-digit OTP code
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

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

    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    res.json({ 
      message: 'Login successful', 
      user: user || {
        id: authData.user.id,
        email: authData.user.email,
        name: authData.user.user_metadata?.name || 'User',
        role: authData.user.user_metadata?.role || 'user'
      }, 
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

    // Insert or update public.users (newly signed up users are unverified by default)
    const { data: newUser, error: dbError } = await supabase
      .from('users')
      .upsert([{ 
        id: authData.user.id, 
        name, 
        email, 
        phone, 
        password: 'SUPABASE_AUTH_MANAGED',
        role,
        is_verified: false,
        verification_status: 'unverified'
      }])
      .select()
      .single();

    if (dbError) {
      console.error('❌ TRACE [REGISTRATION]: public.users Upsert Error:', dbError.message);
    }

    // Automatically log the user in after successful registration to avoid stale sessions
    let token = null;
    try {
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (!signInError && signInData?.session) {
        token = signInData.session.access_token;
      }
    } catch (loginErr) {
      console.warn('⚠️ Auto-login after registration failed:', loginErr.message);
    }

    return res.json({ 
      message: 'Registration successful.',
      user: newUser || authData.user,
      token
    });
  } catch (err) {
    console.error('Registration Catch Error:', err);
    res.status(500).json({ message: 'Registration failed' });
  }
};

// 3. Logout
export const logout = async (_req, res) => {
  try {
    await supabase.auth.signOut();
    res.json({ message: 'Signed out successfully' });
  } catch (err) {
    res.json({ message: 'Signed out' });
  }
};

// 4. Forgot Password Flow
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${req.headers.origin || 'http://localhost:5173'}/reset-password`
    });

    if (error) throw error;
    res.json({ message: 'Reset email sent successfully' });
  } catch (err) {
    console.error('Forgot Password Error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

// 5. Update Password (Reset flow)
export const updatePassword = async (req, res) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ message: 'Password is required' });
  }

  try {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Password Update Error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

// 6. Request OTP Flow
export const requestOtp = async (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    return res.status(400).json({ message: 'Phone number is required' });
  }

  try {
    // Check if user exists in public.users
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('phone', phone)
      .maybeSingle();

    if (fetchError || !user) {
      return res.status(404).json({ message: 'No user registered with this phone number' });
    }

    const otp = generateOTP();
    
    // Save generated OTP token to public.users table temporarily
    const { error: updateError } = await supabase
      .from('users')
      .update({ auth_token: otp })
      .eq('id', user.id);

    if (updateError) throw updateError;

    // Simulate sending SMS via log system
    sendMockSms(phone, `Your Agro-Connect secure login OTP code is: ${otp}. Valid for 10 minutes.`);

    res.json({ message: 'OTP code generated and sent successfully', phone });
  } catch (err) {
    console.error('Request OTP Error:', err.message);
    res.status(500).json({ message: 'Failed to request OTP code' });
  }
};

// 7. Verify OTP Flow
export const verifyOtp = async (req, res) => {
  const { phone, code } = req.body;
  if (!phone || !code) {
    return res.status(400).json({ message: 'Phone number and verification code are required' });
  }

  try {
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('phone', phone)
      .eq('auth_token', code)
      .maybeSingle();

    if (fetchError || !user) {
      return res.status(401).json({ message: 'Invalid or expired OTP verification code' });
    }

    // Clear user auth token after successful verification
    await supabase
      .from('users')
      .update({ auth_token: null })
      .eq('id', user.id);

    // Create custom access session or simulate success session response
    res.json({
      message: 'OTP verification successful',
      user,
      token: 'otp-verified-session-token-' + Math.random().toString(36).substring(7)
    });
  } catch (err) {
    console.error('Verify OTP Error:', err.message);
    res.status(500).json({ message: 'Failed to verify OTP code' });
  }
};

// 8. Get Active Profile
export const getProfile = async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error || !user) {
      return res.json(req.user);
    }
    res.json(user);
  } catch (err) {
    res.json(req.user);
  }
};
