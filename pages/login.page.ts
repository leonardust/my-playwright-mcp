import { endpoints } from '@config/urls.js';
import { BasePage } from '@pages/base.page.js';
import { Locator, Page } from '@playwright/test';

export class LoginPage extends BasePage {
  private readonly email: Locator;
  private readonly password: Locator;
  private readonly submitButton: Locator;

  constructor(page: Page) {
    super(page, 'LoginPage');
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

    this.logElementActionLocal('fill', 'email input', '[data-testid="email"]', email);
    await this.email.fill(email);

    this.logElementActionLocal('fill', 'password input', '[data-testid="password"]', '***');
    await this.password.fill(password);

    this.logElementActionLocal('click', 'submit button', '[data-testid="submit"]');
    await this.submitButton.click();
  }
}
