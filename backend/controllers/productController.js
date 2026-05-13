import { supabase } from '../config/db.js';

export const getAll = async (req, res) => {
  const { category = 'all', location = 'All Locations', search = '' } = req.query;

  try {
    let query = supabase
      .from('products')
      .select('*, farmer:users(name, is_verified, verification_status)');

    if (category !== 'all') {
      query = query.eq('category', category);
    }

    if (location !== 'All Locations') {
      query = query.eq('location', location);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,category.ilike.%${search}%`);
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
    console.error('GetAll products error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getById = async (req, res) => {
  const { id } = req.params;

  try {
    const { data: product, error } = await supabase
      .from('products')
      .select('*, farmer:users(name, is_verified, verification_status)')
      .eq('id', id)
      .single();
    
    if (error || !product) return res.json(null);

    return res.json({
      ...product,
      farmerName: product.farmer?.name,
      farmerVerified: product.farmer?.is_verified,
      farmerStatus: product.farmer?.verification_status
    });
  } catch (err) {
    console.error('GetById product error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getByFarmer = async (req, res) => {
  const farmerId = req.params.farmerId ?? req.query.farmerId;

  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*, farmer:users(name, is_verified, verification_status)')
      .eq('farmer_id', farmerId);

    if (error) throw error;

    const formatted = products.map(p => ({
      ...p,
      farmerName: p.farmer?.name,
      farmerVerified: p.farmer?.is_verified,
      farmerStatus: p.farmer?.verification_status
    }));

    return res.json(formatted);
  } catch (err) {
    console.error('GetByFarmer products error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const create = async (req, res) => {
  const {
    farmerId,
    name,
    description = '',
    category = 'produce',
    price = 0,
    unit = 'kg',
    available = 0,
    images = ['/placeholder.svg'],
    certifications = [],
    location = 'Lagos',
  } = req.body;

  if (!farmerId) return res.status(401).json({ message: 'Unauthorized: Farmer ID required' });
  if (!name || !price) return res.status(400).json({ message: 'Name and price are required' });

  try {
    const { data: product, error } = await supabase
      .from('products')
      .insert([
        {
          farmer_id: farmerId,
          name,
          description,
          category,
          price,
          unit,
          available,
          images,
          location,
          certifications
        }
      ])
      .select('*, farmer:users(name, is_verified, verification_status)')
      .single();

    if (error) throw error;

    return res.json({
      ...product,
      farmerName: product.farmer?.name,
      farmerVerified: product.farmer?.is_verified,
      farmerStatus: product.farmer?.verification_status
    });
  } catch (err) {
    console.error('Create product error:', err);
    return res.status(500).json({ message: 'Error creating product: ' + err.message });
  }
};

export const update = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const { data: product, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select('*, farmer:users(name, is_verified, verification_status)')
      .single();

    if (error) return res.status(404).json({ message: 'Product not found' });

    return res.json({
      ...product,
      farmerName: product.farmer?.name,
      farmerVerified: product.farmer?.is_verified,
      farmerStatus: product.farmer?.verification_status
    });
  } catch (err) {
    console.error('Update product error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const remove = async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) return res.status(404).json({ message: 'Product not found' });
    return res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error('Remove product error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
