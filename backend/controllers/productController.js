import { supabase } from '../config/db.js';

export const getAll = async (req, res) => {
  const { category = 'all', location = 'All Locations', search = '' } = req.query;

  try {
    let query = supabase
      .from('products')
      .select('*, farmer:users(name, is_verified, verification_status)');

    if (category !== 'all') query = query.eq('category', category);
    if (location !== 'All Locations') query = query.eq('location', location);
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data: products, error } = await query;
    if (error) throw error;

    const formatted = products.map(p => ({
      ...p,
      farmerName: p.farmer?.name,
      farmerVerified: p.farmer?.is_verified,
      farmerStatus: p.farmer?.verification_status
    }));

    return res.json(formatted);
  } catch (err) {
    return res.status(500).json({ message: 'Fetch products failed' });
  }
};

export const getById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, farmer:users(name, is_verified, verification_status)')
      .eq('id', req.params.id)
      .single();
    if (error) return res.json(null);
    return res.json({
      ...data,
      farmerName: data.farmer?.name,
      farmerVerified: data.farmer?.is_verified
    });
  } catch (err) {
    return res.status(500).json({ message: 'Fetch product failed' });
  }
};

export const create = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([req.body])
      .select()
      .single();
    if (error) throw error;
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: 'Create failed' });
  }
};

export const update = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();
    if (error) throw error;
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: 'Update failed' });
  }
};

export const remove = async (req, res) => {
  try {
    await supabase.from('products').delete().eq('id', req.params.id);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ message: 'Delete failed' });
  }
};
