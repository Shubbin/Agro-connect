<?php

class UploadController
{
    public function upload()
    {
        if (empty($_FILES)) {
            http_response_code(400);
            echo json_encode(["message" => "No file provided"]);
            return;
        }

        // Get the first file from the upload
        $fileKey = array_keys($_FILES)[0];
        $file = $_FILES[$fileKey];
        
        $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $newName = uniqid() . '.' . $extension;
        $targetPath = __DIR__ . '/../../uploads/' . $newName;

        if (!is_dir(__DIR__ . '/../../uploads/')) {
            mkdir(__DIR__ . '/../../uploads/', 0777, true);
        }

        if (move_uploaded_file($file['tmp_name'], $targetPath)) {
            $url = '/uploads/' . $newName;
            
            // Determine media type
            $mime = $file['type'] ?? '';
            $type = 'file';
            if (strpos($mime, 'image/') === 0) $type = 'image';
            elseif (strpos($mime, 'video/') === 0) $type = 'video';
            elseif (strpos($mime, 'audio/') === 0) $type = 'audio';
            
            echo json_encode([
                "url" => $url,
                "type" => $type,
                "mime" => $mime
            ]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Failed to move uploaded file"]);
        }
    }
}
