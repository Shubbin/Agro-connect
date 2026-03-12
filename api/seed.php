<?php
/**
 * AgroDirect Connect - Database Seeder
 * Run: php api/seed.php
 */

require_once __DIR__ . '/config/db.php';
use Config\Database;

$db = Database::getConnection();

echo "🌱 AgroDirect Connect - Database Seeder\n";
echo "=========================================\n\n";

// ── 1. Add phone column to users if missing ──────────────────────────────────
try {
    $db->exec("ALTER TABLE users ADD COLUMN phone TEXT");
    echo "✅ Added phone column to users\n";
} catch (Exception $e) {
    echo "ℹ️  Phone column already exists\n";
}

// ── 2. Seed Farmers ──────────────────────────────────────────────────────────
$farmers = [
    [
        'name'     => 'Emeka Okafor',
        'email'    => 'emeka@agrodirect.ng',
        'phone'    => '08012345678',
        'password' => 'Farmer123!',
        'location' => 'Enugu',
    ],
    [
        'name'     => 'Fatima Aliyu',
        'email'    => 'fatima@agrodirect.ng',
        'phone'    => '07098765432',
        'password' => 'Farmer123!',
        'location' => 'Kano',
    ],
    [
        'name'     => 'Bola Adeyemi',
        'email'    => 'bola@agrodirect.ng',
        'phone'    => '09011223344',
        'password' => 'Farmer123!',
        'location' => 'Ibadan',
    ],
];

$farmerIds = [];
foreach ($farmers as $farmer) {
    // Check if already exists
    $stmt = $db->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$farmer['email']]);
    $existing = $stmt->fetch();

    if ($existing) {
        $farmerIds[] = $existing['id'];
        echo "ℹ️  Farmer '{$farmer['name']}' already exists (ID: {$existing['id']})\n";
    } else {
        $hashed = password_hash($farmer['password'], PASSWORD_DEFAULT);
        $stmt = $db->prepare("INSERT INTO users (name, email, phone, password, role, is_verified, verification_status) VALUES (?, ?, ?, ?, 'farmer', 1, 'verified')");
        $stmt->execute([$farmer['name'], $farmer['email'], $farmer['phone'], $hashed]);
        $id = $db->lastInsertId();
        $farmerIds[] = $id;
        echo "✅ Created farmer '{$farmer['name']}' (ID: $id)\n";
    }
}

// ── 3. Seed Products ─────────────────────────────────────────────────────────
$productSets = [
    // Farmer 1 - Emeka Okafor (Enugu) - Root crops and grains
    [
        ['name' => 'Premium Cassava Tubers', 'category' => 'produce', 'price' => 8500, 'unit' => 'bag (50kg)', 'available' => 200, 'description' => 'Fresh, high-starch cassava tubers from Enugu highlands. Ideal for garri and flour processing. Harvested within 48 hours.', 'certifications' => ['Organic', 'GAP Certified'], 'location' => 'Enugu'],
        ['name' => 'Sweet Potato (Cream)', 'category' => 'produce', 'price' => 6200, 'unit' => 'bag (50kg)', 'available' => 150, 'description' => 'Cream-variety sweet potato. Rich in beta-carotene and antioxidants. Grown on volcanic soil for superior sweetness.', 'certifications' => ['Organic'], 'location' => 'Enugu'],
        ['name' => 'Hybrid Maize', 'category' => 'grains', 'price' => 14500, 'unit' => 'ton', 'available' => 50, 'description' => 'UNILAG-certified hybrid maize. High yield, disease-resistant variety. Suitable for human and animal consumption.', 'certifications' => ['NAFDAC', 'GAP Certified'], 'location' => 'Enugu'],
        ['name' => 'Cocoyam (Taro)', 'category' => 'produce', 'price' => 5800, 'unit' => 'bag (50kg)', 'available' => 80, 'description' => 'Organically grown cocoyam from the Enugu hills. Starchy, delicious and perfect for soups.', 'certifications' => ['Organic'], 'location' => 'Enugu'],
    ],
    // Farmer 2 - Fatima Aliyu (Kano) - Vegetables and seeds
    [
        ['name' => 'Sun-Dried Tomatoes', 'category' => 'produce', 'price' => 12000, 'unit' => 'bag (30kg)', 'available' => 120, 'description' => 'Sun-dried Kano roma tomatoes. Concentrated flavour, zero preservatives. Perfect for paste, stews and export.', 'certifications' => ['Organic', 'Export Grade'], 'location' => 'Kano'],
        ['name' => 'Onion Bulbs (Red)', 'category' => 'produce', 'price' => 9500, 'unit' => 'bag (50kg)', 'available' => 300, 'description' => 'Large, firm red onion bulbs grown in the Kano basin. Market-favourite variety with long shelf life.', 'certifications' => ['GAP Certified'], 'location' => 'Kano'],
        ['name' => 'Groundnut (Arachis)', 'category' => 'grains', 'price' => 18000, 'unit' => 'bag (100kg)', 'available' => 90, 'description' => 'Grade-A raw groundnuts from Kano. Low aflatoxin levels, export quality. Used for oil, paste, and snacks.', 'certifications' => ['NAFDAC', 'Export Grade'], 'location' => 'Kano'],
        ['name' => 'Sesame Seeds (White)', 'category' => 'grains', 'price' => 22000, 'unit' => 'bag (80kg)', 'available' => 60, 'description' => 'Premium white sesame seeds. Moisture content below 6%. Major export commodity sought by Asian buyers.', 'certifications' => ['Export Grade', 'Organic'], 'location' => 'Kano'],
    ],
    // Farmer 3 - Bola Adeyemi (Ibadan) - Fruits and livestock
    [
        ['name' => 'Plantain Fingers (Yellow)', 'category' => 'produce', 'price' => 4500, 'unit' => 'bunch (30pcs)', 'available' => 500, 'description' => 'Ripe, smooth plantain fingers from Ibadan farms. Sweet aroma, perfect for frying, boiling or chips processing.', 'certifications' => ['Organic'], 'location' => 'Ibadan'],
        ['name' => 'Pineapple (MD2 Hybrid)', 'category' => 'produce', 'price' => 2200, 'unit' => 'crate (24pcs)', 'available' => 200, 'description' => 'MD2 hybrid pineapple with low acidity and golden interior. Grown using drip irrigation for consistent quality.', 'certifications' => ['GAP Certified', 'Organic'], 'location' => 'Ibadan'],
        ['name' => 'Palm Oil (Red)', 'category' => 'produce', 'price' => 35000, 'unit' => 'drum (25L)', 'available' => 40, 'description' => 'Fresh-pressed red palm oil from Oyo state. E-grade purity. No bleaching agents used. Rich colour and aroma.', 'certifications' => ['Organic', 'NAFDAC'], 'location' => 'Ibadan'],
        ['name' => 'Waterleaf Vegetable', 'category' => 'produce', 'price' => 1200, 'unit' => 'bundle (5kg)', 'available' => 800, 'description' => 'Fresh waterleaf (Talinum triangulare) harvested daily. Rich in iron and calcium. Delivered within 24 hours.', 'certifications' => ['Organic'], 'location' => 'Ibadan'],
    ],
];

