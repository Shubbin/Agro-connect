import Product from '../models/Product.js';

export const getAll = async (req, res) => {
  const { category = 'all', location = 'All Locations', search = '' } = req.query;

  try {
    let filter = {};

    if (category !== 'all') {
      filter.category = category;
    }

    if (location !== 'All Locations') {
      filter.location = location;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(filter).populate('farmer', 'name is_verified verification_status');

    const formatted = products.map(p => ({
      ...p.toObject(),
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
    const product = await Product.findById(id).populate('farmer', 'name is_verified verification_status');
    if (!product) return res.json(null);

    return res.json({
      ...product.toObject(),
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
    const products = await Product.find({ farmer: farmerId }).populate('farmer', 'name is_verified verification_status');
    
    const formatted = products.map(p => ({
      ...p.toObject(),
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
  const { farmerId, name, price, ...other } = req.body;

  if (!farmerId) return res.status(401).json({ message: 'Unauthorized: Farmer ID required' });
  if (!name || !price) return res.status(400).json({ message: 'Name and price are required' });

  try {
    const product = new Product({
      farmer: farmerId,
      name,
      price,
      ...other
    });

    await product.save();
    const populated = await Product.findById(product._id).populate('farmer', 'name is_verified verification_status');

    return res.json({
      ...populated.toObject(),
      farmerName: populated.farmer?.name,
      farmerVerified: populated.farmer?.is_verified,
      farmerStatus: populated.farmer?.verification_status
    });
  } catch (err) {
    console.error('Create product error:', err);
    return res.status(500).json({ message: 'Error creating product' });
  }
};

export const update = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndUpdate(id, req.body, { new: true }).populate('farmer', 'name is_verified verification_status');
    if (!product) return res.status(404).json({ message: 'Product not found' });

    return res.json({
      ...product.toObject(),
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
    await Product.findByIdAndDelete(id);
    return res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error('Remove product error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
