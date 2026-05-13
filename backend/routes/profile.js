import { Router } from 'express';
import { getProfile } from '../controllers/profileController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/', protect, getProfile);

export default router;
