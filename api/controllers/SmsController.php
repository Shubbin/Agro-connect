<?php

class SmsController {
    private $logFile;

    public function __construct() {
        $this->logFile = __DIR__ . "/../../logs/sms_gateway.log";
        if (!file_exists(dirname($this->logFile))) {
            mkdir(dirname($this->logFile), 0777, true);
        }
    }

    public function sendMockSms($to, $message) {
        $timestamp = date('Y-m-d H:i:s');
        $logEntry = "[{$timestamp}] TO: {$to} | MSG: {$message}\n";
        
        file_put_contents($this->logFile, $logEntry, FILE_APPEND);
        
        return [
            'status' => 'success',
            'message' => 'SMS queued in mock gateway',
            'recipient' => $to,
            'log_reference' => $timestamp
        ];
    }

    public function handleSimulate() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            header('Content-Type: application/json');
            echo json_encode(['error' => 'Method not allowed']);
            return;
        }

        $input = json_decode(file_get_contents('php://input'), true);
        $to = $input['to'] ?? 'Unknown';
        $message = $input['message'] ?? '';

        $result = $this->sendMockSms($to, $message);
        
        header('Content-Type: application/json');
        echo json_encode($result);
    }
}
