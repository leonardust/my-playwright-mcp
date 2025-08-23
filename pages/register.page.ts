import { Locator, Page } from '@playwright/test';
import { endpoints } from '../config/urls';
import { BasePage } from './base.page';

export class RegisterPage extends BasePage {
  private readonly firstName: Locator;
  private readonly lastName: Locator;
  private readonly email: Locator;
  private readonly password: Locator;
  private readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.firstName = page.getByTestId('firstname-input');
    this.lastName = page.getByTestId('lastname-input');
    this.email = page.getByTestId('email-input');
    this.password = page.getByTestId('password-input');
    this.submitButton = page.getByTestId('register-button');
  }

  async goto() {
    await this.navigate(endpoints.register);
  }

  async fillForm(data: { firstName: string; lastName: string; email: string; password: string }) {
    await this.firstName.fill(data.firstName);
    await this.lastName.fill(data.lastName);
    await this.email.fill(data.email);
    await this.password.fill(data.password);
  }

  async submit() {
    await this.submitButton.click();
  }

  async registerUser(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) {
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
