import Order from '../models/Order.js';

export const getBalance = async (_req, res) => {
  try {
    const availableRes = await Order.aggregate([
      { $match: { payment_status: 'paid', escrow_status: 'released' } },
      { $group: { _id: null, total: { $sum: "$total" } } }
    ]);
    
    const pendingRes = await Order.aggregate([
      { $match: { payment_status: 'paid', escrow_status: 'held' } },
      { $group: { _id: null, total: { $sum: "$total" } } }
    ]);

    return res.json({ 
      available: availableRes[0]?.total ?? 0, 
      pending: pendingRes[0]?.total ?? 0, 
      currency: 'NGN' 
    });
  } catch (err) {
    console.error('Get wallet balance error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getTransactions = async (_req, res) => {
  try {
    const orders = await Order.find().sort({ created_at: -1 });

    const txns = orders.map((o) => ({
      id: `txn_${o._id}`,
      type: 'credit',
      amount: o.total,
      description: `Order #${o._id} payment`,
      date: o.created_at,
      status: o.payment_status === 'paid' ? 'completed' : 'pending',
    }));

    return res.json(txns);
  } catch (err) {
    console.error('Get wallet transactions error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};


