import { supabase } from '../config/db.js';

export const get = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { data: items, error } = await supabase
      .from('cart_items')
      .select('*, product:products(*)')
      .eq('user_id', userId);

    if (error) throw error;
    return res.json(items || []);
  } catch (err) {
    return res.status(500).json({ message: 'Cart fetch failed' });
  }
};

export const add = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { productId, quantity = 1 } = req.body;

    // Check existing
    const { data: existing } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single();

    if (existing) {
      const { data: updated, error } = await supabase
        .from('cart_items')
        .update({ quantity: existing.quantity + Number(quantity) })
        .eq('id', existing.id)
        .select('*, product:products(*)')
        .single();
      if (error) throw error;
      return res.json(updated);
    } else {
      const { data: newItem, error } = await supabase
        .from('cart_items')
        .insert([{ user_id: userId, product_id: productId, quantity: Number(quantity) }])
        .select('*, product:products(*)')
        .single();
      if (error) throw error;
      return res.json(newItem);
    }
  } catch (err) {
    return res.status(500).json({ message: 'Add to cart failed' });
  }
};

export const update = async (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.body;
  try {
    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', itemId)
      .select('*, product:products(*)')
      .single();
    if (error) throw error;
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: 'Update failed' });
  }
};

export const remove = async (req, res) => {
  const { itemId } = req.params;
  try {
    await supabase.from('cart_items').delete().eq('id', itemId);
    return res.json({ success: true, id: itemId });
  } catch (err) {
    return res.status(500).json({ message: 'Delete failed' });
  }
};

export const clear = async (req, res) => {
  try {
    await supabase.from('cart_items').delete().eq('user_id', req.user?.id);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ message: 'Clear failed' });
  }
};

export const makeOffer = async (req, res) => {
  const { itemId } = req.params;
  const { offeredPrice } = req.body;
  try {
    const { data, error } = await supabase
      .from('cart_items')
      .update({ offered_price: offeredPrice, offer_status: 'pending' })
      .eq('id', itemId)
      .select('*, product:products(*)')
      .single();
    if (error) throw error;
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: 'Offer failed' });
  }
};
