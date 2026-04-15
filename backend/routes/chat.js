import { Router } from 'express';
import { getMessages, sendMessage, getConversations, getUsers } from '../controllers/chatController.js';

const router = Router();

router.get('/messages', getMessages);
router.get('/conversations', getConversations);
router.get('/users', getUsers);
router.post('/send', sendMessage);

export default router;
