import { supabase } from '../config/db.js';
import { sendMockSms } from './smsController.js';

export const getAll = async (req, res) => {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*, user:users(name, email), items:order_items(*, product:products(*))')
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
      .select('*, user:users(name, email), items:order_items(*, product:products(*))')
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
    // For now, we'll use the client total if provided, or sum the items
    const total = clientTotal || items.reduce((sum, item) => sum + (item.offeredPrice ?? item.product.price) * item.quantity, 0);

    // 2. Create Order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        user_id: userId,
        total,
        delivery_address: deliveryAddress,
        status: 'pending',
        payment_status: 'pending',
        escrow_status: 'held'
      }])
      .select()
      .single();

    if (orderError) throw orderError;

    // 2. Create Order Items
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

    // 3. Fetch populated
    const { data: populated, error: popError } = await supabase
      .from('orders')
      .select('*, user:users(name, email), items:order_items(*, product:products(*))')
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

    sendMockSms('Vendor', `Order #${orderId} delivery confirmed!`);
    return res.json({ status: 'success', order });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const generateOtp = async (req, res) => {
  res.json({ message: 'OTP generated' });
};

export const getFarmerOrders = async (req, res) => {
  try {
    // For vendors, we need to find orders that contain their products
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*, user:users(name, email), items:order_items(*, product:products(*))')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Filter orders that have items belonging to this farmer/vendor
    const farmerOrders = orders.filter(o => 
      o.items.some(item => item.product?.farmer_id === req.user.id)
    );

    return res.json(farmerOrders);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const respondToOffer = (_req, res) => {
  return res.json({ message: 'Offer response recorded' });
};
