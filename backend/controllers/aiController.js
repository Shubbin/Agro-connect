import fetch from 'node-fetch';
import 'dotenv/config';

const callGroq = async (prompt, isJson = false) => {
  const apiKey = process.env.GROQ_API_KEY;
  const apiUrl = 'https://api.groq.com/openai/v1/chat/completions';

  if (!apiKey || apiKey === 'your_groq_api_key_here') {
    console.warn('GROQ_API_KEY is not set or invalid in .env');
    return isJson 
      ? JSON.stringify({ error: 'AI features are currently unavailable' }) 
      : "I'm sorry, my AI features are currently offline. Please contact the administrator.";
  }

  const body = {
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: `You are AgroBot, the premium AI heart of the Agro Direct Connect platform in Nigeria. 
        Your mission is to empower Nigerian farmers and buyers with expert, actionable, and culturally relevant agricultural advice. 
        Focus on local Nigerian crop varieties (Cocoa, Cassava, Yam, Ginger, etc.), sustainable practices, and marketplace growth. 
        ${isJson ? 'Respond ONLY with a valid JSON object.' : 'Keep your responses concise, professional, and encouraging.'}`,
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
    return data.choices?.[0]?.message?.content ?? (isJson ? JSON.stringify({ error: 'AI processing failed' }) : "I'm sorry, I couldn't process that request.");
  } catch {
    return isJson
      ? JSON.stringify({ error: 'AI connection failed' })
      : "Sorry, I'm having trouble connecting to my AI core right now.";
  }
};

export const handle = async (req, res) => {
  const action = req.params.action ?? 'assistant';

  switch (action) {
    case 'assistant': {
      const { message = 'Hello' } = req.body;
      const response = await callGroq(message);
      return res.json({ response });
    }

    case 'onboarding-tips': {
      const { role = 'user' } = req.query;
      const rolePrompt =
        role === 'farmer'
          ? 'as a farmer onboarding into an agro-marketplace'
          : 'as a buyer onboarding into an agro-marketplace';
      const response = await callGroq(
        `Provide 2 short, actionable tips ${rolePrompt}. Return as JSON with 'tips' array containing 'id', 'title', 'description'.`,
        true
      );
      return res.send(response);
    }

    case 'product-suggestions': {
      const response = await callGroq(
        `Suggest improvements for this agricultural product listing: ${JSON.stringify(req.body)}. Return as JSON with 'suggestions' array of {field, suggestion}.`,
        true
      );
      return res.send(response);
    }

    case 'cart-insights': {
      const response = await callGroq(
        `Provide shopping insights for these cart items: ${JSON.stringify(req.body)}. Return as JSON with 'insights' array of {title, detail, icon, severity}.`,
        true
      );
      return res.send(response);
    }

    case 'recommendations': {
      const response = await callGroq(
        'Recommend 3 agricultural products for a buyer in Nigeria. Return as JSON with \'recommendations\' array of {id, name, reason}.',
        true
      );
      return res.send(response);
    }

    case 'farmer-insights': {
      const response = await callGroq(
        'Provide business growth insights for a Nigerian farmer. Return as JSON with \'insights\' array of {title, detail, icon, severity}.',
        true
      );
      return res.send(response);
    }

    default:
      return res.json({ message: 'AI feature coming soon' });
  }
};
