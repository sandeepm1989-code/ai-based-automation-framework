import { BasePage } from '../basePage';

export class TenantA extends BasePage {
  async fillTenantAInformation(postalCode: string) {
    await this.page.fill('[data-test="postalCode"]', postalCode);
    await this.page.click('[data-test="continue"]');
  }
}