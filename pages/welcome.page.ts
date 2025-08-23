import { Locator, Page } from '@playwright/test';
import { endpoints } from '../config/urls';
import { BasePage } from './base.page';

export class WelcomePage extends BasePage {
  private readonly menu: Locator;

  constructor(page: Page) {
    super(page);
    this.menu = page.getByRole('heading', { level: 1 });
  }

  get url(): string {
    return endpoints.welcome;
  }

  async navigateAndWaitFor(): Promise<void> {
    await this.navigate(this.url);
    await this.waitForUrl(this.url);
  }

  getMenu(): Locator {
    return this.menu;
  }
}
