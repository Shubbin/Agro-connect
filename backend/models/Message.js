import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  media_url: { type: String },
  media_type: { type: String },
  is_read: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);
export default Message;
