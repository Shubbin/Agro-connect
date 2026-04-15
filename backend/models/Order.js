import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  status: { type: String, default: 'pending' },
  total: { type: Number, required: true },
  delivery_address: { type: String, default: '' },
  tracking_number: { type: String },
  estimated_delivery: { type: String },
  actual_delivery_date: { type: Date },
  payment_status: { type: String, default: 'pending' },
  escrow_status: { type: String, default: 'held' },
  created_at: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
