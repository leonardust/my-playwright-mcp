import { endpoints } from '@config/urls.js';
import { BasePage } from '@pages/base.page.js';
import { Locator, Page } from '@playwright/test';

export class WelcomePage extends BasePage {
  private readonly menu: Locator;

  constructor(page: Page) {
    super(page, 'WelcomePage');
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
