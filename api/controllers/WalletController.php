<?php

require_once __DIR__ . '/../config/db.php';
use Config\Database;

class WalletController {
    private $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function getBalance()
    {
        // Available funds: Paid orders where escrow has been released
        $stmt = $this->db->query("SELECT SUM(total) as total FROM orders WHERE payment_status = 'paid' AND escrow_status = 'released'");
        $result = $stmt->fetch();
        $available = $result['total'] ?? 0;

        // Pending funds: Paid orders where escrow is still held
        $stmtPending = $this->db->query("SELECT SUM(total) as total FROM orders WHERE payment_status = 'paid' AND escrow_status = 'held'");
        $resultPending = $stmtPending->fetch();
        $pending = $resultPending['total'] ?? 0;

        echo json_encode([
            "available" => $available,
            "pending" => $pending,
            "currency" => "NGN"
        ]);
    }

    public function getTransactions()
    {
        $stmt = $this->db->query("SELECT * FROM orders ORDER BY created_at DESC");
        $orders = $stmt->fetchAll();
        $txns = array_map(function ($o) {
            return [
                "id" => "txn_" . $o['id'],
                "type" => "credit",
                "amount" => $o['total'],
                "description" => "Order #" . $o['id'] . " payment",
                "date" => $o['created_at'],
                "status" => $o['payment_status'] === 'paid' ? 'completed' : 'pending'
            ];
        }, $orders);
        echo json_encode($txns);
    }
}
