import { Router } from 'express';
import * as disputeController from '../controllers/disputeController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// Buyer routes
router.post('/', protect, disputeController.createDispute);
router.get('/my-disputes', protect, disputeController.createDispute); // Reuse or filter in controller

// Admin routes
router.get('/admin/all', protect, disputeController.getAllDisputes);
router.post('/admin/resolve', protect, disputeController.resolveDispute);
router.get('/admin/analyze/:disputeId', protect, disputeController.analyzeDisputeAI);

export default router;
