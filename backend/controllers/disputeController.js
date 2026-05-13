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
      // Return funds to buyer's wallet (Logic would normally involve payment provider)
      await supabase.from('orders').update({ escrow_status: 'refunded', status: 'cancelled' }).eq('id', orderId);
    } else if (resolution === 'released') {
      // Release funds to seller
      await supabase.from('orders').update({ escrow_status: 'released', status: 'delivered' }).eq('id', orderId);
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

// 4. AI-Powered Dispute Analysis
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
