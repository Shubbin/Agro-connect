import mongoose from 'mongoose';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

const getUserIdFromToken = async (req) => {
  const auth = req.headers.authorization ?? '';
  const match = auth.match(/^Bearer\s+(.+)$/);
  if (!match) return null;
  try {
    const user = await User.findOne({ auth_token: match[1] });
    return user ? user._id : null;
  } catch (err) {
    console.error('getUserIdFromToken error:', err);
    return null;
  }
};

// ── Farmer helpers ──────────────────────────────────────────────────────────

const getFarmerStats = async (farmerId) => {
  try {
    // 1. Total Revenue from delivered orders
    const revenueRes = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $unwind: "$items" },
      { $lookup: { from: 'products', localField: 'items.product', foreignField: '_id', as: 'productInfo' } },
      { $unwind: "$productInfo" },
      { $match: { "productInfo.farmer": farmerId } },
      { $group: { _id: null, total: { $sum: { $multiply: ["$items.price", "$items.quantity"] } } } }
    ]);

    // 2. Total orders containing farmer's products
    const totalOrdersRes = await Order.aggregate([
      { $unwind: "$items" },
      { $lookup: { from: 'products', localField: 'items.product', foreignField: '_id', as: 'productInfo' } },
      { $unwind: "$productInfo" },
      { $match: { "productInfo.farmer": farmerId } },
      { $group: { _id: "$_id" } }
    ]);

    // 3. Delivered orders containing farmer's products
    const deliveredOrdersRes = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $unwind: "$items" },
      { $lookup: { from: 'products', localField: 'items.product', foreignField: '_id', as: 'productInfo' } },
      { $unwind: "$productInfo" },
      { $match: { "productInfo.farmer": farmerId } },
      { $group: { _id: "$_id" } }
    ]);

    const productCount = await Product.countDocuments({ farmer: farmerId });

    const tOrders = totalOrdersRes.length;
    const dCount = deliveredOrdersRes.length;
    const deliveryRate = tOrders > 0 ? Math.round((dCount / tOrders) * 100) : 0;

    return {
      totalRevenue: revenueRes[0]?.total ?? 0,
      pendingRevenue: 0,
      totalOrders: tOrders,
      deliveredOrders: dCount,
      productCount: productCount,
      deliveryRate,
    };
  } catch (err) {
    console.error('getFarmerStats error:', err);
    return {};
  }
};

const getTopProducts = async (farmerId) => {
  try {
    // Top 5 products by revenue and order count
    const topProducts = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $unwind: "$items" },
      { $lookup: { from: 'products', localField: 'items.product', foreignField: '_id', as: 'productInfo' } },
      { $unwind: "$productInfo" },
      { $match: { "productInfo.farmer": farmerId } },
      { $group: {
          _id: "$productInfo._id",
          name: { $first: "$productInfo.name" },
          price: { $first: "$productInfo.price" },
          available: { $first: "$productInfo.available" },
          category: { $first: "$productInfo.category" },
          order_count: { $sum: 1 },
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
      }},
      { $sort: { revenue: -1, order_count: -1 } },
      { $limit: 5 }
    ]);
    return topProducts;
  } catch (err) {
    console.error('getTopProducts error:', err);
    return [];
  }
};

const getFarmerRecentOrders = async (farmerId) => {
  try {
    // Recent 5 orders containing farmer's products
    const recentOrders = await Order.aggregate([
      { $unwind: "$items" },
      { $lookup: { from: 'products', localField: 'items.product', foreignField: '_id', as: 'productInfo' } },
      { $unwind: "$productInfo" },
      { $match: { "productInfo.farmer": farmerId } },
      { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'buyerInfo' } },
      { $unwind: "$buyerInfo" },
      { $group: {
          _id: "$_id",
          id: { $first: "$_id" },
          status: { $first: "$status" },
          total: { $first: "$total" },
          created_at: { $first: "$created_at" },
          buyerName: { $first: "$buyerInfo.name" }
      }},
      { $sort: { created_at: -1 } },
      { $limit: 5 }
    ]);
    return recentOrders;
  } catch (err) {
    console.error('getFarmerRecentOrders error:', err);
    return [];
  }
};

