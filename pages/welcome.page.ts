import { Locator, Page } from '@playwright/test';
import { endpoints } from '../config/urls';
import { BasePage } from './base.page';

export class WelcomePage extends BasePage {
  private readonly menu: Locator;
  private static readonly _url = endpoints.welcome;

  static get url(): string {
    return this._url;
  }

  constructor(page: Page) {
    super(page);
    this.menu = page.getByRole('heading', { level: 1 });
  }

  async navigateAndWaitFor(): Promise<void> {
    await this.navigate(WelcomePage.url);
    await this.waitForUrl(WelcomePage.url);
  }

  getMenu(): Locator {
    return this.menu;
  }
}
