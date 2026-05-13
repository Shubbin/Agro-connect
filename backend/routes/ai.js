import { Router } from 'express';
import { handle } from '../controllers/aiController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/:action', protect, handle);
router.post('/:action', protect, handle);
router.get('/', protect, handle);
router.post('/', protect, handle);

export default router;
