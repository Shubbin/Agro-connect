import { Router } from 'express';
import { getSummary, getFarmerDashboard } from '../controllers/statsController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/', getSummary);
router.get('/farmer', protect, getFarmerDashboard);

export default router;
