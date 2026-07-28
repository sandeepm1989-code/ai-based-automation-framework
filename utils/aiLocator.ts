import { Page } from '@playwright/test';
import OpenAI from 'openai';
import * as dotenv from 'dotenv';

dotenv.config();

// Initialize OpenAI / Groq client
const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY,
  baseURL: process.env.GROQ_API_KEY ? 'https://api.groq.com/openai/v1' : undefined,
});

/**
 * Extracts a simplified DOM structure containing interactive elements.
 */
export async function getCleanDOMSnapshot(page: Page): Promise<string> {
  return await page.evaluate(() => {
    // Select interactive elements
    const elements = Array.from(document.querySelectorAll('button, a, input, select, [role="button"]'));
    
    return elements.map(el => {
      const tag = el.tagName.toLowerCase();
      const id = el.id ? ` id="${el.id}"` : '';
      const name = el.getAttribute('name') ? ` name="${el.getAttribute('name')}"` : '';
      const type = el.getAttribute('type') ? ` type="${el.getAttribute('type')}"` : '';
      const dataTest = el.getAttribute('data-test') ? ` data-test="${el.getAttribute('data-test')}"` : '';
      const text = el.textContent?.trim().replace(/\s+/g, ' ') || '';
      
      return `<${tag}${id}${name}${type}${dataTest}>${text}</${tag}>`;
    }).join('\n');
  });
}

/**
 * Uses LLM to find a replacement CSS/XPath selector based on user intent.
 */
export async function findFallbackSelectorWithAI(domSnapshot: string, userIntent: string): Promise<string> {
  const modelName = process.env.GROQ_API_KEY ? 'llama-3.3-70b-versatile' : 'gpt-4o-mini';

  const prompt = `
  You are an expert Test Automation Engineer using Playwright.
  A Playwright locator failed. Find a working, robust CSS or XPath selector from the DOM snapshot below.

  User Intent: "${userIntent}"

  DOM Snapshot:
  ${domSnapshot}

  Return ONLY a valid JSON object in this format:
  {
    "selector": "string (valid CSS or XPath selector)",
    "confidence": "high | medium | low",
    "reasoning": "string explaining why this element matches"
  }
  `;

  try {
    const response = await openai.chat.completions.create({
      model: modelName,
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' }
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    console.log(`\n🤖 [AI Healing] Found dynamic selector: "${result.selector}"`);
    console.log(`🤖 [AI Reasoning] ${result.reasoning}\n`);

    return result.selector;
  } catch (error) {
    console.error('⚠️ [AI Healing Failed]:', error);
    throw error;
  }
}