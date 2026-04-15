import mongoose from 'mongoose';
import User from './models/User.js';
import Product from './models/Product.js';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/agrconnect';

const seed = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});

    // Create a farmer
    const farmerPassword = bcrypt.hashSync('password123', 10);
    const farmer = await User.create({
      name: 'Organic Farmer John',
      email: 'farmer@example.com',
      password: farmerPassword,
      role: 'farmer',
      phone: '08012345678',
      is_verified: true,
      verification_status: 'verified'
    });

    // Create a buyer
    const buyerPassword = bcrypt.hashSync('password123', 10);
    await User.create({
      name: 'Smart Buyer Jane',
      email: 'buyer@example.com',
      password: buyerPassword,
      role: 'user',
      phone: '08087654321',
      is_verified: true,
      verification_status: 'verified'
    });

    // Create products
    const products = [
      {
        name: 'Premium Cocoa Beans',
        description: 'Grade-A organic cocoa beans from Edo State. High yield and rich flavor.',
        price: 45000,
        available: 150,
        unit: 'Bag (50kg)',
        category: 'Cash Crops',
        location: 'Edo State',
        farmer: farmer._id,
        images: ['https://images.unsplash.com/photo-1541414779316-956a5084c0d4?auto=format&fit=crop&q=80&w=800'],
        certifications: ['Organic', 'Export Ready']
      },
      {
        name: 'Fresh Cassava Roots',
        description: 'Freshly harvested cassava roots. Perfect for processing into garri or flour.',
        price: 12000,
        available: 500,
        unit: 'Ton',
        category: 'Tubers',
        location: 'Ogun State',
        farmer: farmer._id,
        images: ['https://images.unsplash.com/photo-1627914460578-8fc5f6e80b43?auto=format&fit=crop&q=80&w=800'],
        certifications: ['GMO Free']
      },
      {
        name: 'Large Yellow Onions',
        description: 'High quality large yellow onions from the North. Long shelf life.',
        price: 25000,
        available: 200,
        unit: 'Jumbo Bag',
        category: 'Vegetables',
        location: 'Kano State',
        farmer: farmer._id,
        images: ['https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&q=80&w=800'],
        certifications: ['Freshly Harvested']
      }
    ];

    await Product.insertMany(products);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seed();
