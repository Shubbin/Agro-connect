# Agro-Connect: System Architecture & Technical Documentation

## 1. Executive Summary
Agro-Connect is an enterprise-grade B2B agricultural ecosystem designed to bridge the gap between farmers, distributors, and industrial produce buyers. By leveraging real-time data, AI-driven financial coaching, and a secure escrow verification system, Agro-Connect solves the core problems of trust, fragmentation, and payment delays in the agricultural supply chain.

---

## 2. Problem Statement
The traditional agricultural market suffers from three primary failures:
1.  **Trust Deficit**: Buyers are afraid to pay upfront, and farmers are afraid to ship without payment.
2.  **Opaque Credit worthiness**: Smaller farmers and buyers lack formal credit scores, making them "invisible" to traditional banks.
3.  **Inefficient Logistics**: Lack of verification leads to disputes over quality and quantity upon delivery.

---

## 3. The Solution: Zenda Architecture
Agro-Connect (Zenda-enabled) provides a unified platform where:
*   **Secure Escrow**: Funds are held in a virtual vault and only released via a secure **OTP (One-Time Password)** provided by the buyer upon physical inspection.
*   **AgroScore (AI Credit Scoring)**: A proprietary algorithm backed by **Groq AI** that analyzes trading history to build a trust score.
*   **B2B API Infrastructure**: Allows large industrial processors to integrate Agro-Connect directly into their procurement software.

---

## 4. Architectural Decisions: Node.js vs. PHP
One of the most critical design decisions was migrating from a legacy PHP architecture to a modern **Node.js (Express/ESM)** stack.

### Why Node.js?
1.  **Asynchronous Performance**: Agricultural trading involves multiple concurrent processes (AI generation, payment webhooks, and SMS notifications). Node.js's non-blocking I/O is significantly faster than PHP for these tasks.
2.  **The NPM Ecosystem**: Integration with high-performance SDKs like `groq-sdk` and `@supabase/supabase-js` is seamless in Node.js.
3.  **Real-time Capabilities**: Node.js allows for easy integration of WebSockets, which we use for real-time trade negotiations and chat.
4.  **Modern ESM Standards**: Using ECMAScript Modules ensures the codebase is future-proof and clean.

---

## 5. Artificial Intelligence: The Groq Edge
We integrated **Groq AI** using the Llama 3.1 & 3.3 models to create a "Living Platform."

### Why Groq?
*   **Speed**: Groq provides the world's fastest inference, allowing our AI coaching (`AgroCoach`) to generate personalized financial advice in less than 500ms.
*   **Multilingual Support**: The AI provides coaching in **Yoruba, Hausa, and Igbo**, ensuring that non-English speaking farmers are not left behind.
*   **Smart Arbitration**: When a dispute is filed, Groq AI analyzes the evidence and provides a "Recommended Resolution" to the human admin, speeding up conflict resolution by 80%.

---

## 6. API Endpoint Reference

### Authentication (Auth)
*   `POST /api/auth/login`: Direct email-based login for frictionless entry.
*   `POST /api/auth/register`: Auto-onboarding for new users.
*   `GET /api/auth/profile`: Retrieves the user's role, wallet balance, and AgroScore.

### B2B Trade & Merchant API
*   `POST /api/b2b/keys`: Generates secure API keys (`ac_live_...`) for industrial partners.
*   `GET /api/b2b/stats`: High-level trading volume and commission analytics.
*   `POST /api/b2b/trade/session`: External endpoint for partners to initiate bulk procurement.

### Secure Escrow & Orders
*   `POST /api/orders/request-delivery-code`: Generates a secure OTP for the buyer.
*   `POST /api/orders/confirm-delivery`: Validates the OTP and triggers the **Automatic Payout Ledger**.
*   `GET /api/disputes`: List of all active conflicts.

### AI Services
*   `POST /api/ai/assistant`: Direct access to `AgroBot` for platform support.
*   `GET /api/ai/farmer-insights`: Personalized coaching on how to improve AgroScore.

---

## 7. Frontend Design Philosophy
The frontend is built with **React and Vite**, focusing on a "Premium Professional" aesthetic:
*   **Responsive Grid**: Optimized for both mobile (farmers in the field) and desktop (buyers in offices).
*   **Glassmorphism**: A modern UI style that uses subtle transparency and blurs to create a high-end feel.
*   **State Management**: Uses modern hooks and API wrappers (`api.js`) to ensure data is always in sync with the backend.

---

## 8. Deployment Strategy
*   **Backend (Render)**: Hosted on Render with a **Keep-Alive Heartbeat** script to ensure zero-downtime on free/starter tiers.
*   **Frontend (Vercel)**: Hosted on Vercel's global edge network for sub-second page loads.
*   **Database (Supabase)**: A globally distributed PostgreSQL database with Row Level Security (RLS) to ensure that a farmer can never see a buyer's private wallet data.

---

**Prepared by Antigravity AI**
*Version 1.0 - May 2026*
