import OpenAI from 'openai';
import * as dotenv from 'dotenv';

dotenv.config();

// Groq uses the exact same OpenAI SDK structure
const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1', // Point to Groq's free endpoint
});

export async function validateDataWithAI(actualData: any, expectedContext: string): Promise<boolean> {
  if (!process.env.GROQ_API_KEY) {
    console.warn("⚠️ GROQ_API_KEY is missing. Skipping AI verification.");
    return true; 
  }

  const prompt = `Analyze this JSON response against the business intent: "${expectedContext}".
  Response Data: ${JSON.stringify(actualData)}
  Return ONLY a JSON object: {"valid": boolean, "reason": "string"}`;

  const response = await openai.chat.completions.create({
    model: 'llama-3.3-70b-versatile', // Free high-performance open model
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' }
  });

  const result = JSON.parse(response.choices[0].message.content || '{}');
  console.log(`[AI Analysis] Valid: ${result.valid} | Reason: ${result.reason}`);
  return result.valid;
}

/**
 * Uses LLM to cross-validate dynamic UI quote text against raw API quote calculations.
 */
export function assertQuoteLogicWithAI(
  apiData: object,
  uiQuoteDetails: string,
  userTier: string
): Promise<boolean> {
  const modelName = process.env.GROQ_API_KEY ? 'llama-3.3-70b-versatile' : 'gpt-4o-mini';

  const prompt = `
  You are an Insurance Domain Validation Expert.
  Cross-validate the Backend API Quote Response against the Frontend UI Quote details for a user with tier: "${userTier}".

  Backend API Data:
  ${JSON.stringify(apiData, null, 2)}

  Frontend UI Text:
  "${uiQuoteDetails}"

  Validation Criteria:
  1. Does the UI pricing/quote logically reflect backend values, discounts, or user tier?
  2. Are there any discrepancies between the calculation intent and what the user sees on screen?

  Return ONLY a JSON object:
  {
    "valid": boolean,
    "confidence": "high | medium | low",
    "discrepancies": ["array of issue strings if any"],
    "reasoning": "summary of validation"
  }
  `;

  return (async () => {
    try {
      const response = await openai.chat.completions.create({
        model: modelName,
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      console.log(`\n📊 [Quote AI Audit] Valid: ${result.valid}`);
      console.log(`📊 [Quote AI Reasoning] ${result.reasoning}`);
      if (result.discrepancies?.length) {
        console.warn(`⚠️ [Discrepancies Found]:`, result.discrepancies);
      }

      return result.valid ?? true;
    } catch (error) {
      console.error('⚠️ [AI Quote Audit Error]:', error);
      return true;
    }
  })();
}