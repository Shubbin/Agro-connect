import { supabase, supabaseAdmin } from '../config/db.js';
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

    // Upload buffer directly to Supabase storage bucket 'agro-uploads' using supabaseAdmin to bypass RLS policies
    const { data, error } = await supabaseAdmin.storage
      .from('agro-uploads')
      .upload(fileName, req.file.buffer, {
        contentType: mime,
        upsert: true
      });

    if (error) {
      console.error('Supabase upload error:', error.message);
      
      // Fallback: If bucket does not exist, auto-create it using the Service Role admin key and retry
      if (error.message.includes('Bucket not found') || error.message.includes('bucket_not_found')) {
        console.log(`[Upload] Bucket 'agro-uploads' not found. Attempting programmatic auto-creation...`);
        const { error: createError } = await supabaseAdmin.storage.createBucket('agro-uploads', {
          public: true
        });
        
        if (createError) {
          console.error('[Upload] Failed to auto-create storage bucket:', createError.message);
          return res.status(500).json({ message: 'Cloud storage bucket does not exist and auto-creation failed: ' + createError.message });
        }
        
        console.log(`[Upload] Bucket 'agro-uploads' created successfully. Retrying file upload...`);
        const { data: retryData, error: retryError } = await supabaseAdmin.storage
          .from('agro-uploads')
          .upload(fileName, req.file.buffer, {
            contentType: mime,
            upsert: true
          });
          
        if (retryError) {
          console.error('[Upload] Retry upload failed:', retryError.message);
          return res.status(500).json({ message: 'Failed to upload to cloud storage after bucket auto-creation: ' + retryError.message });
        }
      } else {
        return res.status(500).json({ message: 'Failed to upload to cloud storage: ' + error.message });
      }
    }

    // Retrieve the public URL for the newly uploaded file
    const { data: publicUrlData } = supabaseAdmin.storage
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
