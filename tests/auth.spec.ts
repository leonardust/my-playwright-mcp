import { test, expect, Page } from '@playwright/test';
import { generateTestUser } from '../utils/test-helpers';

test.describe('Authentication Module', () => {
  test.describe.serial('Positive Authentication Flow', () => {
    const testUser = generateTestUser();

    test('should successfully register a new user', async ({ page }) => {
      // Arrange
      const registrationPage = 'http://localhost:3000/register.html';
      const registerForm = {
        firstName: page.getByTestId('firstname-input'),
        lastName: page.getByTestId('lastname-input'),
        email: page.getByTestId('email-input'),
        password: page.getByTestId('password-input'),
        submitButton: page.getByTestId('register-button'),
      };

      // Act
      await page.goto(registrationPage);
      await registerForm.firstName.fill(testUser.firstName);
      await registerForm.lastName.fill(testUser.lastName);
      await registerForm.email.fill(testUser.email);
      await registerForm.password.fill(testUser.password);
      await registerForm.submitButton.click();

      // Assert
      await expect(page.getByRole('alert')).toHaveText('User created');
    });

    test('should successfully login with newly created user', async ({ page }) => {
      // Arrange
      const loginPage = 'http://localhost:3000/login/';
      const loginForm = {
        email: page.getByRole('textbox', { name: 'Enter User Email' }),
        password: page.getByRole('textbox', { name: 'Enter Password' }),
        submitButton: page.getByRole('button', { name: 'LogIn' }),
      };
      const welcomePage = {
        url: 'http://localhost:3000/welcome',
        menu: page.getByRole('heading', { level: 1 }),
      };

      // Act
      await page.goto(loginPage);
      await loginForm.email.fill(testUser.email);
      await loginForm.password.fill(testUser.password);
      await loginForm.submitButton.click();

      // Assert
      await expect(page).toHaveURL(welcomePage.url);
      await expect(welcomePage.menu).toContainText('GAD');
    });
  });

  test.describe('Registration Validation Tests', () => {
    const registrationPage = 'http://localhost:3000/register.html';
    const errorClass = /octavalidate-inp-error/;
    const getRegisterForm = (page: Page) => ({
      firstName: page.getByTestId('firstname-input'),
      lastName: page.getByTestId('lastname-input'),
      email: page.getByTestId('email-input'),
      password: page.getByTestId('password-input'),
      submitButton: page.getByTestId('register-button'),
    });

    test('should validate empty form fields', async ({ page }) => {
      // Arrange
      const registerForm = getRegisterForm(page);

      // Act
      await page.goto(registrationPage);
      await registerForm.submitButton.click();

      // Assert
      await expect(registerForm.firstName).toHaveClass(errorClass);
      await expect(registerForm.lastName).toHaveClass(errorClass);
      await expect(registerForm.email).toHaveClass(errorClass);
      await expect(registerForm.password).toHaveClass(errorClass);
    });

    test('should validate invalid email format', async ({ page }) => {
      // Arrange
      const registerForm = getRegisterForm(page);
      const invalidEmail = 'invalid-email';

      // Act
      await page.goto(registrationPage);
      await registerForm.firstName.fill('John');
      await registerForm.lastName.fill('Doe');
      await registerForm.email.fill(invalidEmail);
      await registerForm.password.fill('Password123!');
      await registerForm.submitButton.click();

      // Assert
      await expect(registerForm.email).toHaveAttribute('octavalidate', /EMAIL/);
      await expect(registerForm.email).toHaveClass(errorClass);
    });

    test('should validate non-alpha characters in name fields', async ({ page }) => {
      // Arrange
      const registerForm = getRegisterForm(page);

      // Act
      await page.goto(registrationPage);
      await registerForm.firstName.fill('John123');
      await registerForm.lastName.fill('Doe456');
      await registerForm.email.fill('test@example.com');
      await registerForm.password.fill('Password123!');
      await registerForm.submitButton.click();

      // Assert
      await expect(registerForm.firstName).toHaveAttribute('octavalidate', 'R,ALPHA_ONLY');
      await expect(registerForm.firstName).toHaveClass(errorClass);
      await expect(registerForm.lastName).toHaveAttribute('octavalidate', 'R,SURNAME');
      await expect(registerForm.lastName).toHaveClass(errorClass);
    });
  });
});
