<?php

require_once __DIR__ . '/../config/db.php';
use Config\Database;

class StatsController
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getConnection();
    }

    public function getSummary()
    {
        $volumeRaw = $this->db->query("SELECT SUM(total) FROM orders WHERE status != 'cancelled'")->fetchColumn() ?: 0;
        
        // Format volume (e.g., 50000 -> 50k)
        if ($volumeRaw >= 1000000) {
            $volume = '₦' . round($volumeRaw / 1000000, 1) . 'M+';
        } elseif ($volumeRaw >= 1000) {
            $volume = '₦' . round($volumeRaw / 1000, 1) . 'k+';
        } else {
            $volume = '₦' . number_format($volumeRaw);
        }

        $stats = [
            'farmers' => (int)$this->getCount('users', "role = 'farmer'"),
            'products' => (int)$this->getCount('products'),
            'states' => (int)$this->getUniqueCount('products', 'location'),
            'volume' => $volume
        ];

        echo json_encode($stats);
    }

    private function getCount($table, $where = "1=1")
    {
        $stmt = $this->db->query("SELECT COUNT(*) FROM $table WHERE $where");
        return $stmt->fetchColumn();
    }

    private function getUniqueCount($table, $column)
    {
        $stmt = $this->db->query("SELECT COUNT(DISTINCT $column) FROM $table");
        return $stmt->fetchColumn();
    }
}
