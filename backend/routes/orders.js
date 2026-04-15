import { Router } from 'express';
import { getAll, getById, create, updateTracking, confirmDelivery, getFarmerOrders } from '../controllers/orderController.js';

const router = Router();

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', create);
router.post('/update-tracking', updateTracking);
router.post('/confirm-delivery', confirmDelivery);

export default router;
