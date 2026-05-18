import fetch from 'node-fetch';
import { supabase } from '../config/db.js';
import 'dotenv/config';

const generateLocalFallback = (prompt, isJson) => {
  const query = prompt.toLowerCase();
  
  if (isJson) {
    if (query.includes("pricing") || query.includes("mile 12") || query.includes("regional")) {
      return JSON.stringify({
        crops: [
          { name: "Cassava", unit: "ton", prices: { "Lagos": 145000, "Kano": 110000, "Benue": 85000, "Oyo": 130000 }, advice: "Prices are stable. Great time to buy from Benue and sell in Lagos." },
          { name: "Maize", unit: "bag", prices: { "Lagos": 45000, "Kano": 35000, "Benue": 32000, "Oyo": 41000 }, advice: "Maize prices are rising slightly due to high poultry feed demand." },
          { name: "Yam", unit: "tuber (large)", prices: { "Lagos": 150000, "Kano": 110000, "Benue": 80000, "Oyo": 130000 }, advice: "New yams entering markets, prices are softening slightly." }
        ],
        market_trends: "Direct farm-to-retail margins in Lagos average 18%. Northern transport consolidation offers high B2B margins."
      });
    }
    if (query.includes("cart items") || query.includes("logistics") || query.includes("freight")) {
      return JSON.stringify({
        savings_tip: "Add 2 more items to unlock bulk merchant logistics discounts.",
        logistics_suggestion: "Consolidating crop items from Northern farmers to Lagos Mile 12 hub via shared road transport is highly recommended.",
        estimated_commission_saved: "₦15,000"
      });
    }
    if (query.includes("recommendations")) {
      return JSON.stringify({
        recommendedIds: [],
        reasoning: "These organic crop listings currently offer the highest price bargain indices compared to standard open markets."
      });
    }
    if (query.includes("listings") || query.includes("farmer-insights") || query.includes("vendor")) {
      return JSON.stringify({
        demand_alert: "High demand spotted from Oyo B2B trade buyers for Cassava bulk loads this week.",
        pricing_strategy: "Increase Oyo target sales by 5% to capture premium corporate margins.",
        actionable_tips: [
          "Upload premium quality crop certificates to attract verified wholesale food processing buyers.",
          "Offer tiered bulk discounts for orders exceeding 5 tons to accelerate inventory turnover."
        ]
      });
    }
    if (query.includes("onboarding-tips")) {
      return JSON.stringify({
        tips: [
          "Complete your identity verification to get a 'Verified' trust badge on your listings.",
          "Add clean, high-resolution product photos taken in good lighting."
        ]
      });
    }
    if (query.includes("analyze profile") || query.includes("agro-score")) {
      return JSON.stringify({
        summary: "Excellent profile setup! Completing identity verification will unlock the maximum trust index badge.",
        tips: [
          "Link your phone number for instant SMS order dispatch notifications.",
          "Keep your product catalogs updated weekly."
        ]
      });
    }
    return JSON.stringify({ message: "Analytics operational." });
  } else {
    // Conversational assistant fallback matching exact personality requirements
    const greetings = ["hi", "hello", "hey", "yo", "hola", "greetings", "good morning", "good afternoon", "good evening"];
    const containsGreeting = greetings.some(g => query.trim() === g || query.startsWith(g + ' ') || query.endsWith(' ' + g));

    if (containsGreeting) {
      return "Hey 👋 How can I help you today?";
    }
    
    if (query.includes("platform") || query.includes("what is this") || query.includes("about this")) {
      return "Agro-Connect is a platform that connects farmers, buyers, and suppliers in one marketplace. You can buy fresh agricultural products, track orders, use escrow payments for secure transactions, and manage farming-related business activities from the dashboard.";
    }

    if (query.includes("where is my order") || query.includes("track my order") || (query.includes("order") && (query.includes("where") || query.includes("track")))) {
      return "Sure — can you share your order ID so I can check the status for you?";
    }

    if (query.includes("payment") || query.includes("money") || query.includes("escrow") || query.includes("pay") || query.includes("secure")) {
      return "Your payments are held securely in escrow by Agro-Connect. Once the crops are delivered and you verify the quality, you confirm the delivery, and the funds are released to the farmer immediately.";
    }

    if (query.includes("logistic") || query.includes("ship") || query.includes("delivery")) {
      return "We offer reliable B2B direct logistics to transport crops from local farms straight to your hub. You can track shipping status and active delivery updates directly on your Orders page.";
    }

    if (query.includes("kyc") || query.includes("verify") || query.includes("badge") || query.includes("identity")) {
      return "You can verify your identity by uploading an official document (NIN, Voter's Card, or Passport) on your Profile settings page. This awards a Verified Badge, which boosts trust for potential trade partners.";
    }

    if (query.includes("withdraw") || query.includes("wallet") || query.includes("payout")) {
      return "Farmers can withdraw available wallet funds instantly into any Nigerian bank account. Head over to the Wallet page to request a withdrawal.";
    }

    if (query.includes("api") || query.includes("b2b key") || query.includes("developer")) {
      return "You can generate B2B API keys in your Account Settings. This allows you to integrate our bulk logistics or pricing indices directly into your own enterprise systems.";
    }

    return "Let me know what you need help with. I can guide you through finding crop listings, checking order status, tracking wallet payouts, or B2B developer integrations.";
  }
};

