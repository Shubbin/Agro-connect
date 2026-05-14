import { supabase } from '../config/db.js';

/**
 * Protect middleware: Forensic Audit Version
 * 1. Checks for Bearer token
 * 2. Validates against Supabase 'users' table
 * 3. Handles 401s gracefully for the frontend
 */
export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  // 1. Check if header exists
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }

  // 2. Extract token
  const token = authHeader.startsWith('Bearer ') 
    ? authHeader.split(' ')[1] 
    : authHeader;

  if (!token || token === 'null' || token === 'undefined') {
    return res.status(401).json({ error: 'Valid token required' });
  }

  try {
    // 3. Verify User in Supabase
    // We are currently using the User ID as the token for direct session management
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', token)
      .single();

    if (error || !user) {
      console.warn(`[AUTH] Unauthorized access attempt with token: ${token.substring(0, 8)}...`);
      return res.status(401).json({ error: 'Session expired or invalid. Please login again.' });
    }

    // 4. Attach user to request
    req.user = user;
    next();
  } catch (err) {
    console.error('[AUTH] System Error:', err.message);
    return res.status(401).json({ error: 'Authentication service temporarily unavailable' });
  }
};

/**
 * Merchant API Key middleware
 */
export const merchantApiKey = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) return res.status(401).json({ error: 'API key required' });
  
  // Optional: Add logic to verify keys in Supabase
  next();
};
