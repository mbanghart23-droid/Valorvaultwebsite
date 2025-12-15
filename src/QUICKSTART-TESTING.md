# 🚀 Quick Start - Playwright Testing

Get up and running with automated tests in 5 minutes!

## Step 1: Install Playwright

```bash
npm install
npm run test:install
```

This installs Playwright and all browser dependencies.

## Step 2: Create Test Users

You need two test users in your database:

### Regular User
- **Email:** `user@test.com`
- **Password:** `UserPass123!`
- **Status:** Active (not pending)

### Admin User
- **Email:** `admin@test.com`
- **Password:** `AdminPass123!`
- **Role:** Admin
- **Status:** Active (not pending)

**Create these users** via:
1. Register through the UI → Activate via admin panel, OR
2. Use Supabase dashboard → Insert directly into `auth.users`, OR
3. Call the `/signup` endpoint → Activate manually

## Step 3: Start Your App

```bash
# Make sure your app is running on http://localhost:3000
npm run dev
```

## Step 4: Run Tests

### Run All Tests (Recommended First Time)

```bash
npm test
```

This runs all 79 tests across all browsers.

### Run Tests in UI Mode (Interactive)

```bash
npm run test:ui
```

**This is the best way to explore tests!** You can:
- See each test as it runs
- Step through actions
- Inspect the page at each step
- Debug failures visually

### Run Specific Test Suite

```bash
npm run test:auth       # Authentication tests
npm run test:medals     # Medal catalog tests
npm run test:admin      # Admin panel tests
npm run test:search     # Search functionality
npm run test:contact    # Contact support form
npm run test:settings   # User settings
```

### Run in Headed Mode (See the Browser)

```bash
npm run test:headed
```

Watch the tests run in a real browser window.

## Step 5: View Test Report

```bash
npm run test:report
```

Opens a detailed HTML report showing:
- ✅ Passed tests
- ❌ Failed tests
- 📸 Screenshots of failures
- 🎥 Video recordings
- 📊 Test duration stats

---

## Common Commands

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests |
| `npm run test:ui` | Interactive UI mode |
| `npm run test:headed` | Watch tests run in browser |
| `npm run test:debug` | Debug mode (step-by-step) |
| `npm run test:chromium` | Chrome only |
| `npm run test:firefox` | Firefox only |
| `npm run test:webkit` | Safari only |
| `npm run test:mobile` | Mobile browsers only |
| `npm run test:report` | View HTML report |

---

## What Gets Tested?

✅ **Authentication** (14 tests)
- Login, logout, registration
- Password validation
- Email verification
- Terms & Privacy links

✅ **Medal Catalog** (11 tests)
- Add/edit/delete service members
- Add/edit/delete medals
- Profile image uploads
- Filters and search

✅ **Admin Panel** (13 tests)
- Activate/reject pending users
- Manage user accounts
- User search and filters
- Bulk operations

✅ **Global Search** (13 tests)
- Search users by name/email
- Filter by branch
- Contact requests
- Privacy controls

✅ **Contact Support** (14 tests)
- Form validation
- CAPTCHA verification
- Spam protection (honeypot)
- Rate limiting
- Email to admins

✅ **User Settings** (14 tests)
- Change password
- Update profile
- Privacy settings
- Account deletion

**Total: 79 comprehensive tests** 🎉

---

## Troubleshooting

### ❌ Tests are failing

**Check:**
1. Is your app running on `http://localhost:3000`?
2. Do test users exist in database?
3. Are test users **activated** (not pending)?

### ❌ "Cannot find test users"

Create test users:
- `user@test.com` (regular user)
- `admin@test.com` (admin user)

Activate them via admin panel.

### ❌ Timeout errors

Some tests may need more time. Edit `playwright.config.ts`:

```typescript
timeout: 60000  // Increase to 60 seconds
```

### 🐛 Need to debug a specific test?

```bash
npm run test:debug tests/auth.spec.ts
```

This opens Playwright Inspector where you can step through line by line.

---

## Next Steps

📖 **Read the full guide:** `/TESTING.md`

🎓 **Learn Playwright:** https://playwright.dev/docs/intro

🔧 **Write custom tests:** Check `/tests/helpers/test-utils.ts` for helper functions

---

## Quick Example: Writing a New Test

```typescript
import { test, expect } from '@playwright/test';
import { login, TEST_USERS } from './helpers/test-utils';

test('my custom test', async ({ page }) => {
  // Login
  await login(page, TEST_USERS.regularUser.email, TEST_USERS.regularUser.password);
  
  // Navigate
  await page.goto('/my-page');
  
  // Interact
  await page.click('button:has-text("Click Me")');
  
  // Assert
  await expect(page.locator('text=Success')).toBeVisible();
});
```

Save to `/tests/my-test.spec.ts` and run:

```bash
npx playwright test tests/my-test.spec.ts
```

---

**Happy Testing! 🎭**

Questions? Check `/TESTING.md` for comprehensive documentation.
