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

    // Sanitize product data for database insertion (only valid table columns)
    const productData = {
      farmer_id: userId,
      name: req.body.name,
      description: req.body.description || '',
      category: req.body.category || 'produce',
      price: parseFloat(req.body.price) || 0,
      unit: req.body.unit || 'kg',
      available: parseInt(req.body.available) || 0,
      images: Array.isArray(req.body.images) ? req.body.images : [],
      location: req.body.location || 'Lagos Regional Hub'
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

    // Sanitize update data (only valid table columns)
    const updateData = {};
    if (req.body.name !== undefined) updateData.name = req.body.name;
    if (req.body.description !== undefined) updateData.description = req.body.description;
    if (req.body.category !== undefined) updateData.category = req.body.category;
    if (req.body.price !== undefined) updateData.price = parseFloat(req.body.price);
    if (req.body.unit !== undefined) updateData.unit = req.body.unit;
    if (req.body.available !== undefined) updateData.available = parseInt(req.body.available);
    if (req.body.images !== undefined) updateData.images = Array.isArray(req.body.images) ? req.body.images : [];
    if (req.body.location !== undefined) updateData.location = req.body.location;

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