foreach ($productSets as $idx => $products) {
    $farmerId = $farmerIds[$idx];
    foreach ($products as $p) {
        // Check if product already exists for this farmer
        $stmt = $db->prepare("SELECT id FROM products WHERE farmer_id = ? AND name = ?");
        $stmt->execute([$farmerId, $p['name']]);
        if ($stmt->fetch()) {
            echo "  ℹ️  Product '{$p['name']}' already exists, skipping\n";
            continue;
        }

        $images = json_encode(['/placeholder.svg']);
        $certs  = json_encode($p['certifications']);

        $stmt = $db->prepare("INSERT INTO products (farmer_id, name, description, category, price, unit, available, images, location, certifications) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$farmerId, $p['name'], $p['description'], $p['category'], $p['price'], $p['unit'], $p['available'], $images, $p['location'], $certs]);
        echo "  ✅ Created product: {$p['name']}\n";
    }
}

// ── 4. Seed sample chat messages ─────────────────────────────────────────────
// Get the first non-farmer user for buyer demo messages (or create one)
$stmt = $db->prepare("SELECT id FROM users WHERE role = 'user' LIMIT 1");
$stmt->execute();
$buyer = $stmt->fetch();

if (!$buyer) {
    $hashed = password_hash('Buyer123!', PASSWORD_DEFAULT);
    $stmt = $db->prepare("INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, 'user')");
    $stmt->execute(['Chidi Nwachukwu', 'chidi@buyer.ng', '08099887766', $hashed]);
    $buyerId = $db->lastInsertId();
    echo "\n✅ Created demo buyer 'Chidi Nwachukwu' (ID: $buyerId, email: chidi@buyer.ng, pass: Buyer123!)\n";
} else {
    $buyerId = $buyer['id'];
    echo "\nℹ️  Using existing buyer (ID: $buyerId) for demo messages\n";
}

// Insert some sample messages
$messages = [
    [$buyerId, $farmerIds[0], "Hello Emeka! Are your cassava tubers available for bulk order?"],
    [$farmerIds[0], $buyerId, "Yes! We have over 200 bags ready for immediate delivery."],
    [$buyerId, $farmerIds[0], "Great! Can you ship to Lagos? What's the delivery timeline?"],
    [$buyerId, $farmerIds[1], "Hi Fatima, I'm interested in your sesame seeds for export."],
    [$farmerIds[1], $buyerId, "We have 60 bags of premium export-grade sesame ready. Moisture tested."],
];

foreach ($messages as [$senderId, $receiverId, $content]) {
    $stmt = $db->prepare("SELECT id FROM messages WHERE sender_id = ? AND receiver_id = ? AND content = ?");
    $stmt->execute([$senderId, $receiverId, $content]);
    if (!$stmt->fetch()) {
        $stmt = $db->prepare("INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)");
        $stmt->execute([$senderId, $receiverId, $content]);
        echo "  ✅ Message seeded\n";
    }
}

echo "\n🎉 Seeding complete!\n";
echo "======================================\n";
echo "Farmer login credentials:\n";
echo "  emeka@agrodirect.ng  / Farmer123!\n";
echo "  fatima@agrodirect.ng / Farmer123!\n";
echo "  bola@agrodirect.ng   / Farmer123!\n";
echo "Buyer:\n";
echo "  chidi@buyer.ng / Buyer123!\n";
