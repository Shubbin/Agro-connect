import { Router } from 'express';
import { getAll, getById, getByFarmer, create, update, remove } from '../controllers/productController.js';

const router = Router();

router.get('/all', getAll);
router.get('/', getAll);
router.get('/:id', getById);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);

export default router;

