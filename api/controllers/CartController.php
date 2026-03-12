<?php

require_once __DIR__ . '/../config/db.php';
use Config\Database;

class CartController
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getConnection();
        // Since we don't have a cart_items table yet in migrate.php (I missed it), 
        // I'll either use a session or add it now.
        // Let's add it to the migration script first or use session for simplicity.
        // Actually, a database-backed cart is better.
    }

    public function get()
    {
        // Mocking user_id = 1
        $stmt = $this->db->prepare("SELECT ci.*, p.name, p.price, p.images FROM cart_items ci JOIN products p ON ci.product_id = p.id WHERE ci.user_id = ?");
        $stmt->execute([1]);
        $items = $stmt->fetchAll();
        foreach ($items as &$item) {
            $item['images'] = json_decode($item['images'] ?? '[]', true);
            $item['product'] = [
                'id' => $item['product_id'],
                'name' => $item['name'],
                'price' => $item['price'],
                'images' => $item['images']
            ];

        }
        echo json_encode($items);
    }

    public function add()
    {
        $input = json_decode(file_get_contents('php://input'), true);
        $productId = $input['productId'];
        $quantity = $input['quantity'] ?? 1;

        $stmt = $this->db->prepare("INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)");
        $stmt->execute([1, $productId, $quantity]);

        $itemId = $this->db->lastInsertId();
        echo json_encode(["id" => $itemId, "product_id" => $productId, "quantity" => $quantity]);
    }

    public function remove()
    {
        // Logic for parts[2] (itemId) would go here in index.php router
    }
}
