

import { test as base } from '@playwright/test';
import { getGlobalConfig, GlobalConfig } from '../config/globalConfig';
import { TENANTS, TenantSettings } from '../config/tenantConfig';
import { LoginPage } from '../layers/pages/common/loginPage';
import { TenantA } from '../layers/pages/tenants/tenantA';
import { apiClient } from '../layers/api/apiClient';
import { DatabaseClient } from '../layers/db/dbClient';
import { InventoryPage } from '../layers/pages/common/inventoryPage';
import { CartPage } from '../layers/pages/common/cartPage';
import { CheckoutPage } from '../layers/pages/common/checkoutPage';

// Declare types for Page Factory fixtures
type TestFixtures = {
  globalConfig: GlobalConfig;
  tenantConfig: TenantSettings;
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  tenantA: TenantA;
  apiClient: apiClient;
  dbClient: DatabaseClient;
};

// Extend base test to inject Page Factory instances
export const test = base.extend<TestFixtures>({
  globalConfig: async ({}, use) => {
    await use(getGlobalConfig());
  },

  tenantConfig: async ({ globalConfig }, use) => {
    const tenant = TENANTS[globalConfig.tenant] || TENANTS['tenantA'];
    await use(tenant);
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },

  tenantA: async ({ page }, use) => {
    await use(new TenantA(page));
  },

  apiClient: async ({ request, tenantConfig }, use) => {
    await use(new apiClient(request, tenantConfig.apiBaseUrl));
  },

  dbClient: async ({ globalConfig }, use) => {
    const db = new DatabaseClient(globalConfig.dbHost, globalConfig.dbPort);
    await db.connect();
    await use(db);
    await db.disconnect();
  },
});

export { expect } from '@playwright/test';