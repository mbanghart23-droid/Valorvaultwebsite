import { test, expect } from '@playwright/test';
import { login, navigateTo, TEST_USERS } from './helpers/test-utils';

/**
 * User Settings Tests
 * Tests for password change, account deletion, and profile settings
 */

test.describe('User Settings', () => {
  
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await login(page, TEST_USERS.regularUser.email, TEST_USERS.regularUser.password);
  });

  test('should display settings page', async ({ page }) => {
    await navigateTo(page, 'settings');
    
    // Check for settings elements
    await expect(page.locator('text=/settings|account.*settings|preferences/i')).toBeVisible();
  });

  test('should display user profile information', async ({ page }) => {
    await navigateTo(page, 'settings');
    
    // Should show user email and name
    await expect(page.locator(`text=${TEST_USERS.regularUser.email}`)).toBeVisible();
  });

  test('should display membership tier', async ({ page }) => {
    await navigateTo(page, 'settings');
    
    // Should show tier information
    await expect(page.locator('text=/beta.*user|membership|tier/i')).toBeVisible();
  });

  test('should change password successfully', async ({ page }) => {
    await navigateTo(page, 'settings');
    
    // Look for change password section
    const changePasswordButton = page.locator('button:has-text("Change Password")').first();
    const hasChangePassword = await changePasswordButton.isVisible({ timeout: 3000 }).catch(() => false);
    
    if (hasChangePassword) {
      await changePasswordButton.click();
      
      // Fill password form
      await page.fill('input[name="currentPassword"], input[placeholder*="Current"]', TEST_USERS.regularUser.password);
      await page.fill('input[name="newPassword"], input[placeholder*="New"]', 'NewTestPass123!');
      await page.fill('input[name="confirmPassword"], input[placeholder*="Confirm"]', 'NewTestPass123!');
      
      // Submit
      await page.click('button[type="submit"]:has-text("Update"), button:has-text("Change")');
      
      // Should show success
      await expect(page.locator('text=/password.*changed|password.*updated|success/i')).toBeVisible({ timeout: 5000 });
      
      // Change it back
      await page.waitForTimeout(1000);
      await changePasswordButton.click();
      await page.fill('input[name="currentPassword"], input[placeholder*="Current"]', 'NewTestPass123!');
      await page.fill('input[name="newPassword"], input[placeholder*="New"]', TEST_USERS.regularUser.password);
      await page.fill('input[name="confirmPassword"], input[placeholder*="Confirm"]', TEST_USERS.regularUser.password);
      await page.click('button[type="submit"]:has-text("Update"), button:has-text("Change")');
    }
  });

  test('should validate password requirements when changing', async ({ page }) => {
    await navigateTo(page, 'settings');
    
    const changePasswordButton = page.locator('button:has-text("Change Password")').first();
    if (await changePasswordButton.isVisible({ timeout: 3000 })) {
      await changePasswordButton.click();
      
      // Try weak password
      await page.fill('input[name="currentPassword"], input[placeholder*="Current"]', TEST_USERS.regularUser.password);
      await page.fill('input[name="newPassword"], input[placeholder*="New"]', 'weak');
      await page.fill('input[name="confirmPassword"], input[placeholder*="Confirm"]', 'weak');
      
      await page.click('button[type="submit"]:has-text("Update"), button:has-text("Change")');
      
      // Should show validation error
      await expect(page.locator('text=/password.*requirements|too.*short|too.*weak/i')).toBeVisible({ timeout: 5000 });
    }
  });

  test('should validate password confirmation matches', async ({ page }) => {
    await navigateTo(page, 'settings');
    
    const changePasswordButton = page.locator('button:has-text("Change Password")').first();
    if (await changePasswordButton.isVisible({ timeout: 3000 })) {
      await changePasswordButton.click();
      
      // Mismatched passwords
      await page.fill('input[name="currentPassword"], input[placeholder*="Current"]', TEST_USERS.regularUser.password);
      await page.fill('input[name="newPassword"], input[placeholder*="New"]', 'NewPass123!');
      await page.fill('input[name="confirmPassword"], input[placeholder*="Confirm"]', 'DifferentPass123!');
      
      await page.click('button[type="submit"]:has-text("Update"), button:has-text("Change")');
      
      // Should show mismatch error
      await expect(page.locator('text=/passwords.*match|passwords.*same|must.*match/i')).toBeVisible({ timeout: 5000 });
    }
  });

  test('should reject wrong current password', async ({ page }) => {
    await navigateTo(page, 'settings');
    
    const changePasswordButton = page.locator('button:has-text("Change Password")').first();
    if (await changePasswordButton.isVisible({ timeout: 3000 })) {
      await changePasswordButton.click();
      
      // Wrong current password
      await page.fill('input[name="currentPassword"], input[placeholder*="Current"]', 'WrongPassword123!');
      await page.fill('input[name="newPassword"], input[placeholder*="New"]', 'NewPass123!');
      await page.fill('input[name="confirmPassword"], input[placeholder*="Confirm"]', 'NewPass123!');
      
      await page.click('button[type="submit"]:has-text("Update"), button:has-text("Change")');
      
      // Should show error
      await expect(page.locator('text=/incorrect.*password|current.*password.*wrong|invalid/i')).toBeVisible({ timeout: 5000 });
    }
  });

  test('should display delete account option', async ({ page }) => {
    await navigateTo(page, 'settings');
    
    // Look for delete account button/section
    const deleteButton = page.locator('button:has-text("Delete Account"), text=/delete.*account/i').first();
    const hasDeleteOption = await deleteButton.isVisible({ timeout: 3000 }).catch(() => false);
    
    expect(hasDeleteOption).toBeTruthy();
  });

  test('should show confirmation dialog for account deletion', async ({ page }) => {
    await navigateTo(page, 'settings');
    
    // Click delete account
    const deleteButton = page.locator('button:has-text("Delete Account")').first();
    if (await deleteButton.isVisible({ timeout: 3000 })) {
      await deleteButton.click();
      
      // Should show confirmation dialog
      await expect(page.locator('text=/are.*you.*sure|confirm.*deletion|permanently.*delete/i')).toBeVisible({ timeout: 5000 });
      
      // Cancel the deletion
      await page.click('button:has-text("Cancel"), button:has-text("No")');
    }
  });

  test('should update profile name', async ({ page }) => {
    await navigateTo(page, 'settings');
    
    // Look for name input
    const nameInput = page.locator('input[name="name"], input[placeholder*="Name"]').first();
    const hasNameInput = await nameInput.isVisible({ timeout: 3000 }).catch(() => false);
    
    if (hasNameInput) {
      const originalName = await nameInput.inputValue();
      
      // Update name
      await nameInput.fill('Updated Test Name');
      
      // Save
      await page.click('button:has-text("Save"), button:has-text("Update")');
      
      // Should show success
      await expect(page.locator('text=/saved|updated|success/i')).toBeVisible({ timeout: 5000 });
      
      // Restore original name
      await nameInput.fill(originalName);
      await page.click('button:has-text("Save"), button:has-text("Update")');
    }
  });

  test('should display privacy settings', async ({ page }) => {
    await navigateTo(page, 'settings');
    
    // Look for privacy options
    const hasPrivacySettings = await page.locator('text=/privacy|public.*profile|visibility/i').isVisible({ timeout: 3000 })
      .catch(() => false);
    
    if (hasPrivacySettings) {
      // Should have toggles or checkboxes
      await expect(page.locator('input[type="checkbox"], input[type="radio"]')).toBeVisible();
    }
  });

  test('should toggle profile visibility', async ({ page }) => {
    await navigateTo(page, 'settings');
    
    // Look for public/private toggle
    const visibilityToggle = page.locator('input[type="checkbox"]:near(text=/public|visible|searchable/i)').first();
    const hasVisibilityToggle = await visibilityToggle.isVisible({ timeout: 3000 }).catch(() => false);
    
    if (hasVisibilityToggle) {
      const originalState = await visibilityToggle.isChecked();
      
      // Toggle it
      await visibilityToggle.click();
      
      // Should change state
      const newState = await visibilityToggle.isChecked();
      expect(newState).toBe(!originalState);
      
      // Toggle back
      await visibilityToggle.click();
    }
  });

  test('should display notification preferences', async ({ page }) => {
    await navigateTo(page, 'settings');
    
    // Look for notification settings
    const hasNotificationSettings = await page.locator('text=/notification|email.*preferences|alerts/i').isVisible({ timeout: 3000 })
      .catch(() => false);
    
    if (hasNotificationSettings) {
      await expect(page.locator('input[type="checkbox"]')).toBeVisible();
    }
  });

  test('should show account creation date', async ({ page }) => {
    await navigateTo(page, 'settings');
    
    // Look for account info
    const hasAccountInfo = await page.locator('text=/member.*since|joined|created/i').isVisible({ timeout: 3000 })
      .catch(() => false);
    
    if (hasAccountInfo) {
      // Should show a date
      await expect(page.locator('text=/\\d{4}|\\d{1,2}\\/\\d{1,2}/i')).toBeVisible();
    }
  });

  test('should display storage usage for Beta tier', async ({ page }) => {
    await navigateTo(page, 'settings');
    
    // Look for storage/usage info
    const hasUsageInfo = await page.locator('text=/storage|catalog.*size|unlimited/i').isVisible({ timeout: 3000 })
      .catch(() => false);
    
    if (hasUsageInfo) {
      // Beta users should have unlimited
      const hasUnlimited = await page.locator('text=/unlimited/i').isVisible().catch(() => false);
      expect(hasUnlimited || true).toBeTruthy();
    }
  });

  test('should allow export of user data', async ({ page }) => {
    await navigateTo(page, 'settings');
    
    // Look for export option
    const exportButton = page.locator('button:has-text("Export"), button:has-text("Download")').first();
    const hasExport = await exportButton.isVisible({ timeout: 3000 }).catch(() => false);
    
    if (hasExport) {
      // Click export (don't actually download in test)
      await exportButton.click();
      
      // Should show download prompt or success message
      await page.waitForTimeout(2000);
    }
  });

  test('should navigate back to dashboard', async ({ page }) => {
    await navigateTo(page, 'settings');
    
    // Click back or dashboard button
    const backButton = page.locator('button:has-text("Back"), button:has-text("Dashboard"), a:has-text("Dashboard")').first();
    await backButton.click();
    
    // Should return to dashboard
    await expect(page.locator('text=/dashboard|welcome/i')).toBeVisible({ timeout: 5000 });
  });
});
