import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/balance', protect, getBalance);
router.get('/transactions', protect, getTransactions);

export default router;
