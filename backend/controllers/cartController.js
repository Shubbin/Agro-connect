import CartItem from '../models/CartItem.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

const getUserIdFromToken = async (req) => {
  const auth = req.headers.authorization ?? '';
  const match = auth.match(/^Bearer\s+(.+)$/);
  if (!match) return null;

  try {
    const user = await User.findOne({ auth_token: match[1] });
    return user ? user._id : null;
  } catch (err) {
    console.error('getUserIdFromToken error:', err);
    return null;
  }
};

export const get = async (req, res) => {
  try {
    const userId = (await getUserIdFromToken(req)) ?? (req.query.userId || '65f1a2b3c4d5e6f7a8b9c0d1'); // Fallback for testing

    const items = await CartItem.find({ user: userId }).populate('product');

    const formatted = items.map((item) => {
      const doc = item.toObject();
      return {
        ...doc,
        id: doc._id,
        productId: doc.product?._id,
        name: doc.product?.name,
        price: doc.product?.price,
        images: doc.product?.images,
        product: doc.product ? {
          ...doc.product,
          id: doc.product._id
        } : null
      };
    });

    return res.json(formatted);
  } catch (err) {
    console.error('Get cart error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const add = async (req, res) => {
  try {
    const userId = (await getUserIdFromToken(req)) ?? req.query.userId;
    const { productId, quantity = 1 } = req.body;

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    // Check if item already exists in cart
    let item = await CartItem.findOne({ user: userId, product: productId });

    if (item) {
      item.quantity += Number(quantity);
      await item.save();
    } else {
      item = await CartItem.create({
        user: userId,
        product: productId,
        quantity: Number(quantity)
      });
    }

    const populated = await item.populate('product');
    const doc = populated.toObject();

    return res.json({
      ...doc,
      id: doc._id,
      product: doc.product ? { ...doc.product, id: doc.product._id } : null
    });
  } catch (err) {
    console.error('Add to cart error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const update = async (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.body;

  try {
    const item = await CartItem.findByIdAndUpdate(itemId, { quantity }, { new: true }).populate('product');
    if (!item) return res.status(404).json({ message: 'Item not found' });

    const doc = item.toObject();
    return res.json({
      ...doc,
      id: doc._id,
      success: true
    });
  } catch (err) {
    console.error('Update cart error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const remove = async (req, res) => {
  const { itemId } = req.params;
  try {
    const item = await CartItem.findByIdAndDelete(itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    return res.json({ success: true, id: itemId });
  } catch (err) {
    console.error('Remove from cart error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const clear = async (req, res) => {
  try {
    const userId = (await getUserIdFromToken(req)) ?? req.query.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    await CartItem.deleteMany({ user: userId });
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
    const item = await CartItem.findByIdAndUpdate(
      itemId,
      { offered_price: offeredPrice, offer_status: 'pending' },
      { new: true }
    ).populate('product');

    if (!item) return res.status(404).json({ message: 'Item not found' });

    const doc = item.toObject();
    return res.json({
      ...doc,
      id: doc._id,
      product: doc.product ? { ...doc.product, id: doc.product._id } : null
    });
  } catch (err) {
    console.error('Make offer error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};


