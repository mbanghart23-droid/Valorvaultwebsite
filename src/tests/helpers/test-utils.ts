import { Page, expect } from '@playwright/test';

/**
 * Shared test utilities for Valor Registry
 */

export interface TestUser {
  email: string;
  password: string;
  name: string;
}

export const TEST_USERS = {
  admin: {
    email: 'admin@test.com',
    password: 'AdminPass123!',
    name: 'Admin User'
  },
  regularUser: {
    email: 'user@test.com',
    password: 'UserPass123!',
    name: 'Regular User'
  },
  newUser: {
    email: `test-${Date.now()}@test.com`,
    password: 'NewUserPass123!',
    name: 'New Test User'
  }
};

/**
 * Login helper function
 */
export async function login(page: Page, email: string, password: string) {
  await page.goto('/');
  
  // Click Sign In button
  await page.click('button:has-text("Sign In")');
  
  // Fill in credentials
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  
  // Submit
  await page.click('button[type="submit"]:has-text("Sign In")');
  
  // Wait for navigation to dashboard
  await page.waitForURL(/dashboard/, { timeout: 10000 });
  
  // Verify we're logged in
  await expect(page.locator('h1, h2').filter({ hasText: 'Dashboard' })).toBeVisible();
}

/**
 * Logout helper function
 */
export async function logout(page: Page) {
  // Click user menu or logout button
  await page.click('button:has-text("Sign Out"), button:has-text("Logout")');
  
  // Wait for redirect to landing page
  await page.waitForURL('/', { timeout: 5000 });
}

/**
 * Register a new user
 */
export async function register(page: Page, user: TestUser) {
  await page.goto('/');
  
  // Click Get Started
  await page.click('button:has-text("Get Started")');
  
  // Fill registration form
  await page.fill('input[type="text"][placeholder*="name"], input[name="name"]', user.name);
  await page.fill('input[type="email"]', user.email);
  await page.fill('input[type="password"]', user.password);
  
  // Submit
  await page.click('button[type="submit"]:has-text("Create Account"), button:has-text("Register")');
  
  // Wait for success message or pending activation
  await expect(page.locator('text=/account.*created|pending.*activation|thank you/i')).toBeVisible({ timeout: 10000 });
}

/**
 * Navigate to a specific section from dashboard
 */
export async function navigateTo(page: Page, section: 'medals' | 'search' | 'admin' | 'contact-support' | 'settings') {
  const sectionMap = {
    'medals': 'Medal Catalog',
    'search': 'Search',
    'admin': 'Admin',
    'contact-support': 'Contact Support',
    'settings': 'Settings'
  };
  
  await page.click(`button:has-text("${sectionMap[section]}"), a:has-text("${sectionMap[section]}")`);
  await page.waitForTimeout(500); // Allow for view transition
}

/**
 * Add a service member
 */
export async function addServiceMember(page: Page, data: {
  firstName: string;
  lastName: string;
  branch?: string;
  rank?: string;
}) {
  // Click Add Service Member button
  await page.click('button:has-text("Add Service Member")');
  
  // Fill in the form
  await page.fill('input[placeholder*="First"], input[name="firstName"]', data.firstName);
  await page.fill('input[placeholder*="Last"], input[name="lastName"]', data.lastName);
  
  if (data.branch) {
    await page.selectOption('select[name="branch"], select', data.branch);
  }
  
  if (data.rank) {
    await page.fill('input[placeholder*="Rank"], input[name="rank"]', data.rank);
  }
  
  // Submit
  await page.click('button[type="submit"]:has-text("Add"), button:has-text("Create")');
  
  // Wait for success
  await expect(page.locator(`text=${data.firstName} ${data.lastName}`)).toBeVisible({ timeout: 5000 });
}

/**
 * Add a medal to a service member
 */
export async function addMedal(page: Page, medalName: string) {
  // Click Add Medal button
  await page.click('button:has-text("Add Medal")');
  
  // Search and select medal
  await page.fill('input[placeholder*="Search"], input[type="search"]', medalName);
  await page.click(`text=${medalName}`);
  
  // Save
  await page.click('button:has-text("Save"), button:has-text("Add")');
  
  // Wait for success
  await expect(page.locator(`text=${medalName}`)).toBeVisible({ timeout: 5000 });
}

/**
 * Wait for toast notification
 */
export async function waitForToast(page: Page, message?: string) {
  if (message) {
    await expect(page.locator(`[role="status"]:has-text("${message}"), .toast:has-text("${message}")`))
      .toBeVisible({ timeout: 5000 });
  } else {
    await expect(page.locator('[role="status"], .toast'))
      .toBeVisible({ timeout: 5000 });
  }
}

/**
 * Take a visual snapshot for regression testing
 */
export async function takeSnapshot(page: Page, name: string) {
  await expect(page).toHaveScreenshot(`${name}.png`, {
    fullPage: true,
    maxDiffPixels: 100
  });
}
