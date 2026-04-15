import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  category: { type: String, default: 'produce' },
  price: { type: Number, required: true },
  unit: { type: String, default: 'kg' },
  available: { type: Number, default: 0 },
  images: { type: [String], default: ['/placeholder.svg'] },
  location: { type: String, default: 'Lagos' },
  certifications: { type: [String], default: [] },
  rating: { type: Number, default: 0 },
  review_count: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
});

const Product = mongoose.model('Product', productSchema);
export default Product;
