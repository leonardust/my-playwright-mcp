# Playwright MCP

End-to-end test automation project using Playwright with Model Context Protocol (MCP) integration.

## 🎯 **IMPORTANT: Coding Standards**

**⚠️ Before making any changes to this project, read [`CODING_STANDARDS.md`](./CODING_STANDARDS.md) first!**

This document contains:

- ✅ **Complete coding conventions** for the entire project
- ✅ **TypeScript patterns** and best practices
- ✅ **Page Object Model** implementation guidelines
- ✅ **Test structure** and naming conventions
- ✅ **Import/export patterns** with TypeScript path mapping
- ✅ **Git conventions** and commit message rules

**All code in this project follows these standards strictly.** Any new code must be consistent with established patterns.

## 📋 Table of Contents

- [Coding Standards](#-important-coding-standards)
- [Project Description](#-project-description)
- [Requirements](#-requirements)
- [Installation](#-installation)
- [Project Structure](#-project-structure)
- [Configuration](#-configuration)
- [Running Tests](#-running-tests)
- [NPM Scripts](#-npm-scripts)
- [Quality Assurance](#-quality-assurance)
- [Git Hooks](#-git-hooks)
- [Development](#-development)

## 🎯 Project Description

This project contains automated end-to-end tests written in TypeScript using the Playwright framework. The project is configured with advanced tools to ensure code quality:

- **Playwright** - E2E testing framework
- **TypeScript** - Typed JavaScript
- **Faker.js** - Library for generating realistic test data
- **ESLint** - Linter for JavaScript/TypeScript
- **Prettier** - Code formatter
- **Husky** - Git hooks for automatic code checking

## 🔧 Requirements

- **Node.js** >= 18.0.0
- **npm** >= 8.0.0
- **Git** - for version control

## 🚀 Installation

### 1. Clone Repository

```bash
git clone <repository-url>
cd playwright-mcp
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Install Playwright Browsers

```bash
npx playwright install
```

### 4. Test Application Setup

The project requires the GAD GUI API Demo test application. Make sure it's cloned in the parent directory:

```bash
cd ..
git clone https://github.com/jaktestowac/gad-gui-api-demo.git
cd gad-gui-api-demo
npm install
cd ../playwright-mcp
```

## 📁 Project Structure

```
playwright-mcp/
├── config/
│   └── urls.ts              # URL configuration
├── constants/
│   └── validation.ts        # Validation constants
├── fixtures/
│   └── pages.ts            # Page object fixtures
├── pages/
│   ├── base.page.ts        # Base page object class
│   ├── login.page.ts       # Login page object
│   ├── register.page.ts    # Registration page object
│   └── welcome.page.ts     # Welcome page object
├── tests/
│   └── auth.spec.ts        # Authentication tests
├── utils/
│   ├── test-helpers.ts     # Helper functions
│   └── test-types.ts       # TypeScript types
├── .husky/
│   └── pre-commit          # Git pre-commit hook
├── eslint.config.js        # ESLint configuration
├── playwright.config.ts    # Playwright configuration
├── .prettierrc            # Prettier configuration
└── package.json           # Dependencies and scripts
```

## ⚙️ Configuration

### Playwright Configuration

The project is configured to run tests on:

- **Browser**: Chromium
- **Base URL**: `http://localhost:3000`
- **Viewport**: 1280x720
- **Screenshots**: only on failures

### ESLint Configuration

- TypeScript syntax checking
- Rules for Playwright projects
- Automatic fixing of simple errors

### Prettier Configuration

- Semicolons: enabled
- Single quotes
- Tab width: 2 spaces
- Maximum line length: 100 characters

### TypeScript Path Mapping

The project uses TypeScript path aliases for cleaner imports:

```typescript
// ✅ Use aliases instead of relative paths
import { BasePage } from '@pages/base.page.js';
import { endpoints } from '@config/urls.js';
import { generateTestUser } from '@utils/test-helpers.js';
import { ValidationConstants } from '@constants/validation.js';
```

Available aliases:

- `@pages/*` → `./pages/*`
- `@utils/*` → `./utils/*`
- `@config/*` → `./config/*`
- `@constants/*` → `./constants/*`
- `@fixtures/*` → `./fixtures/*`

## 🏃‍♂️ Running Tests

### Starting Test Application

Before running tests, you need to start the GAD GUI API Demo test application:

```bash
# Start application (in separate terminal)
npm run app:start

# Or start application in background (Windows)
npm run app:start:background

# Stop application (Windows)
npm run app:stop
```

### Running Tests

```bash
# Run all tests (application must be running)
npm run test

# Run tests in UI mode
npm run test:ui

# Run tests in headed mode (visible browser)
npm run test:headed

# Run tests in debug mode
npm run test:debug

# Run specific test
npx playwright test tests/auth.spec.ts

# Run tests with report
npx playwright test --reporter=html
```

### Developer Workflow

```bash
# Terminal 1: Start application
npm run app:start

# Terminal 2: Run tests
npm run test:ui

# Or quick startup (experimental)
npm run dev        # start app + tests
npm run dev:ui     # start app + tests UI
```

### Development Mode

```bash
# Check formatting
npm run format:check

# Auto format
npm run format

# Check ESLint
npm run lint

# Auto fix ESLint
npm run lint:fix
```

## 📜 NPM Scripts

| Script                         | Description                          |
| ------------------------------ | ------------------------------------ |
| `npm run test`                 | Run all Playwright tests             |
| `npm run test:ui`              | Run tests in UI mode                 |
| `npm run test:headed`          | Run tests with visible browser       |
| `npm run test:debug`           | Run tests in debug mode              |
| `npm run format`               | Format code with Prettier            |
| `npm run format:check`         | Check formatting without changes     |
| `npm run lint`                 | Check code with ESLint               |
| `npm run lint:fix`             | Fix ESLint issues automatically      |
| `npm run app:start`            | Start test application (foreground)  |
| `npm run app:start:background` | Start test application (background)  |
| `npm run app:stop`             | Stop test application                |
| `npm run dev`                  | Start application + tests            |
| `npm run dev:ui`               | Start application + tests in UI mode |

## 🔍 Quality Assurance

### Code Quality Tools

- **ESLint**: Static analysis for JavaScript/TypeScript code
- **Prettier**: Automatic code formatting
- **TypeScript**: Static typing

### Lint-staged Configuration

Automatic file checking before commit:

```json
{
  "*.{ts,js}": ["eslint --fix", "prettier --write"],
  "*.{json,md,yml,yaml}": ["prettier --write"]
}
```

## 🪝 Git Hooks

### Pre-commit Hook

Automatically runs before each commit:

1. **ESLint** - checks and fixes code errors
2. **Prettier** - formats code according to rules
3. **Blocks commit** if it finds unfixable errors

### Husky Configuration

```bash
# .husky/pre-commit
npx lint-staged
```

## 🛠 Development

### Adding New Tests

1. Create a new file in the `tests/` directory
2. Import needed modules using TypeScript path mapping:

   ```typescript
   import { test } from '@fixtures/pages.js';
   import { generateTestUser } from '@utils/test-helpers.js';
   ```

3. Write tests using the Page Object Model pattern

### Adding New Page Objects

1. Create a new file in the `pages/` directory
2. Extend the `BasePage` class:

   ```typescript
   import { BasePage } from '@pages/base.page.js';
   import { endpoints } from '@config/urls.js';
   ```

3. Add selectors and methods specific to the page

### Best Practices

- Use **Page Object Model** pattern
- Write **descriptive test names**
- Group tests into **logical suites**
- Use **type-safe selectors**
- Add **comments** to complex logic

### Git Conventions

**Project Rule:** We prefer simple, concise commit messages

```bash
# ✅ Preferred
feat: add Faker.js for test data generation
fix: resolve login validation issue
test: add email format validation

# ❌ Avoid
feat(test-data): implement comprehensive Faker.js library...
```

### Before Committing

Pre-commit hook automatically:

- ✅ Checks code with ESLint
- ✅ Formats code with Prettier
- ✅ Blocks commit on errors

### Troubleshooting

```bash
# Check all errors
npm run lint

# Auto fix errors
npm run lint:fix

# Format entire project
npm run format

# Check Playwright installation
npx playwright --version
```

## 📊 Reporting

Playwright generates automatic HTML reports available after running tests with `--reporter=html` flag.

## 🤝 Contributing

**⚠️ MANDATORY: Read [`CODING_STANDARDS.md`](./CODING_STANDARDS.md) before contributing!**

1. **Read** the coding standards document thoroughly
2. **Follow** all established patterns and conventions
3. **Use** TypeScript path aliases and established import patterns
4. **Maintain** consistency with existing code structure
5. **Test** your changes with `npm test`
6. **Format** code with `npm run format`
7. **Lint** code with `npm run lint:fix`

### Contribution Process

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. **Follow** coding standards from `CODING_STANDARDS.md`
4. Write tests following established patterns
5. Commit changes using simple commit messages (`git commit -m 'feat: add amazing feature'`)
6. Push to branch (`git push origin feature/amazing-feature`)
7. Open Pull Request

### Key Files for Contributors

- 📋 [`CODING_STANDARDS.md`](./CODING_STANDARDS.md) - **PRIMARY REFERENCE**
- 🤖 [`.copilot-instructions.md`](./.copilot-instructions.md) - AI Assistant guidelines
- ⚙️ [`tsconfig.json`](./tsconfig.json) - TypeScript path mapping configuration

---

**Author**: Your Name  
**License**: ISC  
**Version**: 1.0.0
