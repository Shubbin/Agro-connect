import { supabase } from '../config/db.js';

/**
 * Protect middleware: Validates the user's auth_token
 */
export const protect = async (req, res, next) => {
  const auth = req.headers.authorization ?? '';
  const match = auth.match(/^Bearer\s+(.+)$/);
  
  if (!match) return res.status(401).json({ error: 'Unauthorized: No token provided' });

  try {
    const token = match[1];

    // Check if it's a valid UUID (User ID) from our DB
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', token)
      .single();

    if (error || !user) return res.status(401).json({ error: 'Unauthorized: Session expired or invalid' });

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

/**
 * Merchant API Key middleware: Validates the x-api-key header
 */
export const merchantApiKey = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) return res.status(401).json({ error: 'API Key missing' });

  try {
    const { data: keyData, error } = await supabase
      .from('merchant_api_keys')
      .select('*, merchant:users(*)')
      .eq('api_key', apiKey)
      .eq('is_active', true)
      .single();

    if (error || !keyData) return res.status(401).json({ error: 'Invalid or inactive API Key' });

    req.merchant = keyData.merchant;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Authentication failed' });
  }
};
