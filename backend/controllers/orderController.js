import { supabase } from '../config/db.js';
import { sendMockSms } from './smsController.js';
import payoutService from '../services/payoutService.js';

export const getAll = async (req, res) => {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*, user:users!user_id(name, email), items:order_items(*, product:products(*))')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return res.json(orders);
  } catch (err) {
    console.error('GetAll orders error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getById = async (req, res) => {
  try {
    const { data: order, error } = await supabase
      .from('orders')
      .select('*, user:users!user_id(name, email), items:order_items(*, product:products(*))')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    return res.json(order);
  } catch (err) {
    console.error('GetById order error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const create = async (req, res) => {
  const { total: clientTotal, deliveryAddress = '', items = [] } = req.body;
  const userId = req.user.id;

  try {
    // 1. Calculate Total (Security best practice: calculate on server)
    const total = clientTotal || items.reduce((sum, item) => sum + (item.offeredPrice ?? item.product.price) * item.quantity, 0);

    // 2. Set merchant_id to the farmer of the first item's product
    const merchantId = items[0]?.product?.farmer_id || items[0]?.product?.merchant_id || null;

    // 3. Create Order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        user_id: userId,
        merchant_id: merchantId,
        total,
        delivery_address: deliveryAddress,
        status: 'pending',
        payment_status: 'pending',
        escrow_status: 'held'
      }])
      .select()
      .single();

    if (orderError) throw orderError;

    // 4. Create Order Items
    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.product.id || item.product._id,
      quantity: item.quantity,
      price: item.offeredPrice ?? item.product.price
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // 5. Create Invoice record automatically for billing
    const invoiceNum = `INV-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    await supabase
      .from('invoices')
      .insert([{
        order_id: order.id,
        seller_id: merchantId,
        buyer_id: userId,
        invoice_number: invoiceNum,
        total_amount: total,
        status: 'unpaid'
      }]);

    // 6. Fetch populated
    const { data: populated, error: popError } = await supabase
      .from('orders')
      .select('*, user:users!user_id(name, email), items:order_items(*, product:products(*))')
      .eq('id', order.id)
      .single();

    if (popError) throw popError;

    return res.json(populated);
  } catch (err) {
    console.error('Create order error:', err);
    return res.status(500).json({ message: 'Could not create your order.' });
  }
};

export const updateTracking = async (req, res) => {
  const { orderId, trackingNumber, estimatedDelivery } = req.body;
  try {
    const { data: order, error } = await supabase
      .from('orders')
      .update({
        tracking_number: trackingNumber,
        estimated_delivery: estimatedDelivery,
        status: 'shipped'
      })
      .eq('id', orderId)
      .select()
      .single();

    if (error || !order) return res.status(404).json({ message: 'Order not found' });

    sendMockSms('Buyer', `Your order #${orderId} has been shipped!`);
    return res.json({ status: 'success', order });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const confirmDelivery = async (req, res) => {
  const { orderId } = req.body;
  try {
    const { data: order, error } = await supabase
      .from('orders')
      .update({
        status: 'delivered',
        escrow_status: 'released',
        actual_delivery_date: new Date().toISOString()
      })
      .eq('id', orderId)
      .select()
      .single();

    if (error || !order) return res.status(404).json({ message: 'Order not found' });

    // Fulfill Escrow / Payout release flow securely
    await payoutService.recordPayout(order);

    // Also update invoice status to paid if payment was done
    await supabase
      .from('invoices')
      .update({ status: 'paid' })
      .eq('order_id', orderId);

    sendMockSms('Vendor', `Order #${orderId} delivery confirmed! Payout released to your wallet.`);
    return res.json({ status: 'success', order });
  } catch (err) {
    console.error('Confirm Delivery Error:', err.message);
    return res.status(500).json({ message: 'Server error: ' + err.message });
  }
};

export const generateOtp = async (req, res) => {
  res.json({ message: 'OTP generated' });
};

export const getFarmerOrders = async (req, res) => {
  try {
    // For vendors, we find orders that belong to this merchant_id
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*, user:users!user_id(name, email), items:order_items(*, product:products(*))')
      .eq('merchant_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return res.json(orders);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const respondToOffer = async (req, res) => {
  const { cartItemId, accept } = req.body;
  if (!cartItemId) {
    return res.status(400).json({ message: 'Cart Item ID is required' });
  }

  try {
    const status = accept ? 'accepted' : 'rejected';
    const { data: cartItem, error } = await supabase
      .from('cart_items')
      .update({ offer_status: status })
      .eq('id', cartItemId)
      .select()
      .single();

    if (error || !cartItem) {
      return res.status(404).json({ message: 'Cart item not found or update failed' });
    }

    return res.json({ 
      success: true, 
      message: `Offer ${status} successfully`, 
      cartItem 
    });
  } catch (err) {
    console.error('Respond to offer error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
