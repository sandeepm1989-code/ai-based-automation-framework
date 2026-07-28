import { Page, expect } from '@playwright/test';
import { getCleanDOMSnapshot, findFallbackSelectorWithAI } from './aiLocator';

export async function smartClick(page: Page, brokenSelector: string, userIntent: string) {
  try {
    // Attempt standard click with a short timeout to fail fast if locator is broken
    console.log(`🔍 Attempting standard click on: "${brokenSelector}"`);
    await page.click(brokenSelector, { timeout: 3000 });
    console.log(`✅ Standard click succeeded.`);
  } catch (error) {
    console.warn(`⚠️ Locator failed: "${brokenSelector}". Initiating AI Self-Healing...`);

    // 1. Capture clean DOM snapshot
    const domSnapshot = await getCleanDOMSnapshot(page);

    // 2. Ask AI for healed selector
    const healedSelector = await findFallbackSelectorWithAI(domSnapshot, userIntent);

    // 3. Perform click with healed selector
    await page.click(healedSelector);
    console.log(`🎉 Self-healing action completed successfully!`);
  }
}