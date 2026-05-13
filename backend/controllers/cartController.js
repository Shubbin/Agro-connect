import { supabase } from '../config/db.js';

const getUserIdFromToken = async (req) => {
  const auth = req.headers.authorization ?? '';
  const match = auth.match(/^Bearer\s+(.+)$/);
  if (!match) return null;

  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id')
      .eq('auth_token', match[1])
      .single();
    
    return user ? user.id : null;
  } catch (err) {
    console.error('getUserIdFromToken error:', err);
    return null;
  }
};

export const get = async (req, res) => {
  try {
    const userId = await getUserIdFromToken(req);
    if (!userId) return res.status(401).json({ message: 'Authentication required' });

    const { data: items, error } = await supabase
      .from('cart_items')
      .select('*, product:products(*)')
      .eq('user_id', userId);

    if (error) throw error;

    return res.json(items);
  } catch (err) {
    console.error('Get cart error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const add = async (req, res) => {
  try {
    const userId = await getUserIdFromToken(req);
    const { productId, quantity = 1 } = req.body;

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    // Check if item already exists in cart
    const { data: existingItem, error: findError } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single();

    if (existingItem) {
      const { data: updated, error: updateError } = await supabase
        .from('cart_items')
        .update({ quantity: existingItem.quantity + Number(quantity) })
        .eq('id', existingItem.id)
        .select('*, product:products(*)')
        .single();
      
      if (updateError) throw updateError;
      return res.json(updated);
    } else {
      const { data: newItem, error: insertError } = await supabase
        .from('cart_items')
        .insert([{
          user_id: userId,
          product_id: productId,
          quantity: Number(quantity)
        }])
        .select('*, product:products(*)')
        .single();
      
      if (insertError) throw insertError;
      return res.json(newItem);
    }
  } catch (err) {
    console.error('Add to cart error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const update = async (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.body;

  try {
    const { data: updated, error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', itemId)
      .select('*, product:products(*)')
      .single();

    if (error) throw error;
    return res.json({ ...updated, success: true });
  } catch (err) {
    console.error('Update cart error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const remove = async (req, res) => {
  const { itemId } = req.params;
  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId);

    if (error) throw error;
    return res.json({ success: true, id: itemId });
  } catch (err) {
    console.error('Remove from cart error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const clear = async (req, res) => {
  try {
    const userId = await getUserIdFromToken(req);
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
    return res.json({ success: true });
  } catch (err) {
    console.error('Clear cart error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const makeOffer = async (req, res) => {
  const { itemId } = req.params;
  const { offeredPrice } = req.body;

  try {
    const { data: updated, error } = await supabase
      .from('cart_items')
      .update({ offered_price: offeredPrice, offer_status: 'pending' })
      .eq('id', itemId)
      .select('*, product:products(*)')
      .single();

    if (error) throw error;
    return res.json(updated);
  } catch (err) {
    console.error('Make offer error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
