<?php

require_once __DIR__ . '/../config/db.php';
use Config\Database;

class PaymentController
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getConnection();
    }

    public function process()
    {
        $input = json_decode(file_get_contents('php://input'), true);
        $orderId = $input['orderId'] ?? null;
        $amount = $input['amount'] ?? 0;

        if (!$orderId) {
            http_response_code(400);
            echo json_encode(["message" => "Order ID required"]);
            return;
        }

        // Mock payment processing delay
        // usleep(500000);

        try {
            $stmt = $this->db->prepare("UPDATE orders SET payment_status = 'paid', status = 'confirmed' WHERE id = ?");
            $stmt->execute([$orderId]);

            echo json_encode([
                "success" => true,
                "transactionId" => "PAY_" . bin2hex(random_bytes(8)),
                "message" => "Payment successful"
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["message" => "Payment failed: " . $e->getMessage()]);
        }
    }
}
