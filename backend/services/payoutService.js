import { supabase } from '../config/db.js';

/**
 * PayoutService
 * 
 * Handles automated financial settlements.
 */
class PayoutService {
  /**
   * Record a new payout when an order is delivered
   * @param {object} order - The order object with total and merchant details
   */
  async recordPayout(order) {
    try {
      // 1. Calculate commission (3% default for bulk/trade if not specified)
      const commission = order.platform_commission || (order.total * 0.03);
      const amountNet = order.total - commission;

      // 2. Insert into payouts table
      const { data, error } = await supabase
        .from('payouts')
        .insert([{
          merchant_id: order.merchant_id || order.farmer_id,
          order_id: order.id,
          amount_gross: order.total,
          commission_deducted: commission,
          amount_net: amountNet,
          status: 'pending'
        }]);

      if (error) throw error;
      console.log(`[Payout] Recorded pending payout for Order #${order.id}`);
      return data;
    } catch (error) {
      console.error('[Payout Service Error]:', error.message);
    }
  }

  /**
   * Get merchant payout history
   */
  async getMerchantHistory(merchantId) {
    const { data, error } = await supabase
      .from('payouts')
      .select('*')
      .eq('merchant_id', merchantId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
}

export default new PayoutService();
