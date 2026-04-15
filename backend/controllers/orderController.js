import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { sendMockSms } from './smsController.js';

export const getAll = async (_req, res) => {
  try {
    const orders = await Order.find().sort({ created_at: -1 }).populate('user', 'name email');
    return res.json(orders);
  } catch (err) {
    console.error('GetAll orders error:', err);
    return res.status(500).json({ message: 'Something went wrong on our end. Please try again later.' });
  }
};

export const getById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product');
    return res.json(order ?? null);
  } catch (err) {
    console.error('GetById order error:', err);
    return res.status(500).json({ message: 'Something went wrong on our end. Please try again later.' });
  }
};

export const create = async (req, res) => {
  const { userId, total = 0, deliveryAddress = '', items = [] } = req.body;

  try {
    // MongoDB handles the embedded items automatically by defining them in the schema
    const orderItems = items.map(item => ({
      product: item.product.id || item.product._id,
      quantity: item.quantity,
      price: item.offeredPrice ?? item.product.price
    }));

    const order = await Order.create({
      user: userId,
      total,
      delivery_address: deliveryAddress,
      items: orderItems
    });

    const populated = await order.populate(['user', 'items.product']);
    return res.json(populated);
  } catch (err) {
    console.error('Create order error:', err);
    return res.status(500).json({ message: 'Could not create your order. Please try again later.' });
  }
};

export const updateTracking = async (req, res) => {
  const { orderId, trackingNumber, estimatedDelivery } = req.body;

  try {
    const order = await Order.findByIdAndUpdate(
      orderId,
      { tracking_number: trackingNumber, estimated_delivery: estimatedDelivery, status: 'shipped' },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: 'Could not find this order' });

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
  const { orderId } = req.body;

  try {
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status: 'delivered', escrow_status: 'released', actual_delivery_date: Date.now() },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: 'Could not find this order' });

    sendMockSms('Farmer', `Order #${orderId} delivery confirmed! Money has been sent to your wallet.`);
    sendMockSms('Buyer', `Delivery confirmed for order #${orderId}. Thank you for using AgroDirect!`);

    return res.json({ status: 'success', message: 'Success! Delivery confirmed and SMS sent', order });
  } catch (err) {
    console.error('Confirm delivery error:', err);
    return res.status(500).json({ message: 'Something went wrong on our end. Please try again later.' });
  }
};

export const getFarmerOrders = async (req, res) => {
  // In a real app, we'd filter by products belonging to the farmer
  // For this MVP, we return all orders since orders are shared
  try {
    const orders = await Order.find().sort({ created_at: -1 }).populate(['user', 'items.product']);
    return res.json(orders);
  } catch (err) {
    console.error('GetFarmerOrders error:', err);
    return res.status(500).json({ message: 'Something went wrong on our end. Please try again later.' });
  }
};

export const respondToOffer = (_req, res) => {
  return res.json({ message: 'Offer response recorded' });
};


