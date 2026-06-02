import { supabase, supabaseAdmin } from '../config/db.js';

// Redundant helper removed - we now use req.user from the protect middleware

// ── Farmer helpers ──────────────────────────────────────────────────────────

const getFarmerStats = async (farmerId) => {
  try {
    // Fetch all orders with items and product details for this farmer
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*, items:order_items(*, product:products(*))');

    if (error) throw error;

    let totalRevenue = 0;
    let totalOrdersSet = new Set();
    let deliveredOrdersSet = new Set();

    orders.forEach(order => {
      const farmerItems = order.items.filter(item => item.product?.farmer_id === farmerId);
      if (farmerItems.length > 0) {
        totalOrdersSet.add(order.id);
        if (order.status === 'delivered') {
          deliveredOrdersSet.add(order.id);
          farmerItems.forEach(item => {
            totalRevenue += Number(item.price) * Number(item.quantity);
          });
        }
      }
    });

    const { count: productCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('farmer_id', farmerId);

    const tOrders = totalOrdersSet.size;
    const dCount = deliveredOrdersSet.size;
    const deliveryRate = tOrders > 0 ? Math.round((dCount / tOrders) * 100) : 0;

    return {
      totalRevenue,
      pendingRevenue: 0,
      totalOrders: tOrders,
      deliveredOrders: dCount,
      productCount: productCount || 0,
      deliveryRate,
    };
  } catch (err) {
    console.error('getFarmerStats error:', err);
    return {};
  }
};

const getTopProducts = async (farmerId) => {
  try {
    const { data: items, error } = await supabase
      .from('order_items')
      .select('*, order:orders!inner(status), product:products!inner(*)')
      .eq('product.farmer_id', farmerId)
      .eq('order.status', 'delivered');

    if (error) throw error;

    const productStats = {};
    items.forEach(item => {
      const p = item.product;
      if (!productStats[p.id]) {
        productStats[p.id] = {
          id: p.id,
          name: p.name,
          price: p.price,
          available: p.available,
          category: p.category,
          order_count: 0,
          revenue: 0
        };
      }
      productStats[p.id].order_count += 1;
      productStats[p.id].revenue += Number(item.price) * Number(item.quantity);
    });

    return Object.values(productStats)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  } catch (err) {
    console.error('getTopProducts error:', err);
    return [];
  }
};

const getFarmerRecentOrders = async (farmerId) => {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*, user:users(name), items:order_items!inner(product:products!inner(farmer_id))')
      .eq('items.product.farmer_id', farmerId)
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) throw error;

    return orders.map(o => ({
      id: o.id,
      status: o.status,
      total: o.total,
      created_at: o.created_at,
      buyerName: o.user?.name
    }));
  } catch (err) {
    console.error('getFarmerRecentOrders error:', err);
    return [];
  }
};

const getInventoryValue = async (farmerId) => {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('price, available')
      .eq('farmer_id', farmerId);

    if (error) throw error;
    return products.reduce((sum, p) => sum + (Number(p.price) * Number(p.available)), 0);
  } catch (err) {
    console.error('getInventoryValue error:', err);
    return 0;
  }
};

const getFarmerAIInsights = async (farmerId) => {
  try {
    const { data: products, error: pError } = await supabase
      .from('products')
      .select('*')
      .eq('farmer_id', farmerId);

    if (pError) throw pError;

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

    const { data: orderItems, error: oError } = await supabase
      .from('order_items')
      .select('id, product:products!inner(farmer_id)')
      .eq('product.farmer_id', farmerId);

    if (oError) throw oError;
    const orderCount = orderItems.length;

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
    const { data: orders, error } = await supabase
      .from('orders')
      .select('total, items:order_items(product:products(farmer_id))')
      .eq('user_id', buyerId);

    if (error) throw error;

    let totalSpend = 0;
    const uniqueFarmers = new Set();

    orders.forEach(o => {
      totalSpend += Number(o.total);
      o.items.forEach(item => {
        if (item.product?.farmer_id) uniqueFarmers.add(item.product.farmer_id);
      });
    });

    return {
      totalSpend,
      totalOrders: orders.length,
      uniqueFarmers: uniqueFarmers.size,
    };
  } catch (err) {
    console.error('getBuyerStats error:', err);
    return {};
  }
};

const getBuyerRecentOrders = async (buyerId) => {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*, items:order_items(*, product:products(*, farmer:users(name)))')
      .eq('user_id', buyerId)
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) throw error;

    return orders.map(o => ({
      ...o,
      farmerName: o.items[0]?.product?.farmer?.name ?? 'Farmer',
      total_amount: o.total
    }));
  } catch (err) {
    console.error('getBuyerRecentOrders error:', err);
    return [];
  }
};

const getBuyerAIInsights = async (buyerId) => {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('items:order_items(product:products(category))')
      .eq('user_id', buyerId);

    if (error) throw error;

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
        detail: 'Browse 120+ products from verified farmers across Nigeria.',
      });
    }

    return { profileScore: categoriesFound.length > 0 ? 80 : 40, insights };
  } catch (err) {
    console.error('getBuyerAIInsights error:', err);
    return { profileScore: 40, insights: [] };
  }
};

// ── Main handler ────────────────────────────────────────────────────────────

