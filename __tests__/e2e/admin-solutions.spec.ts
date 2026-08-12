import { test, expect } from '@playwright/test';

test.describe('Admin Solutions Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'admin@vetkind.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForNavigation();
  });

  test('should render the solutions page with filters and table', async ({ page }) => {
    await page.goto('http://localhost:3000/admin/solutions');
    await expect(page.locator('h1', { hasText: 'Solutions' })).toBeVisible();
    await expect(page.locator('input[placeholder*="Search solutions"]')).toBeVisible();
    await expect(page.locator('select').filter({ hasText: 'All Statuses' })).toBeVisible();
    await expect(page.locator('table')).toBeVisible();
  });

  test('should filter solutions by search query', async ({ page }) => {
    await page.goto('http://localhost:3000/admin/solutions');
    await page.fill('input[placeholder*="Search solutions"]', 'TestSolutionQuery');
    await page.keyboard.press('Enter');
    
    await page.waitForURL(/q=TestSolutionQuery/);
    const tableText = await page.locator('table').innerText();
    expect(tableText).toContain('No solutions found matching your criteria.');
  });

  test('should have working row action dropdowns', async ({ page }) => {
    await page.goto('http://localhost:3000/admin/solutions');
    const actionButton = page.locator('button:has(svg.lucide-more-vertical)').first();
    
    if (await actionButton.isVisible()) {
      await actionButton.click();
      const menu = page.locator('[role="menu"]');
      await expect(menu).toBeVisible();
      await expect(menu.locator('text=Edit')).toBeVisible();
      await expect(menu.locator('text=Publish').or(menu.locator('text=Unpublish'))).toBeVisible();
      await expect(menu.locator('text=Delete')).toBeVisible();
      await page.keyboard.press('Escape');
    }
  });
});
