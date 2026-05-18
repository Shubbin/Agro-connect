import { Router } from 'express';
import multer from 'multer';
import { upload as uploadHandler } from '../controllers/uploadController.js';

// Use memory storage to prevent ephemeral disk wipe issues on Render
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/', protect, upload.single('file'), uploadHandler);

export default router;
