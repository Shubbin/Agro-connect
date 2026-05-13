import { supabase } from '../config/db.js';
import { sendMockSms } from './smsController.js';
import PayoutService from '../services/payoutService.js';

export const getAll = async (_req, res) => {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*, user:users(name, email)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return res.json(orders);
  } catch (err) {
    console.error('GetAll orders error:', err);
    return res.status(500).json({ message: 'Something went wrong on our end. Please try again later.' });
  }
};

export const getById = async (req, res) => {
  try {
    const { data: order, error } = await supabase
      .from('orders')
      .select('*, user:users(name, email), items:order_items(*, product:products(*))')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    return res.json(order);
  } catch (err) {
    console.error('GetById order error:', err);
    return res.status(500).json({ message: 'Something went wrong on our end. Please try again later.' });
  }
};

export const create = async (req, res) => {
  const { userId, total = 0, deliveryAddress = '', items = [] } = req.body;

  try {
    // 1. Create the main order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          user_id: userId,
          total,
          delivery_address: deliveryAddress,
          status: 'pending'
        }
      ])
      .select()
      .single();

    if (orderError) throw orderError;

    // 2. Create the order items
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

    // 3. Return full order with items
    const { data: fullOrder, error: fetchError } = await supabase
      .from('orders')
      .select('*, user:users(name, email), items:order_items(*, product:products(*))')
      .eq('id', order.id)
      .single();

    if (fetchError) throw fetchError;

    return res.json(fullOrder);
  } catch (err) {
    console.error('Create order error:', err);
    return res.status(500).json({ message: 'Could not create your order. Please try again later.' });
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

    if (error) return res.status(404).json({ message: 'Could not find this order' });

    sendMockSms(
      'Buyer',
      `Your AgroDirect order #${orderId} has been shipped! Tracking: ${trackingNumber}. Estimated arrival: ${estimatedDelivery}`
    );

    return res.json({ status: 'success', message: 'Success! Tracking updated and SMS sent', order });
  } catch (err) {
    console.error('Update tracking error:', err);
    return res.status(500).json({ message: 'Something went wrong on our end. Please try again later.' });
  }
};

export const confirmDelivery = async (req, res) => {
  const { orderId, otp } = req.body;

  try {
    // 1. Fetch order to check OTP
    const { data: orderData, error: fetchError } = await supabase
      .from('orders')
      .select('delivery_otp, status')
      .eq('id', orderId)
      .single();

    if (fetchError || !orderData) return res.status(404).json({ message: 'Order not found' });

    // 2. Verify OTP if it exists
    if (orderData.delivery_otp && orderData.delivery_otp !== otp) {
      return res.status(400).json({ message: 'Invalid delivery OTP' });
    }

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

    if (error) return res.status(404).json({ message: 'Could not find this order' });

    // 3. Record Payout in Ledger
    await PayoutService.recordPayout(order);

    sendMockSms('Farmer', `Order #${orderId} delivery confirmed! Money has been sent to your wallet.`);
    sendMockSms('Buyer', `Delivery confirmed for order #${orderId}. Thank you for using AgroDirect!`);

    return res.json({ status: 'success', message: 'Success! Delivery confirmed and SMS sent', order });
  } catch (err) {
    console.error('Confirm delivery error:', err);
    return res.status(500).json({ message: 'Something went wrong on our end. Please try again later.' });
  }
};

export const generateOtp = async (req, res) => {
  const { orderId } = req.params;
  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ delivery_otp: otp })
      .eq('id', orderId)
      .select('*, user:users(phone)')
      .single();

    if (error) throw error;

    // Send OTP to buyer via SMS
    sendMockSms('Buyer', `Your AgroConnect delivery OTP for order #${orderId} is: ${otp}. Give this to the seller only when you receive your produce.`);

    res.json({ message: 'OTP generated and sent to buyer' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFarmerOrders = async (req, res) => {
  try {
    // For MVP, return all orders with product details
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*, user:users(name, email), items:order_items(*, product:products(*))')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return res.json(orders);
  } catch (err) {
    console.error('GetFarmerOrders error:', err);
    return res.status(500).json({ message: 'Something went wrong on our end. Please try again later.' });
  }
};

export const respondToOffer = (_req, res) => {
  return res.json({ message: 'Offer response recorded' });
};
