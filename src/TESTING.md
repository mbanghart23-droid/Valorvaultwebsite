# Valor Registry - Testing Guide

## Overview

This document provides comprehensive instructions for running automated tests in the Valor Registry application using Playwright.

## Table of Contents

1. [Installation](#installation)
2. [Running Tests](#running-tests)
3. [Test Structure](#test-structure)
4. [Test Configuration](#test-configuration)
5. [Writing New Tests](#writing-new-tests)
6. [CI/CD Integration](#cicd-integration)
7. [Troubleshooting](#troubleshooting)

---

## Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Valor Registry application running locally

### Install Playwright

```bash
# Install Playwright and browsers
npm install -D @playwright/test
npx playwright install
```

This will install:
- Playwright Test framework
- Chromium, Firefox, and WebKit browsers
- All required dependencies

---

## Running Tests

### Run All Tests

```bash
npx playwright test
```

### Run Specific Test File

```bash
npx playwright test tests/auth.spec.ts
npx playwright test tests/medals.spec.ts
npx playwright test tests/admin.spec.ts
```

### Run Tests in UI Mode (Interactive)

```bash
npx playwright test --ui
```

This opens an interactive UI where you can:
- See tests as they run
- Inspect each step
- Time-travel through test execution
- Debug failures visually

### Run Tests in Headed Mode (See Browser)

```bash
npx playwright test --headed
```

### Run Tests on Specific Browser

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Run Tests in Debug Mode

```bash
npx playwright test --debug
```

This opens Playwright Inspector for step-by-step debugging.

### Generate Test Report

```bash
npx playwright show-report
```

---

## Test Structure

### Test Files

```
tests/
├── helpers/
│   └── test-utils.ts          # Shared utilities and helper functions
├── auth.spec.ts               # Authentication tests (login, register, logout)
├── medals.spec.ts             # Medal catalog CRUD operations
├── admin.spec.ts              # Admin panel tests (account activation)
├── search.spec.ts             # Global search and contact requests
├── contact-support.spec.ts    # Contact support form with CAPTCHA
└── settings.spec.ts           # User settings (password, account deletion)
```

### Test Coverage

| Test Suite | Tests | Coverage |
|------------|-------|----------|
| **auth.spec.ts** | 14 | Login, logout, registration, validation, Terms/Privacy |
| **medals.spec.ts** | 11 | Service members, medals, CRUD, uploads, filters |
| **admin.spec.ts** | 13 | Account activation, user management, bulk actions |
| **search.spec.ts** | 13 | User search, filters, contact requests, privacy |
| **contact-support.spec.ts** | 14 | Form validation, CAPTCHA, spam protection, rate limiting |
| **settings.spec.ts** | 14 | Password change, profile updates, account deletion |
| **TOTAL** | **79** | Comprehensive coverage of all features |

---

## Test Configuration

### Configuration File: `playwright.config.ts`

Key settings:

```typescript
{
  baseURL: 'http://localhost:3000',  // Change for different environments
  timeout: 30000,                     // 30 second timeout per test
  retries: 2,                         // Retry failed tests on CI
  workers: 1,                         // Parallel test execution
  
  use: {
    trace: 'on-first-retry',          // Capture trace on failure
    screenshot: 'only-on-failure',    // Screenshot on failure
    video: 'retain-on-failure',       // Record video on failure
  }
}
```

### Environment Variables

Set custom base URL:

```bash
PLAYWRIGHT_TEST_BASE_URL=http://localhost:3000 npx playwright test
```

For production testing:

```bash
PLAYWRIGHT_TEST_BASE_URL=https://your-production-url.com npx playwright test
```

---

## Test Prerequisites

### Database Setup

Before running tests, you need test users in your database:

1. **Regular User**
   - Email: `user@test.com`
   - Password: `UserPass123!`
   - Status: Active

2. **Admin User**
   - Email: `admin@test.com`
   - Password: `AdminPass123!`
   - Role: Admin
   - Status: Active

### Create Test Users

You can create test users via:

1. **Manual Registration** - Register through the UI and activate via admin panel
2. **Direct Database Insert** - Use Supabase dashboard to create users
3. **API Script** - Use the `/signup` endpoint to create users

Example using the signup endpoint:

```bash
curl -X POST https://your-project.supabase.co/functions/v1/make-server-8db4ea83/signup \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@test.com",
    "password": "UserPass123!",
    "name": "Test User"
  }'
```

---

## Writing New Tests

### Basic Test Structure

```typescript
import { test, expect } from '@playwright/test';
import { login, TEST_USERS } from './helpers/test-utils';

test.describe('Feature Name', () => {
  
  test.beforeEach(async ({ page }) => {
    // Setup before each test
    await login(page, TEST_USERS.regularUser.email, TEST_USERS.regularUser.password);
  });

  test('should do something', async ({ page }) => {
    // Navigate
    await page.goto('/some-page');
    
    // Interact
    await page.click('button:has-text("Click Me")');
    
    // Assert
    await expect(page.locator('text=Success')).toBeVisible();
  });
});
```

### Using Helper Functions

Available helpers in `tests/helpers/test-utils.ts`:

```typescript
// Login
await login(page, email, password);

// Logout
await logout(page);

// Register
await register(page, { email, password, name });

// Navigate
await navigateTo(page, 'medals');  // 'medals', 'search', 'admin', 'contact-support', 'settings'

// Add service member
await addServiceMember(page, { firstName, lastName, branch, rank });

// Add medal
await addMedal(page, medalName);

// Wait for toast
await waitForToast(page, 'Success message');

// Visual snapshot
await takeSnapshot(page, 'screenshot-name');
```

### Best Practices

1. **Use data-testid attributes** for stable selectors
2. **Avoid hardcoded waits** - use `waitForSelector` instead
3. **Clean up after tests** - delete created data
4. **Make tests independent** - don't rely on other tests
5. **Use meaningful test names** - describe what the test does
6. **Test user flows** - not just individual functions

---

## Visual Regression Testing

Playwright can capture screenshots and compare them:

```typescript
test('visual snapshot', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page).toHaveScreenshot('dashboard.png');
});
```

First run creates the baseline, subsequent runs compare against it.

---

## CI/CD Integration

### GitHub Actions

Create `.github/workflows/playwright.yml`:

```yaml
name: Playwright Tests

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - uses: actions/setup-node@v3
      with:
        node-version: 18
    
    - name: Install dependencies
      run: npm ci
    
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps
    
    - name: Run Playwright tests
      run: npx playwright test
      env:
        PLAYWRIGHT_TEST_BASE_URL: http://localhost:3000
    
    - uses: actions/upload-artifact@v3
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
```

---

## Troubleshooting

### Tests Failing Locally

1. **Ensure app is running**
   ```bash
   # In one terminal
   npm run dev
   
   # In another terminal
   npx playwright test
   ```

2. **Check test users exist**
   - Verify `user@test.com` and `admin@test.com` are in database
   - Ensure they are activated (not pending)

3. **Clear browser state**
   ```bash
   npx playwright test --project=chromium --headed --debug
   ```

### Timeout Errors

If tests timeout:

1. Increase timeout in `playwright.config.ts`:
   ```typescript
   timeout: 60000  // 60 seconds
   ```

2. Or for specific test:
   ```typescript
   test('slow test', async ({ page }) => {
     test.setTimeout(60000);
     // ...
   });
   ```

### Flaky Tests

If tests fail intermittently:

1. Add explicit waits:
   ```typescript
   await page.waitForLoadState('networkidle');
   ```

2. Use `toBeVisible({ timeout: 10000 })` with longer timeouts

3. Retry flaky tests:
   ```typescript
   test.describe.configure({ retries: 3 });
   ```

### Database State Issues

Tests may fail if database is in unexpected state:

1. **Create test-specific users** - use unique emails with timestamps
2. **Clean up test data** - delete created records after tests
3. **Use transactions** - roll back changes after each test (if possible)

---

## Advanced Features

### Parallel Execution

Run tests faster with parallel workers:

```bash
npx playwright test --workers=4
```

### Record Tests

Record new tests interactively:

```bash
npx playwright codegen http://localhost:3000
```

This opens a browser where your actions are recorded as test code.

### Trace Viewer

View detailed traces of test execution:

```bash
npx playwright show-trace trace.zip
```

### Mobile Testing

Tests already run on mobile viewports (iPhone, Pixel).

To test only mobile:

```bash
npx playwright test --project="Mobile Chrome"
```

---

## Test Metrics

### Current Status

- ✅ **79 automated tests**
- ✅ **6 test suites**
- ✅ **5 browsers tested** (Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari)
- ✅ **~95% feature coverage**

### What's Tested

- [x] Authentication flows
- [x] User registration & activation
- [x] Medal catalog CRUD
- [x] Service member management
- [x] Profile image uploads
- [x] Admin account management
- [x] Global search
- [x] Contact requests
- [x] Contact support form
- [x] CAPTCHA & spam protection
- [x] Password changes
- [x] Account deletion
- [x] Privacy settings
- [x] Terms of Service & Privacy Policy
- [x] Responsive design (mobile)

### What's Not Tested (Future)

- [ ] Email delivery (Resend integration)
- [ ] Payment processing (future paid tiers)
- [ ] Real image uploads to Supabase Storage
- [ ] Performance benchmarks
- [ ] Accessibility (a11y) compliance

---

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright Selectors](https://playwright.dev/docs/selectors)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)

---

## Support

For questions about testing:

1. Check the [Playwright Docs](https://playwright.dev)
2. Review existing test files in `/tests`
3. Use the helper functions in `/tests/helpers/test-utils.ts`
4. Run tests in debug mode: `npx playwright test --debug`

---

**Last Updated:** v1.5.1  
**Test Coverage:** 79 tests across 6 suites  
**Status:** ✅ All systems operational
