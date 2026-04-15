import { Router } from 'express';
import { getByFarmer } from '../controllers/productController.js';
import { getAll as getFarmerOrders } from '../controllers/orderController.js';

const router = Router();

// GET /farmer/products?farmerId=x
router.get('/products', getByFarmer);

// GET /farmer/orders
router.get('/orders', getFarmerOrders);

export default router;
