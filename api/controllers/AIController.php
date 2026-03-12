<?php

require_once __DIR__ . '/../config/db.php';
use Config\Database;

class AIController
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getConnection();
    }

    public function handle($action)
    {
        switch ($action) {
            case 'assistant':
                $input = json_decode(file_get_contents('php://input'), true);
                $message = $input['message'] ?? 'Hello';
                $response = $this->callGroq($message);
                echo json_encode(["response" => $response]);
                break;
            case 'onboarding-tips':
                $role = $_GET['role'] ?? 'user';
                $rolePrompt = $role === 'farmer' ? "as a farmer onboarding into an agro-marketplace" : "as a buyer onboarding into an agro-marketplace";
                $response = $this->callGroq("Provide 2 short, actionable tips $rolePrompt. Return as JSON with 'tips' array containing 'id', 'title', 'description'.", true);
                echo $response;
                break;
            case 'product-suggestions':
                $input = json_decode(file_get_contents('php://input'), true);
                $response = $this->callGroq("Suggest improvements for this agricultural product listing: " . json_encode($input) . ". Return as JSON with 'suggestions' array of {field, suggestion}.", true);
                echo $response;
                break;
            case 'cart-insights':
                $input = json_decode(file_get_contents('php://input'), true);
                $response = $this->callGroq("Provide shopping insights for these cart items: " . json_encode($input) . ". Return as JSON with 'insights' array of {title, detail, icon, severity}.", true);
                echo $response;
                break;
            case 'recommendations':
                $response = $this->callGroq("Recommend 3 agricultural products for a buyer in Nigeria. Return as JSON with 'recommendations' array of {id, name, reason}.", true);
                echo $response;
                break;
            case 'farmer-insights':
                $response = $this->callGroq("Provide business growth insights for a Nigerian farmer. Return as JSON with 'insights' array of {title, detail, icon, severity}.", true);
                echo $response;
                break;
            default:
                echo json_encode(["message" => "AI feature coming soon"]);
        }
    }

    private function callGroq($prompt, $isJson = false)
    {
        $apiKey = getenv('GROQ_API_KEY'); 
        $apiUrl = 'https://api.groq.com/openai/v1/chat/completions';

        $data = [
            'model' => 'llama-3.3-70b-versatile',
            'messages' => [
                ['role' => 'system', 'content' => 'You are AgroBot, a specialized AI assistant for the Agro Direct Connect platform in Nigeria. ' . ($isJson ? 'Respond ONLY with valid JSON.' : '')],
                ['role' => 'user', 'content' => $prompt]
            ],
            'temperature' => 0.7,
            'max_tokens' => 1000
        ];

        if ($isJson) {
            $data['response_format'] = ['type' => 'json_object'];
        }

        $options = [
            'http' => [
                'header'  => [
                    "Content-Type: application/json",
                    "Authorization: Bearer $apiKey"
                ],
                'method'  => 'POST',
                'content' => json_encode($data),
                'ignore_errors' => true
            ]
        ];

        $context  = stream_context_create($options);
        $result = file_get_contents($apiUrl, false, $context);
        
        if ($result === false) {
            return $isJson ? json_encode(["error" => "AI connection failed"]) : "Sorry, I'm having trouble connecting to my AI core right now.";
        }

        $response = json_decode($result, true);
        return $response['choices'][0]['message']['content'] ?? ($isJson ? json_encode(["error" => "AI processing failed"]) : "I'm sorry, I couldn't process that request.");
    }
}
