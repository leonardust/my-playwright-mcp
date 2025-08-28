import { Locator, Page } from '@playwright/test';
import { logElementAction, logError, logPageAction } from '@utils/logger.js';

export abstract class BasePage {
  protected readonly page: Page;
  protected readonly pageName: string;

  constructor(page: Page, pageName: string) {
    this.page = page;
    this.pageName = pageName;
  }

  /**
   * Helper method to log element actions with selector information
   */
  protected logElementActionLocal(
    action: 'click' | 'fill' | 'check' | 'select' | 'hover' | 'focus',
    elementName: string,
    selector: string,
    value?: string
  ): void {
    logElementAction(this.pageName, action, elementName, selector, value);
  }

  async getUrl(): Promise<string> {
    try {
      const url = this.page.url();
      return url;
    } catch (error) {
      logError(error as Error, `${this.pageName}.getUrl`);
      throw error;
    }
  }

  protected async navigate(url: string): Promise<void> {
    try {
      logPageAction(this.pageName, 'Navigate to page', url);
      await this.page.goto(url);
    } catch (error) {
      logError(error as Error, `${this.pageName}.navigate`);
      throw error;
    }
  }

  async waitForUrl(url: string): Promise<void> {
    try {
      logPageAction(this.pageName, 'Wait for URL', url);
      await this.page.waitForURL(url);
    } catch (error) {
      logError(error as Error, `${this.pageName}.waitForUrl`);
      throw error;
    }
  }

  getAlert(): Locator {
    return this.page.getByRole('alert');
  }
}
