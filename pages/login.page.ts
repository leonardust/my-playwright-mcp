import { Locator, Page } from '@playwright/test';
import { endpoints } from '../config/urls';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  private readonly email: Locator;
  private readonly password: Locator;
  private readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.email = page.getByRole('textbox', { name: 'Enter User Email' });
    this.password = page.getByRole('textbox', { name: 'Enter Password' });
    this.submitButton = page.getByRole('button', { name: 'LogIn' });
  }

  get url(): string {
    return endpoints.login;
  }

  async goto(): Promise<void> {
    await this.navigate(this.url);
  }

  async login(email: string, password: string): Promise<void> {
    await this.goto();
    await this.email.fill(email);
    await this.password.fill(password);
    await this.submitButton.click();
  }
}
