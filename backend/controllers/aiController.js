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

Guidelines:
1. Speak warmly and naturally like a real person, using gentle local expressions where appropriate (e.g., brief, friendly greetings like "How far, my friend!" or realistic local market insights). Do NOT sound robotic, dry, or formal.
2. Provide highly practical advice for Nigerian crops (like Cassava, Maize, Yam, Tomatoes, Rice), regional pricing dynamics (e.g., Lagos, Kano, Kaduna, Benue, Oyo markets), logistics solutions, and escrow payment systems.
3. Be clear, concise, and structured. Avoid giving dry or generic essays. Make your advice actionable.
4. Respond ONLY with a valid JSON object if requested.`,
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

  if (!userId) {
    return res.status(401).json({ error: 'User session unauthorized' });
  }

  switch (action) {
    case 'assistant': {
      const { message = 'Hello', sessionId } = req.body;
      let activeSessionId = sessionId;

      try {
        // 1. Create session if none exists or 'new' is requested
        if (!activeSessionId || activeSessionId === 'new') {
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

        // 4. Generate AI completion
        const response = await callGroq(
          `Please answer the following user question in a warm, expert, and highly practical human tone: "${message}"`,
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
