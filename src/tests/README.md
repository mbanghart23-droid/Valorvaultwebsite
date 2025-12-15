# Valor Registry - Test Suite

## Overview

This directory contains comprehensive end-to-end tests for Valor Registry using Playwright.

## 📁 Structure

```
tests/
├── helpers/
│   └── test-utils.ts          # Shared helper functions
├── auth.spec.ts               # 14 tests - Authentication flows
├── medals.spec.ts             # 11 tests - Medal catalog management
├── admin.spec.ts              # 13 tests - Admin panel functionality
├── search.spec.ts             # 13 tests - Global search & contacts
├── contact-support.spec.ts    # 14 tests - Support form & CAPTCHA
├── settings.spec.ts           # 14 tests - User settings & preferences
└── README.md                  # This file
```

## 🎯 Test Coverage

### Total: 79 Tests

| Suite | Tests | What's Tested |
|-------|-------|---------------|
| **auth.spec.ts** | 14 | Login, logout, registration, validation, Terms/Privacy navigation |
| **medals.spec.ts** | 11 | Service members CRUD, medals CRUD, uploads, filters |
| **admin.spec.ts** | 13 | Account activation, user management, search, bulk actions |
| **search.spec.ts** | 13 | User search, filters, contact requests, privacy |
| **contact-support.spec.ts** | 14 | Form validation, CAPTCHA, spam protection, rate limiting |
| **settings.spec.ts** | 14 | Password change, profile updates, account deletion |

## 🚀 Quick Start

```bash
# Install Playwright
npm run test:install

# Run all tests
npm test

# Run in interactive UI mode
npm run test:ui

# Run specific suite
npm run test:auth
npm run test:medals
npm run test:admin
```

See `/QUICKSTART-TESTING.md` for detailed setup instructions.

## 🛠️ Helper Functions

The `/tests/helpers/test-utils.ts` file provides reusable functions:

### Authentication
```typescript
await login(page, email, password);
await logout(page);
await register(page, { email, password, name });
```

### Navigation
```typescript
await navigateTo(page, 'medals');     // Medal catalog
await navigateTo(page, 'search');      // Global search
await navigateTo(page, 'admin');       // Admin panel
await navigateTo(page, 'contact-support');
await navigateTo(page, 'settings');
```

### Actions
```typescript
await addServiceMember(page, { firstName, lastName, branch, rank });
await addMedal(page, medalName);
await waitForToast(page, 'Success message');
await takeSnapshot(page, 'screenshot-name');
```

### Test Users
```typescript
TEST_USERS.regularUser  // user@test.com
TEST_USERS.admin        // admin@test.com
TEST_USERS.newUser      // Generates unique email
```

## 📝 Writing New Tests

### Basic Template

```typescript
import { test, expect } from '@playwright/test';
import { login, navigateTo, TEST_USERS } from './helpers/test-utils';

test.describe('Feature Name', () => {
  
  test.beforeEach(async ({ page }) => {
    await login(page, TEST_USERS.regularUser.email, TEST_USERS.regularUser.password);
  });

  test('should do something specific', async ({ page }) => {
    // Navigate
    await navigateTo(page, 'medals');
    
    // Interact
    await page.click('button:has-text("Add Medal")');
    await page.fill('input[name="medalName"]', 'Purple Heart');
    
    // Assert
    await expect(page.locator('text=Purple Heart')).toBeVisible();
  });
});
```

### Best Practices

1. ✅ **Use descriptive test names** - "should add a medal to service member"
2. ✅ **Test user flows** - not just individual functions
3. ✅ **Use helper functions** - don't repeat login logic
4. ✅ **Clean up after tests** - delete created data
5. ✅ **Make tests independent** - don't rely on execution order
6. ✅ **Use semantic selectors** - `text=`, `:has-text()`, `role=`
7. ✅ **Avoid hardcoded waits** - use `waitForSelector()` instead

## 🔍 Debugging Tests

### Run Single Test
```bash
npx playwright test tests/auth.spec.ts
```

### Debug Mode
```bash
npm run test:debug
```
Opens Playwright Inspector for step-by-step debugging.

### Headed Mode
```bash
npm run test:headed
```
Watch tests run in a visible browser.

### UI Mode (Best for Development)
```bash
npm run test:ui
```
Interactive UI with time-travel debugging.

## 📊 Test Reports

After running tests, view the HTML report:

```bash
npm run test:report
```

The report includes:
- ✅ Pass/fail status for each test
- 📸 Screenshots of failures
- 🎥 Video recordings of failed tests
- ⏱️ Execution time per test
- 📈 Trends over time

## 🌐 Running on Different Environments

### Local Development
```bash
npm test
```
Uses `http://localhost:3000` by default.

### Staging
```bash
PLAYWRIGHT_TEST_BASE_URL=https://staging.valorregistry.com npm test
```

### Production (Smoke Tests)
```bash
PLAYWRIGHT_TEST_BASE_URL=https://valorregistry.com npm test
```

## 🤖 CI/CD Integration

Tests run automatically on:
- Push to `main` or `develop` branches
- Pull requests

See `/.github/workflows/playwright.yml` for CI configuration.

## 📚 Resources

- [Playwright Documentation](https://playwright.dev)
- [Full Testing Guide](/TESTING.md)
- [Quick Start Guide](/QUICKSTART-TESTING.md)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)

## 🐛 Common Issues

### Tests Timing Out
- Increase timeout in `playwright.config.ts`
- Check if app is running on correct port
- Verify network is not throttled

### Test Users Not Found
- Create test users: `user@test.com` and `admin@test.com`
- Ensure users are **activated** (not pending)
- Check credentials match `TEST_USERS` in `test-utils.ts`

### Flaky Tests
- Add explicit waits: `await page.waitForLoadState('networkidle')`
- Use longer timeouts: `{ timeout: 10000 }`
- Increase retries: `test.describe.configure({ retries: 3 })`

## 📞 Support

Questions about tests?
1. Check `/TESTING.md` for comprehensive guide
2. Review existing test files for examples
3. Run in debug mode: `npm run test:debug`
4. Use UI mode for exploration: `npm run test:ui`

---

**Last Updated:** v1.5.1  
**Total Tests:** 79  
**Status:** ✅ All systems operational
