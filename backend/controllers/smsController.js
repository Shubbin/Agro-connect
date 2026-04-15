import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logFile = path.join(__dirname, '../../logs/sms_gateway.log');

// Ensure the logs directory exists
fs.mkdirSync(path.dirname(logFile), { recursive: true });

export const sendMockSms = (to, message) => {
  const timestamp = new Date().toISOString().replace('T', ' ').split('.')[0];
  const logEntry = `[${timestamp}] TO: ${to} | MSG: ${message}\n`;
  fs.appendFileSync(logFile, logEntry);

  return {
    status: 'success',
    message: 'SMS queued in mock gateway',
    recipient: to,
    log_reference: timestamp,
  };
};

export const handleSimulate = (req, res) => {
  const { to = 'Unknown', message = '' } = req.body;
  const result = sendMockSms(to, message);
  return res.json(result);
};
