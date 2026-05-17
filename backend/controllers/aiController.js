import fetch from 'node-fetch';
import { supabase } from '../config/db.js';
import 'dotenv/config';

const callGroq = async (prompt, isJson = false) => {
  const apiKey = process.env.GROQ_API_KEY;
  const apiUrl = 'https://api.groq.com/openai/v1/chat/completions';

  if (!apiKey || apiKey === 'your_groq_api_key_here') {
    return isJson 
      ? JSON.stringify({ error: 'AI features are currently unavailable' }) 
      : "I'm sorry, my AI features are currently offline.";
  }

  const body = {
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: `You are AgroBot, a warm, highly empathetic, and professional Nigerian agricultural expert and AI guide on the Agro-Connect platform. 
Your goal is to provide highly practical, realistic, and human-sounding advice for local farmers, agricultural commodity buyers, and logistics providers in Nigeria. 

Guidelines:
1. Speak warmly and naturally like a real person, using gentle local expressions where appropriate (e.g., brief, friendly greetings, or realistic local market insights). Do NOT sound robotic, dry, or formal.
2. Provide highly practical advice for Nigerian crops (like Cassava, Maize, Yam, Tomatoes, Rice), regional pricing dynamics (e.g., Lagos, Kano, Kaduna, Benue, Oyo markets), logistics solutions, and escrow payment systems.
3. Be clear, concise, and structured. Avoid giving dry or generic essays. Make your advice actionable.
4. Respond ONLY with a valid JSON object if requested.`,
      },
      { role: 'user', content: prompt },
    ],
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

  switch (action) {
    case 'assistant': {
      const { message = 'Hello' } = req.body;
      const response = await callGroq(`Please answer the following user question in a warm, expert, and highly practical human tone: "${message}"`);
      return res.json({ response });
    }

    case 'onboarding-tips': {
      const response = await callGroq(
        `Provide 2 actionable tips for a farmer/buyer. Return as JSON with 'tips' array.`,
        true
      );
      return res.send(response);
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
      const userId = req.user?.id; // Use authenticated ID
      try {
        const { data: logs, error } = await supabase
          .from('ai_coaching_logs')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return res.json(logs);
      } catch (err) {
        console.error('CoachingHistory error:', err.message);
        return res.status(500).json({ error: 'Failed to fetch coaching history' });
      }
    }

    default:
      return res.json({ message: 'AI feature coming soon' });
  }
};