const getAgroTrustBadges = (stats, role) => {
  const badges = [];
  if (role === 'farmer') {
    if (stats.deliveryRate > 90 && stats.totalOrders > 5) {
      badges.push({ id: 'fast-shipper', label: 'Fast Shipper', icon: 'zap', color: 'green' });
    }
    if (stats.deliveredOrders > 20) {
      badges.push({ id: 'top-rated', label: 'Top Rated Seller', icon: 'star', color: 'blue' });
    }
  } else {
    if (stats.totalSpent > 100000) {
      badges.push({ id: 'high-roller', label: 'Premium Buyer', icon: 'award', color: 'purple' });
    }
    if (stats.agroScore > 70) {
      badges.push({ id: 'trustworthy', label: 'Trusted Partner', icon: 'shield-check', color: 'gold' });
    }
  }
  return badges;
};

export const getProfile = async (req, res) => {
  const userId = req.user?.id || req.query.userId;
  
  if (!userId) return res.status(401).json({ error: 'Unauthorized: User ID required' });

  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email, phone, role, is_verified, verification_status, created_at, agro_score, trust_badges')
      .eq('id', userId)
      .single();

    if (error || !user) {
      // If the profile is for the currently logged-in user, auto-sync and create it!
      if (req.user && req.user.id === userId) {
        console.log(`[PROFILE] Auto-syncing missing user ${userId} to database using supabaseAdmin...`);
        const { data: syncedUser, error: syncErr } = await supabaseAdmin
          .from('users')
          .insert([{
            id: userId,
            name: req.user.user_metadata?.name || 'User',
            email: req.user.email,
            phone: req.user.user_metadata?.phone || '',
            password: 'SUPABASE_AUTH_MANAGED',
            role: req.user.user_metadata?.role || 'user',
            is_verified: false,
            verification_status: 'unverified'
          }])
          .select('id, name, email, phone, role, is_verified, verification_status, created_at, agro_score, trust_badges')
          .single();

        if (!syncErr && syncedUser) {
          const profile = { user: syncedUser };
          if (syncedUser.role === 'farmer') {
            profile.stats = { totalRevenue: 0, pendingRevenue: 0, totalOrders: 0, deliveredOrders: 0, productCount: 0, deliveryRate: 0 };
            profile.topProducts = [];
            profile.recentOrders = [];
            profile.inventoryValue = 0;
            profile.aiInsights = { profileScore: 50, insights: [] };
            profile.badges = [];
          } else {
            profile.stats = { totalSpend: 0, totalOrders: 0, uniqueFarmers: 0 };
            profile.recentOrders = [];
            profile.aiInsights = { profileScore: 40, insights: [] };
            profile.badges = [];
          }
          return res.json(profile);
        }
      }
      return res.status(404).json({ error: 'User not found' });
    }

    const profile = { user };

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
      profile.recentOrders = recentOrders;
      profile.inventoryValue = inventoryValue;
      profile.aiInsights = aiInsights;
      profile.badges = getAgroTrustBadges(stats, 'farmer');
    } else {
      const [stats, recentOrders, aiInsights] = await Promise.all([
        getBuyerStats(userId),
        getBuyerRecentOrders(userId),
        getBuyerAIInsights(userId)
      ]);
      profile.stats = stats;
      profile.recentOrders = recentOrders;
      profile.aiInsights = aiInsights;
      // Inject agro_score into stats for badge calculation
      stats.agroScore = user.agro_score;
      profile.badges = getAgroTrustBadges(stats, 'buyer');
    }

    return res.json(profile);
  } catch (err) {
    console.error('getProfile error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const updateProfile = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const { name, phone } = req.body;

  try {
    const { data: updatedUser, error } = await supabase
      .from('users')
      .update({ name, phone, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select('id, name, email, phone, role, is_verified, verification_status, created_at, agro_score, trust_badges')
      .single();

    if (error) throw error;
    return res.json(updatedUser);
  } catch (err) {
    console.error('updateProfile error:', err);
    return res.status(500).json({ message: 'Failed to update profile' });
  }
};

export const submitVerification = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const { idType, idNumber, idImageUrl } = req.body;
  if (!idType || !idNumber) {
    return res.status(400).json({ message: 'ID Type and ID Number are required' });
  }

  try {
    // 1. Update user fields
    const { data: updatedUser, error } = await supabase
      .from('users')
      .update({
        id_type: idType,
        id_number: idNumber,
        id_image_url: idImageUrl || null,
        verification_status: 'pending',
        is_verified: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select('id, name, email, phone, role, is_verified, verification_status, created_at, agro_score, trust_badges, id_type, id_number, id_image_url')
      .single();

    if (error) throw error;

    // 2. Insert audit trail in verification_requests table (swallow error if table not yet created by user)
    try {
      await supabase
        .from('verification_requests')
        .insert([{
          user_id: userId,
          id_type: idType,
          id_number: idNumber,
          id_image_url: idImageUrl || null,
          status: 'pending'
        }]);
    } catch (auditErr) {
      console.warn('⚠️ Optional audit log failed (table might be pending creation):', auditErr.message);
    }

    return res.json({
      message: 'Verification request submitted successfully',
      user: updatedUser
    });
  } catch (err) {
    console.error('submitVerification error:', err);
    return res.status(500).json({ message: 'Failed to submit verification' });
  }
};

export const upgradeToSeller = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const { data: updatedUser, error } = await supabase
      .from('users')
      .update({
        role: 'farmer',
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select('id, name, email, phone, role, is_verified, verification_status, created_at, agro_score, trust_badges')
      .single();

    if (error) throw error;
    return res.json({
      message: 'Successfully upgraded to Seller/Farmer role!',
      user: updatedUser
    });
  } catch (err) {
    console.error('upgradeToSeller error:', err);
    return res.status(500).json({ message: 'Failed to upgrade to seller' });
  }
};
