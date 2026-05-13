import { Router } from 'express';
import * as b2bController from '../controllers/b2bController.js';
import { protect, merchantApiKey } from '../middleware/auth.js';

const router = Router();

// Internal merchant routes
router.post('/keys', protect, b2bController.generateApiKey);
router.get('/keys', protect, b2bController.getApiKeys);
router.get('/stats', protect, b2bController.getTradeStats);

// External B2B API
router.post('/trade/session', merchantApiKey, b2bController.createTradeSession);

export default router;
