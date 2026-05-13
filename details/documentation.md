# AgroConnect System Documentation
## Version 1.0 — "Seed to Scale" Migration

### 1. Project Overview
**AgroConnect** is a next-generation B2B and B2C agricultural marketplace designed to bridge the gap between rural farmers and urban markets. By leveraging real-time data, AI-driven insights, and secure financial settlements, AgroConnect solves the traditional problems of price opacity, supply chain fragmentation, and payment insecurity in the agricultural sector.

### 2. The Problem We Are Solving
The traditional agricultural market in Nigeria (and similar emerging markets) suffers from:
- **Middlemen Exploitation**: Farmers lose up to 60% of value to intermediaries.
- **Payment Risk**: High default rates and lack of escrow services.
- **Logistics Fragmentation**: No real-time tracking for perishable goods.
- **Credit Inaccessibility**: Farmers lack the data (AgroScore) to access formal financing.

**AgroConnect** solves this by providing a unified platform for direct trade, secure escrow payments, and AI-backed credit scoring.

---

### 3. Architecture: Why Node.js over PHP?
During the migration from the legacy PHP implementation to the modern **Node.js/Express** stack, several strategic decisions were made:

- **Performance & Scalability**: Node.js's non-blocking I/O is significantly faster for handling concurrent connections, which is critical for a high-traffic marketplace.
- **Unified Language (JavaScript/TypeScript)**: Using JS on both the frontend (React) and backend (Node) allows for faster development, shared types, and a more cohesive engineering culture.
- **Real-time Capabilities**: Node.js makes implementing WebSockets (for live chat and order tracking) much more efficient than traditional PHP setups.
- **Ecosystem**: The npm ecosystem provides more robust libraries for AI integration (Groq), cloud services (Supabase), and modern security.

---

### 4. Technical Stack
- **Frontend**: React.js with Vite, TailwindCSS for premium aesthetics, and Lucide for iconography.
- **Backend**: Node.js with Express.js.
- **Database**: Supabase (PostgreSQL) with Row Level Security (RLS) and Realtime subscriptions.
- **AI Engine**: Groq AI (Llama 3 70B) for ultra-fast natural language processing.
- **Storage**: Supabase Storage for produce images and KYC documents.

---

### 5. Backend & API Details
The backend is organized into a modular controller-service architecture.

#### Core Endpoints
| Endpoint | Method | Purpose |
| :--- | :--- | :--- |
| `/api/auth/register` | POST | Secure user registration with role-based assignment. |
| `/api/products/all` | GET | Paginated product list with advanced category/price filtering. |
| `/api/orders/create` | POST | Initializes a new order, calculates platform commission. |
| `/api/orders/confirm-delivery` | POST | Verifies OTP and triggers the financial payout service. |
| `/api/ai/assistant` | POST | Direct interface with Groq for market advice and pricing insights. |
| `/api/wallet/balance` | GET | Real-time balance check for farmers (Settled vs. Pending). |

#### The Settlement Service
A critical backend component that handles the transition of funds from **Escrow** to **Farmer Wallets**. 
1. **Order Delivered**: User provides OTP.
2. **Verification**: Backend checks OTP against Supabase record.
3. **Payout**: Commission (3-5%) is deducted, and the net amount is moved to `settled_payout_balance`.

---

### 6. The AI Aspect: Why Groq AI?
We integrated **Groq AI** because it is currently the fastest inference engine on the market. In an agricultural context, farmers need instant answers without the latency of typical LLMs.

**Key AI Features:**
- **AgroScore Analysis**: Analyzes user transaction history to generate a creditworthiness score.
- **Pricing Insights**: Scrapes current market trends to suggest the best selling price for produce.
- **Onboarding Tips**: Context-aware guidance for new farmers to help them set up their digital storefront.

---

### 7. Frontend Design Philosophy
The UI was built with a **"Premium-Professional"** aesthetic.
- **Micro-Animations**: Uses Framer Motion for smooth state transitions.
- **Transparency**: Clear status badges for orders (Pending, Shipped, Delivered).
- **Mobile First**: Optimized for rural network conditions while maintaining a high-end feel.

---

### 8. Conclusion
AgroConnect is more than a marketplace; it is a financial and operational OS for the agricultural sector. The move to Node.js and Supabase ensures that the platform is ready to scale from hundreds to millions of users with enterprise-grade security and AI intelligence.
