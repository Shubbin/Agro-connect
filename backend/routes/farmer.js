import { Router } from 'express';
import { getByFarmer } from '../controllers/productController.js';
import { getAll as getFarmerOrders } from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// GET /farmer/products?farmerId=x
router.get('/products', protect, getByFarmer);

// GET /farmer/orders
router.get('/orders', protect, getFarmerOrders);

export default router;