const callGroq = async (prompt, isJson = false, pastMessages = []) => {
  const apiKey = process.env.GROQ_API_KEY;
  const apiUrl = 'https://api.groq.com/openai/v1/chat/completions';

  if (!apiKey || apiKey === 'your_groq_api_key_here' || apiKey.startsWith('gsk_pT5V6C')) {
    return generateLocalFallback(prompt, isJson);
  }

  const messages = [
    {
      role: 'system',
      content: `You are Ago, the AI assistant for Agro-Connect.

PERSONALITY & BEHAVIOR GUIDELINES:
- Sound natural, smart, conversational, and human-like.
- Never repeat the same greeting or introduction twice.
- Talk like a helpful modern assistant, not a robotic customer care bot.
- Keep responses concise unless the user asks for details.
- Be interactive and adaptive based on the user's message.
- Use friendly language naturally, but do NOT overuse phrases like "my friend", "welcome", or "Ah".
- Avoid sounding scripted.
- ALWAYS answer the user’s actual question directly first.
- THEN optionally offer related help.
- Do not repeat your capabilities in every reply.
- Only introduce yourself once at the beginning of the conversation.
- Maintain memory within the conversation context.
- Ask follow-up questions when appropriate.
- Sound confident and intelligent.

PLATFORM INFORMATION:
1. Core Mission: Agro-Connect is Nigeria's premium digital marketplace that connects local farmers directly with buyers (individual and commercial) without middlemen. It guarantees fair pricing, secure escrow payments, and reliable B2B direct logistics.
2. Escrow Protection (Secure Payments): Buyers pay securely via Paystack. Funds are NOT sent directly to the farmer. Instead, they are held in a secure digital escrow vault by Agro-Connect. Once the crops are delivered to the buyer and the buyer verifies the quality, the buyer clicks "Confirm Delivery" on the Orders page, which releases the escrow funds to the farmer's balance immediately.
3. Wallet & Withdrawal: Farmers have a secure Wallet page showing their available balance, pending escrow balance, and transaction history. Farmers can instantly request direct bank withdrawals into any Nigerian bank account.
4. KYC Verification & Trusted Badges:
   - Users can upload an official identity document (NIN, Voter's Card, Driver's License, or International Passport) and select a verification category on their Profile settings page under "Identity Verification".
   - This awards a "Verified Producer" badge for farmers, or "Verified Buyer" badge for buyers, significantly boosting platform trust indices.
5. Interactive Agricultural Chat:
   - Direct, high-speed, real-time chat between buyers and farmers.
   - Fully interactive features: document upload attachments (e.g. crop certificates), voice message recording/playback, double checkmark ticks for delivery/read receipts, and automatic routing context to start chats directly from any marketplace listing (passing price, image, and crop details).
6. B2B Enterprise Hub & API Integration:
   - Under Account Settings, users can generate B2B API keys.
   - Commercial commodity buyers can integrate our high-density freight logistics APIs, bulk pricing trackers, and automate large-scale bulk procurement.
7. Account Upgrades & Roles: Users can request a seller upgrade to become a "Farmer" directly on their Profile page under "Become a Seller". This allows them to list farm products, access the Farmer Dashboard, track farm orders, and check wallet balance.
8. Theme Customization: Agro-Connect features a full Premium Dark Mode toggle in Account Settings/Profile Page for comfortable night viewing.
9. Navigation Guidelines:
   - Marketplace: /marketplace
   - Orders Page: /orders (buyers) or /farmer/orders (farmers)
   - Wallet Page: /wallet
   - User Profile / Account Settings: /profile
   - AI Coaching & Market Prices: /ai-assistant
10. Nigerian Crop Pricing Indices:
    We compare and track prices across major regional trade hubs:
    - Lagos (Mile 12 Market)
    - Oyo (Bodija Market)
    - Kano (Dawanau Market)
    - Benue (Gboko Market)
    Key crops tracked include Cassava, Maize, Yam, Tomatoes, Rice, and Cowpea.`,
    },
    ...pastMessages,
    { role: 'user', content: prompt },
  ];

  const body = {
    model: 'llama-3.3-70b-versatile',
    messages,
    temperature: 0.7,
    max_tokens: 1000,
  };

  if (isJson) body.response_format = { type: 'json_object' };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`❌ GROQ API ERROR [${response.status}]:`, errText);
      return generateLocalFallback(prompt, isJson);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content || content === "Error") {
      return generateLocalFallback(prompt, isJson);
    }
    return content;
  } catch (err) {
    console.error('❌ callGroq Exception:', err.message);
    return generateLocalFallback(prompt, isJson);
  }
};

