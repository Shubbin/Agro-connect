import { Router } from 'express';
import { handle } from '../controllers/aiController.js';
import { protect } from '../middleware/auth.js';
import { supabase } from '../config/db.js';

const router = Router();

// Optional protect middleware to identify logged-in users while still allowing guests
const optionalProtect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next();
  }
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
  if (!token || token === 'null' || token === 'undefined') {
    return next();
  }
  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (!error && data?.user) {
      req.user = data.user;
    }
  } catch (err) {
    // Ignore error and proceed as guest
  }
  next();
};

router.post('/assistant', optionalProtect, handle);
router.get('/:action', protect, handle);
router.post('/:action', protect, handle);
router.get('/', protect, handle);
router.post('/', protect, handle);

export default router;
