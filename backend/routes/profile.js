import { Router } from 'express';
import { getProfile, updateProfile, submitVerification, upgradeToSeller } from '../controllers/profileController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/', protect, getProfile);
router.put('/update', protect, updateProfile);
router.post('/verify', protect, submitVerification);
router.post('/upgrade', protect, upgradeToSeller);

export default router;
