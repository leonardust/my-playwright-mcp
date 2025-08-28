import { ValidationConstants } from '@constants/validation.js';
import { test } from '@fixtures/pages.js';
import { expect } from '@playwright/test';
import { logAssertion } from '@utils/logger.js';
import { generateTestUser } from '@utils/test-helpers.js';
import { TestUser } from '@utils/test-types.js';

test.describe('Authentication Module', () => {
  test.describe.serial('Positive Authentication Flow', () => {
    let testUser: TestUser;

    test('should successfully register a new user', async ({ registerPage }) => {
      // Arrange
      testUser = generateTestUser();

      // Act
      await registerPage.registerUser(testUser);

      // Assert
      logAssertion('Verify user creation message', 'Registration');
      await expect(registerPage.getAlert()).toHaveText('User created');
      logAssertion('User registration validation passed', 'Registration');
    });

    test('should successfully login with newly created user', async ({
      loginPage,
      welcomePage,
    }) => {
      // Arrange

      // Act
      await loginPage.login(testUser.email, testUser.password);

      // Assert
      logAssertion('Verify redirect to welcome page', 'Login');
      await welcomePage.waitForUrl(welcomePage.url);
      logAssertion('Verify GAD menu is visible', 'Welcome Page');
      await expect(welcomePage.getMenu()).toContainText('GAD');
      logAssertion('Login flow validation passed', 'Welcome Page');
    });
  });

  test.describe('Registration Validation Tests', () => {
    test('should validate empty form fields', async ({ registerPage }) => {
      // Arrange

      // Act
      await registerPage.goto();
      await registerPage.submit();

      // Assert
      logAssertion('Verify validation errors for empty fields', 'Form Validation');
      await expect(registerPage.getFirstNameInput()).toHaveClass(ValidationConstants.ERROR_CLASS);
      await expect(registerPage.getLastNameInput()).toHaveClass(ValidationConstants.ERROR_CLASS);
      await expect(registerPage.getEmailInput()).toHaveClass(ValidationConstants.ERROR_CLASS);
      await expect(registerPage.getPasswordInput()).toHaveClass(ValidationConstants.ERROR_CLASS);
      logAssertion('Empty fields validation passed', 'Form Validation');
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
      logAssertion('Verify email validation for invalid format', 'Email Validation');
      await expect(registerPage.getEmailInput()).toHaveAttribute(
        ValidationConstants.VALIDATION_ATTRIBUTE,
        ValidationConstants.VALIDATION_RULES.EMAIL
      );
      await expect(registerPage.getEmailInput()).toHaveClass(ValidationConstants.ERROR_CLASS);
      logAssertion('Email format validation passed', 'Email Validation');
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
      logAssertion('Verify name field validation for non-alpha characters', 'Name Validation');
      await expect(registerPage.getFirstNameInput()).toHaveAttribute(
        ValidationConstants.VALIDATION_ATTRIBUTE,
        ValidationConstants.VALIDATION_RULES.ALPHA_ONLY
      );
      await expect(registerPage.getFirstNameInput()).toHaveClass(ValidationConstants.ERROR_CLASS);
      await expect(registerPage.getLastNameInput()).toHaveAttribute(
        ValidationConstants.VALIDATION_ATTRIBUTE,
        ValidationConstants.VALIDATION_RULES.SURNAME
      );
      await expect(registerPage.getLastNameInput()).toHaveClass(ValidationConstants.ERROR_CLASS);
      logAssertion('Name field validation passed', 'Name Validation');
    });
  });
});
