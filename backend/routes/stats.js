import { Router } from 'express';
import { getSummary } from '../controllers/statsController.js';

const router = Router();

router.get('/', getSummary);

export default router;
