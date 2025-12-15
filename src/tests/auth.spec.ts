import { test, expect } from '@playwright/test';
import { login, logout, register, TEST_USERS } from './helpers/test-utils';

/**
 * Authentication Flow Tests
 * Tests for login, logout, registration, and account activation
 */

test.describe('Authentication', () => {
  
  test('should display landing page for non-logged in users', async ({ page }) => {
    await page.goto('/');
    
    // Check for landing page elements
    await expect(page.locator('text=Valor Registry')).toBeVisible();
    await expect(page.locator('button:has-text("Get Started")')).toBeVisible();
    await expect(page.locator('button:has-text("Sign In")')).toBeVisible();
  });

  test('should navigate to login page', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Sign In")');
    
    // Check for login form
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Sign In")');
    
    await page.fill('input[type="email"]', 'invalid@test.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // Should show error message
    await expect(page.locator('text=/invalid.*credentials|login.*failed|incorrect/i')).toBeVisible({ timeout: 5000 });
  });

  test('should successfully login with valid credentials', async ({ page }) => {
    // Note: This test requires a valid test user in the database
    // You'll need to create this user manually or via API
    await login(page, TEST_USERS.regularUser.email, TEST_USERS.regularUser.password);
    
    // Should be on dashboard
    await expect(page).toHaveURL(/dashboard/);
    await expect(page.locator('text=/dashboard|welcome/i')).toBeVisible();
  });

  test('should successfully logout', async ({ page }) => {
    // Login first
    await login(page, TEST_USERS.regularUser.email, TEST_USERS.regularUser.password);
    
    // Logout
    await logout(page);
    
    // Should be back on landing page
    await expect(page).toHaveURL('/');
    await expect(page.locator('button:has-text("Sign In")')).toBeVisible();
  });

  test('should navigate to registration page', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Get Started")');
    
    // Check for registration form
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('text=/create.*account|register|sign up/i')).toBeVisible();
  });

  test('should register a new user and show pending activation', async ({ page }) => {
    const newUser = {
      email: `test-${Date.now()}@test.com`,
      password: 'TestPass123!',
      name: 'Test User'
    };
    
    await register(page, newUser);
    
    // Should show pending activation message
    await expect(page.locator('text=/pending.*activation|awaiting.*approval|admin.*review/i')).toBeVisible();
  });

  test('should validate email format', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Get Started")');
    
    await page.fill('input[type="email"]', 'invalid-email');
    await page.fill('input[type="password"]', 'TestPass123!');
    await page.click('button[type="submit"]');
    
    // Should show validation error
    await expect(page.locator('input[type="email"]:invalid, text=/invalid.*email/i')).toBeVisible();
  });

  test('should validate password requirements', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Get Started")');
    
    await page.fill('input[type="email"]', 'test@test.com');
    await page.fill('input[type="password"]', 'weak');
    await page.click('button[type="submit"]');
    
    // Should show password validation error
    const errorVisible = await page.locator('text=/password.*requirements|password.*weak|password.*short/i').isVisible({ timeout: 3000 })
      .catch(() => false);
    
    expect(errorVisible).toBeTruthy();
  });

  test('should handle "Contact Support" link from homepage', async ({ page }) => {
    await page.goto('/');
    
    // Click contact support link
    await page.click('text=Have Questions or Suggestions?');
    
    // Should redirect to login for non-logged in users
    await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: 5000 });
  });

  test('should navigate to Terms of Service', async ({ page }) => {
    await page.goto('/');
    
    // Find and click Terms of Service link
    await page.click('text=Terms of Service, a:has-text("Terms")');
    
    // Should show terms content
    await expect(page.locator('text=/terms.*service|terms.*conditions/i')).toBeVisible();
  });

  test('should navigate to Privacy Policy', async ({ page }) => {
    await page.goto('/');
    
    // Find and click Privacy Policy link
    await page.click('text=Privacy Policy, a:has-text("Privacy")');
    
    // Should show privacy policy content
    await expect(page.locator('text=/privacy.*policy/i')).toBeVisible();
  });

  test('should show version number in footer after login', async ({ page }) => {
    await login(page, TEST_USERS.regularUser.email, TEST_USERS.regularUser.password);
    
    // Check for version number
    await expect(page.locator('text=/v\d+\.\d+\.\d+/')).toBeVisible();
  });
});
