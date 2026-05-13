import { Router } from 'express';
import { getAll, getById, create, update, remove } from '../controllers/productController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/all', getAll);
router.get('/', getAll);
router.get('/:id', getById);
router.post('/', protect, create);
router.put('/:id', protect, update);
router.delete('/:id', protect, remove);

export default router;

