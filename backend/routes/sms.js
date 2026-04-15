import { Router } from 'express';
import { handleSimulate } from '../controllers/smsController.js';

const router = Router();

router.post('/simulate', handleSimulate);

export default router;
