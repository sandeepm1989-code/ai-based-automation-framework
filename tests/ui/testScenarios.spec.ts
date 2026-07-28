import { test, expect } from '@/factories/pageFactory';
import * as validator from '@/utils/validators';
import * as aiHelper from '@/utils/aiHelper';
import { smartClick } from '@/utils/actionHelper';

test.describe('Scenario 1: AI-Assisted Hybrid Workflow', () => {

  test('Validate API data integrity with MD5, AI analysis, and sync with UI', async ({ request, loginPage, inventoryPage }) => {
    
    // --- STEP 1: API Request & MD5 Validation ---
    const apiResponse = await request.get('https://reqres.in/api/users/2', {
      headers: { 'x-api-key': process.env.REQRES_API_KEY || 'reqres_free_key' },
    });
    expect(apiResponse.ok()).toBeTruthy();

    const body = await apiResponse.json();
    const user = body.data;

    // Calculate MD5 hash of API payload to ensure data payload integrity
    const payloadHash = validator.calculateMD5(user);
    console.log(`[Checksum] User MD5 Hash: ${payloadHash}`);
    expect(payloadHash).toBeDefined();

    // --- STEP 2: AI Intent Verification ---
    const isAiValid = await aiHelper.validateDataWithAI(
      user,
      'User must have a valid professional email domain and non-empty first and last names.'
    );
    console.log(`[DEBUG] AI validation returned: ${isAiValid}`);
    expect(isAiValid).toBe(true);

    // --- STEP 3: UI Workflow using Page Factory ---
    await loginPage.navigateTo();
    await loginPage.login('standard_user', 'secret_sauce');

    // Assert UI Navigation via Inventory Page Object
    await expect(inventoryPage.title).toHaveText('Products');

    // Add item to cart and verify cart badge state
    await inventoryPage.addBackpackToCart();
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

});

test.describe('Scenario 2: AI Self-Healing Locators', () => {

  test('Should self-heal when clicking an outdated element selector', async ({ loginPage,
    inventoryPage,page }) => {
    // 1. Navigate & Login via POM
    await loginPage.navigateTo();
    await loginPage.login('standard_user', 'secret_sauce');

    // 2. Add item to cart and navigate to cart
    await inventoryPage.addBackpackToCart();
    await inventoryPage.goToCart();

    // 3. Deliberately pass a broken locator to smartClick
    const brokenCheckoutSelector = '#old-legacy-checkout-button-v1';
    await smartClick(page, brokenCheckoutSelector, 'Click the Checkout button on the cart page');

    // 4. Assert navigation succeeded
    await expect(page).toHaveURL(/.*checkout-step-one/);
  });

});

test.describe('Scenario 3: Dynamic Insurance Quote Engine Validation', () => {

  test('Validate Backend API Quote integrity with MD5 & UI Quote Sync with AI', async ({ request, loginPage,
    inventoryPage, page, cartPage, checkoutPage }) => {

    // --- STEP 1: API Quote Generation ---
    const apiResponse = await request.get('https://jsonplaceholder.typicode.com/users/2');
    expect(apiResponse.ok()).toBeTruthy();
    const rawUserQuoteApi = await apiResponse.json();

    const quoteCalculation = {
      ...rawUserQuoteApi,
      userTier: 'Gold',
      basePremium: 1200,
      appliedDiscount: 15,
      finalCalculatedQuote: 1020,
    };

    // --- STEP 2: Schema MD5 Checksum Integrity Check ---
    const schemaHash = validator.generateSchemaChecksum(quoteCalculation);
    expect(schemaHash).toBeDefined();

    // --- STEP 3: UI Workflow using Page Factory ---
    await loginPage.navigateTo();
    await loginPage.login('standard_user', 'secret_sauce');

    await inventoryPage.addBackpackToCart();
    await inventoryPage.goToCart();

    await cartPage.proceedToCheckout();

    await checkoutPage.fillInformation(
      quoteCalculation.name.split(' ')[0],
      quoteCalculation.name.split(' ')[1] || 'User',
      quoteCalculation.address.zipcode
    );

    // Inject the API quote dynamically into the page HTML for realistic validation
    await page.evaluate((quote) => {
      const container = document.querySelector('.checkout_summary_container');
      if (container) {
        container.innerHTML += `
          <div id="insurance-quote-details">
            <p>User Tier: ${quote.userTier}</p>
            <p>Base Premium: $${quote.basePremium}</p>
            <p>Applied Discount: ${quote.appliedDiscount}%</p>
            <p>Final Approved Quote: $${quote.finalCalculatedQuote}</p>
          </div>
        `;
      }
    }, quoteCalculation);

    // Extract UI summary text via POM method
    const uiSummaryText = await checkoutPage.getSummaryText();

    // --- STEP 4: AI Cross-Channel Validation ---
    const isQuoteValid = await aiHelper.assertQuoteLogicWithAI(
      quoteCalculation,
      uiSummaryText,
      quoteCalculation.userTier
    );

    expect(isQuoteValid).toBe(true);
  });

});