# Coding Standards

This document defines coding standards for the Playwright MCP project. Following these rules ensures consistency, readability, and maintainability of the code.

## 📋 Table of Contents

- [General Rules](#general-rules)
- [TypeScript Standards](#typescript-standards)
- [Playwright Test Standards](#playwright-test-standards)
- [Page Object Model](#page-object-model)
- [Naming Conventions](#naming-conventions)
- [Code Formatting](#code-formatting)
- [Comments and Documentation](#comments-and-documentation)
- [Import and Export](#import-and-export)
- [Error Handling](#error-handling)
- [Git Conventions](#git-conventions)
- [Code Review](#code-review)

## 🎯 General Rules

### ✅ Basic Rules

- **Code should be readable** - write code as if a human, not a computer, will read it
- **Consistency** - follow established patterns throughout the project
- **Simplicity** - choose the simplest solution that works
- **DRY (Don't Repeat Yourself)** - avoid code duplication
- **KISS (Keep It Simple, Stupid)** - simplicity above all

### 🚫 Forbidden Practices

- ❌ Using `any` without justification
- ❌ Commenting out code instead of deleting it
- ❌ Long functions (>50 lines)
- ❌ Global variables
- ❌ Magic numbers without explanation

## 🔧 TypeScript Standards

### Type Definitions (Based on Current Code)

```typescript
// ✅ Interface definitions (from current project)
export interface TestUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

// ✅ Const assertions for immutable objects
export const ValidationConstants = {
  ERROR_CLASS: /octavalidate-inp-error/,
  VALIDATION_ATTRIBUTE: 'octavalidate',
  VALIDATION_RULES: {
    EMAIL: 'R,EMAIL',
    ALPHA_ONLY: 'R,ALPHA_ONLY',
    SURNAME: 'R,SURNAME',
  },
} as const;

// ✅ Using Faker.js for realistic test data generation
import { faker } from '@faker-js/faker';

export const generateTestUser = (): TestUser => ({
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email({ provider: 'example.com' }),
  password: 'TestPassword123!',
});
```

### Class Patterns

```typescript
// ✅ Abstract base class pattern (from project)
export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Protected methods for internal use
  protected async navigate(url: string): Promise<void> {
    await this.page.goto(url);
  }

  // Public interface methods
  async getUrl(): Promise<string> {
    return this.page.url();
  }

  async waitForUrl(url: string): Promise<void> {
    await this.page.waitForURL(url);
  }

  getAlert(): Locator {
    return this.page.getByRole('alert');
  }
}

// ✅ Concrete implementation
export class RegisterPage extends BasePage {
  private readonly firstName: Locator;
  private readonly lastName: Locator;

  constructor(page: Page) {
    super(page);
    // Initialize locators in constructor
    this.firstName = page.getByTestId('firstname-input');
    this.lastName = page.getByTestId('lastname-input');
  }

  get url(): string {
    return endpoints.register;
  }

  async fillForm(data: TestUser): Promise<void> {
    await this.firstName.fill(data.firstName);
    await this.lastName.fill(data.lastName);
  }
}
```

### Import/Export Patterns

```typescript
// ✅ Named exports (preferred in this project)
export class RegisterPage extends BasePage {}
export const ValidationConstants = {} as const;
export interface TestUser {}

// ✅ Import patterns from project using TypeScript path mapping
import { Locator, Page } from '@playwright/test';
import { endpoints } from '@config/urls.js';
import { BasePage } from '@pages/base.page.js';
import { TestUser } from '@utils/test-types.js';

// ✅ Re-exports for convenience
export { TestUser } from '@utils/test-types.js';
export { ValidationConstants } from '@constants/validation.js';
```

### Method Signatures

```typescript
// ✅ Async methods with Promise return types
async goto(): Promise<void> {
  await this.navigate(this.url);
}

async fillForm(data: TestUser): Promise<void> {
  // implementation
}

// ✅ Sync methods with explicit types
get url(): string {
  return endpoints.register;
}

getAlert(): Locator {
  return this.page.getByRole('alert');
}

// ✅ Utility functions with Faker.js for realistic data
import { faker } from '@faker-js/faker';

const generateName = (): string => faker.person.firstName();
```

### Type Safety Best Practices

```typescript
// ✅ Strict null checks compliance
async getErrorMessage(): Promise<string> {
  return await this.errorMessage.textContent() ?? '';
}

// ✅ Type guards when needed
if (user && user.email) {
  await this.login(user.email, user.password);
}

// ✅ Proper optional chaining
const userName = user?.firstName ?? 'Anonymous';

// ✅ Type assertions only when necessary
const config = data as PlaywrightConfig;
```

## 🎭 Playwright Test Standards

### Test Structure (Based on Current Implementation)

```typescript
// ✅ Current project structure
import { expect } from '@playwright/test';
import { test } from '@fixtures/pages.js'; // Custom fixture
import { generateTestUser } from '@utils/test-helpers.js';
import { ValidationConstants } from '@constants/validation.js';

test.describe('Authentication Module', () => {
  test.describe.serial('Positive Authentication Flow', () => {
    // ✅ Shared test data for serial tests
    const testUser = generateTestUser();

    test('should successfully register a new user', async ({ registerPage }) => {
      // Arrange - using generated test data

      // Act - high-level page object method
      await registerPage.registerUser(testUser);

      // Assert - specific expectation
      await expect(registerPage.getAlert()).toHaveText('User created');
    });

    test('should successfully login with newly created user', async ({
      loginPage,
      welcomePage,
    }) => {
      // Act
      await loginPage.login(testUser.email, testUser.password);

      // Assert - multiple expectations
      await welcomePage.waitForUrl(welcomePage.url);
      await expect(welcomePage.getMenu()).toContainText('GAD');
    });
  });

  test.describe('Registration Validation Tests', () => {
    test('should validate empty form fields', async ({ registerPage }) => {
      // Act
      await registerPage.goto();
      await registerPage.submit();

      // Assert - using constants for validation
      await expect(registerPage.getFirstNameInput()).toHaveClass(ValidationConstants.ERROR_CLASS);
      await expect(registerPage.getLastNameInput()).toHaveClass(ValidationConstants.ERROR_CLASS);
      await expect(registerPage.getEmailInput()).toHaveClass(ValidationConstants.ERROR_CLASS);
      await expect(registerPage.getPasswordInput()).toHaveClass(ValidationConstants.ERROR_CLASS);
    });
  });
});
```

### Test Organization Patterns

```typescript
// ✅ Serial tests for dependent scenarios
test.describe.serial('User Registration Flow', () => {
  const testUser = generateTestUser();
  // Tests that depend on each other
});

// ✅ Parallel tests for independent scenarios
test.describe('Form Validation', () => {
  // Independent validation tests
});

// ✅ Custom fixtures usage
async ({ registerPage, loginPage, welcomePage }) => {
  // Multiple page objects available from fixtures
};
```

### Test Data Management

```typescript
// ✅ Current project patterns
// Utility functions for test data generation using Faker.js
import { faker } from '@faker-js/faker';

export const generateTestUser = (): TestUser => ({
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email({ provider: 'example.com' }),
  password: 'TestPassword123!',
});

// ✅ Type-safe test data
interface TestUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
```

#### Faker.js Best Practices

```typescript
// ✅ Consistent data with specific provider
const email = faker.internet.email({ provider: 'example.com' });

// ✅ Data localization (optional)
faker.locale = 'pl';
const polishName = faker.person.firstName();

// ✅ Seed for repeatable tests (optional)
faker.seed(123);
const reproducibleData = faker.person.firstName();

// ✅ Other useful generators
const phoneNumber = faker.phone.number();
const address = faker.location.streetAddress();
const company = faker.company.name();
const birthDate = faker.date.birthdate({ min: 18, max: 99, mode: 'age' });
```

### Constants Usage

```typescript
// ✅ Validation constants pattern from project
export const ValidationConstants = {
  ERROR_CLASS: /octavalidate-inp-error/,
  VALIDATION_ATTRIBUTE: 'octavalidate',
  VALIDATION_RULES: {
    EMAIL: 'R,EMAIL',
    ALPHA_ONLY: 'R,ALPHA_ONLY',
    SURNAME: 'R,SURNAME',
  },
} as const;

// ✅ Usage in tests
await expect(element).toHaveClass(ValidationConstants.ERROR_CLASS);
```

### Test Naming Conventions

```typescript
// ✅ Correct test names (from current project)
test('should successfully register a new user');
test('should successfully login with newly created user');
test('should validate empty form fields');
test('should validate invalid email format');

// ✅ Describe block naming
test.describe('Authentication Module');
test.describe('Registration Validation Tests');
test.describe.serial('Positive Authentication Flow');
```

### Assertions Best Practices

```typescript
// ✅ Specific text matching
await expect(registerPage.getAlert()).toHaveText('User created');

// ✅ URL assertions with regex for flexibility
await expect(page).toHaveURL(/\/dashboard$/);

// ✅ Class assertions with regex patterns
await expect(input).toHaveClass(ValidationConstants.ERROR_CLASS);

// ✅ Content matching with partial text
await expect(welcomePage.getMenu()).toContainText('GAD');

// ✅ Element state assertions
await expect(submitButton).toBeDisabled();
await expect(errorMessage).toBeVisible();
```

## 🏗 Page Object Model

### Base Page Structure

````typescript
## 🏗 Page Object Model

### Base Page Structure

```typescript
// ✅ Correct Page Object based on actual code
export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Protected methods for shared functionality
  protected async navigate(url: string): Promise<void> {
    await this.page.goto(url);
  }

  // Public methods with explicit return types
  async getUrl(): Promise<string> {
    return this.page.url();
  }

  async waitForUrl(url: string): Promise<void> {
    await this.page.waitForURL(url);
  }

  // Common UI elements
  getAlert(): Locator {
    return this.page.getByRole('alert');
  }
}

// ✅ Page Object implementation for specific page
export class RegisterPage extends BasePage {
  // Private readonly locators as properties
  private readonly firstName: Locator;
  private readonly lastName: Locator;
  private readonly email: Locator;
  private readonly password: Locator;
  private readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    // Initialize locators in constructor
    this.firstName = page.getByTestId('firstname-input');
    this.lastName = page.getByTestId('lastname-input');
    this.email = page.getByTestId('email-input');
    this.password = page.getByTestId('password-input');
    this.submitButton = page.getByTestId('register-button');
  }

  // Concrete getter for URL (non-abstract in actual code)
  get url(): string {
    return endpoints.register;
  }

  // Public navigation method
  async goto(): Promise<void> {
    await this.navigate(this.url);
  }

  // Atomic actions with typed parameters
  async fillForm(data: TestUser): Promise<void> {
    await this.firstName.fill(data.firstName);
    await this.lastName.fill(data.lastName);
    await this.email.fill(data.email);
    await this.password.fill(data.password);
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  // High-level actions combining atomic operations
  async registerUser(data: TestUser): Promise<void> {
    await this.goto();
    await this.fillForm(data);
    await this.submit();
  }

  // Getters for external access when needed
  getFirstNameInput(): Locator {
    return this.firstName;
  }

  getLastNameInput(): Locator {
    return this.lastName;
  }

  getEmailInput(): Locator {
    return this.email;
  }

  getPasswordInput(): Locator {
    return this.password;
  }
}
```

### Selector Strategy (Based on Current Code)

```typescript
// ✅ Current project uses getByTestId() - most preferred
page.getByTestId('firstname-input');
page.getByTestId('register-button');

// ✅ Role-based selectors for semantic elements
page.getByRole('alert');
page.getByRole('button', { name: 'Submit' });

// ✅ CSS selectors only for specific cases
page.locator('.octavalidate-inp-error');

// ❌ Avoid in this project:
page.locator('input[name="firstName"]'); // Use getByTestId instead
page.locator('div:nth-child(3)'); // Fragile selectors
```

### Page Object Patterns

```typescript
// ✅ Pattern: Private locators, public methods
export class LoginPage extends BasePage {
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;

  // Getters for external access when needed
  getEmailInput(): Locator {
    return this.emailInput;
  }

  // High-level business methods
  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}

// ✅ Pattern: Typed parameters using interfaces
interface LoginCredentials {
  email: string;
  password: string;
}

async login(credentials: LoginCredentials): Promise<void> {
  // implementation
}
```

### Selector Strategy

```typescript
// ✅ Priority order for selectors:
// 1. data-testid (most preferred)
'[data-testid="submit-button"]';

// 2. ARIA attributes
'[aria-label="Submit form"]';

// 3. Semantic HTML
'button[type="submit"]';

// 4. CSS classes (only if stable)
'.submit-btn';

// ❌ Avoid:
'div > p:nth-child(3)'; // Fragile selectors
'#element-123456'; // Generated IDs
````

## 📝 Naming Conventions

### Files and Directories (Based on Current Project)

```text
✅ Correct file names (from project):
- register.page.ts
- login.page.ts
- base.page.ts
- auth.spec.ts
- test-helpers.ts
- test-types.ts
- validation.ts
- urls.ts

✅ Directory structure:
- pages/ (Page Object classes)
- tests/ (Test specification files)
- utils/ (Utility functions and types)
- constants/ (Application constants)
- config/ (Configuration files)
- fixtures/ (Test fixtures)

❌ Incorrect file names:
- RegisterPage.ts
- authTests.ts
- Helpers.ts
```

### Classes and Interfaces (From Current Code)

```typescript
// ✅ Correct naming from project
class RegisterPage extends BasePage {}
class LoginPage extends BasePage {}
abstract class BasePage {}

interface TestUser {}
interface LoginCredentials {}

// ✅ Constants naming
const ValidationConstants = {} as const;
export const endpoints = {} as const;

// ❌ Incorrect naming
class registerPage {}
interface testUser {}
const validationConstants = {};
```

### Variables and Functions (Current Patterns)

```typescript
// ✅ Correct naming from project
const testUser = generateTestUser();
const firstName = faker.person.firstName();
const email = faker.internet.email({ provider: 'example.com' });
const ERROR_CLASS = /octavalidate-inp-error/;

// ✅ Method naming patterns
async goto(): Promise<void> {}
async fillForm(data: TestUser): Promise<void> {}
async registerUser(data: TestUser): Promise<void> {}
getAlert(): Locator {}
getUrl(): Promise<string> {}

// ✅ Test naming (current examples)
test('should successfully register a new user');
test('should validate empty form fields');
test('should validate invalid email format');

// ✅ Describe block naming
test.describe('Authentication Module');
test.describe('Registration Validation Tests');
test.describe.serial('Positive Authentication Flow');
```

### Selector and TestId Naming

```typescript
// ✅ TestId patterns from project
'firstname-input';
'lastname-input';
'email-input';
'password-input';
'register-button';
'login-button';

// ✅ Consistent kebab-case for test IDs
page.getByTestId('firstname-input');
page.getByTestId('submit-button');
page.getByTestId('error-message');

// ❌ Inconsistent naming
('firstName_Input');
('Register-Button');
('errorMsg');
```

### Constants Naming

```typescript
// ✅ Current project patterns
export const ValidationConstants = {
  ERROR_CLASS: /octavalidate-inp-error/,
  VALIDATION_ATTRIBUTE: 'octavalidate',
  VALIDATION_RULES: {
    EMAIL: 'R,EMAIL',
    ALPHA_ONLY: 'R,ALPHA_ONLY',
    SURNAME: 'R,SURNAME',
  },
} as const;

// ✅ URL configuration
export const endpoints = {
  login: '/login',
  register: '/register',
  welcome: '/welcome',
} as const;
```

## 🎨 Code Formatting

### Prettier Configuration

The project uses Prettier with the following configuration:

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "avoid"
}
```

### Code Style Examples

```typescript
// ✅ Correct formatting
const userConfig = {
  name: 'John Doe',
  email: 'john@example.com',
  preferences: {
    theme: 'dark',
    notifications: true,
  },
};

const processUser = async (user: User): Promise<ProcessedUser> => {
  const validatedUser = await validateUser(user);
  return transformUser(validatedUser);
};

// Array destructuring
const [firstName, lastName] = fullName.split(' ');

// Object destructuring
const { id, name, email } = user;
```

## 📚 Comments and Documentation

### JSDoc Comments

```typescript
/**
 * Authenticates user with provided credentials
 * @param email - User's email address
 * @param password - User's password
 * @returns Promise that resolves when authentication is complete
 * @throws {AuthenticationError} When credentials are invalid
 */
async function authenticateUser(email: string, password: string): Promise<void> {
  // Implementation
}
```

### Inline Comments

```typescript
// ✅ Good - explains "why", not "what"
// Wait for animation to complete before proceeding
await page.waitForTimeout(500);

// Retry mechanism for flaky network requests
const maxRetries = 3;

// ❌ Bad - describes obvious
// Set user name to John
const userName = 'John';

// ❌ Bad - comment instead of refactoring
// This is a hack, but it works
// TODO: fix this later
```

### TODO Comments

```typescript
// ✅ Correct TODO
// TODO(username): Add validation for email format - Issue #123
// FIXME: Handle edge case when user has no permissions
// NOTE: This workaround is needed for Safari compatibility

// ❌ Incorrect TODO
// TODO: fix this
// HACK: quick fix
```

## 📦 Import and Export

### Import Order (Based on Current Code)

```typescript
// ✅ Current project patterns

// 1. External libraries
import { test as base } from '@playwright/test';
import { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

// 2. Internal modules - config
import { endpoints } from '@config/urls.js';

// 3. Internal modules - constants
import { ValidationConstants } from '@constants/validation.js';

// 4. Internal modules - utilities
import { generateTestUser } from '@utils/test-helpers.js';
import { TestUser } from '@utils/test-types.js';

// 5. Internal modules - pages
import { BasePage } from '@pages/base.page.js';
import { RegisterPage } from '@pages/register.page.js';
import { LoginPage } from '@pages/login.page.js';

// 6. Custom fixtures
import { test } from '@fixtures/pages.js';
```

### Export Patterns (Current Project)

```typescript
// ✅ Named exports (preferred in project)
export class RegisterPage extends BasePage {}
export class LoginPage extends BasePage {}
export abstract class BasePage {}

export interface TestUser {}
export const ValidationConstants = {} as const;
export const endpoints = {} as const;

// ✅ Utility function exports with Faker.js
export const generateTestUser = (): TestUser => ({
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email({ provider: 'example.com' }),
  password: 'TestPassword123!',
});

// ✅ Re-exports pattern
export { TestUser } from './test-types';
```

### Fixtures Pattern (From Current Code)

```typescript
// ✅ Custom test fixtures implementation
import { test as base } from '@playwright/test';
import { RegisterPage } from '@pages/register.page.js';
import { LoginPage } from '@pages/login.page.js';
import { WelcomePage } from '@pages/welcome.page.js';

type Pages = {
  registerPage: RegisterPage;
  loginPage: LoginPage;
  welcomePage: WelcomePage;
};

export const test = base.extend<Pages>({
  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  welcomePage: async ({ page }, use) => {
    await use(new WelcomePage(page));
  },
});

// ✅ Usage in tests
import { test } from '@fixtures/pages.js';

test('should successfully register a new user', async ({ registerPage, loginPage }) => {
  // Multiple page objects available
});
```

## ⚠️ Error Handling

### Test Error Handling

```typescript
// ✅ Specific error assertions
await test.step('Login should fail with invalid credentials', async () => {
  await expect(async () => {
    await loginPage.login('invalid@email.com', 'wrongpassword');
  }).toThrow('Authentication failed');
});

// ✅ Soft assertions for multiple checks
await test.step('Verify form validation', async () => {
  await expect.soft(emailError).toBeVisible();
  await expect.soft(passwordError).toBeVisible();
  await expect.soft(submitButton).toBeDisabled();
});
```

### Page Object Error Handling

```typescript
// ✅ Proper error handling in Page Objects
async function waitForElement(selector: string, timeout = 5000): Promise<void> {
  try {
    await this.page.locator(selector).waitFor({ timeout });
  } catch (error) {
    throw new Error(`Element ${selector} not found within ${timeout}ms: ${error.message}`);
  }
}
```

## 🔄 Git Conventions

### Commit Messages

#### Project Rule: We prefer simple, concise commit messages

Format: `type: brief description`

```bash
# ✅ Preferred in this project - simple and concise
feat: add Faker.js for test data generation
fix: resolve login validation issue
test: add email format validation
docs: update README with Faker.js info
refactor: simplify test helpers

# ✅ Optionally with scope (if needed)
feat(auth): add password reset functionality
fix(login): resolve session timeout issue

# ❌ Avoid overly detailed commits
feat(test-data): implement Faker.js library for realistic test data generation with firstName, lastName and email fields replacing previous randomString and uniqueEmail functions while maintaining backward compatibility and updating all related documentation

# ❌ Incorrect commit messages
fix login
added tests
update
wip
```

### Commit Types

- **feat**: new functionality
- **fix**: bug fix
- **test**: adding or modifying tests
- **refactor**: code refactoring
- **docs**: documentation changes
- **style**: formatting changes, no logic changes
- **chore**: dependency updates, configuration

### Branch Naming

```bash
# ✅ Correct branch names
feature/user-authentication
fix/login-session-timeout
test/email-validation
refactor/page-object-structure

# ❌ Incorrect branch names
login-fix
test-branch
my-changes
```

## 👥 Code Review

### Review Checklist

#### ✅ What to Check

- [ ] Code meets all standards from this document
- [ ] Tests cover new functionality
- [ ] No hardcoded values (uses constants/configuration)
- [ ] Error handling is implemented
- [ ] Performance considerations are addressed
- [ ] Security best practices are followed
- [ ] Documentation is updated

#### 🔍 Questions for Task

- Is the code readable and understandable?
- Is the business logic correctly implemented?
- Are there potential edge cases?
- Are tests comprehensive and stable?
- Can the code be easily maintained and extended?

### Review Comments

```typescript
// ✅ Constructive comments
// Consider extracting this logic into a helper function for reusability
// This selector might be fragile - consider using data-testid instead
// Great implementation! This makes the code much more readable

// ❌ Unhelpful comments
// This is wrong
// Change this
// I don't like this approach
```

## 🚀 Performance Guidelines

### Test Performance

```typescript
// ✅ Optimize test execution
// Use page.goto() with waitUntil option
await page.goto('/login', { waitUntil: 'networkidle' });

// Reuse browser contexts when possible
test.describe.configure({ mode: 'parallel' });

// Use specific locators
await page.locator('[data-testid="submit-btn"]').click();

// ❌ Avoid slow patterns
await page.waitForTimeout(5000); // Use specific waits instead
await page.locator('div').nth(5).click(); // Fragile and slow
```

### Code Performance

```typescript
// ✅ Efficient patterns
const users = await Promise.all(userIds.map(id => fetchUser(id)));

// ✅ Proper error boundaries
const result = await page.evaluate(() => {
  try {
    return window.someGlobalFunction();
  } catch (error) {
    return null;
  }
});
```

## 📋 Checklist przed merge

- [ ] All tests pass
- [ ] ESLint and Prettier report no errors
- [ ] Code review has been conducted
- [ ] Documentation has been updated
- [ ] Commit messages follow conventions
- [ ] Branch jest up-to-date z main
- [ ] Performance impact has been evaluated

---

## 🔧 Automated Tools

This project uses the following tools to enforce standards:

- **ESLint** - automatic code quality checking
- **Prettier** - automatyczne formatowanie
- **Husky** - git hooks for pre-commit checks
- **lint-staged** - running tools only on changed files

All these tools work automatically with every commit.

---

**Remember**: These standards are a living document. If you have suggestions for improvements, create an issue or pull request! 🚀
