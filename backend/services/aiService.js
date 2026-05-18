import { Groq } from 'groq-sdk';
import 'dotenv/config';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * AgroAIService
 * 
 * Handles all AI interactions for Agro-Connect using Groq.
 */
class AgroAIService {
  /**
   * Analyze Farmer verification documents
   */
  async analyzeFarmerVerification(verificationData) {
    try {
      const prompt = `
        You are an agricultural certification expert. Analyze the following verification data for a farmer on Agro-Connect.
        Data:
        - Farmer Name: ${verificationData.name}
        - Category: ${verificationData.category}
        
        Return ONLY a JSON object:
        {
          "confidence": number,
          "trust_badge": "None" | "Verified" | "Premium",
          "summary": "string",
          "flags": ["string"]
        }
      `;

      const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.3-70b-versatile',
        response_format: { type: 'json_object' },
      });

      return JSON.parse(chatCompletion.choices[0].message.content);
    } catch (error) {
      console.error('Agro AI Verification Error:', error);
      return { confidence: 50, trust_badge: "None", summary: "AI analysis unavailable." };
    }
  }

  async getAgroScoreCoaching(profile) {
    try {
      const prompt = `
        You are 'AgroCoach', a financial advisor for Zenda users.
        User Profile:
        - Name: ${profile.name}
        - Current AgroScore: ${profile.agro_score || 0}/100
        
        Return ONLY a JSON object:
        {
          "summary": "string",
          "tips": ["string", "string", "string"],
          "next_milestone": "string"
        }
      `;

      const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.3-70b-versatile',
        response_format: { type: 'json_object' },
      });

      return JSON.parse(chatCompletion.choices[0].message.content);
    } catch (error) {
      return { summary: "Continue using Agro-Connect to build your credit profile.", tips: ["Complete installments on time."] };
    }
  }

  async askAgroBot(question) {
    try {
      const prompt = `
        You are 'AgroBot', the AI assistant for Agro-Connect.
        Answer this question concisely in a highly professional, human, Nigerian-friendly tone: "${question}"
      `;

      const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.3-70b-versatile',
      });

      return chatCompletion.choices[0].message.content;
    } catch (error) {
      return "I'm having trouble thinking right now. Please try again later.";
    }
  }
}

export default new AgroAIService();
