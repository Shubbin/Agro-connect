import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/', protect, getProfile);

export default router;
