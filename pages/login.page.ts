import { Locator, Page } from '@playwright/test';
import { endpoints } from '../config/urls';

export class LoginPage {
  private readonly page: Page;
  private readonly email: Locator;
  private readonly password: Locator;
  private readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.email = page.getByRole('textbox', { name: 'Enter User Email' });
    this.password = page.getByRole('textbox', { name: 'Enter Password' });
    this.submitButton = page.getByRole('button', { name: 'LogIn' });
  }

  async goto() {
    await this.page.goto(endpoints.login);
  }

  async login(email: string, password: string) {
    await this.goto();
    await this.email.fill(email);
    await this.password.fill(password);
    await this.submitButton.click();
  }
}
