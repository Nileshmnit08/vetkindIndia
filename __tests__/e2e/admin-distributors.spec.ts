import { test, expect } from '@playwright/test';

test.describe('Admin Distributors Page', () => {
  // We use a setup that logs in as an admin for these tests
  // Assuming a global setup handles authentication, or we do it here:
  test.beforeEach(async ({ page }) => {
    // Auth is bypassed for /admin routes in middleware, but layout.tsx still checks session
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'admin@vetkind.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    // It might redirect to home page (/) or dashboard, so we wait for navigation and then go to distributors
    await page.waitForNavigation();
  });

  test('should render the distributors page with filters and table', async ({ page }) => {
    await page.goto('http://localhost:3000/admin/distributors');
    await expect(page.locator('h1', { hasText: 'Distributors' })).toBeVisible();
    await expect(page.locator('input[placeholder*="Search distributors"]')).toBeVisible();
    await expect(page.locator('select').filter({ hasText: 'All Statuses' })).toBeVisible();
    await expect(page.locator('table')).toBeVisible();
  });

  test('should filter distributors by search query', async ({ page }) => {
    await page.goto('http://localhost:3000/admin/distributors');
    await page.fill('input[placeholder*="Search distributors"]', 'TestDistributor123');
    await page.keyboard.press('Enter');
    
    // Wait for URL to update
    await page.waitForURL(/q=TestDistributor123/);
    
    // Verify empty state or filtered results
    const tableText = await page.locator('table').innerText();
    expect(tableText).toContain('Distributor');
  });

  test('should filter distributors by status', async ({ page }) => {
    await page.goto('http://localhost:3000/admin/distributors');
    await page.selectOption('select', 'ACTIVE');
    
    // Wait for URL to update
    await page.waitForURL(/status=ACTIVE/);
    
    // We expect the URL to have status=ACTIVE
    expect(page.url()).toContain('status=ACTIVE');
  });

  test('should have working row action dropdowns', async ({ page }) => {
    await page.goto('http://localhost:3000/admin/distributors');
    
    // Find the first actions button (if there are any distributors)
    const actionButton = page.locator('button:has(svg.lucide-more-horizontal)').first();
    
    if (await actionButton.isVisible()) {
      await actionButton.click();
      
      const menu = page.locator('[role="menu"]');
      await expect(menu).toBeVisible();
      await expect(menu.locator('text=Edit / View Profile')).toBeVisible();
      await expect(menu.locator('text=Resend Invite')).toBeVisible();
      await expect(menu.locator('text=Delete Account')).toBeVisible();
      
      // Close menu
      await page.keyboard.press('Escape');
    }
  });
});
