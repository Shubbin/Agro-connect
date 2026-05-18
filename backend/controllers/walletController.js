import { supabase } from '../config/db.js';

export const getBalance = async (req, res) => {
  try {
    // 1. Available Balance (processed payouts)
    const { data: processedData, error: processedError } = await supabase
      .from('payouts')
      .select('amount_net')
      .eq('merchant_id', req.user.id)
      .eq('status', 'processed');

    if (processedError) throw processedError;
    const available = processedData.reduce((sum, p) => sum + Number(p.amount_net), 0);
    
    // 2. Pending Balance (pending payouts)
    const { data: pendingData, error: pendingError } = await supabase
      .from('payouts')
      .select('amount_net')
      .eq('merchant_id', req.user.id)
      .eq('status', 'pending');

    if (pendingError) throw pendingError;
    const pending = pendingData.reduce((sum, p) => sum + Number(p.amount_net), 0);

    // Fallback: Check orders if payouts are empty
    if (available === 0 && pending === 0) {
      const { data: orderData } = await supabase
        .from('orders')
        .select('total, escrow_status')
        .eq('merchant_id', req.user.id)
        .eq('payment_status', 'paid');
      
      if (orderData && orderData.length > 0) {
        const fallAvail = orderData
          .filter(o => o.escrow_status === 'released')
          .reduce((sum, o) => sum + Number(o.total), 0);
        const fallPend = orderData
          .filter(o => o.escrow_status === 'held')
          .reduce((sum, o) => sum + Number(o.total), 0);
        return res.json({ available: fallAvail, pending: fallPend, currency: 'NGN' });
      }
    }

    return res.json({ 
      available, 
      pending, 
      currency: 'NGN' 
    });
  } catch (err) {
    console.error('Get wallet balance error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const { data: payouts, error } = await supabase
      .from('payouts')
      .select('*')
      .eq('merchant_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    let txns = payouts.map((p) => ({
      id: `payout_${p.id}`,
      type: 'credit',
      amount: p.amount_net,
      description: `Payout for Order #${p.order_id ? p.order_id.substring(0, 8) : 'N/A'}`,
      date: p.created_at,
      status: p.status === 'processed' ? 'completed' : 'pending',
    }));

    // Fallback: Check orders if transactions list is empty
    if (txns.length === 0) {
      const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .eq('merchant_id', req.user.id)
        .order('created_at', { ascending: false });

      if (orders) {
        txns = orders.map((o) => ({
          id: `txn_${o.id}`,
          type: 'credit',
          amount: o.total,
          description: `Order #${o.id.substring(0, 8)} payment`,
          date: o.created_at,
          status: o.payment_status === 'paid' ? 'completed' : 'pending',
        }));
      }
    }

    return res.json(txns);
  } catch (err) {
    console.error('Get wallet transactions error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
