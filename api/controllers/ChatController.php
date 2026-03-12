<?php

require_once __DIR__ . '/../config/db.php';
use Config\Database;

class ChatController
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getConnection();
    }

    // Get the current user from the Authorization token
    private function getCurrentUserId()
    {
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        if (preg_match('/^Bearer\s+(.+)$/', $authHeader, $matches)) {
            $token = $matches[1];
            $stmt = $this->db->prepare("SELECT id FROM users WHERE auth_token = ?");
            $stmt->execute([$token]);
            $user = $stmt->fetch();
            return $user ? $user['id'] : null;
        }
        return null;
    }

    public function getMessages($conversationId)
    {
        if (!$conversationId) {
            echo json_encode([]);
            return;
        }

        // conversationId format: "{userId1}_{userId2}"
        $parts = explode('_', $conversationId);
        if (count($parts) < 2) {
            echo json_encode([]);
            return;
        }
        [$id1, $id2] = $parts;

        $stmt = $this->db->prepare("
            SELECT m.*, u.name as senderName
            FROM messages m
            JOIN users u ON m.sender_id = u.id
            WHERE (m.sender_id = ? AND m.receiver_id = ?)
               OR (m.sender_id = ? AND m.receiver_id = ?)
            ORDER BY m.timestamp ASC
        ");
        $stmt->execute([$id1, $id2, $id2, $id1]);
        echo json_encode($stmt->fetchAll());
    }

    public function sendMessage()
    {
        $input = json_decode(file_get_contents('php://input'), true);
        $receiverId = $input['receiverId'] ?? null;
        $content    = trim($input['content'] ?? '');
        $productId  = $input['productId'] ?? null;
        $mediaUrl   = $input['mediaUrl'] ?? null;
        $mediaType  = $input['mediaType'] ?? null;

        // Try to get sender from token, fallback to input if provided (dev mode)
        $senderId = $this->getCurrentUserId() ?? ($input['senderId'] ?? null);

        if (!$senderId || !$receiverId || (empty($content) && !$mediaUrl)) {
            http_response_code(400);
            echo json_encode(['error' => 'senderId, receiverId and (content or media) are required']);
            return;
        }

        $stmt = $this->db->prepare("INSERT INTO messages (sender_id, receiver_id, content, product_id, media_url, media_type) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([$senderId, $receiverId, $content, $productId, $mediaUrl, $mediaType]);

        $msgId = $this->db->lastInsertId();
        $stmt = $this->db->prepare("
            SELECT m.*, u.name as senderName
            FROM messages m
            JOIN users u ON m.sender_id = u.id
            WHERE m.id = ?
        ");
        $stmt->execute([$msgId]);
        echo json_encode($stmt->fetch());
    }

    public function getConversations()
    {
        // Get current user from token or fallback to query param for dev
        $userId = $this->getCurrentUserId() ?? ($_GET['userId'] ?? null);

        if (!$userId) {
            echo json_encode([]);
            return;
        }

        // Get all unique conversations for this user
        $stmt = $this->db->prepare("
            WITH RawConversations AS (
                SELECT 
                    CASE WHEN sender_id = ? THEN receiver_id ELSE sender_id END as partner_id,
                    timestamp,
                    content,
                    sender_id,
                    receiver_id,
                    is_read
                FROM messages
                WHERE sender_id = ? OR receiver_id = ?
            )
            SELECT 
                partner_id,
                MAX(timestamp) as last_ts,
                (SELECT content FROM messages WHERE 
                    (sender_id = ? AND receiver_id = r.partner_id) OR
                    (sender_id = r.partner_id AND receiver_id = ?)
                    ORDER BY timestamp DESC LIMIT 1) as lastMessage,
                (SELECT COUNT(*) FROM messages WHERE receiver_id = ? AND sender_id = r.partner_id AND is_read = 0) as unread
            FROM RawConversations r
            GROUP BY partner_id
            ORDER BY last_ts DESC
        ");
        $stmt->execute([$userId, $userId, $userId, $userId, $userId, $userId]);
        $rows = $stmt->fetchAll();

        $conversations = [];
        foreach ($rows as $row) {
            $partnerId = $row['partner_id'];
            $uStmt = $this->db->prepare("SELECT id, name, role, is_verified FROM users WHERE id = ?");
            $uStmt->execute([$partnerId]);
            $partner = $uStmt->fetch();
            if ($partner) {
                $conversations[] = [
                    'id'              => "{$userId}_{$partnerId}",
                    'participantId'   => $partnerId,
                    'participantName' => $partner['name'],
                    'participantRole' => $partner['role'],
                    'isVerified'      => (bool)$partner['is_verified'],
                    'lastMessage'     => $row['lastMessage'] ?? '',
                    'unread'          => (int)($row['unread'] ?? 0),
                    'timestamp'       => $row['last_ts'],
                ];
            }
        }

        echo json_encode($conversations);
    }

    public function getUsers()
    {
        // Return all farmers so buyers can start conversations
        $stmt = $this->db->query("SELECT id, name, role, is_verified, verification_status FROM users WHERE role = 'farmer'");
        echo json_encode($stmt->fetchAll());
    }
}
