import User from '../models/User.js';

/**
 * Protect middleware: Validates the user's auth_token
 */
export const protect = async (req, res, next) => {
  const auth = req.headers.authorization ?? '';
  const match = auth.match(/^Bearer\s+(.+)$/);
  
  if (!match) {
    return res.status(401).json({ error: 'Authentication required: No token' });
  }

  try {
    const token = match[1];

    // In this setup, we use the User ID as the token
    const user = await User.findById(token);

    if (!user) {
      return res.status(401).json({ error: 'Authentication required: Invalid session' });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Authentication required: System error' });
  }
};

/**
 * Merchant API Key middleware
 */
export const merchantApiKey = async (req, res, next) => {
  // Add MongoDB implementation for API keys if needed
  next();
};
