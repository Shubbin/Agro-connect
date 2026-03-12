<?php

require_once __DIR__ . '/../config/db.php';
use Config\Database;

class ProductController
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getConnection();
    }

    public function getAll()
    {
        $category = $_GET['category'] ?? 'all';
        $location = $_GET['location'] ?? 'All Locations';
        $search = $_GET['search'] ?? '';

        $query = "SELECT p.*, u.name as farmerName, u.is_verified as farmerVerified, u.verification_status as farmerStatus FROM products p JOIN users u ON p.farmer_id = u.id WHERE 1=1";
        $params = [];

        if ($category !== 'all') {
            $query .= " AND p.category = ?";
            $params[] = $category;
        }

        if ($location !== 'All Locations') {
            $query .= " AND p.location = ?";
            $params[] = $location;
        }

        if (!empty($search)) {
            $query .= " AND (p.name LIKE ? OR u.name LIKE ? OR p.description LIKE ? OR p.category LIKE ?)";
            $params[] = "%$search%";
            $params[] = "%$search%";
            $params[] = "%$search%";
            $params[] = "%$search%";
        }


        $stmt = $this->db->prepare($query);
        $stmt->execute($params);
        $products = $stmt->fetchAll();

        // Decode JSON images
        foreach ($products as &$product) {
            $product['images']         = json_decode($product['images'] ?? '[]', true);
            $product['certifications'] = json_decode($product['certifications'] ?? '[]', true);
        }

        echo json_encode($products);
    }

    public function getById($id)
    {
        $stmt = $this->db->prepare("SELECT p.*, u.name as farmerName, u.is_verified as farmerVerified, u.verification_status as farmerStatus FROM products p JOIN users u ON p.farmer_id = u.id WHERE p.id = ?");
        $stmt->execute([$id]);
        $product = $stmt->fetch();

        if ($product) {
            $product['images'] = json_decode($product['images'] ?? '[]', true);
            $product['certifications'] = json_decode($product['certifications'] ?? '[]', true);
        }

        echo json_encode($product ?: null);
    }

    public function getByFarmer($farmerId)
    {
        $stmt = $this->db->prepare("SELECT p.*, u.name as farmerName, u.is_verified as farmerVerified, u.verification_status as farmerStatus FROM products p JOIN users u ON p.farmer_id = u.id WHERE p.farmer_id = ?");
        $stmt->execute([$farmerId]);
        $products = $stmt->fetchAll();

        foreach ($products as &$product) {
            $product['images'] = json_decode($product['images'] ?? '[]', true);
        }

        echo json_encode($products);
    }

    public function create()
    {
        $input = json_decode(file_get_contents('php://input'), true);

        $farmerId = $input['farmerId'] ?? null;
        if (!$farmerId) {
            http_response_code(401);
            echo json_encode(["message" => "Unauthorized: Farmer ID required"]);
            return;
        }
        $name = $input['name'] ?? '';
        $description = $input['description'] ?? '';
        $category = $input['category'] ?? 'produce';
        $price = $input['price'] ?? 0;
        $unit = $input['unit'] ?? 'kg';
        $available = $input['available'] ?? 0;
        $images = json_encode($input['images'] ?? ['/placeholder.svg']);
        $certifications = json_encode($input['certifications'] ?? []);
        $location = $input['location'] ?? 'Lagos';

        if (empty($name) || empty($price)) {
            http_response_code(400);
            echo json_encode(["message" => "Name and price are required"]);
            return;
        }

        try {
            $stmt = $this->db->prepare("INSERT INTO products (farmer_id, name, description, category, price, unit, available, images, location, certifications) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$farmerId, $name, $description, $category, $price, $unit, $available, $images, $location, $certifications]);

            $productId = $this->db->lastInsertId();
            $this->getById($productId);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["message" => "Error creating product: " . $e->getMessage()]);
        }
    }

    public function update($id)
    {
        // Logic for update...
    }

    public function delete($id)
    {
        $stmt = $this->db->prepare("DELETE FROM products WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(["message" => "Product deleted"]);
    }
}
