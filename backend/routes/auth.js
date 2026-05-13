import { Router } from 'express';
import * as authController from '../controllers/authController.js';

const router = Router();

// Password-based (Legacy)
router.post('/login', authController.login);
router.post('/register', authController.register);

// Passwordless (OTP)
router.post('/otp/request', authController.requestOtp);
router.post('/otp/verify', authController.verifyOtp);

// Password Management
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.updatePassword);

router.post('/logout', authController.logout);

export default router;
