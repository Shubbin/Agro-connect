import { supabase } from '../config/db.js';
import paystackService from '../services/paystackService.js';
import crypto from 'crypto';

/**
   * Initialize Paystack Payment Session
   */
export const initialize = async (req, res) => {
  const { orderId } = req.body;
  if (!orderId) {
    return res.status(400).json({ message: 'Order ID is required' });
  }

  try {
    // 1. Fetch order details
    const { data: order, error: fetchErr } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (fetchErr || !order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // 2. Fetch buyer details
    const { data: buyer, error: buyerErr } = await supabase
      .from('users')
      .select('email')
      .eq('id', order.user_id)
      .single();

    if (buyerErr || !buyer) {
      return res.status(404).json({ message: 'Buyer profile not found' });
    }

    const callbackUrl = `${req.headers.origin || 'http://localhost:5173'}/payment-success?orderId=${orderId}`;
    
    // 3. Initialize Paystack transaction
    const transaction = await paystackService.initializeTransaction(
      buyer.email,
      Number(order.total),
      orderId,
      callbackUrl
    );

    // 4. Save Paystack reference back to order
    await supabase
      .from('orders')
      .update({ paystack_reference: transaction.reference })
      .eq('id', orderId);

    return res.json({
      success: true,
      authorization_url: transaction.authorization_url,
      reference: transaction.reference,
      message: 'Payment initialized successfully'
    });
  } catch (err) {
    console.error('Initialize payment error:', err);
    return res.status(500).json({ message: 'Failed to initialize payment: ' + err.message });
  }
};

/**
   * Verify Paystack Transaction Status
   */
export const verify = async (req, res) => {
  const { reference } = req.body;
  if (!reference) {
    return res.status(400).json({ message: 'Transaction reference is required' });
  }

  try {
    const verification = await paystackService.verifyTransaction(reference);

    if (!verification.status) {
      return res.status(400).json({ 
        success: false, 
        message: 'Payment verification failed: ' + verification.gateway_response 
      });
    }

    const orderId = verification.metadata?.orderId;
    if (!orderId) {
      return res.status(400).json({ message: 'Invalid transaction metadata: missing Order ID' });
    }

    // Update order status to paid / confirmed
    const { data: order, error } = await supabase
      .from('orders')
      .update({ 
        payment_status: 'paid', 
        status: 'confirmed',
        escrow_status: 'held'
      })
      .eq('id', orderId)
      .select()
      .single();

    if (error || !order) {
      return res.status(404).json({ message: 'Associated order not found during verification' });
    }

    return res.json({
      success: true,
      message: 'Payment verified and captured successfully',
      order
    });
  } catch (err) {
    console.error('Verify payment error:', err);
    return res.status(500).json({ message: 'Verification error: ' + err.message });
  }
};

/**
   * Paystack Realtime Webhook Listener
   */
export const webhook = async (req, res) => {
  const hash = crypto
    .createHmac('sha256', process.env.PAYSTACK_SECRET_KEY || 'sk_test_mock_paystack_secret_key_for_development')
    .update(JSON.stringify(req.body))
    .digest('hex');

  // Verify signature to make sure it came from Paystack
  if (hash !== req.headers['x-paystack-signature']) {
    return res.status(401).json({ message: 'Invalid webhook signature' });
  }

  const event = req.body;
  
  if (event.event === 'charge.success') {
    const { reference, metadata } = event.data;
    const orderId = metadata?.orderId;

    if (orderId) {
      console.log(`[Paystack Webhook] Fulfilling order payment: ${orderId}...`);
      await supabase
        .from('orders')
        .update({ 
          payment_status: 'paid', 
          status: 'confirmed',
          escrow_status: 'held',
          paystack_reference: reference
        })
        .eq('id', orderId);
    }
  }

  return res.json({ status: 'success' });
};


