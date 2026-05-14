import CartItem from '../models/CartItem.js';

export const get = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: 'Authentication required' });

    const items = await CartItem.find({ user: userId }).populate('product');
    return res.json(items);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const add = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { productId, quantity = 1 } = req.body;

    let item = await CartItem.findOne({ user: userId, product: productId });

    if (item) {
      item.quantity += Number(quantity);
    } else {
      item = new CartItem({
        user: userId,
        product: productId,
        quantity: Number(quantity)
      });
    }

    await item.save();
    const populated = await item.populate('product');
    return res.json(populated);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const update = async (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.body;
  try {
    const updated = await CartItem.findByIdAndUpdate(
      itemId,
      { quantity },
      { new: true }
    ).populate('product');
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const remove = async (req, res) => {
  const { itemId } = req.params;
  try {
    await CartItem.findByIdAndDelete(itemId);
    return res.json({ success: true, id: itemId });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const clear = async (req, res) => {
  try {
    await CartItem.deleteMany({ user: req.user?._id });
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const makeOffer = async (req, res) => {
  const { itemId } = req.params;
  const { offeredPrice } = req.body;
  try {
    const updated = await CartItem.findByIdAndUpdate(
      itemId,
      { offeredPrice, offerStatus: 'pending' },
      { new: true }
    ).populate('product');
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};
