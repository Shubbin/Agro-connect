import { Router } from 'express';
import { handle } from '../controllers/aiController.js';

const router = Router();

router.get('/:action', handle);
router.post('/:action', handle);
router.get('/', handle);
router.post('/', handle);

export default router;
