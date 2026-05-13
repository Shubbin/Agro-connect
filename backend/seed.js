import { supabase } from './config/db.js';
import bcrypt from 'bcryptjs';

const seed = async () => {
  console.log('🌱 Starting Supabase Seeding...');

  try {
    // 1. Clear existing data (optional, be careful)
    // await supabase.from('cart_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    // await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    const hashedPassword = bcrypt.hashSync('password123', 10);

    // 2. Seed Farmers
    const { data: farmers, error: farmerError } = await supabase
      .from('users')
      .insert([
        { name: 'Ibrahim Okafor', email: 'ibrahim@farm.ng', password: hashedPassword, role: 'farmer', is_verified: true, verification_status: 'verified' },
        { name: 'Amina Yusuf', email: 'amina@agrotech.ng', password: hashedPassword, role: 'farmer', is_verified: true, verification_status: 'verified' },
        { name: 'Chidi Benson', email: 'chidi@agri.ng', password: hashedPassword, role: 'farmer', is_verified: true, verification_status: 'verified' }
      ])
      .select();

    if (farmerError) throw farmerError;
    console.log(`✅ Seeded ${farmers.length} farmers`);

    // 3. Seed Products
    const productsToSeed = [
      {
        farmer_id: farmers[0].id,
        name: 'Organic Tomatoes',
        description: 'Freshly harvested vine-ripened organic tomatoes from our Oyo fields. No chemical pesticides used.',
        category: 'Produce',
        price: 1500,
        unit: 'Basket',
        available: 45,
        images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop'],
        location: 'Oyo'
      },
      {
        farmer_id: farmers[0].id,
        name: 'Habanero Peppers',
        description: 'Extremely spicy and aromatic peppers, perfect for traditional Nigerian stews.',
        category: 'Spices',
        price: 800,
        unit: 'kg',
        available: 120,
        images: ['https://images.unsplash.com/photo-1589146143003-8898126e0337?w=800&auto=format&fit=crop'],
        location: 'Oyo'
      },
      {
        farmer_id: farmers[1].id,
        name: 'Sweet Potatoes',
        description: 'High-quality sweet potatoes from the rich soils of Kaduna. Rich in vitamin A.',
        category: 'Tubers',
        price: 3500,
        unit: 'Bag (50kg)',
        available: 20,
        images: ['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop'],
        location: 'Kaduna'
      },
      {
        farmer_id: farmers[2].id,
        name: 'Fresh Palm Oil',
        description: 'Pure, unadulterated red palm oil processed traditionally in Enugu.',
        category: 'Oil',
        price: 12000,
        unit: '25L Gallon',
        available: 15,
        images: ['https://images.unsplash.com/photo-1621460245191-49e0881f621a?w=800&auto=format&fit=crop'],
        location: 'Enugu'
      }
    ];

    const { data: seededProducts, error: productError } = await supabase
      .from('products')
      .insert(productsToSeed)
      .select();

    if (productError) throw productError;
    console.log(`✅ Seeded ${seededProducts.length} products`);

    console.log('\n🚀 Database Seeding Completed Successfully!');
    console.log('-------------------------------------------');
    console.log('Login Details for testing:');
    console.log('Email: ibrahim@farm.ng');
    console.log('Password: password123');
    console.log('-------------------------------------------');

  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
  } finally {
    process.exit();
  }
};

seed();
