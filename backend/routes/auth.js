import { Router } from 'express';
import { login, register, logout } from '../controllers/authController.js';
import { getProfile } from '../controllers/profileController.js';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);
router.get('/profile', getProfile);

export default router;

