import { Router } from 'express';
import { getBalance, getTransactions } from '../controllers/walletController.js';

const router = Router();

router.get('/balance', getBalance);
router.get('/transactions', getTransactions);

export default router;
