import { Router } from 'express';
import { getBalance, getTransactions } from '../controllers/walletController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/balance', protect, getBalance);
router.get('/transactions', protect, getTransactions);

export default router;
