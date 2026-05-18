import fetch from 'node-fetch';
import { supabase } from '../config/db.js';
import 'dotenv/config';

const callGroq = async (prompt, isJson = false, pastMessages = []) => {
  const apiKey = process.env.GROQ_API_KEY;
  const apiUrl = 'https://api.groq.com/openai/v1/chat/completions';

  if (!apiKey || apiKey === 'your_groq_api_key_here') {
    return isJson 
      ? JSON.stringify({ error: 'AI features are currently unavailable' }) 
      : "I'm sorry, my AI features are currently offline.";
  }

  const messages = [
    {
      role: 'system',
      content: `You are Ago, a warm, highly empathetic, and professional Nigerian agricultural expert and AI trade advisor on the Agro-Connect platform.
Your goal is to provide highly practical, realistic, and human-sounding advice for local farmers, agricultural commodity buyers, and logistics providers in Nigeria.

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
    Key crops tracked include Cassava, Maize, Yam, Tomatoes, Rice, and Cowpea.

COMMUNICATION STYLE GUIDELINES:
- Avoid robotic, dry, or formal "AI speak". Speak warmly and enthusiastically like a trusted, experienced agricultural mentor or friend.
- Use friendly, authentic Nigerian-friendly greetings and phrases naturally (e.g., "Ah, my friend!", "How far!", "Welcome to Agro-Connect!", "God bless your harvest!"). Keep it highly respectful, warm, and commercial-grade.
- Keep answers structured but conversational, clear, and action-oriented. Provide realistic, factual, and direct answers. Respond ONLY with a valid JSON object if requested.`,
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
      throw new Error(`Groq API returned ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content ?? "Error";
  } catch (err) {
    console.error('❌ callGroq Exception:', err.message);
    return "Error";
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
      const { cartItems = [] } = req.body;
      try {
        const response = await callGroq(
          `Review the user's current agricultural cart items: ${JSON.stringify(cartItems)}.
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
        return res.status(500).json({ error: 'Failed to calculate cart insights' });
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