const getInventoryValue = async (farmerId) => {
  try {
    const res = await Product.aggregate([
      { $match: { farmer: farmerId } },
      { $group: { _id: null, value: { $sum: { $multiply: ["$price", "$available"] } } } }
    ]);
    return res[0]?.value ?? 0;
  } catch (err) {
    console.error('getInventoryValue error:', err);
    return 0;
  }
};

const getFarmerAIInsights = async (farmerId) => {
  try {
    const products = await Product.find({ farmer: farmerId });

    const insights = [];
    let profileScore = 50;

    const uncertified = products.filter((p) => (p.certifications ?? []).length === 0);

    if (uncertified.length > 0) {
      insights.push({
        type: 'listing_health',
        icon: 'AlertTriangle',
        severity: 'warning',
        title: `${uncertified.length} products have no certifications`,
        detail: 'Adding "Organic" or "GAP Certified" can increase buyer trust by up to 40%.',
      });
    } else if (products.length > 0) {
      profileScore += 20;
    }

    products.forEach((p) => {
      if (p.available < 10) {
        insights.push({
          type: 'restock',
          icon: 'PackageX',
          severity: 'error',
          title: `${p.name} is running low`,
          detail: `Only ${p.available} units left. Restock soon to avoid missed orders.`,
        });
      }
    });

    const orderRes = await Order.aggregate([
      { $unwind: "$items" },
      { $lookup: { from: 'products', localField: 'items.product', foreignField: '_id', as: 'productInfo' } },
      { $unwind: "$productInfo" },
      { $match: { "productInfo.farmer": farmerId } },
      { $group: { _id: "$_id" } }
    ]);

    const orderCount = orderRes.length;

    if (orderCount === 0) {
      insights.push({
        type: 'price_advisor',
        icon: 'TrendingUp',
        severity: 'info',
        title: 'No orders yet — review your pricing',
        detail: 'Competitive pricing earns first sales faster. Check the marketplace for similar products.',
      });
    } else {
      profileScore += 20;
      insights.push({
        type: 'price_advisor',
        icon: 'TrendingUp',
        severity: 'success',
        title: `Great — you've received ${orderCount} orders!`,
        detail: 'Consider raising prices by 5–10% to test demand as your reputation grows.',
      });
    }

    const categories = [...new Set(products.map((p) => p.category))];
    if (categories.length < 2) {
      insights.push({
        type: 'diversification',
        icon: 'Layers',
        severity: 'info',
        title: 'Diversify your product range',
        detail: 'Farmers with 3+ categories get 2× more enquiries. Consider adding related crops.',
      });
    } else {
      profileScore += 10;
    }

    if (products.length >= 5) profileScore += 10;
    if (orderCount > 0) profileScore += 10;

    return { profileScore: Math.min(100, profileScore), insights };
  } catch (err) {
    console.error('getFarmerAIInsights error:', err);
    return { profileScore: 50, insights: [] };
  }
};

// ── Buyer helpers ────────────────────────────────────────────────────────────

const getBuyerStats = async (buyerId) => {
  try {
    const stats = await Order.aggregate([
      { $match: { user: buyerId } },
      { $group: { 
          _id: null, 
          totalSpend: { $sum: "$total" },
          totalOrders: { $sum: 1 }
      }}
    ]);

    const farmerCountRes = await Order.aggregate([
      { $match: { user: buyerId } },
      { $unwind: "$items" },
      { $lookup: { from: 'products', localField: 'items.product', foreignField: '_id', as: 'productInfo' } },
      { $unwind: "$productInfo" },
      { $group: { _id: "$productInfo.farmer" } }
    ]);

    return {
      totalSpend: stats[0]?.totalSpend ?? 0,
      totalOrders: stats[0]?.totalOrders ?? 0,
      uniqueFarmers: farmerCountRes.length,
    };
  } catch (err) {
    console.error('getBuyerStats error:', err);
    return {};
  }
};

