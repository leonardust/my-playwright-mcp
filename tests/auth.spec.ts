import { expect } from '@playwright/test';
import { test } from '../fixtures/pages';
import { generateTestUser } from '../utils/test-helpers';
import { WelcomePage } from '../pages/welcome.page';

test.describe('Authentication Module', () => {
  test.describe.serial('Positive Authentication Flow', () => {
    const testUser = generateTestUser();

    test('should successfully register a new user', async ({ page, registerPage }) => {
      // Arrange

      // Act
      await registerPage.registerUser(testUser);

      // Assert
      await expect(registerPage.getAlert()).toHaveText('User created');
    });

    test('should successfully login with newly created user', async ({
      loginPage,
      welcomePage,
    }) => {
      // Arrange

      // Act
      await loginPage.login(testUser.email, testUser.password);

      // Assert
      await welcomePage.waitForUrl(welcomePage.url);
      await expect(welcomePage.getMenu()).toContainText('GAD');
    });
  });

  test.describe('Registration Validation Tests', () => {
    const errorClass = /octavalidate-inp-error/;

    test('should validate empty form fields', async ({ registerPage }) => {
      // Arrange

      // Act
      await registerPage.goto();
      await registerPage.submit();

      // Assert
      await expect(registerPage.getFirstNameInput()).toHaveClass(errorClass);
      await expect(registerPage.getLastNameInput()).toHaveClass(errorClass);
      await expect(registerPage.getEmailInput()).toHaveClass(errorClass);
      await expect(registerPage.getPasswordInput()).toHaveClass(errorClass);
    });

    test('should validate invalid email format', async ({ registerPage }) => {
      // Arrange
      const invalidEmail = 'invalid-email';
      const testData = {
        firstName: 'John',
        lastName: 'Doe',
        email: invalidEmail,
        password: 'Password123!',
      };

      // Act
      await registerPage.registerUser(testData);

      // Assert
      await expect(registerPage.getEmailInput()).toHaveAttribute('octavalidate', /EMAIL/);
      await expect(registerPage.getEmailInput()).toHaveClass(errorClass);
    });

    test('should validate non-alpha characters in name fields', async ({ registerPage }) => {
      // Arrange
      const testData = {
        firstName: 'John123',
        lastName: 'Doe456',
        email: 'test@example.com',
        password: 'Password123!',
      };

      // Act
      await registerPage.registerUser(testData);

      // Assert
      await expect(registerPage.getFirstNameInput()).toHaveAttribute(
        'octavalidate',
        'R,ALPHA_ONLY'
      );
      await expect(registerPage.getFirstNameInput()).toHaveClass(errorClass);
      await expect(registerPage.getLastNameInput()).toHaveAttribute('octavalidate', 'R,SURNAME');
      await expect(registerPage.getLastNameInput()).toHaveClass(errorClass);
    });
  });
});
