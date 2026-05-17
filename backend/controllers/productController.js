import { supabase } from '../config/db.js';

export const getAll = async (req, res) => {
  const { category = 'all', location = 'All Locations', search = '' } = req.query;

  try {
    let query = supabase
      .from('products')
      .select('*, farmer:users!farmer_id(name, is_verified, verification_status)');

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
      .select('*, farmer:users!farmer_id(name, is_verified, verification_status)')
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
    const userId = req.user?.id;
    // Verify user role is farmer
    const { data: dbUser } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();

    const role = dbUser?.role || req.user?.user_metadata?.role;
    if (role !== 'farmer') {
      return res.status(403).json({ message: 'Only farmers can create listings' });
    }

    // Force farmer_id to be current user's ID
    const productData = {
      ...req.body,
      farmer_id: userId
    };

    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select()
      .single();
    if (error) throw error;
    return res.json(data);
  } catch (err) {
    console.error('Create product error:', err);
    return res.status(500).json({ message: 'Create failed' });
  }
};

export const update = async (req, res) => {
  try {
    const userId = req.user?.id;
    
    // Check if product belongs to the requester
    const { data: product, error: findError } = await supabase
      .from('products')
      .select('farmer_id')
      .eq('id', req.params.id)
      .single();

    if (findError || !product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.farmer_id !== userId) {
      return res.status(403).json({ message: 'Unauthorized: This product does not belong to you' });
    }

    // Clean body to prevent changing farmer_id
    const updateData = { ...req.body };
    delete updateData.farmer_id;

    const { data, error } = await supabase
      .from('products')
      .update(updateData)
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
    const userId = req.user?.id;
    
    // Check if product belongs to the requester
    const { data: product, error: findError } = await supabase
      .from('products')
      .select('farmer_id')
      .eq('id', req.params.id)
      .single();

    if (findError || !product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.farmer_id !== userId) {
      return res.status(403).json({ message: 'Unauthorized: This product does not belong to you' });
    }

    await supabase.from('products').delete().eq('id', req.params.id);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ message: 'Delete failed' });
  }
};


export const getByFarmer = async (req, res) => {
  const { farmerId } = req.query;
  if (!farmerId) return res.status(400).json({ message: 'Farmer ID required' });
  
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('farmer_id', farmerId);
    
    if (error) throw error;
    return res.json(data);
  } catch (err) {
    console.error('GetByFarmer error:', err);
    return res.status(500).json({ message: 'Fetch farmer products failed' });
  }
};
