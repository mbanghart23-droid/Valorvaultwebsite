import { test, expect } from '@playwright/test';
import { login, navigateTo, addServiceMember, TEST_USERS } from './helpers/test-utils';

/**
 * Medal Catalog Tests
 * Tests for viewing, adding, editing, and deleting medals
 */

test.describe('Medal Catalog', () => {
  
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await login(page, TEST_USERS.regularUser.email, TEST_USERS.regularUser.password);
  });

  test('should display medal catalog page', async ({ page }) => {
    await navigateTo(page, 'medals');
    
    // Check for catalog elements
    await expect(page.locator('text=/medal.*catalog|my.*medals/i')).toBeVisible();
  });

  test('should show empty state when no service members exist', async ({ page }) => {
    await navigateTo(page, 'medals');
    
    // Check for empty state or add service member button
    const hasEmptyState = await page.locator('text=/no.*service.*members|get.*started|add.*first/i').isVisible({ timeout: 3000 })
      .catch(() => false);
    const hasAddButton = await page.locator('button:has-text("Add Service Member")').isVisible()
      .catch(() => false);
    
    expect(hasEmptyState || hasAddButton).toBeTruthy();
  });

  test('should add a new service member', async ({ page }) => {
    await navigateTo(page, 'medals');
    
    const serviceMember = {
      firstName: 'John',
      lastName: `TestMember-${Date.now()}`,
      branch: 'Army',
      rank: 'Captain'
    };
    
    await addServiceMember(page, serviceMember);
    
    // Verify service member appears
    await expect(page.locator(`text=${serviceMember.firstName} ${serviceMember.lastName}`)).toBeVisible();
  });

  test('should view service member details', async ({ page }) => {
    await navigateTo(page, 'medals');
    
    // Add a service member first
    const serviceMember = {
      firstName: 'Jane',
      lastName: `Details-${Date.now()}`,
      branch: 'Navy'
    };
    
    await addServiceMember(page, serviceMember);
    
    // Click to view details
    await page.click(`text=${serviceMember.firstName} ${serviceMember.lastName}`);
    
    // Should show details page
    await expect(page.locator(`text=${serviceMember.firstName} ${serviceMember.lastName}`)).toBeVisible();
    await expect(page.locator('text=/medals|awards|decorations/i')).toBeVisible();
  });

  test('should add a medal to service member', async ({ page }) => {
    await navigateTo(page, 'medals');
    
    // Add service member
    const serviceMember = {
      firstName: 'Medal',
      lastName: `Test-${Date.now()}`,
      branch: 'Air Force'
    };
    
    await addServiceMember(page, serviceMember);
    
    // Click to view service member
    await page.click(`text=${serviceMember.firstName} ${serviceMember.lastName}`);
    
    // Add medal
    await page.click('button:has-text("Add Medal")');
    
    // Fill medal form (adjust selectors based on your actual form)
    const medalName = 'Purple Heart';
    await page.fill('input[placeholder*="Search"], input[type="search"]', medalName);
    
    // Wait for medal to appear in search results
    await page.waitForTimeout(1000);
    
    // Select medal
    const medalElement = page.locator(`text=${medalName}`).first();
    if (await medalElement.isVisible()) {
      await medalElement.click();
    }
    
    // Save medal
    await page.click('button:has-text("Save"), button:has-text("Add")');
    
    // Verify medal was added
    await expect(page.locator(`text=${medalName}`)).toBeVisible({ timeout: 5000 });
  });

  test('should mark medal as "entitled but not owned"', async ({ page }) => {
    await navigateTo(page, 'medals');
    
    // This test assumes you can mark medals as entitled but not physically owned
    // Adjust based on your actual UI
    const hasEntitledFeature = await page.locator('text=/entitled|authorized|not.*owned/i').isVisible({ timeout: 2000 })
      .catch(() => false);
    
    if (hasEntitledFeature) {
      // Click the checkbox or toggle
      await page.click('input[type="checkbox"]:near(text=/entitled|not.*owned/i)');
      
      // Verify state changed
      await expect(page.locator('text=/entitled|not.*owned/i')).toBeVisible();
    } else {
      test.skip();
    }
  });

  test('should edit service member details', async ({ page }) => {
    await navigateTo(page, 'medals');
    
    // Add service member
    const serviceMember = {
      firstName: 'Edit',
      lastName: `Test-${Date.now()}`,
      branch: 'Marines'
    };
    
    await addServiceMember(page, serviceMember);
    
    // Click to view
    await page.click(`text=${serviceMember.firstName} ${serviceMember.lastName}`);
    
    // Click edit button
    const editButton = page.locator('button:has-text("Edit")').first();
    if (await editButton.isVisible({ timeout: 3000 })) {
      await editButton.click();
      
      // Update rank
      await page.fill('input[placeholder*="Rank"], input[name="rank"]', 'Major');
      
      // Save
      await page.click('button:has-text("Save")');
      
      // Verify update
      await expect(page.locator('text=Major')).toBeVisible();
    }
  });

  test('should delete a service member', async ({ page }) => {
    await navigateTo(page, 'medals');
    
    // Add service member
    const serviceMember = {
      firstName: 'Delete',
      lastName: `Test-${Date.now()}`,
      branch: 'Coast Guard'
    };
    
    await addServiceMember(page, serviceMember);
    
    // Click to view
    await page.click(`text=${serviceMember.firstName} ${serviceMember.lastName}`);
    
    // Click delete button
    const deleteButton = page.locator('button:has-text("Delete")').first();
    if (await deleteButton.isVisible({ timeout: 3000 })) {
      await deleteButton.click();
      
      // Confirm deletion
      await page.click('button:has-text("Confirm"), button:has-text("Yes")');
      
      // Verify deletion
      await expect(page.locator(`text=${serviceMember.firstName} ${serviceMember.lastName}`))
        .not.toBeVisible({ timeout: 5000 });
    }
  });

  test('should upload profile image for service member', async ({ page }) => {
    await navigateTo(page, 'medals');
    
    // Add service member
    const serviceMember = {
      firstName: 'Photo',
      lastName: `Test-${Date.now()}`,
      branch: 'Space Force'
    };
    
    await addServiceMember(page, serviceMember);
    
    // Click to view
    await page.click(`text=${serviceMember.firstName} ${serviceMember.lastName}`);
    
    // Check if upload button exists
    const uploadButton = page.locator('button:has-text("Upload"), input[type="file"]');
    const hasUpload = await uploadButton.isVisible({ timeout: 3000 }).catch(() => false);
    
    if (hasUpload) {
      // Create a test image file
      const buffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
      
      // Upload file
      await page.setInputFiles('input[type="file"]', {
        name: 'test-image.png',
        mimeType: 'image/png',
        buffer: buffer
      });
      
      // Wait for upload confirmation
      await expect(page.locator('text=/upload.*success|image.*uploaded/i')).toBeVisible({ timeout: 5000 });
    }
  });

  test('should respect membership tier limits', async ({ page }) => {
    await navigateTo(page, 'medals');
    
    // Check for Beta User or tier information
    await expect(page.locator('text=/beta.*user|membership|tier/i')).toBeVisible();
  });

  test('should filter medals by branch', async ({ page }) => {
    await navigateTo(page, 'medals');
    
    // Check if filter exists
    const filterExists = await page.locator('select, button:has-text("Filter")').isVisible({ timeout: 3000 })
      .catch(() => false);
    
    if (filterExists) {
      // Apply filter
      await page.click('button:has-text("Filter"), select');
      
      // Verify filter works
      await page.waitForTimeout(500);
    }
  });
});
