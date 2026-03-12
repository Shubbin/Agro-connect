<?php

require_once __DIR__ . '/../config/db.php';
use Config\Database;

class ProfileController
{
    private $db;

    public function __construct()
    {
        // Suppress PHP notices/warnings so they don't corrupt JSON output
        error_reporting(0);
        $this->db = Database::getConnection();
    }

    private function getUserIdFromToken()
    {
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        if (preg_match('/^Bearer\s+(.+)$/', $authHeader, $m)) {
            $stmt = $this->db->prepare("SELECT id FROM users WHERE auth_token = ?");
            $stmt->execute([$m[1]]);
            $row = $stmt->fetch();
            return $row ? $row['id'] : null;
        }
        return null;
    }

    public function getProfile()
    {
        $userId = $this->getUserIdFromToken() ?? ($_GET['userId'] ?? null);

        if (!$userId) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
            return;
        }

        $stmt = $this->db->prepare(
            "SELECT id, name, email, phone, role, is_verified, verification_status, created_at FROM users WHERE id = ?"
        );
        $stmt->execute([$userId]);
        $user = $stmt->fetch();

        if (!$user) {
            http_response_code(404);
            echo json_encode(['error' => 'User not found']);
            return;
        }

        $profile = ['user' => $user];

        if ($user['role'] === 'farmer') {
            $profile['stats']         = $this->getFarmerStats($userId);
            $profile['topProducts']   = $this->getTopProducts($userId);
            $profile['recentOrders']  = $this->getFarmerRecentOrders($userId);
            $profile['inventoryValue']= $this->getInventoryValue($userId);
            $profile['aiInsights']    = $this->getFarmerAIInsights($userId);
        } else {
            $profile['stats']        = $this->getBuyerStats($userId);
            $profile['recentOrders'] = $this->getBuyerRecentOrders($userId);
            $profile['aiInsights']   = $this->getBuyerAIInsights($userId);
        }

