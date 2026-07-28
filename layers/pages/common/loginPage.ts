import { Page, Locator } from '@playwright/test';
import { BasePage } from '../basePage';

export class LoginPage extends BasePage {
  
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  async navigateTo(url?: string) {
    await super.navigateTo(url);
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}