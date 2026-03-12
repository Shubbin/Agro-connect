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
        $stats = [
            'farmers' => $this->getCount('users', "role = 'farmer'"),
            'products' => $this->getCount('products'),
            'states' => $this->getUniqueCount('products', 'location'),
            'volume' => '₦500k+' // Mocking this part as we don't have many real orders yet, but making it realistic
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
