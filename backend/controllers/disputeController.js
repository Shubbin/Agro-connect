import { supabase } from '../config/db.js';
import aiService from '../services/aiService.js';

/**
 * Dispute Controller
 * 
 * Logic for handling marketplace conflicts and admin resolutions.
 */

// 1. File a new dispute (Buyer)
export const createDispute = async (req, res) => {
  const { orderId, reason, description, evidenceUrls = [] } = req.body;
  const reporterId = req.user.id;

  try {
    const { data, error } = await supabase
      .from('disputes')
      .insert([{
        order_id: orderId,
        reporter_id: reporterId,
        reason,
        description,
        evidence_urls: evidenceUrls,
        status: 'open'
      }])
      .select()
      .single();

    if (error) throw error;

    // Update order status to flag a dispute
    await supabase.from('orders').update({ status: 'disputed' }).eq('id', orderId);

    res.status(201).json({ message: 'Dispute filed successfully. An admin will review it soon.', dispute: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Get all disputes (Admin)
export const getAllDisputes = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('disputes')
      .select('*, order:orders(*, user:users(*)), reporter:users(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. Resolve Dispute (Admin)
export const resolveDispute = async (req, res) => {
  const { disputeId, resolution, adminNotes } = req.body;

  try {
    // 1. Fetch dispute and order
    const { data: dispute, error: dError } = await supabase
      .from('disputes')
      .select('*, order:orders(*)')
      .eq('id', disputeId)
      .single();

    if (dError || !dispute) return res.status(404).json({ error: 'Dispute not found' });

    const orderId = dispute.order_id;

    // 2. Process financial resolution
    if (resolution === 'refunded') {
      await supabase.from('orders').update({ escrow_status: 'refunded', status: 'cancelled' }).eq('id', orderId);
      // Update payouts associated with this order to failed
      await supabase.from('payouts').update({ status: 'failed' }).eq('order_id', orderId);
    } else if (resolution === 'released') {
      await supabase.from('orders').update({ escrow_status: 'released', status: 'delivered' }).eq('id', orderId);
      // Fulfill / Process payout status
      await supabase.from('payouts').update({ status: 'processed', payout_date: new Date().toISOString() }).eq('order_id', orderId);
    }

    // 3. Update dispute status
    const { data: updatedDispute, error: uError } = await supabase
      .from('disputes')
      .update({
        status: 'resolved',
        resolution,
        admin_notes: adminNotes,
        updated_at: new Date().toISOString()
      })
      .eq('id', disputeId)
      .select()
      .single();

    if (uError) throw uError;

    res.json({ message: 'Dispute resolved successfully', dispute: updatedDispute });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4. Get User's own Disputes (Buyer or Seller)
export const getUserDisputes = async (req, res) => {
  try {
    const userId = req.user.id;
    // 1. Fetch disputes filed by this user
    const { data: filedDisputes, error: filedError } = await supabase
      .from('disputes')
      .select('*, order:orders(*)')
      .eq('reporter_id', userId);

    if (filedError) throw filedError;

    // 2. Fetch disputes filed against this vendor's orders
    const { data: orders } = await supabase
      .from('orders')
      .select('id')
      .eq('merchant_id', userId);

    let vendorDisputes = [];
    if (orders && orders.length > 0) {
      const orderIds = orders.map(o => o.id);
      const { data: againstDisputes, error: againstError } = await supabase
        .from('disputes')
        .select('*, order:orders(*)')
        .in('order_id', orderIds);

      if (!againstError && againstDisputes) {
        vendorDisputes = againstDisputes;
      }
    }

    // Merge distinct disputes
    const mergedMap = new Map();
    [...(filedDisputes || []), ...vendorDisputes].forEach(d => mergedMap.set(d.id, d));
    
    res.json(Array.from(mergedMap.values()));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 5. AI-Powered Dispute Analysis
export const analyzeDisputeAI = async (req, res) => {
  const { disputeId } = req.params;

  try {
    const { data: dispute, error } = await supabase
      .from('disputes')
      .select('*, order:orders(*)')
      .eq('id', disputeId)
      .single();

    if (error) throw error;

    const prompt = `
      You are an impartial dispute arbitrator for Agro-Connect.
      Dispute Details:
      - Reason: ${dispute.reason}
      - Description: ${dispute.description}
      - Order Amount: ${dispute.order.total}
      
      Tasks:
      1. Summarize the conflict.
      2. Based on typical agricultural trade rules (freshness, delivery proof), recommend a resolution.
      
      Return as JSON with 'summary' and 'recommended_resolution' (refunded, released, or partial).
    `;

    // Assuming aiService has a generic callGroq or handle method
    const aiAnalysis = await aiService.askAgroBot(prompt); // Simplified for now
    res.json({ analysis: aiAnalysis });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
