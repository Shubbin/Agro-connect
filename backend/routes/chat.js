import { Router } from 'express';
import { getMessages, sendMessage, getConversations, getUsers } from '../controllers/chatController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/messages', protect, getMessages);
router.get('/conversations', protect, getConversations);
router.get('/users', protect, getUsers);
router.post('/send', protect, sendMessage);

export default router;
