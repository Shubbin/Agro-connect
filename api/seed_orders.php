<?php
/**
 * AgroDirect Connect - Orders Seed
 * Generates realistic orders to populate stats
 */

require_once __DIR__ . '/config/db.php';
use Config\Database;

$db = Database::getConnection();

echo "📦 Seeding Orders...\n";

// Get some users and products
$users = $db->query("SELECT id FROM users WHERE role = 'user'")->fetchAll();
$products = $db->query("SELECT id, price, farmer_id FROM products")->fetchAll();

if (empty($users) || empty($products)) {
    echo "❌ Need users and products first! Run seed_extended.php\n";
    exit;
}

$orderCount = 25;
$statuses = ['delivered', 'processing', 'shipped', 'pending'];

for ($i = 0; $i < $orderCount; $i++) {
    $user = $users[array_rand($users)];
    $status = $statuses[array_rand($statuses)];
    $itemCount = rand(1, 3);
    $total = 0;
    
    $orderItems = [];
    for ($j = 0; $j < $itemCount; $j++) {
        $product = $products[array_rand($products)];
        $qty = rand(1, 5);
        $price = $product['price'];
        $subtotal = $qty * $price;
        $total += $subtotal;
        $orderItems[] = [
            'product_id' => $product['id'],
            'quantity' => $qty,
            'price' => $price
        ];
    }

    // Insert order
    $stmt = $db->prepare("INSERT INTO orders (user_id, status, total, delivery_address, payment_status) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([
        $user['id'],
        $status,
        $total,
        "Lagos, Nigeria",
        $status === 'delivered' ? 'completed' : 'pending'
    ]);
    $orderId = $db->lastInsertId();

    // Insert items
    foreach ($orderItems as $item) {
        $stmt = $db->prepare("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)");
        $stmt->execute([
            $orderId,
            $item['product_id'],
            $item['quantity'],
            $item['price']
        ]);
    }

    echo "✅ Order #$orderId created (Total: ₦$total)\n";
}

echo "\n🎉 Orders seeding complete!\n";
