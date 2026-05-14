import { supabase } from '../config/db.js';

/**
 * Protect middleware: Forensic Audit Version
 * 1. Checks for Bearer token
 * 2. Validates against Supabase 'users' table
 * 3. Handles 401s gracefully for the frontend
 */
export const protect = async (req, res, next) => {
  console.log("🔍 TRACE: HEADERS:", req.headers);
  const authHeader = req.headers.authorization;
  console.log("🔍 TRACE: AUTH HEADER:", authHeader);
  
  // 1. Check if header exists
  if (!authHeader) {
    console.log("❌ TRACE: NO AUTH HEADER");
    return res.status(401).json({ error: 'Authorization header missing' });
  }

  // 2. Extract token
  const token = authHeader.startsWith('Bearer ') 
    ? authHeader.split(' ')[1] 
    : authHeader;

  console.log("🔍 TRACE: TOKEN:", token === 'undefined' ? 'undefined (RACE CONDITION)' : token.substring(0, 10) + "...");

  if (!token || token === 'null' || token === 'undefined') {
    console.log("❌ TRACE: INVALID TOKEN STRING");
    return res.status(401).json({ error: 'Valid token required' });
  }

  try {
    // 3. Decode JWT Payload for Forensic Audit
    try {
      const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
      console.log("🔍 TRACE: JWT PAYLOAD:", {
        aud: payload.aud,
        exp: payload.exp,
        role: payload.role,
        iss: payload.iss,
        sub: payload.sub,
        isExpired: Math.floor(Date.now() / 1000) > payload.exp
      });
    } catch (jwtErr) {
      console.warn("⚠️ TRACE: Could not decode JWT payload:", jwtErr.message);
    }

    // 4. Verify User in Supabase Auth
    const { data, error } = await supabase.auth.getUser(token);
    
    console.log("🔍 TRACE: SUPABASE USER:", data?.user?.id || 'NOT FOUND');
    console.log("🔍 TRACE: SUPABASE ERROR:", error);

    if (error || !data.user) {
      console.warn(`[AUTH] Unauthorized: ${error?.message || 'User not found'}`);
      return res.status(401).json({ error: 'Session expired or invalid. Please login again.' });
    }

    // 5. Attach user to request
    req.user = data.user;
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
