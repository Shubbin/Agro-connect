import { Router } from 'express';
import { getAll, getById, create, updateTracking, confirmDelivery } from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/', protect, getAll);
router.get('/:id', protect, getById);
router.post('/', protect, create);
router.post('/update-tracking', protect, updateTracking);
router.post('/confirm-delivery', protect, confirmDelivery);

export default router;
