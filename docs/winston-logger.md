# Winston Logger Documentation

## Overview

This project uses Winston for structured logging during Playwright tests. The logger provides different log levels and outputs to both console and files.

## Configuration

### Log Levels

- **error**: Error messages with stack traces
- **warn**: Warning messages
- **info**: General information (default in CI)
- **debug**: Detailed debug information (default in development)

### Environment Variables

- `LOG_LEVEL`: Override default log level
- `DEBUG_LOGS`: Enable logs in test environment
- `CI`: Automatically detected, affects default log level

## Usage Examples

### Import Logger

```typescript
import { logger, logTestStep, logPageAction, logError } from '@utils/logger.js';
```

### Test Logging

```typescript
test('should login successfully', async ({ loginPage }) => {
  logTestStep('Login attempt', 'Authentication Test');

  await loginPage.login('user@example.com', 'password');

  logTestStep('Login completed successfully');
});
```

### Page Object Logging

```typescript
export class LoginPage extends BasePage {
  async login(email: string, password: string): Promise<void> {
    logPageAction(this.pageName, 'Login attempt', `Email: ${email}`);

    await this.email.fill(email);
    await this.password.fill(password);
    await this.submitButton.click();

    logPageAction(this.pageName, 'Login form submitted');
  }
}
```

### Error Logging

```typescript
try {
  await this.page.locator('.element').click();
} catch (error) {
  logError(error as Error, 'Element click failed');
  throw error;
}
```

### Direct Logger Usage

```typescript
logger.info('Test started');
logger.debug('Debug information');
logger.warn('Warning message');
logger.error('Error occurred', { context: 'additional data' });
```

## Log Output

### Console Output

- **Development**: Colorized, human-readable format
- **CI**: Plain text, structured format
- **Test**: Silent unless `DEBUG_LOGS=true`

### File Output

- `test-results/test-logs.log`: All logs (info level and above)
- `test-results/error-logs.log`: Error logs only
- JSON format for easy parsing

## Integration with BasePage

All Page Objects automatically inherit logging capabilities:

- Navigation actions are logged
- URL changes are tracked
- Errors are automatically captured with context

## Best Practices

1. **Use specific log functions**: Prefer `logTestStep`, `logPageAction` over direct logger
2. **Include context**: Add relevant details like email, page name, action type
3. **Log test boundaries**: Mark test start/end and major steps
4. **Don't log sensitive data**: Avoid passwords, tokens in logs
5. **Use appropriate levels**: Debug for detailed info, Info for test flow, Error for failures

## Example Test Flow

```typescript
test('User registration and login', async ({ registerPage, loginPage }) => {
  const testUser = generateTestUser();

  logTestStep('Starting user registration', 'User Flow Test');
  logger.info(`Generated test user: ${testUser.email}`);

  await registerPage.registerUser(testUser);
  logTestStep('User registration completed');

  logTestStep('Starting user login');
  await loginPage.login(testUser.email, testUser.password);
  logTestStep('User login completed');
});
```
