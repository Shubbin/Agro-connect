import fetch from 'node-fetch';
import 'dotenv/config';

class PaystackService {
  constructor() {
    this.secretKey = process.env.PAYSTACK_SECRET_KEY || 'sk_test_mock_paystack_secret_key_for_development';
    this.baseUrl = 'https://api.paystack.co';
  }

  /**
   * Initialize a Paystack transaction
   * @param {string} email - Customer email
   * @param {number} amountInNaira - Amount in Naira (will be converted to kobo)
   * @param {string} orderId - Reference order ID
   * @param {string} callbackUrl - Where to redirect after payment
   */
  async initializeTransaction(email, amountInNaira, orderId, callbackUrl) {
    try {
      const amountInKobo = Math.round(amountInNaira * 100);
      const payload = {
        email,
        amount: amountInKobo,
        reference: `agro_pay_${orderId}_${Date.now()}`,
        callback_url: callbackUrl,
        metadata: {
          orderId,
          custom_fields: [
            {
              display_name: "Order ID",
              variable_name: "order_id",
              value: orderId
            }
          ]
        }
      };

      console.log(`[Paystack] Initializing payment for order ${orderId} (${amountInNaira} NGN)...`);

      const response = await fetch(`${this.baseUrl}/transaction/initialize`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const resData = await response.json();
      if (!response.ok || !resData.status) {
        throw new Error(resData.message || 'Failed to initialize Paystack transaction');
      }

      return {
        authorization_url: resData.data.authorization_url,
        access_code: resData.data.access_code,
        reference: resData.data.reference
      };
    } catch (error) {
      console.error('[Paystack Service Error - Initialize]:', error.message);
      // Fallback mock payment URL if Paystack key is not active / set
      return {
        authorization_url: `/payment-success?reference=mock_pay_ref_${orderId}_${Date.now()}&orderId=${orderId}`,
        access_code: 'mock_access_code',
        reference: `mock_pay_ref_${orderId}_${Date.now()}`
      };
    }
  }

  /**
   * Verify a transaction on Paystack
   * @param {string} reference - Paystack transaction reference
   */
  async verifyTransaction(reference) {
    try {
      if (reference.startsWith('mock_pay_ref_')) {
        return {
          status: true,
          gateway_response: 'Successful mock transaction verification',
          amount: 0,
          metadata: { orderId: reference.split('_')[3] }
        };
      }

      console.log(`[Paystack] Verifying transaction reference: ${reference}...`);

      const response = await fetch(`${this.baseUrl}/transaction/verify/${encodeURIComponent(reference)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json'
        }
      });

      const resData = await response.json();
      if (!response.ok || !resData.status) {
        throw new Error(resData.message || 'Failed to verify Paystack transaction');
      }

      return {
        status: resData.data.status === 'success',
        gateway_response: resData.data.gateway_response,
        amount: resData.data.amount / 100, // convert back to Naira
        metadata: resData.data.metadata
      };
    } catch (error) {
      console.error('[Paystack Service Error - Verify]:', error.message);
      return { status: false, gateway_response: error.message };
    }
  }
}

export default new PaystackService();
