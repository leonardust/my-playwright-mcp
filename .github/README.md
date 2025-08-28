# GitHub Actions for Playwright MCP

This project contains GitHub Actions workflows for test automation and CI/CD with GAD application.

## Available Workflows

### 1. **CI - Tests & Quality** (`.github/workflows/ci.yml`)

- **Trigger**: Push and PR on `main` branch
- **Features**:
  - ✅ Code quality checks (ESLint + Prettier)
  - 🧪 E2E Playwright tests with Docker GAD
  - 📊 Test report generation
  - 📤 Upload artifacts (reports + results)

### 2. **Deploy Test Reports** (`.github/workflows/deploy-reports.yml`)

- **Trigger**: Push to `main` or manual trigger
- **Features**:
  - 🏃 Runs tests with HTML report
  - 🌐 Publishes reports to GitHub Pages
  - 📊 Available at: `https://<username>.github.io/<repo-name>/`

## Configuration

### To enable GitHub Pages

1. Go to Settings → Pages
2. Select "GitHub Actions" as source
3. Save settings

### Environment variables

- `CI=true` - automatically set in GitHub Actions
- `GITHUB_TOKEN` - automatically available

## Artifacts

Each workflow saves:

- **playwright-report/** - HTML test reports
- **test-results/** - detailed test results in JSON and XML format

Artifacts are stored for 10 days and can be downloaded from the Actions tab.

## Local testing

Before pushing, you can check locally:

```bash
# Check formatting
npm run format:check

# Run linting
npm run lint

# Run tests
npm test

# Generate report
npm run test:report
```

## Troubleshooting

### Tests fail in CI but work locally

- Check if application is running (Docker service in workflow)
- Verify timeouts - CI might be slower
- Check screen resolution differences

### No access to GitHub Pages

- Check permissions in Settings → Actions → General
- Make sure Pages are enabled in Settings → Pages

### Docker GAD service issues

- Check if GAD service started properly (check logs)
- Verify port 3000 is available
- Ensure BASE_URL is correct
