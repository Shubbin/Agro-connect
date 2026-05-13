import { supabase } from '../config/db.js';
import crypto from 'crypto';

export const process = async (req, res) => {
  const { orderId, amount = 0 } = req.body;

  if (!orderId) return res.status(400).json({ message: 'Order ID required' });

  try {
    const { data: order, error } = await supabase
      .from('orders')
      .update({ payment_status: 'paid', status: 'confirmed' })
      .eq('id', orderId)
      .select()
      .single();

    if (error || !order) return res.status(404).json({ message: 'Order not found' });

    return res.json({
      success: true,
      transactionId: 'PAY_' + crypto.randomBytes(8).toString('hex'),
      message: 'Payment successful',
      order
    });
  } catch (err) {
    console.error('Process payment error:', err);
    return res.status(500).json({ message: 'Payment failed: ' + err.message });
  }
};


