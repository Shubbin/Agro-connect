<?php
// Serve static files from uploads directory if requested via /uploads/
if (strpos($_SERVER['REQUEST_URI'], '/uploads/') === 0) {
    $filePath = __DIR__ . '/..' . $_SERVER['REQUEST_URI'];
    if (file_exists($filePath)) {
        $mime = mime_content_type($filePath);
        header("Content-Type: $mime");
        header("Access-Control-Allow-Origin: *");
        readfile($filePath);
        exit;
    }
}
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:4157");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

require_once __DIR__ . '/config/db.php';

// Simple .env loader
if (file_exists(__DIR__ . '/../.env')) {
    $env = parse_ini_file(__DIR__ . '/../.env');
    foreach ($env as $key => $value) {
        putenv("$key=$value");
        $_ENV[$key] = $value;
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$requestUri = $_SERVER['REQUEST_URI'];
$basePath = '/api';
$path = str_replace($basePath, '', $requestUri);
$path = explode('?', $path)[0];
$method = $_SERVER['REQUEST_METHOD'];

// Simple routing
$parts = explode('/', trim($path, '/'));

if (empty($parts[0])) {
    echo json_encode(["message" => "Welcome to Agro Direct Connect API"]);
    exit;
}

// Map URL segments to correct controller class names
$controllerMap = [
    'products' => 'ProductController',
    'auth'     => 'AuthController',
    'cart'     => 'CartController',
    'chat'     => 'ChatController',
    'orders'   => 'OrderController',
    'farmer'   => 'ProductController',
    'stats'    => 'StatsController',
    'ai'       => 'AIController',
    'wallet'   => 'WalletController',
    'payment'  => 'PaymentController',
    'upload'   => 'UploadController',
    'sms'      => 'SmsController',
    'checkout' => 'OrderController',
    'profile'  => 'ProfileController',
];

$controller = $controllerMap[$parts[0]] ?? (ucfirst($parts[0]) . 'Controller');
$controllerFile = __DIR__ . "/controllers/$controller.php";

    if (file_exists($controllerFile)) {
        require_once $controllerFile;
        $instance = new $controller();

        if ($method === 'POST') {
            switch ($parts[0]) {
                case 'auth':
                    if ($parts[1] === 'login') $instance->login();
                    elseif ($parts[1] === 'register') $instance->register();
                    elseif ($parts[1] === 'logout') $instance->logout();
                    break;
                case 'products':
                    $instance->create();
                    break;
                case 'cart':
                    if ($parts[1] === 'add') $instance->add();
                    break;
                case 'checkout':
                    $instance->create();
                    break;
                case 'chat':
                    if ($parts[1] === 'send') $instance->sendMessage();
                    break;
                case 'ai':
                    $instance->handle($parts[1] ?? 'assistant');
                    break;
                case 'upload':
                    $instance->upload();
                    break;
                case 'payment':
                    $instance->process();
                    break;
                case 'orders':
                    if ($parts[1] === 'update-tracking') $instance->updateTracking();
                    elseif ($parts[1] === 'confirm-delivery') $instance->confirmDelivery();
                    break;
                case 'sms':
                    if ($parts[1] === 'simulate') $instance->handleSimulate();
                    break;
                default:
                    http_response_code(404);
            }
        } elseif ($method === 'GET') {
            switch ($parts[0]) {
                case 'products':
                    if (isset($parts[1]) && is_numeric($parts[1])) $instance->getById($parts[1]);
                    else $instance->getAll();
                    break;
                case 'farmer':
                    if ($parts[1] === 'products') $instance->getByFarmer($_GET['farmerId'] ?? null);
                    elseif ($parts[1] === 'orders') (new OrderController())->getAll(); // Map handles farmer -> ProductController, so override for orders
                    break;
                case 'profile':
                    $instance->getProfile();
                    break;
                case 'orders':
                    $instance->getAll();
                    break;
                case 'chat':
                    if ($parts[1] === 'messages') $instance->getMessages($_GET['conversationId'] ?? null);
                    elseif ($parts[1] === 'conversations') $instance->getConversations();
                    elseif ($parts[1] === 'users') $instance->getUsers();
                    break;
                case 'ai':
                    $instance->handle($parts[1] ?? 'assistant');
                    break;
                case 'stats':
                    $instance->getSummary();
                    break;
                case 'cart':
                    $instance->get();
                    break;
                case 'wallet':
                    if ($parts[1] === 'balance') $instance->getBalance();
                    elseif ($parts[1] === 'transactions') $instance->getTransactions();
                    break;
                default:
                    http_response_code(404);
            }
        } else {
            http_response_code(405);
        }
    }
}
