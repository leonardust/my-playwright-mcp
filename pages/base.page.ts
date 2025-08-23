import { Locator, Page } from '@playwright/test';

export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async getUrl(): Promise<string> {
    return this.page.url();
  }

  protected async navigate(url: string): Promise<void> {
    await this.page.goto(url);
  }

  async waitForUrl(url: string): Promise<void> {
    await this.page.waitForURL(url);
  }

  getAlert(): Locator {
    return this.page.getByRole('alert');
  }
}
