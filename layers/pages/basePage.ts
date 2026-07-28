import { Page } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(url?: string) {
    const targetUrl = url || 'https://www.saucedemo.com';
    await this.page.goto(targetUrl);
  }
}