import { test, expect } from '@/factories/pageFactory';
import { ExcelUtil } from '@/test-data/excelUtil';

// Read excel inputs dynamically
const testRows = ExcelUtil.readSheet('./test-data/testData.xlsx', 'Scenarios');

test.describe('Full Multi-Tenant E2E Suite', () => {

  testRows.forEach((row) => {
    test(`E2E Validation for user: ${row.Username}`, async ({
      tenantConfig,
      apiClient,
      dbClient,
      loginPage,
      tenantA
    }) => {

      // 1. API LAYER: Pre-fetch quote/user state
      const apiUser = await apiClient.getUserById(row.UserId || 2);
      expect(apiUser).toBeDefined();

      // 2. DB LAYER: Confirm backend persistence
      const dbPolicy = await dbClient.getPolicyDetails(row.PolicyId || 'POL-101');
      expect(dbPolicy.status).toBe('ACTIVE');

      // 3. UI LAYER: Tenant-based execution
      await loginPage.navigateTo(tenantConfig.baseUrl);
      await loginPage.login(row.Username, row.Password);

      // Execute tenant specific methods if running tenantA
      if (tenantConfig.tenantId === 'tenantA') {
        await tenantA.fillTenantAInformation(row.PostalCode);
      }

      console.log(`✅ Multi-tenant E2E completed for ${tenantConfig.tenantId}`);
    });
  });

});