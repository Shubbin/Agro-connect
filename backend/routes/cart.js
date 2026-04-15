import { Router } from 'express';
import { get, add, update, remove, clear, makeOffer } from '../controllers/cartController.js';

const router = Router();

router.get('/', get);
router.post('/add', add);
router.put('/:itemId', update);
router.delete('/:itemId', remove);
router.delete('/', clear);
router.post('/:itemId/offer', makeOffer);

export default router;