const getBuyerRecentOrders = async (buyerId) => {
  try {
    const orders = await Order.find({ user: buyerId }).sort({ created_at: -1 }).limit(5).populate('items.product');

    return await Promise.all(orders.map(async (order) => {
      const doc = order.toObject();
      const firstProduct = doc.items[0]?.product;
      let farmerName = 'Farmer';
      
      if (firstProduct && firstProduct.farmer) {
        const farmer = await User.findById(firstProduct.farmer).select('name');
        farmerName = farmer?.name ?? 'Farmer';
      }

      return {
        ...doc,
        id: doc._id,
        farmerName,
        total_amount: doc.total,
      };
    }));
  } catch (err) {
    console.error('getBuyerRecentOrders error:', err);
    return [];
  }
};

const getBuyerAIInsights = async (buyerId) => {
  try {
    const orders = await Order.find({ user: buyerId }).populate('items.product');

    const insights = [];
    const catCounts = {};
    
    orders.forEach(order => {
      order.items.forEach(item => {
        const cat = item.product?.category;
        if (cat) catCounts[cat] = (catCounts[cat] ?? 0) + 1;
      });
    });

    const categoriesFound = Object.entries(catCounts).sort((a, b) => b[1] - a[1]);
    const topCat = categoriesFound[0]?.[0];

    if (topCat) {
      insights.push({
        type: 'recommendation',
        icon: 'ShoppingBag',
        severity: 'info',
        title: `You love ${topCat}!`,
        detail: `Most of your orders are in ${topCat}. We have fresh listings from verified farmers in this category.`,
      });
    } else {
      insights.push({
        type: 'onboarding',
        icon: 'ShoppingBag',
        severity: 'info',
        title: 'Start shopping from verified farmers',
        detail: 'Browse 120+ products from 16 verified farmers across Nigeria.',
      });
    }

    return { profileScore: categoriesFound.length > 0 ? 80 : 40, insights };
  } catch (err) {
    console.error('getBuyerAIInsights error:', err);
    return { profileScore: 40, insights: [] };
  }
};

// ── Main handler ────────────────────────────────────────────────────────────

export const getProfile = async (req, res) => {
  let userId = await getUserIdFromToken(req);
  
  // If not in token, check query
  if (!userId && req.query.userId) {
     const qId = req.query.userId;
     if (mongoose.Types.ObjectId.isValid(qId)) {
        userId = qId;
     }
  }

  if (!userId) return res.status(401).json({ error: 'Unauthorized or Invalid User ID' });

  try {
    const user = await User.findById(userId).select('id name email phone role is_verified verification_status created_at');
    if (!user) return res.status(404).json({ error: 'User not found' });

    const userData = user.toObject();
    userData.id = userData._id;
    const profile = { user: userData };

    if (user.role === 'farmer') {
      const [stats, topProducts, recentOrders, inventoryValue, aiInsights] = await Promise.all([
        getFarmerStats(userId),
        getTopProducts(userId),
        getFarmerRecentOrders(userId),
        getInventoryValue(userId),
        getFarmerAIInsights(userId)
      ]);
      profile.stats = stats;
      profile.topProducts = topProducts;
      profile.recentOrders = recentOrders.map(o => ({ ...o, id: o._id }));
      profile.inventoryValue = inventoryValue;
      profile.aiInsights = aiInsights;
    } else {
      const [stats, recentOrders, aiInsights] = await Promise.all([
        getBuyerStats(userId),
        getBuyerRecentOrders(userId),
        getBuyerAIInsights(userId)
      ]);
      profile.stats = stats;
      profile.recentOrders = recentOrders;
      profile.aiInsights = aiInsights;
    }

    return res.json(profile);
  } catch (err) {
    console.error('getProfile error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};


