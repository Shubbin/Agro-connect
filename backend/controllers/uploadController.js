import { supabase } from '../config/db.js';
import path from 'path';

export const upload = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file provided' });
  }

  try {
    const ext = path.extname(req.file.originalname);
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    const mime = req.file.mimetype ?? 'application/octet-stream';

    console.log(`[Upload] Uploading ${fileName} (${req.file.size} bytes) to Supabase Storage...`);

    // Upload buffer directly to Supabase storage bucket 'agro-uploads'
    const { data, error } = await supabase.storage
      .from('agro-uploads')
      .upload(fileName, req.file.buffer, {
        contentType: mime,
        upsert: true
      });

    if (error) {
      console.error('Supabase upload error:', error.message);
      // Fallback: If bucket does not exist or isn't accessible, try auto-creating or return status error
      return res.status(500).json({ message: 'Failed to upload to cloud storage: ' + error.message });
    }

    // Retrieve the public URL for the newly uploaded file
    const { data: publicUrlData } = supabase.storage
      .from('agro-uploads')
      .getPublicUrl(fileName);

    const url = publicUrlData.publicUrl;

    let type = 'file';
    if (mime.startsWith('image/')) type = 'image';
    else if (mime.startsWith('video/')) type = 'video';
    else if (mime.startsWith('audio/')) type = 'audio';

    console.log(`[Upload] File uploaded successfully. Public URL: ${url}`);

    return res.json({ url, type, mime });
  } catch (err) {
    console.error('Upload Controller Error:', err);
    return res.status(500).json({ message: 'Upload failed: ' + err.message });
  }
};
