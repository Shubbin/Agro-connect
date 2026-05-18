import { Router } from 'express';
import * as paymentController from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/initialize', protect, paymentController.initialize);
router.post('/verify', protect, paymentController.verify);
router.post('/webhook', paymentController.webhook); // Public endpoint for Paystack webhook

export default router;