        echo json_encode($profile);
    }

    // ── Farmers ────────────────────────────────────────────────────────────

    private function getFarmerStats($farmerId)
    {
        // Orders are linked to farmers via order_items → products → farmer_id
        $revenue = $this->db->prepare("
            SELECT COALESCE(SUM(oi.price * oi.quantity), 0) as total
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            JOIN orders o ON oi.order_id = o.id
            WHERE p.farmer_id = ? AND o.status = 'delivered'
        ");
        $revenue->execute([$farmerId]);
        $totalRevenue = $revenue->fetch()['total'];

        $orders = $this->db->prepare("
            SELECT COUNT(DISTINCT o.id) as c
            FROM orders o
            JOIN order_items oi ON oi.order_id = o.id
            JOIN products p ON oi.product_id = p.id
            WHERE p.farmer_id = ?
        ");
        $orders->execute([$farmerId]);
        $totalOrders = $orders->fetch()['c'];

        $delivered = $this->db->prepare("
            SELECT COUNT(DISTINCT o.id) as c
            FROM orders o
            JOIN order_items oi ON oi.order_id = o.id
            JOIN products p ON oi.product_id = p.id
            WHERE p.farmer_id = ? AND o.status = 'delivered'
        ");
        $delivered->execute([$farmerId]);
        $deliveredCount = $delivered->fetch()['c'];

        $products = $this->db->prepare("SELECT COUNT(*) as c FROM products WHERE farmer_id = ?");
        $products->execute([$farmerId]);
        $productCount = $products->fetch()['c'];

        $deliveryRate = $totalOrders > 0 ? round(($deliveredCount / $totalOrders) * 100) : 0;

        return [
            'totalRevenue'    => (float)$totalRevenue,
            'pendingRevenue'  => 0.0, // escrow not in base schema
            'totalOrders'     => (int)$totalOrders,
            'deliveredOrders' => (int)$deliveredCount,
            'productCount'    => (int)$productCount,
            'deliveryRate'    => $deliveryRate,
        ];
    }

    private function getTopProducts($farmerId)
    {
        $stmt = $this->db->prepare("
            SELECT p.name, p.price, p.available, p.category,
                   COUNT(oi.id) as order_count,
                   COALESCE(SUM(oi.price * oi.quantity), 0) as revenue
            FROM products p
            LEFT JOIN order_items oi ON oi.product_id = p.id
            LEFT JOIN orders o ON oi.order_id = o.id AND o.status = 'delivered'
            WHERE p.farmer_id = ?
            GROUP BY p.id, p.name, p.price, p.available, p.category
            ORDER BY revenue DESC, order_count DESC
            LIMIT 5
        ");
        $stmt->execute([$farmerId]);
        return $stmt->fetchAll();
    }

    private function getFarmerRecentOrders($farmerId)
    {
        $stmt = $this->db->prepare("
            SELECT DISTINCT o.id, o.status, o.total, o.created_at, u.name as buyerName
            FROM orders o
            JOIN order_items oi ON oi.order_id = o.id
            JOIN products p ON oi.product_id = p.id
            JOIN users u ON u.id = o.user_id
            WHERE p.farmer_id = ?
            ORDER BY o.created_at DESC
            LIMIT 5
        ");
        $stmt->execute([$farmerId]);
        return $stmt->fetchAll();
    }

    private function getInventoryValue($farmerId)
    {
        $stmt = $this->db->prepare(
            "SELECT COALESCE(SUM(price * available), 0) as value FROM products WHERE farmer_id = ?"
        );
        $stmt->execute([$farmerId]);
        return (float)$stmt->fetch()['value'];
    }

    // ── Buyers ─────────────────────────────────────────────────────────────

    private function getBuyerStats($buyerId)
    {
        $spend = $this->db->prepare(
            "SELECT COALESCE(SUM(total), 0) as total FROM orders WHERE user_id = ?"
        );
        $spend->execute([$buyerId]);
        $totalSpend = $spend->fetch()['total'];

        $orders = $this->db->prepare(
            "SELECT COUNT(*) as c FROM orders WHERE user_id = ?"
        );
        $orders->execute([$buyerId]);
        $totalOrders = $orders->fetch()['c'];

        $farmers = $this->db->prepare("
            SELECT COUNT(DISTINCT p.farmer_id) as c
            FROM orders o
            JOIN order_items oi ON oi.order_id = o.id
            JOIN products p ON oi.product_id = p.id
            WHERE o.user_id = ?
        ");
        $farmers->execute([$buyerId]);
        $uniqueFarmers = $farmers->fetch()['c'];

        return [
            'totalSpend'    => (float)$totalSpend,
            'totalOrders'   => (int)$totalOrders,
            'uniqueFarmers' => (int)$uniqueFarmers,
        ];
    }

    private function getBuyerRecentOrders($buyerId)
    {
        $stmt = $this->db->prepare("
            SELECT o.id, o.status, o.total, o.created_at,
                   (SELECT u.name FROM users u JOIN products p2 ON TRUE JOIN order_items oi2 ON oi2.order_id = o.id AND oi2.product_id = p2.id WHERE u.id = p2.farmer_id LIMIT 1) as farmerName
            FROM orders o
            WHERE o.user_id = ?
            ORDER BY o.created_at DESC
            LIMIT 5
        ");
        $stmt->execute([$buyerId]);
        $rows = $stmt->fetchAll();

        // Simplified fallback — just get orders + farmer from first item
        if (empty($rows)) return [];

        $result = [];
        foreach ($rows as $order) {
            $f = $this->db->prepare("
                SELECT u.name FROM order_items oi
                JOIN products p ON oi.product_id = p.id
                JOIN users u ON u.id = p.farmer_id
                WHERE oi.order_id = ? LIMIT 1
            ");
            $f->execute([$order['id']]);
            $farmer = $f->fetch();
            $order['farmerName']    = $farmer['name'] ?? 'Farmer';
            $order['total_amount']  = $order['total']; // alias for frontend
            $result[] = $order;
        }
        return $result;
    }

    // ── AI Insights ────────────────────────────────────────────────────────

    private function getFarmerAIInsights($farmerId)
    {
        $stmt = $this->db->prepare(
            "SELECT name, price, available, certifications, category FROM products WHERE farmer_id = ?"
        );
        $stmt->execute([$farmerId]);
        $products = $stmt->fetchAll();

        $insights     = [];
        $profileScore = 50;

        // Listing health — certifications
        $uncertified = array_filter($products, function($p) {
            $certs = is_array($p['certifications'])
                ? $p['certifications']
                : json_decode($p['certifications'] ?? '[]', true);
            return empty($certs);
        });
        if (count($uncertified) > 0) {
            $insights[] = [
                'type'     => 'listing_health',
                'icon'     => 'AlertTriangle',
                'severity' => 'warning',
                'title'    => count($uncertified) . ' products have no certifications',
                'detail'   => 'Adding "Organic" or "GAP Certified" can increase buyer trust by up to 40%.',
            ];
        } else {
            $profileScore += 20;
        }

        // Low stock alert
        foreach ($products as $p) {
            if ($p['available'] < 10) {
                $insights[] = [
                    'type'     => 'restock',
                    'icon'     => 'PackageX',
                    'severity' => 'error',
                    'title'    => "{$p['name']} is running low",
                    'detail'   => "Only {$p['available']} units left. Restock soon to avoid missed orders.",
                ];
            }
        }

        // Order count feedback
        $oc = $this->db->prepare("
            SELECT COUNT(DISTINCT o.id) as c
            FROM orders o JOIN order_items oi ON oi.order_id = o.id
            JOIN products p ON oi.product_id = p.id WHERE p.farmer_id = ?
        ");
        $oc->execute([$farmerId]);
        $orderCount = (int)$oc->fetch()['c'];

        if ($orderCount === 0) {
            $insights[] = [
                'type'     => 'price_advisor',
                'icon'     => 'TrendingUp',
                'severity' => 'info',
                'title'    => 'No orders yet — review your pricing',
                'detail'   => 'Competitive pricing earns first sales faster. Check the marketplace for similar products.',
            ];
        } else {
            $profileScore += 20;
            $insights[] = [
                'type'     => 'price_advisor',
                'icon'     => 'TrendingUp',
                'severity' => 'success',
                'title'    => "Great — you've received {$orderCount} orders!",
                'detail'   => 'Consider raising prices by 5–10% to test demand as your reputation grows.',
            ];
        }

        // Product diversity
        $categories = array_unique(array_column($products, 'category'));
        if (count($categories) < 2) {
            $insights[] = [
                'type'     => 'diversification',
                'icon'     => 'Layers',
                'severity' => 'info',
                'title'    => 'Diversify your product range',
                'detail'   => 'Farmers with 3+ categories get 2× more enquiries. Consider adding related crops.',
            ];
        } else {
            $profileScore += 10;
        }

        if (count($products) >= 5) $profileScore += 10;
        if ($orderCount > 0)       $profileScore += 10;

        return [
            'profileScore' => min(100, $profileScore),
            'insights'     => array_values($insights),
        ];
    }

    private function getBuyerAIInsights($buyerId)
    {
        $stmt = $this->db->prepare("
            SELECT p.category FROM orders o
            JOIN order_items oi ON oi.order_id = o.id
            JOIN products p ON oi.product_id = p.id
            WHERE o.user_id = ?
        ");
        $stmt->execute([$buyerId]);
        $rows = $stmt->fetchAll();

        $insights   = [];
        $categories = array_column($rows, 'category');
        $catCounts  = array_count_values(array_filter($categories));
        arsort($catCounts);
        $topCat = array_key_first($catCounts);

        if ($topCat) {
            $insights[] = [
                'type'     => 'recommendation',
                'icon'     => 'ShoppingBag',
                'severity' => 'info',
                'title'    => "You love {$topCat}!",
                'detail'   => "Most of your orders are in {$topCat}. We have fresh listings from verified farmers in this category.",
            ];
        } else {
            $insights[] = [
                'type'     => 'onboarding',
                'icon'     => 'ShoppingBag',
                'severity' => 'info',
                'title'    => 'Start shopping from verified farmers',
                'detail'   => 'Browse 120+ products from 16 verified farmers across Nigeria.',
            ];
        }

        return [
            'profileScore' => count($rows) > 0 ? 80 : 40,
            'insights'     => $insights,
        ];
    }
}
