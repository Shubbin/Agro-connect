import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  offered_price: { type: Number },
  offer_status: { type: String, default: 'none' },
  created_at: { type: Date, default: Date.now }
});

const CartItem = mongoose.model('CartItem', cartItemSchema);
export default CartItem;
