import mongoose from 'mongoose';
import 'dotenv/config';

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Don't exit process in development, but log it clearly
  }
};

export default connectDB;
export const supabase = null; // Provide a null export to avoid breaking imports during transition
