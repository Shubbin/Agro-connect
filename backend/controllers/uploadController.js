import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const upload = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file provided' });
  }

  const url = `/uploads/${req.file.filename}`;
  const mime = req.file.mimetype ?? '';

  let type = 'file';
  if (mime.startsWith('image/')) type = 'image';
  else if (mime.startsWith('video/')) type = 'video';
  else if (mime.startsWith('audio/')) type = 'audio';

  return res.json({ url, type, mime });
};
