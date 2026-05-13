import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/', protect, process);

export default router;
