import { LoginPage } from '@pages/login.page.js';
import { RegisterPage } from '@pages/register.page.js';
import { WelcomePage } from '@pages/welcome.page.js';
import { test as base } from '@playwright/test';
import { setWorkerContext } from '@utils/logger.js';

type Pages = {
  registerPage: RegisterPage;
  loginPage: LoginPage;
  welcomePage: WelcomePage;
};

export const test = base.extend<Pages>({
  registerPage: async ({ page }, use, testInfo) => {
    // Set worker context for logging
    setWorkerContext({
      workerId: testInfo.parallelIndex.toString(),
      workerIndex: testInfo.parallelIndex,
    });
    await use(new RegisterPage(page));
  },
  loginPage: async ({ page }, use, testInfo) => {
    setWorkerContext({
      workerId: testInfo.parallelIndex.toString(),
      workerIndex: testInfo.parallelIndex,
    });
    await use(new LoginPage(page));
  },
  welcomePage: async ({ page }, use, testInfo) => {
    setWorkerContext({
      workerId: testInfo.parallelIndex.toString(),
      workerIndex: testInfo.parallelIndex,
    });
    await use(new WelcomePage(page));
  },
});
