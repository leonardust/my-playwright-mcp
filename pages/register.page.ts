import { endpoints } from '@config/urls.js';
import { BasePage } from '@pages/base.page.js';
import { Locator, Page } from '@playwright/test';

export class RegisterPage extends BasePage {
  private readonly firstName: Locator;
  private readonly lastName: Locator;
  private readonly email: Locator;
  private readonly password: Locator;
  private readonly submitButton: Locator;

  constructor(page: Page) {
    super(page, 'RegisterPage');
    this.firstName = page.getByTestId('firstname-input');
    this.lastName = page.getByTestId('lastname-input');
    this.email = page.getByTestId('email-input');
    this.password = page.getByTestId('password-input');
    this.submitButton = page.getByTestId('register-button');
  }

  get url(): string {
    return endpoints.register;
  }

  async goto(): Promise<void> {
    await this.navigate(this.url);
  }

  async fillForm(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<void> {
    this.logElementActionLocal(
      'fill',
      'first name input',
      '[data-testid="firstName"]',
      data.firstName
    );
    await this.firstName.fill(data.firstName);

    this.logElementActionLocal(
      'fill',
      'last name input',
      '[data-testid="lastName"]',
      data.lastName
    );
    await this.lastName.fill(data.lastName);

    this.logElementActionLocal('fill', 'email input', '[data-testid="email"]', data.email);
    await this.email.fill(data.email);

    this.logElementActionLocal('fill', 'password input', '[data-testid="password"]', '***');
    await this.password.fill(data.password);
  }

  async submit(): Promise<void> {
    this.logElementActionLocal('click', 'submit button', '[data-testid="submit"]');
    await this.submitButton.click();
  }

  async registerUser(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<void> {
    await this.goto();
    await this.fillForm(data);
    await this.submit();
  }

  getFirstNameInput(): Locator {
    return this.firstName;
  }

  getLastNameInput(): Locator {
    return this.lastName;
  }

  getEmailInput(): Locator {
    return this.email;
  }

  getPasswordInput(): Locator {
    return this.password;
  }
}
