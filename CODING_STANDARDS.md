# Coding Standards

Ten dokument definiuje standardy kodowania dla projektu Playwright MCP. Przestrzeganie tych zasad zapewnia spójność, czytelność i łatwość utrzymania kodu.

## 📋 Spis treści

- [Ogólne zasady](#ogólne-zasady)
- [TypeScript Standards](#typescript-standards)
- [Playwright Test Standards](#playwright-test-standards)
- [Page Object Model](#page-object-model)
- [Nazewnictwo](#nazewnictwo)
- [Formatowanie kodu](#formatowanie-kodu)
- [Komentarze i dokumentacja](#komentarze-i-dokumentacja)
- [Import i Export](#import-i-export)
- [Error Handling](#error-handling)
- [Git Conventions](#git-conventions)
- [Code Review](#code-review)

## 🎯 Ogólne zasady

### ✅ Podstawowe reguły

- **Kod powinien być czytelny** - pisz kod tak, jakby czytał go człowiek, nie komputer
- **Konsystencja** - przestrzegaj ustalonych wzorców w całym projekcie
- **Prostota** - wybierz najprostsze rozwiązanie, które działa
- **DRY (Don't Repeat Yourself)** - unikaj duplikacji kodu
- **KISS (Keep It Simple, Stupid)** - prostota ponad wszystko

### 🚫 Zakazane praktyki

- ❌ Używanie `any` bez uzasadnienia
- ❌ Komentowanie kodu zamiast jego usunięcia
- ❌ Długie funkcje (>50 linii)
- ❌ Globalne zmienne
- ❌ Magiczne liczby bez wyjaśnienia

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

  // Abstract members for implementation in subclasses
  abstract get url(): string;

  // Protected methods for internal use
  protected async navigate(url: string): Promise<void> {
    await this.page.goto(url);
  }

  // Public interface methods
  async getUrl(): Promise<string> {
    return this.page.url();
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

// ✅ Import patterns from project
import { Locator, Page } from '@playwright/test';
import { endpoints } from '../config/urls';
import { BasePage } from './base.page';
import { TestUser } from './test-types';

// ✅ Re-exports for convenience
export { TestUser } from './test-types';
export { ValidationConstants } from '../constants/validation';
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
// ✅ Aktualna struktura z projektu
import { expect } from '@playwright/test';
import { test } from '../fixtures/pages'; // Custom fixture
import { generateTestUser } from '../utils/test-helpers';
import { ValidationConstants } from '../constants/validation';

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
// ✅ Aktualne wzorce z projektu
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
// ✅ Konsistentne dane z konkretnym providerem
const email = faker.internet.email({ provider: 'example.com' });

// ✅ Lokalizacja danych (opcjonalne)
faker.locale = 'pl';
const polishName = faker.person.firstName();

// ✅ Seed dla powtarzalnych testów (opcjonalne)
faker.seed(123);
const reproducibleData = faker.person.firstName();

// ✅ Inne przydatne generatory
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
// ✅ Poprawne nazwy testów (z aktualnego projektu)
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
// ✅ Poprawny Page Object bazujący na rzeczywistym kodzie
export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Abstract getter dla URL (implementowany w klasach pochodnych)
  abstract get url(): string;

  // Protected metody dla wspólnej funkcjonalności
  protected async navigate(url: string): Promise<void> {
    await this.page.goto(url);
  }

  // Public metody z explicit return types
  async getUrl(): Promise<string> {
    return this.page.url();
  }

  async waitForUrl(url: string): Promise<void> {
    await this.page.waitForURL(url);
  }

  // Wspólne elementy UI
  getAlert(): Locator {
    return this.page.getByRole('alert');
  }
}

// ✅ Implementacja Page Object dla konkretnej strony
export class RegisterPage extends BasePage {
  // Private readonly locators jako properties
  private readonly firstName: Locator;
  private readonly lastName: Locator;
  private readonly email: Locator;
  private readonly password: Locator;
  private readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    // Inicjalizacja locatorów w konstruktorze
    this.firstName = page.getByTestId('firstname-input');
    this.lastName = page.getByTestId('lastname-input');
    this.email = page.getByTestId('email-input');
    this.password = page.getByTestId('password-input');
    this.submitButton = page.getByTestId('register-button');
  }

  // Implementation of abstract getter
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
}
````

### Selector Strategy (Based on Current Code)

```typescript
// ✅ Current project używa getByTestId() - najbardziej preferowane
page.getByTestId('firstname-input');
page.getByTestId('register-button');

// ✅ Role-based selectors dla semantic elements
page.getByRole('alert');
page.getByRole('button', { name: 'Submit' });

// ✅ CSS selectors tylko dla specific cases
page.locator('.octavalidate-inp-error');

// ❌ Unikaj w tym projekcie:
page.locator('input[name="firstName"]'); // Użyj getByTestId zamiast
page.locator('div:nth-child(3)'); // Fragile selectors
```

### Page Object Patterns

```typescript
// ✅ Pattern: Private locators, public methods
export class LoginPage extends BasePage {
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;

  // Getters dla external access when needed
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

````

### Selector Strategy

```typescript
// ✅ Priority order dla selektorów:
// 1. data-testid (najbardziej preferowane)
'[data-testid="submit-button"]';

// 2. ARIA attributes
'[aria-label="Submit form"]';

// 3. Semantic HTML
'button[type="submit"]';

// 4. CSS classes (tylko jeśli są stabilne)
'.submit-btn';

// ❌ Unikaj:
'div > p:nth-child(3)'; // Fragile selectors
'#element-123456'; // Generated IDs
````

## 📝 Nazewnictwo

### Files and Directories (Based on Current Project)

```
✅ Poprawne nazwy plików (z projektu):
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

❌ Niepoprawne nazwy plików:
- RegisterPage.ts
- authTests.ts
- Helpers.ts
```

### Classes and Interfaces (From Current Code)

```typescript
// ✅ Poprawne nazewnictwo z projektu
class RegisterPage extends BasePage {}
class LoginPage extends BasePage {}
abstract class BasePage {}

interface TestUser {}
interface LoginCredentials {}

// ✅ Constants naming
const ValidationConstants = {} as const;
export const endpoints = {} as const;

// ❌ Niepoprawne nazewnictwo
class registerPage {}
interface testUser {}
const validationConstants = {};
```

### Variables and Functions (Current Patterns)

```typescript
// ✅ Poprawne nazewnictwo z projektu
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

## 🎨 Formatowanie kodu

### Prettier Configuration

Projekt używa Prettier z następującą konfiguracją:

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
// ✅ Poprawne formatowanie
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

## 📚 Komentarze i dokumentacja

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
// ✅ Dobrze - wyjaśnia "dlaczego", nie "co"
// Wait for animation to complete before proceeding
await page.waitForTimeout(500);

// Retry mechanism for flaky network requests
const maxRetries = 3;

// ❌ Źle - opisuje oczywiste
// Set user name to John
const userName = 'John';

// ❌ Źle - komentarz zamiast refactoringu
// This is a hack, but it works
// TODO: fix this later
```

### TODO Comments

```typescript
// ✅ Poprawne TODO
// TODO(username): Add validation for email format - Issue #123
// FIXME: Handle edge case when user has no permissions
// NOTE: This workaround is needed for Safari compatibility

// ❌ Niepoprawne TODO
// TODO: fix this
// HACK: quick fix
```

## 📦 Import i Export

### Import Order (Based on Current Code)

```typescript
// ✅ Aktualne wzorce z projektu

// 1. External libraries
import { test as base } from '@playwright/test';
import { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

// 2. Internal modules - config
import { endpoints } from '../config/urls';

// 3. Internal modules - constants
import { ValidationConstants } from '../constants/validation';

// 4. Internal modules - utilities
import { generateTestUser } from '../utils/test-helpers';
import { TestUser } from '../utils/test-types';

// 5. Internal modules - pages
import { BasePage } from './base.page';
import { RegisterPage } from '../pages/register.page';
import { LoginPage } from '../pages/login.page';

// 6. Custom fixtures
import { test } from '../fixtures/pages';
```

### Export Patterns (Current Project)

```typescript
// ✅ Named exports (preferred w projekcie)
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
import { RegisterPage } from '../pages/register.page';
import { LoginPage } from '../pages/login.page';
import { WelcomePage } from '../pages/welcome.page';

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
import { test } from '../fixtures/pages';

test('should register user', async ({ registerPage, loginPage }) => {
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

#### Zasada projektu: Preferujemy proste, zwięzłe commit messages

Format: `type: brief description`

```bash
# ✅ Preferowane w tym projekcie - proste i zwięzłe
feat: add Faker.js for test data generation
fix: resolve login validation issue
test: add email format validation
docs: update README with Faker.js info
refactor: simplify test helpers

# ✅ Opcjonalnie z scope (jeśli potrzebne)
feat(auth): add password reset functionality
fix(login): resolve session timeout issue

# ❌ Unikaj zbyt szczegółowych commitów
feat(test-data): implement Faker.js library for realistic test data generation with firstName, lastName and email fields replacing previous randomString and uniqueEmail functions while maintaining backward compatibility and updating all related documentation

# ❌ Niepoprawne commit messages
fix login
added tests
update
wip
```

### Commit Types

- **feat**: nowa funkcjonalność
- **fix**: naprawa błędu
- **test**: dodanie lub modyfikacja testów
- **refactor**: refaktoryzacja kodu
- **docs**: zmiany w dokumentacji
- **style**: formatowanie, bez zmian logiki
- **chore**: aktualizacja zależności, konfiguracji

### Branch Naming

```bash
# ✅ Poprawne nazwy branchy
feature/user-authentication
fix/login-session-timeout
test/email-validation
refactor/page-object-structure

# ❌ Niepoprawne nazwy branchy
login-fix
test-branch
my-changes
```

## 👥 Code Review

### Review Checklist

#### ✅ Co sprawdzać:

- [ ] Kod spełnia wszystkie standardy z tego dokumentu
- [ ] Testy pokrywają nową funkcjonalność
- [ ] Brak hardcoded values (używa konstant/konfiguracji)
- [ ] Error handling jest implementowane
- [ ] Performance considerations zostały uwzględnione
- [ ] Security best practices są przestrzegane
- [ ] Documentation jest zaktualizowana

#### 🔍 Pytania do zadania:

- Czy kod jest czytelny i zrozumiały?
- Czy logika biznesowa jest poprawnie zaimplementowana?
- Czy są potencjalne edge cases?
- Czy testy są comprehensive i stable?
- Czy kod można łatwo utrzymać i rozszerzyć?

### Review Comments

```typescript
// ✅ Konstruktywne komentarze
// Consider extracting this logic into a helper function for reusability
// This selector might be fragile - consider using data-testid instead
// Great implementation! This makes the code much more readable

// ❌ Niepomocne komentarze
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

- [ ] Wszystkie testy przechodzą
- [ ] ESLint i Prettier nie zgłaszają błędów
- [ ] Code review został przeprowadzony
- [ ] Dokumentacja została zaktualizowana
- [ ] Commit messages przestrzegają konwencji
- [ ] Branch jest up-to-date z main
- [ ] Performance impact został oceniony

---

## 🔧 Narzędzia automatyczne

Ten projekt używa następujących narzędzi do egzekwowania standardów:

- **ESLint** - automatyczne sprawdzanie jakości kodu
- **Prettier** - automatyczne formatowanie
- **Husky** - git hooks dla pre-commit sprawdzeń
- **lint-staged** - uruchamianie narzędzi tylko na zmienionych plikach

Wszystkie te narzędzia działają automatycznie podczas każdego commita.

---

**Pamiętaj**: Te standardy to żywy dokument. Jeśli masz sugestie ulepszeń, stwórz issue lub pull request! 🚀
