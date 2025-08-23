import { Locator, Page } from '@playwright/test';
import { endpoints } from '../config/urls';

export class WelcomePage {
  private readonly page: Page;
  private readonly menu: Locator;
  static readonly url = endpoints.welcome;

  constructor(page: Page) {
    this.page = page;
    this.menu = page.getByRole('heading', { level: 1 });
  }

  getMenu(): Locator {
    return this.menu;
  }
}
