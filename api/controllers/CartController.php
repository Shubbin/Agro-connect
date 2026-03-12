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
        
        // Fetch full item with product details to return to frontend
        $stmt = $this->db->prepare("SELECT ci.*, p.name, p.price, p.images FROM cart_items ci JOIN products p ON ci.product_id = p.id WHERE ci.id = ?");
        $stmt->execute([$itemId]);
        $item = $stmt->fetch();
        
        if ($item) {
            $item['images'] = json_decode($item['images'] ?? '[]', true);
            $item['product'] = [
                'id' => $item['product_id'],
                'name' => $item['name'],
                'price' => $item['price'],
                'images' => $item['images']
            ];
            echo json_encode($item);
        } else {
            echo json_encode(["id" => $itemId, "product_id" => $productId, "quantity" => $quantity]);
        }
    }

    public function update($itemId)
    {
        $input = json_decode(file_get_contents('php://input'), true);
        $quantity = $input['quantity'];

        $stmt = $this->db->prepare("UPDATE cart_items SET quantity = ? WHERE id = ?");
        $stmt->execute([$quantity, $itemId]);

        echo json_encode(["success" => true, "id" => $itemId, "quantity" => $quantity]);
    }

    public function remove($itemId)
    {
        $stmt = $this->db->prepare("DELETE FROM cart_items WHERE id = ?");
        $stmt->execute([$itemId]);

        echo json_encode(["success" => true, "id" => $itemId]);
    }

    public function clear()
    {
        // Mocking user_id = 1
        $stmt = $this->db->prepare("DELETE FROM cart_items WHERE user_id = ?");
        $stmt->execute([1]);

        echo json_encode(["success" => true]);
    }

    public function makeOffer($itemId)
    {
        $input = json_decode(file_get_contents('php://input'), true);
        $offeredPrice = $input['offeredPrice'];

        $stmt = $this->db->prepare("UPDATE cart_items SET offered_price = ?, offer_status = 'pending' WHERE id = ?");
        $stmt->execute([$offeredPrice, $itemId]);

        // Fetch updated item
        $stmt = $this->db->prepare("SELECT ci.*, p.name, p.price, p.images FROM cart_items ci JOIN products p ON ci.product_id = p.id WHERE ci.id = ?");
        $stmt->execute([$itemId]);
        $item = $stmt->fetch();
        
        if ($item) {
            $item['images'] = json_decode($item['images'] ?? '[]', true);
            $item['product'] = [
                'id' => $item['product_id'],
                'name' => $item['name'],
                'price' => $item['price'],
                'images' => $item['images']
            ];
            echo json_encode($item);
        } else {
            echo json_encode(["success" => true, "id" => $itemId]);
        }
    }
}
