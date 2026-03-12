<?php

require_once __DIR__ . '/../config/db.php';
use Config\Database;

class AuthController
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getConnection();
    }

    public function login()
    {
        $input = json_decode(file_get_contents('php://input'), true);
        $email = $input['email'] ?? '';
        $password = $input['password'] ?? '';

        if (empty($email) || empty($password)) {
            http_response_code(400);
            echo json_encode(["message" => "Email and password are required"]);
            return;
        }

        $stmt = $this->db->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password'])) {
            $token = "agro_token_" . bin2hex(random_bytes(20));
            // Ensure auth_token column exists and store token
            try {
                $this->db->exec("ALTER TABLE users ADD COLUMN auth_token TEXT");
            } catch (Exception $e) {}
            $upd = $this->db->prepare("UPDATE users SET auth_token = ? WHERE id = ?");
            $upd->execute([$token, $user['id']]);

            unset($user['password']);
            $user['auth_token'] = null; // don't expose in user object
            echo json_encode([
                "user"  => $user,
                "token" => $token
            ]);
        } else {
            http_response_code(401);
            echo json_encode(["message" => "Invalid credentials"]);
        }
    }

    public function register()
    {
        $input = json_decode(file_get_contents('php://input'), true);
        $name     = $input['name'] ?? '';
        $email    = $input['email'] ?? '';
        $password = $input['password'] ?? '';
        $role     = $input['role'] ?? 'user';
        $phone    = $input['phone'] ?? '';

        if (empty($name) || empty($email) || empty($password)) {
            http_response_code(400);
            echo json_encode(["message" => "All fields are required"]);
            return;
        }

        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        $token = "agro_token_" . bin2hex(random_bytes(20));

        try {
            // Ensure phone and auth_token columns exist
            try { $this->db->exec("ALTER TABLE users ADD COLUMN phone TEXT"); } catch (Exception $e) {}
            try { $this->db->exec("ALTER TABLE users ADD COLUMN auth_token TEXT"); } catch (Exception $e) {}

            $stmt = $this->db->prepare("INSERT INTO users (name, email, phone, password, role, auth_token) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([$name, $email, $phone, $hashedPassword, $role, $token]);

            $userId = $this->db->lastInsertId();
            $stmt = $this->db->prepare("SELECT id, name, email, role, phone, is_verified, verification_status FROM users WHERE id = ?");
            $stmt->execute([$userId]);
            $user = $stmt->fetch();

            echo json_encode([
                "user"  => $user,
                "token" => $token
            ]);
        } catch (PDOException $e) {
            http_response_code(409);
            echo json_encode(["message" => "User already exists or database error"]);
        }
    }

    public function logout()
    {
        echo json_encode(["message" => "Logged out"]);
    }

    public function getProfile()
    {
        // In a real app, we'd extract user_id from token/session
        // For now, return a placeholder or implement session logic
        echo json_encode(["message" => "Profile logic pending session implementation"]);
    }
}
