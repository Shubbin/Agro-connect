import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';

// Routes
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import cartRoutes from './routes/cart.js';
import orderRoutes from './routes/orders.js';
import chatRoutes from './routes/chat.js';
import aiRoutes from './routes/ai.js';
import walletRoutes from './routes/wallet.js';
import statsRoutes from './routes/stats.js';
import profileRoutes from './routes/profile.js';
import paymentRoutes from './routes/payment.js';
import smsRoutes from './routes/sms.js';
import uploadRoutes from './routes/upload.js';
import farmerRoutes from './routes/farmer.js';
import b2bRoutes from './routes/b2b.js';
import disputeRoutes from './routes/disputes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Supabase
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ───────────────────────────────────────────────────────────────

app.use(
  cors({
    origin: ["https://agro-connect-two.vercel.app", "http://localhost:5173"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log('🚀 SERVER START: ENV HEALTH CHECK:', {
  PORT,
  HAS_SUPABASE_URL: !!process.env.SUPABASE_URL,
  HAS_SUPABASE_ANON: !!process.env.SUPABASE_ANON_KEY,
  HAS_SERVICE_ROLE: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  NODE_ENV: process.env.NODE_ENV || 'development'
});

// ── Static files ─────────────────────────────────────────────────────────────

// Serve the shared uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ── Routes ───────────────────────────────────────────────────────────────────

app.get('/', (_req, res) => {
  res.json({ message: 'Welcome to Agro Direct Connect API (Node.js/Supabase)' });
});

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'OK', uptime: process.uptime() });
});

// Use /api prefix to match frontend
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/checkout', orderRoutes);           // same controller as orders
app.use('/api/chat', chatRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/sms', smsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/farmer', farmerRoutes);
app.use('/api/b2b', b2bRoutes);
app.use('/api/disputes', disputeRoutes);

// ── 404 catch-all ────────────────────────────────────────────────────────────

app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ── Start ────────────────────────────────────────────────────────────────────
import fetch from 'node-fetch';

app.listen(PORT, () => {
  console.log(`🚀 Agro Direct Connect API (Supabase) running on http://localhost:${PORT}`);
  
  // Keep-alive logic for Render (Free Tier)
  const url = process.env.BACKEND_URL || `http://localhost:${PORT}`;
  setInterval(async () => {
    try {
      const response = await fetch(`${url}/health`);
      console.log(`[Keep-Alive] Pinged ${url}/health: Status ${response.status}`);
    } catch (err) {
      console.error('[Keep-Alive Error]:', err.message);
    }
  }, 600000); // 10 minutes
});
