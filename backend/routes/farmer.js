import { protect } from '../middleware/auth.js';

const router = Router();

// GET /farmer/products?farmerId=x
router.get('/products', protect, getByFarmer);

// GET /farmer/orders
router.get('/orders', protect, getFarmerOrders);

export default router;
