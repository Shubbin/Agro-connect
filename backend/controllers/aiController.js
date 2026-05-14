import fetch from 'node-fetch';
import AICoachingLog from '../models/AICoachingLog.js';
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
        content: `You are AgroBot, the premium AI heart of the Agro Direct Connect platform in Nigeria. Respond ONLY with a valid JSON object if requested.`,
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

    const data = await response.json();
    return data.choices?.[0]?.message?.content ?? "Error";
  } catch {
    return "Error";
  }
};

export const handle = async (req, res) => {
  const action = req.params.action ?? 'assistant';

  switch (action) {
    case 'assistant': {
      const { message = 'Hello' } = req.body;
      const response = await callGroq(`Answer this user query: "${message}". Tone: Helpful and Local.`);
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
        const log = new AICoachingLog({
          user: profile.userId,
          advice_type: 'agro_score',
          advice_content: parsedResponse.summary + " " + (parsedResponse.tips || []).join(" "),
          agro_score_at_time: profile.agro_score
        });
        await log.save();
      }

      return res.json(parsedResponse);
    }

    case 'coaching-history': {
      const { userId } = req.query;
      try {
        const logs = await AICoachingLog.find({ user: userId }).sort({ created_at: -1 });
        return res.json(logs);
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    }

    default:
      return res.json({ message: 'AI feature coming soon' });
  }
};
