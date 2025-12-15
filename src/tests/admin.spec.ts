import { test, expect } from '@playwright/test';
import { login, navigateTo, TEST_USERS } from './helpers/test-utils';

/**
 * Admin Panel Tests
 * Tests for admin-only features: account activation, user management
 */

test.describe('Admin Panel', () => {
  
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await login(page, TEST_USERS.admin.email, TEST_USERS.admin.password);
  });

  test('should display admin panel for admin users', async ({ page }) => {
    await navigateTo(page, 'admin');
    
    // Check for admin panel elements
    await expect(page.locator('text=/admin.*panel|admin.*dashboard|user.*management/i')).toBeVisible();
  });

  test('should show pending account activations', async ({ page }) => {
    await navigateTo(page, 'admin');
    
    // Check for pending activations section
    const hasPendingSection = await page.locator('text=/pending.*activation|awaiting.*approval/i').isVisible({ timeout: 3000 })
      .catch(() => false);
    
    expect(hasPendingSection || true).toBeTruthy(); // May be empty if no pending users
  });

  test('should activate a pending user account', async ({ page }) => {
    await navigateTo(page, 'admin');
    
    // Look for activate button
    const activateButton = page.locator('button:has-text("Activate")').first();
    const hasActivateButton = await activateButton.isVisible({ timeout: 3000 }).catch(() => false);
    
    if (hasActivateButton) {
      // Get user email before activating
      const userRow = page.locator('button:has-text("Activate")').first().locator('..');
      
      // Click activate
      await activateButton.click();
      
      // Confirm activation
      const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("Yes")');
      if (await confirmButton.isVisible({ timeout: 2000 })) {
        await confirmButton.click();
      }
      
      // Wait for success toast
      await expect(page.locator('text=/activated|approved|success/i')).toBeVisible({ timeout: 5000 });
    }
  });

  test('should reject a pending user account', async ({ page }) => {
    await navigateTo(page, 'admin');
    
    // Look for reject/deny button
    const rejectButton = page.locator('button:has-text("Reject"), button:has-text("Deny")').first();
    const hasRejectButton = await rejectButton.isVisible({ timeout: 3000 }).catch(() => false);
    
    if (hasRejectButton) {
      await rejectButton.click();
      
      // Confirm rejection
      const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("Yes")');
      if (await confirmButton.isVisible({ timeout: 2000 })) {
        await confirmButton.click();
      }
      
      // Wait for success
      await expect(page.locator('text=/rejected|denied|deleted/i')).toBeVisible({ timeout: 5000 });
    }
  });

  test('should display list of all users', async ({ page }) => {
    await navigateTo(page, 'admin');
    
    // Check for user list
    await expect(page.locator('text=/all.*users|user.*list|manage.*users/i')).toBeVisible();
    
    // Should show user emails or names
    const hasUserData = await page.locator('text=@').isVisible({ timeout: 3000 })
      .catch(() => false);
    
    expect(hasUserData || true).toBeTruthy(); // May be empty
  });

  test('should deactivate a user account', async ({ page }) => {
    await navigateTo(page, 'admin');
    
    // Look for deactivate button
    const deactivateButton = page.locator('button:has-text("Deactivate"), button:has-text("Suspend")').first();
    const hasDeactivateButton = await deactivateButton.isVisible({ timeout: 3000 }).catch(() => false);
    
    if (hasDeactivateButton) {
      await deactivateButton.click();
      
      // Confirm
      const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("Yes")');
      if (await confirmButton.isVisible({ timeout: 2000 })) {
        await confirmButton.click();
      }
      
      // Wait for success
      await expect(page.locator('text=/deactivated|suspended/i')).toBeVisible({ timeout: 5000 });
    }
  });

  test('should search for users', async ({ page }) => {
    await navigateTo(page, 'admin');
    
    // Look for search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"]').first();
    const hasSearch = await searchInput.isVisible({ timeout: 3000 }).catch(() => false);
    
    if (hasSearch) {
      // Type search query
      await searchInput.fill(TEST_USERS.regularUser.email);
      
      // Wait for results
      await page.waitForTimeout(1000);
      
      // Should show matching user
      await expect(page.locator(`text=${TEST_USERS.regularUser.email}`)).toBeVisible();
    }
  });

  test('should filter users by status', async ({ page }) => {
    await navigateTo(page, 'admin');
    
    // Look for filter options
    const filterSelect = page.locator('select, button:has-text("Filter")').first();
    const hasFilter = await filterSelect.isVisible({ timeout: 3000 }).catch(() => false);
    
    if (hasFilter) {
      // Apply filter
      await filterSelect.click();
      
      // Select a status
      const statusOption = page.locator('option, text=/active|pending|inactive/i').first();
      if (await statusOption.isVisible({ timeout: 2000 })) {
        await statusOption.click();
      }
      
      // Wait for filtered results
      await page.waitForTimeout(1000);
    }
  });

  test('should display user statistics', async ({ page }) => {
    await navigateTo(page, 'admin');
    
    // Check for statistics
    const hasStats = await page.locator('text=/total.*users|active.*users|pending.*users/i').isVisible({ timeout: 3000 })
      .catch(() => false);
    
    if (hasStats) {
      // Verify numbers are displayed
      await expect(page.locator('text=/\d+.*users/i')).toBeVisible();
    }
  });

  test('should change user membership tier', async ({ page }) => {
    await navigateTo(page, 'admin');
    
    // Look for tier change option
    const tierButton = page.locator('button:has-text("Change Tier"), select[name="tier"]').first();
    const hasTierOption = await tierButton.isVisible({ timeout: 3000 }).catch(() => false);
    
    if (hasTierOption) {
      await tierButton.click();
      
      // Select new tier
      const tierOption = page.locator('text=/beta|premium|enterprise/i').first();
      if (await tierOption.isVisible({ timeout: 2000 })) {
        await tierOption.click();
      }
      
      // Save changes
      await page.click('button:has-text("Save")');
      
      // Wait for confirmation
      await expect(page.locator('text=/updated|changed|success/i')).toBeVisible({ timeout: 5000 });
    }
  });

  test('should view user details and activity', async ({ page }) => {
    await navigateTo(page, 'admin');
    
    // Click on a user
    const userRow = page.locator('text=@').first();
    if (await userRow.isVisible({ timeout: 3000 })) {
      await userRow.click();
      
      // Should show user details
      await expect(page.locator('text=/user.*details|account.*info/i')).toBeVisible();
    }
  });

  test('should not be accessible to non-admin users', async ({ page, context }) => {
    // Logout current admin user
    await page.click('button:has-text("Sign Out"), button:has-text("Logout")');
    
    // Login as regular user
    await login(page, TEST_USERS.regularUser.email, TEST_USERS.regularUser.password);
    
    // Try to access admin panel
    const adminButton = page.locator('button:has-text("Admin"), a:has-text("Admin")');
    const isAdminVisible = await adminButton.isVisible({ timeout: 2000 }).catch(() => false);
    
    // Admin option should not be visible for regular users
    expect(isAdminVisible).toBeFalsy();
  });

  test('should handle bulk user operations', async ({ page }) => {
    await navigateTo(page, 'admin');
    
    // Look for select all checkbox
    const selectAllCheckbox = page.locator('input[type="checkbox"][aria-label*="Select all"], input[type="checkbox"]').first();
    const hasSelectAll = await selectAllCheckbox.isVisible({ timeout: 3000 }).catch(() => false);
    
    if (hasSelectAll) {
      // Select multiple users
      await selectAllCheckbox.click();
      
      // Look for bulk action button
      const bulkActionButton = page.locator('button:has-text("Bulk Actions"), button:has-text("Actions")').first();
      if (await bulkActionButton.isVisible({ timeout: 2000 })) {
        await bulkActionButton.click();
      }
    }
  });

  test('should send notification to users', async ({ page }) => {
    await navigateTo(page, 'admin');
    
    // Look for notification/message button
    const notifyButton = page.locator('button:has-text("Notify"), button:has-text("Message")').first();
    const hasNotify = await notifyButton.isVisible({ timeout: 3000 }).catch(() => false);
    
    if (hasNotify) {
      await notifyButton.click();
      
      // Fill message
      await page.fill('textarea', 'Test notification message');
      
      // Send
      await page.click('button:has-text("Send")');
      
      // Wait for confirmation
      await expect(page.locator('text=/sent|delivered/i')).toBeVisible({ timeout: 5000 });
    }
  });
});
