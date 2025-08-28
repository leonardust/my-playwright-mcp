# GitHub Secrets and Variables Configuration

This project uses Docker service for testing, so **no GitHub Secrets or Variables are required** for basic functionality.

## Current Setup

The workflows use:

- **Docker GAD service** - automatically provides test environment
- **Generated test users** - faker.js creates random users for each test
- **Fixed BASE_URL** - always `http://localhost:3000` in CI (Docker service)

## Optional Configuration

If you want to customize the setup, you can optionally add:

### `BASE_URL`

- **Description**: Application URL for testing
- **Default value**: `http://localhost:3000`
- **Examples**:
  - `https://staging.example.com` (for staging environment)
  - `https://demo.jaktestowac.pl` (for demo environment)

## How to add Secret/Variable

1. **Secrets**:
   - Click **New repository secret**
   - Enter name (e.g. `USER_EMAIL`)
   - Enter value
   - Click **Add secret**

2. **Variables**:
   - Click **New repository variable**
   - Enter name (e.g. `BASE_URL`)
   - Enter value
   - Click **Add variable**

## Test Environment

Workflows use Docker service with `jaktestowac/gad:latest` image, which automatically starts GAD application on port 3000.

### Local Development with .env file

For local development, you can use a `.env` file instead of setting environment variables manually:

1. Copy `.env.example` to `.env`:

   ```bash
   cp .env.example .env
   ```

2. Edit `.env` file with your values:

   ```properties
   BASE_URL=http://localhost:3000
   USER_EMAIL=test@example.com
   USER_PASSWORD=password123
   ```

3. The environment variables will be automatically loaded when running tests locally.

### Local testing

Workflows use Docker service with `jaktestowac/gad:latest` image, which automatically starts GAD application on port 3000.

If you want to run tests locally:

```bash
# Run GAD application locally
docker run -p 3000:3000 jaktestowac/gad:latest

# In another terminal run tests
npm test
```

### Changing test environment

If you want to test against different environment, set `BASE_URL` variable:

```bash
# Example with different environment
BASE_URL=https://staging.example.com npm test
```

## Configuration verification

After adding secrets and variables:

1. Go to **Actions** in repository
2. Run workflow manually (workflow_dispatch)
3. Check logs - you should see success on "Check GAD status" step

## Troubleshooting

### Error "Context access might be invalid"

This is just a linter warning - workflow will work correctly.

### GAD connection error

Check if:

- GAD service started properly (check logs)
- Port 3000 is available
- BASE_URL is correct
