import { test, expect } from '@playwright/test';

test.describe('Admin Species Management', () => {
  test.beforeEach(async ({ page }) => {
    // Admin authentication setup (assuming it uses the same as admin-research.spec.ts)
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'admin@vetkind.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForNavigation();
  });

  test('should allow admin to create, edit, and disable a species', async ({ page }) => {
    // 1. Navigate to Species list
    await page.goto('http://localhost:3000/admin/species');
    await expect(page.locator('h1')).toContainText('Animal Species');

    // 2. Add New Species
    await page.click('text=Add Species');
    await expect(page).toHaveURL(/.*\/admin\/species\/new/);
    
    const timestamp = Date.now();
    const testSpeciesName = `Test Species ${timestamp}`;
    const testSpeciesSlug = `test-species-${timestamp}`;

    await page.fill('input[name="name"]', testSpeciesName);
    await page.fill('input[name="slug"]', testSpeciesSlug);
    await page.fill('textarea[name="description"]', 'A test species for automated E2E.');
    await page.fill('input[name="sortOrder"]', '99');

    await page.click('button:has-text("Save Changes")');

    // 3. Verify Species created and appears in list
    await expect(page).toHaveURL(/.*\/admin\/species/);
    await expect(page.locator('table')).toContainText(testSpeciesName);

    // 4. Edit Species to disable it
    const row = page.locator('tr', { hasText: testSpeciesName });
    await row.locator('a[title="Edit"]').click();
    
    await expect(page.locator('h1')).toContainText('Edit Species');
    // Uncheck isActive (it's checked by default)
    await page.uncheck('input[name="isActive"]');
    await page.click('button:has-text("Save Changes")');

    // 5. Verify it shows as Hidden in list
    await expect(page).toHaveURL(/.*\/admin\/species/);
    const updatedRow = page.locator('tr', { hasText: testSpeciesName });
    await expect(updatedRow).toContainText('Hidden');

    // 6. Delete Species
    await updatedRow.locator('a[title="Edit"]').click();
    page.once('dialog', dialog => dialog.accept());
    await page.click('button:has-text("Delete")');
    
    await expect(page).toHaveURL(/.*\/admin\/species/);
    await expect(page.locator('table')).not.toContainText(testSpeciesName);
  });
});