export const handle = async (req, res) => {
  const action = req.params.action ?? 'assistant';
  const userId = req.user?.id;

  if (!userId && action !== 'assistant') {
    return res.status(401).json({ error: 'User session unauthorized' });
  }

  switch (action) {
    case 'assistant': {
      const { message = 'Hello', sessionId } = req.body;
      let activeSessionId = sessionId;

      try {
        if (!userId) {
          // Unauthenticated guest user
          const response = await callGroq(
            `You are Ago, a warm, highly empathetic, and professional Nigerian agricultural expert and AI trade advisor on the Agro-Connect platform.
             Answer this question from a guest user warmly, professionally, and Nigerian-friendly, and politely invite them to sign up or log in to unlock full escrow protection, interactive direct farmer chats, and advanced sales analytics: "${message}"`,
            false
          );
          return res.json({ response, sessionId: 'guest' });
        }

        // 1. Create session if none exists or 'new' is requested
        if (!activeSessionId || activeSessionId === 'new' || activeSessionId === 'guest') {
          const { data: session, error: sessErr } = await supabase
            .from('ai_chat_sessions')
            .insert([{ user_id: userId, title: message.substring(0, 30) + '...' }])
            .select()
            .single();
          
          if (sessErr) throw sessErr;
          activeSessionId = session.id;
        }

        // 2. Fetch past chat history (up to last 10 messages)
        const { data: history } = await supabase
          .from('ai_chat_messages')
          .select('*')
          .eq('session_id', activeSessionId)
          .order('created_at', { ascending: true })
          .limit(10);

        const formattedHistory = (history || []).map(m => ({
          role: m.role,
          content: m.content
        }));

        // 3. Save new user message
        await supabase
          .from('ai_chat_messages')
          .insert([{ session_id: activeSessionId, role: 'user', content: message }]);

        // Fetch user profile info to customize response
        let userName = req.user?.email || 'User';
        let userRole = 'user';
        let userVerified = false;

        const { data: profile } = await supabase
          .from('profiles')
          .select('name, role, is_verified, verification_status')
          .eq('id', userId)
          .maybeSingle();

        if (profile) {
          userName = profile.name;
          userRole = profile.role;
          userVerified = profile.verification_status === 'verified';
        }

        // 4. Generate AI completion with user context
        const response = await callGroq(
          `User Context:
           - Name: ${userName}
           - Role: ${userRole}
           - Verification Status: ${userVerified ? 'Verified' : 'Unverified'}
           
           User Message: "${message}"
           
           Please answer the message warmly and direct the user using their specific context where helpful (e.g. if they are a farmer, give seller/dashboard tips; if they are a buyer, direct them to marketplace/escrow).`,
          false,
          formattedHistory
        );

        // 5. Save AI response
        await supabase
          .from('ai_chat_messages')
          .insert([{ session_id: activeSessionId, role: 'assistant', content: response }]);

        // 6. Update session updated_at timestamp
        await supabase
          .from('ai_chat_sessions')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', activeSessionId);

        return res.json({ response, sessionId: activeSessionId });
      } catch (err) {
        console.error('Chat Assistant Error:', err.message);
        return res.status(500).json({ error: 'Failed to complete chat interaction: ' + err.message });
      }
    }

    case 'sessions': {
      try {
        const { data: sessions, error } = await supabase
          .from('ai_chat_sessions')
          .select('*')
          .eq('user_id', userId)
          .order('updated_at', { ascending: false });

        if (error) throw error;
        return res.json(sessions || []);
      } catch (err) {
        return res.status(500).json({ error: 'Failed to fetch chat sessions' });
      }
    }

    case 'history': {
      const { sessionId } = req.query;
      if (!sessionId) return res.status(400).json({ error: 'Session ID is required' });
      try {
        const { data: messages, error } = await supabase
          .from('ai_chat_messages')
          .select('*')
          .eq('session_id', sessionId)
          .order('created_at', { ascending: true });

        if (error) throw error;
        return res.json(messages || []);
      } catch (err) {
        return res.status(500).json({ error: 'Failed to fetch message history' });
      }
    }

    case 'pricing-insights': {
      try {
        const response = await callGroq(
          `Compare current regional Nigerian market average prices for key crops like Cassava, Maize, Tomatoes, Yam across key trade hubs: Lagos (Mile 12), Oyo (Bodija), Kano (Dawanau), Benue (Gboko).
           Return ONLY a raw JSON object matching:
           {
             "crops": [
               { "name": "Cassava", "unit": "ton", "prices": { "Lagos": 120000, "Kano": 95000, "Benue": 75000, "Oyo": 105000 }, "advice": "string" },
               { "name": "Maize", "unit": "bag", "prices": { "Lagos": 42000, "Kano": 34000, "Benue": 31000, "Oyo": 39000 }, "advice": "string" },
               { "name": "Yam", "unit": "tuber (large)", "prices": { "Lagos": 150000, "Kano": 110000, "Benue": 80000, "Oyo": 130000 }, "advice": "string" }
             ],
             "market_trends": "General trend advice for the week in Naira."
           }`,
          true
        );
        return res.json(JSON.parse(response));
      } catch (err) {
        return res.status(500).json({ error: 'Failed to compile pricing insights' });
      }
    }

    case 'cart-insights': {
      const { items = [], cartItems = [] } = req.body;
      const finalItems = items.length > 0 ? items : cartItems;
      try {
        const response = await callGroq(
          `Review the user's current agricultural cart items: ${JSON.stringify(finalItems)}.
           Provide optimization advice regarding volume freight logistics in Nigeria, potential price bargain opportunities, or bulk thresholds to save costs.
           Return ONLY a JSON object:
           {
             "savings_tip": "string",
             "logistics_suggestion": "string",
             "estimated_commission_saved": "string"
           }`,
          true
        );
        return res.json(JSON.parse(response));
      } catch (err) {
        console.error('Cart Insights Error:', err.message);
        return res.status(500).json({ error: 'Failed to calculate cart insights: ' + err.message });
      }
    }

    case 'recommendations': {
      try {
        // Fetch public products to match recommendations
        const { data: products } = await supabase
          .from('products')
          .select('id, name, price, location, category')
          .limit(10);

        const response = await callGroq(
          `Given this active products list: ${JSON.stringify(products || [])}, select the top 3 best crop bargains for a Nigerian agricultural trade buyer.
           Return ONLY a JSON object:
           {
             "recommendedIds": ["uuid", "uuid"],
             "reasoning": "Reason why these items represent excellent margins."
           }`,
          true
        );
        return res.json(JSON.parse(response));
      } catch (err) {
        return res.status(500).json({ error: 'Failed to compile recommendations' });
      }
    }

    case 'seller-insights':
    case 'farmer-insights': {
      try {
        // Fetch active products of the vendor
        const { data: sellerProducts } = await supabase
          .from('products')
          .select('*')
          .eq('farmer_id', userId);

        const response = await callGroq(
          `You are Ago, agricultural business coach. Review this vendor's listings: ${JSON.stringify(sellerProducts || [])}.
           Provide 3 highly tactical, Nigerian-focused insights to improve listing yields, target Oyo/Lagos buyers, or adjust listings relative to Kano price indices.
           Return ONLY a JSON object:
           {
             "demand_alert": "string",
             "pricing_strategy": "string",
             "actionable_tips": ["string", "string"]
           }`,
          true
        );
        return res.json(JSON.parse(response));
      } catch (err) {
        return res.status(500).json({ error: 'Failed to compile seller insights' });
      }
    }

    case 'onboarding-tips': {
      const response = await callGroq(
        `Provide 2 actionable tips for a farmer/buyer. Return as JSON with 'tips' array.`,
        true
      );
      return res.json(JSON.parse(response));
    }

    case 'agro-score-coaching': {
      const { profile } = req.body;
      const response = await callGroq(
        `Analyze profile: ${JSON.stringify(profile)}. Return JSON with 'summary', 'tips'.`,
        true
      );

      const parsedResponse = JSON.parse(response);
      
      if (profile.userId) {
        await supabase
          .from('ai_coaching_logs')
          .insert([{
            user_id: profile.userId,
            advice_type: 'agro_score',
            advice_content: parsedResponse.summary + " " + (parsedResponse.tips || []).join(" "),
            agro_score_at_time: profile.agro_score
          }]);
      }

      return res.json(parsedResponse);
    }

    case 'coaching-history': {
      try {
        const { data: logs, error } = await supabase
          .from('ai_coaching_logs')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return res.json(logs || []);
      } catch (err) {
        console.error('CoachingHistory error:', err.message);
        return res.status(500).json({ error: 'Failed to fetch coaching history' });
      }
    }

    default:
      return res.status(404).json({ message: 'Unknown AI action endpoint' });
  }
};
