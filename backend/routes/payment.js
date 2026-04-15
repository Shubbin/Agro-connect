import { Router } from 'express';
import { process } from '../controllers/paymentController.js';

const router = Router();

router.post('/', process);

export default router;
