import mongoose from 'mongoose';
import Product from '../models/Product.js';

export const getAll = async (req, res) => {
  const { category = 'all', location = 'All Locations', search = '' } = req.query;

  try {
    const filter = {};

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

    const formatted = products.map(p => {
      const doc = p.toObject();
      return {
        ...doc,
        id: doc._id,
        farmerName: doc.farmer?.name,
        farmerVerified: doc.farmer?.is_verified,
        farmerStatus: doc.farmer?.verification_status
      };
    });

    return res.json(formatted);
  } catch (err) {
    console.error('GetAll products error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid product ID format' });
  }

  try {
    const product = await Product.findById(id).populate('farmer', 'name is_verified verification_status');
    
    if (!product) return res.json(null);

    const doc = product.toObject();
    return res.json({
      ...doc,
      id: doc._id,
      farmerName: doc.farmer?.name,
      farmerVerified: doc.farmer?.is_verified,
      farmerStatus: doc.farmer?.verification_status
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

    const formatted = products.map(p => {
      const doc = p.toObject();
      return {
        ...doc,
        id: doc._id,
        farmerName: doc.farmer?.name,
        farmerVerified: doc.farmer?.is_verified,
        farmerStatus: doc.farmer?.verification_status
      };
    });

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
    const product = await Product.create({
      farmer: farmerId,
      name,
      description,
      category,
      price,
      unit,
      available,
      images,
      location,
      certifications
    });

    const populated = await product.populate('farmer', 'name is_verified verification_status');
    const doc = populated.toObject();

    return res.json({
      ...doc,
      id: doc._id,
      farmerName: doc.farmer?.name,
      farmerVerified: doc.farmer?.is_verified,
      farmerStatus: doc.farmer?.verification_status
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
    const product = await Product.findByIdAndUpdate(id, updates, { new: true }).populate('farmer', 'name is_verified verification_status');
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const doc = product.toObject();
    return res.json({
      ...doc,
      id: doc._id,
      farmerName: doc.farmer?.name,
      farmerVerified: doc.farmer?.is_verified,
      farmerStatus: doc.farmer?.verification_status
    });
  } catch (err) {
    console.error('Update product error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const remove = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    return res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error('Remove product error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};


