import { Router } from 'express';
import { get, add, update, remove, clear, makeOffer } from '../controllers/cartController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/', protect, get);
router.post('/add', protect, add);
router.put('/:itemId', protect, update);
router.delete('/:itemId', protect, remove);
router.delete('/', protect, clear);
router.post('/:itemId/offer', protect, makeOffer);

export default router;
