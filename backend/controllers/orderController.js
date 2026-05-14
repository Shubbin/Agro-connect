import Order from '../models/Order.js';
import { sendMockSms } from './smsController.js';

export const getAll = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('user', 'name email')
      .sort({ created_at: -1 });
    return res.json(orders);
  } catch (err) {
    console.error('GetAll orders error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product');
    return res.json(order);
  } catch (err) {
    console.error('GetById order error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const create = async (req, res) => {
  const { userId, total = 0, deliveryAddress = '', items = [] } = req.body;

  try {
    const order = new Order({
      user: userId,
      total,
      delivery_address: deliveryAddress,
      status: 'pending',
      items: items.map(item => ({
        product: item.product._id || item.product.id,
        quantity: item.quantity,
        price: item.offeredPrice ?? item.product.price
      }))
    });

    await order.save();
    const populated = await Order.findById(order._id)
      .populate('user', 'name email')
      .populate('items.product');

    return res.json(populated);
  } catch (err) {
    console.error('Create order error:', err);
    return res.status(500).json({ message: 'Could not create your order.' });
  }
};

export const updateTracking = async (req, res) => {
  const { orderId, trackingNumber, estimatedDelivery } = req.body;
  try {
    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        tracking_number: trackingNumber,
        estimated_delivery: estimatedDelivery,
        status: 'shipped'
      },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: 'Order not found' });

    sendMockSms('Buyer', `Your order #${orderId} has been shipped!`);
    return res.json({ status: 'success', order });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const confirmDelivery = async (req, res) => {
  const { orderId, otp } = req.body;
  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = 'delivered';
    order.escrow_status = 'released';
    order.actual_delivery_date = new Date();
    await order.save();

    sendMockSms('Farmer', `Order #${orderId} delivery confirmed!`);
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
    // In MongoDB, we might need a merchant/farmer field on the order or items
    // For now, let's just return all orders for testing or filter by item product farmer
    const orders = await Order.find().populate('user', 'name email').populate('items.product');
    return res.json(orders);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const respondToOffer = (_req, res) => {
  return res.json({ message: 'Offer response recorded' });
};
