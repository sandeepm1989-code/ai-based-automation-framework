import { Page, Locator } from '@playwright/test';
import { BasePage } from '../basePage';

export class LoginPage extends BasePage {

  constructor(page: Page) {
    super(page); // 👈 THIS IS CRITICAL. It assigns 'page' to 'this.page' in BasePage.
  }
  
  readonly usernameInput: Locator = this.page.locator('#user-name');
  readonly passwordInput: Locator = this.page.locator('#password');
  readonly loginButton: Locator = this.page.locator('#login-button');

  async navigateTo(url?: string) {
    await super.navigateTo(url);
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}