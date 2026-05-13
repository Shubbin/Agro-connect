-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  auth_token TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  category TEXT DEFAULT 'produce',
  price DECIMAL NOT NULL,
  unit TEXT DEFAULT 'kg',
  available DECIMAL DEFAULT 0,
  images TEXT[] DEFAULT ARRAY['/placeholder.svg'],
  location TEXT DEFAULT 'Lagos',
  certifications TEXT[] DEFAULT ARRAY[]::TEXT[],
  rating DECIMAL DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cart Items Table
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  offered_price DECIMAL,
  offer_status TEXT DEFAULT 'none',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending',
  total DECIMAL NOT NULL,
  delivery_address TEXT DEFAULT '',
  tracking_number TEXT,
  estimated_delivery TEXT,
  actual_delivery_date TIMESTAMPTZ,
  payment_status TEXT DEFAULT 'pending',
  escrow_status TEXT DEFAULT 'held',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order Items Table (for detailed orders)
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  price DECIMAL NOT NULL
);

-- Messages Table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  media_url TEXT,
  media_type TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Wallet/Balance Table (Optional but good for tracking)
CREATE TABLE IF NOT EXISTS wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  balance DECIMAL DEFAULT 0,
  pending_balance DECIMAL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Merchant API Keys (For B2B Partners)
CREATE TABLE IF NOT EXISTS merchant_api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  api_key TEXT UNIQUE NOT NULL,
  name TEXT DEFAULT 'Default Key',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ
);

-- 10. AI Coaching Logs
CREATE TABLE IF NOT EXISTS ai_coaching_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  advice_type TEXT NOT NULL, -- 'agro_score', 'market_insights', 'verification'
  advice_content TEXT NOT NULL,
  agro_score_at_time INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Update Orders table for B2B and Commission logic
ALTER TABLE orders ADD COLUMN IF NOT EXISTS merchant_id UUID REFERENCES users(id);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS platform_commission DECIMAL DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS merchant_payout_amount DECIMAL DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS is_b2b BOOLEAN DEFAULT FALSE;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS installment_plan TEXT; -- e.g. '3 months weekly'
ALTER TABLE orders ADD COLUMN IF NOT EXISTS interest_rate DECIMAL DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS total_payable DECIMAL DEFAULT 0;

-- Additional User fields
ALTER TABLE users ADD COLUMN IF NOT EXISTS agro_score INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS trust_badges TEXT[] DEFAULT ARRAY[]::TEXT[];

-- OTP and Webhooks
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_otp TEXT;
ALTER TABLE merchant_api_keys ADD COLUMN IF NOT EXISTS webhook_url TEXT;

-- 11. Disputes Table
CREATE TABLE IF NOT EXISTS disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  reporter_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  reason TEXT NOT NULL,
  description TEXT,
  evidence_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'under_review', 'resolved', 'cancelled')),
  resolution TEXT, -- 'refunded', 'released', 'partial_refund'
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Policies for Disputes
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own disputes" ON disputes;
CREATE POLICY "Users can view their own disputes" ON disputes FOR SELECT USING (auth.uid() = reporter_id);
DROP POLICY IF EXISTS "Admins can view all disputes" ON disputes;
CREATE POLICY "Admins can view all disputes" ON disputes FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- 12. Payouts Ledger
CREATE TABLE IF NOT EXISTS payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  amount_gross DECIMAL NOT NULL,
  commission_deducted DECIMAL NOT NULL,
  amount_net DECIMAL NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'processed', 'failed'
  payout_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Policies for Payouts
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Merchants can view their own payouts" ON payouts;
CREATE POLICY "Merchants can view their own payouts" ON payouts FOR SELECT USING (auth.uid() = merchant_id);
DROP POLICY IF EXISTS "Admins can view all payouts" ON payouts;
CREATE POLICY "Admins can view all payouts" ON payouts FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);
