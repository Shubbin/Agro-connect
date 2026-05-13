import { supabase } from '../config/db.js';

export const getBalance = async (_req, res) => {
  try {
    // 1. Available Balance (paid and released)
    const { data: availableData, error: availableError } = await supabase
      .from('orders')
      .select('total')
      .eq('payment_status', 'paid')
      .eq('escrow_status', 'released');

    if (availableError) throw availableError;
    const available = availableData.reduce((sum, o) => sum + Number(o.total), 0);
    
    // 2. Pending Balance (paid and held)
    const { data: pendingData, error: pendingError } = await supabase
      .from('orders')
      .select('total')
      .eq('payment_status', 'paid')
      .eq('escrow_status', 'held');

    if (pendingError) throw pendingError;
    const pending = pendingData.reduce((sum, o) => sum + Number(o.total), 0);

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

export const getTransactions = async (_req, res) => {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const txns = orders.map((o) => ({
      id: `txn_${o.id}`,
      type: 'credit',
      amount: o.total,
      description: `Order #${o.id} payment`,
      date: o.created_at,
      status: o.payment_status === 'paid' ? 'completed' : 'pending',
    }));

    return res.json(txns);
  } catch (err) {
    console.error('Get wallet transactions error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
