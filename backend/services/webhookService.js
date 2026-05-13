import fetch from 'node-fetch';
import crypto from 'crypto';

/**
 * WebhookService
 * 
 * Sends event notifications to B2B merchant URLs.
 */
class WebhookService {
  /**
   * Send a webhook notification
   * @param {string} url - Merchant's webhook URL
   * @param {string} secret - Merchant's API Key (used for signing)
   * @param {string} event - Event type (e.g., 'order.paid', 'order.delivered')
   * @param {object} data - Event payload
   */
  async notify(url, secret, event, data) {
    if (!url) return;

    const payload = JSON.stringify({
      event,
      data,
      timestamp: new Date().toISOString()
    });

    // Create a signature so the merchant can verify the request came from us
    const signature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    try {
      console.log(`[Webhook] Sending ${event} to ${url}...`);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-AgroConnect-Signature': signature
        },
        body: payload,
        timeout: 5000 // 5 second timeout
      });

      if (!response.ok) {
        console.warn(`[Webhook] Delivery failed for ${url}: ${response.statusText}`);
      } else {
        console.log(`[Webhook] ${event} delivered successfully.`);
      }
    } catch (error) {
      console.error(`[Webhook] Error notifying ${url}:`, error.message);
    }
  }
}

export default new WebhookService();
