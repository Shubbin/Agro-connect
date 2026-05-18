import { supabase } from '../config/db.js';
import crypto from 'crypto';
import webhookService from '../services/webhookService.js';

/**
 * Agro B2B Controller
 * 
 * Logic for businesses (processors, distributors) to integrate with Agro-Connect.
 */

// 1. Generate API Key for B2B Partner
export const generateApiKey = async (req, res) => {
  const { name } = req.body;
  const merchantId = req.user.id;

  try {
    const apiKey = `ac_live_${crypto.randomBytes(24).toString('hex')}`;
    
    const { data, error } = await supabase
      .from('merchant_api_keys')
      .insert([{
        merchant_id: merchantId,
        api_key: apiKey,
        name: name || 'Default Trade Key'
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ message: 'Trade API Key generated', apiKey: data.api_key });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Get All API Keys for Merchant
export const getApiKeys = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('merchant_api_keys')
      .select('*')
      .eq('merchant_id', req.user.id);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Create Bulk Trade Session (BNPL for Businesses)
export const createTradeSession = async (req, res) => {
  const { items, buyerId, plan } = req.body;
  const merchant = req.merchant; // From API Key middleware

  if (!merchant || !merchant.id) {
    return res.status(401).json({ error: 'B2B Merchant profile not resolved. Valid API Key required.' });
  }

  try {
    let totalAmount = 0;
    items.forEach(item => totalAmount += (item.price * item.quantity));

    const commissionRate = 0.03;
    const commission = totalAmount * commissionRate;
    const farmerPayout = totalAmount - commission;

    const { data: order, error } = await supabase
      .from('orders')
      .insert([{
        user_id: buyerId,
        merchant_id: merchant.id,
        total: totalAmount,
        platform_commission: commission,
        merchant_payout_amount: farmerPayout,
        is_b2b: true,
        installment_plan: plan,
        status: 'pending'
      }])
      .select()
      .single();

    if (error) throw error;

    const orderItems = items.map(i => ({
      order_id: order.id,
      product_id: i.productId,
      quantity: i.quantity,
      price: i.price
    }));

    await supabase.from('order_items').insert(orderItems);

    // Fetch full merchant info for webhook triggers
    const { data: merchantUser } = await supabase
      .from('users')
      .select('*')
      .eq('id', merchant.id)
      .single();

    // Trigger Webhook Notification
    if (merchantUser && merchantUser.webhook_url) {
      webhookService.notify(merchantUser.webhook_url, merchant.api_key, 'trade.created', {
        tradeId: order.id,
        total: totalAmount,
        buyerId
      });
    }

    res.status(201).json({
      message: 'Trade session initiated successfully',
      tradeId: order.id,
      checkoutUrl: `${req.headers.origin || 'http://localhost:5173'}/trade/pay/${order.id}`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. Trade Analytics for B2B Partners
export const getTradeStats = async (req, res) => {
  try {
    const merchantId = req.user?.id || req.merchant?.id;
    if (!merchantId) {
      return res.status(401).json({ error: 'Authentication credentials missing' });
    }

    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .eq('merchant_id', merchantId);

    if (error) throw error;

    const stats = orders.reduce((acc, o) => {
      acc.volume += Number(o.total);
      acc.commissions += Number(o.platform_commission || 0);
      acc.payouts += Number(o.merchant_payout_amount || 0);
      return acc;
    }, { volume: 0, commissions: 0, payouts: 0, count: orders.length });

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
