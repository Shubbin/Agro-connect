<?php

require_once __DIR__ . '/../config/db.php';
use Config\Database;

class OrderController
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getConnection();
    }

    public function getAll()
    {
        // In a real app, filter by session user_id
        $stmt = $this->db->query("SELECT * FROM orders ORDER BY created_at DESC");
        echo json_encode($stmt->fetchAll());
    }

    public function getById($id)
    {
        $stmt = $this->db->prepare("SELECT * FROM orders WHERE id = ?");
        $stmt->execute([$id]);
        $order = $stmt->fetch();

        if ($order) {
            $stmtItems = $this->db->prepare("SELECT oi.*, p.name as productName FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?");
            $stmtItems->execute([$id]);
            $order['items'] = $stmtItems->fetchAll();
        }

        echo json_encode($order ?: null);
    }

    public function create()
    {
        $input = json_decode(file_get_contents('php://input'), true);

        $userId = $input['userId'] ?? 1;
        $total = $input['total'] ?? 0;
        $address = $input['deliveryAddress'] ?? '';
        $items = $input['items'] ?? [];

        try {
            $this->db->beginTransaction();

            $stmt = $this->db->prepare("INSERT INTO orders (user_id, total, delivery_address) VALUES (?, ?, ?)");
            $stmt->execute([$userId, $total, $address]);
            $orderId = $this->db->lastInsertId();

            $stmtItem = $this->db->prepare("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)");
            foreach ($items as $item) {
                $stmtItem->execute([
                    $orderId,
                    $item['product']['id'],
                    $item['quantity'],
                    $item['offeredPrice'] ?? $item['product']['price']
                ]);
            }

            $this->db->commit();
            $this->getById($orderId);
        } catch (Exception $e) {
            $this->db->rollBack();
            http_response_code(500);
            echo json_encode(["message" => "Error creating order: " . $e->getMessage()]);
        }
    }

    public function getFarmerOrders()
    {
        // Mocking for now, in real app, filter by products belonging to farmer session
        $stmt = $this->db->query("SELECT o.* FROM orders o JOIN order_items oi ON o.id = oi.order_id JOIN products p ON oi.product_id = p.id GROUP BY o.id ORDER BY o.created_at DESC");
        echo json_encode($stmt->fetchAll());
    }

    public function updateTracking() {
        $input = json_decode(file_get_contents('php://input'), true);
        $orderId = $input['orderId'];
        $trackingNumber = $input['trackingNumber'];
        $estimatedDelivery = $input['estimatedDelivery'];

        $stmt = $this->db->prepare("UPDATE orders SET tracking_number = ?, estimated_delivery = ?, status = 'shipped' WHERE id = ?");
        $stmt->execute([$trackingNumber, $estimatedDelivery, $orderId]);

        // Trigger Mock SMS
        require_once __DIR__ . "/SmsController.php";
        $sms = new SmsController();
        $sms->sendMockSms("Buyer", "Your AgroDirect order #{$orderId} has been shipped! Tracking: {$trackingNumber}. ETA: {$estimatedDelivery}");

        echo json_encode(['status' => 'success', 'message' => 'Tracking updated and SMS sent']);
    }

    public function confirmDelivery() {
        $input = json_decode(file_get_contents('php://input'), true);
        $orderId = $input['orderId'];

        $stmt = $this->db->prepare("UPDATE orders SET status = 'delivered', escrow_status = 'released', actual_delivery_date = CURRENT_TIMESTAMP WHERE id = ?");
        $stmt->execute([$orderId]);

        // Trigger Mock SMS
        require_once __DIR__ . "/SmsController.php";
        $sms = new SmsController();
        $sms->sendMockSms("Farmer", "Order #{$orderId} delivery confirmed! Escrow funds have been released to your wallet.");
        $sms->sendMockSms("Buyer", "Delivery confirmed for order #{$orderId}. Thank you for using AgroDirect!");

        echo json_encode(['status' => 'success', 'message' => 'Delivery confirmed and SMS sent']);
    }

    public function respondToOffer()
    {
        $input = json_decode(file_get_contents('php://input'), true);
        // Logic for responding to price offers...
        echo json_encode(["message" => "Offer response recorded"]);
    }
}
