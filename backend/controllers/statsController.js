import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

const formatVolume = (raw) => {
  if (raw >= 1_000_000) return `₦${(raw / 1_000_000).toFixed(1)}M+`;
  if (raw >= 1_000) return `₦${(raw / 1_000).toFixed(1)}k+`;
  return `₦${Number(raw).toLocaleString()}`;
};

export const getSummary = async (_req, res) => {
  try {
    const volumeRes = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: "$total" } } }
    ]);

    const farmers = await User.countDocuments({ role: 'farmer' });
    const products = await Product.countDocuments();
    const statesRes = await Product.distinct('location');

    return res.json({
      farmers: Number(farmers ?? 0),
      products: Number(products ?? 0),
      states: statesRes.length,
      volume: formatVolume(volumeRes[0]?.total ?? 0),
    });
  } catch (err) {
    console.error('Get stats summary error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};


