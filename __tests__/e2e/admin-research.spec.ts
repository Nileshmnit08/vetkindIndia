import { test, expect } from '@playwright/test';

test.describe('Research Route Verification', () => {
  test('should keep public /research separate and rendering correctly', async ({ page }) => {
    await page.goto('http://localhost:3000/research');
    await expect(page.locator('h1', { hasText: 'Evidence-Based Veterinary Nutrition' })).toBeVisible();
    await expect(page.locator('h2', { hasText: 'Field Trials & Efficacy' })).toBeVisible();
  });

  test.describe('Admin Research Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('http://localhost:3000/login');
      await page.fill('input[name="email"]', 'admin@vetkind.com');
      await page.fill('input[name="password"]', 'admin123');
      await page.click('button[type="submit"]');
      await page.waitForNavigation();
    });

    test('should render the admin research page with filters and table', async ({ page }) => {
      await page.goto('http://localhost:3000/admin/research');
      await expect(page.locator('h1', { hasText: 'Research' })).toBeVisible();
      await expect(page.locator('input[placeholder*="Search research"]')).toBeVisible();
      await expect(page.locator('select').filter({ hasText: 'All Categories' })).toBeVisible();
      await expect(page.locator('select').filter({ hasText: 'All Statuses' })).toBeVisible();
      await expect(page.locator('table')).toBeVisible();
    });

    test('should have a working "Add research article" button', async ({ page }) => {
      await page.goto('http://localhost:3000/admin/research');
      const addBtn = page.locator('a:has-text("Add research article")');
      await expect(addBtn).toBeVisible();
      await addBtn.click();
      await page.waitForURL('**/admin/research/new');
      await expect(page.locator('h1', { hasText: 'Add New Research Article' })).toBeVisible();
    });

    test('should have a working back button from new page to /admin/research', async ({ page }) => {
      await page.goto('http://localhost:3000/admin/research/new');
      const backBtn = page.locator('a', { hasText: 'Back to Research' });
      await expect(backBtn).toBeVisible();
      await backBtn.click();
      await page.waitForURL('**/admin/research');
      await expect(page.locator('h1', { hasText: 'Research' })).toBeVisible();
    });
  });
});
