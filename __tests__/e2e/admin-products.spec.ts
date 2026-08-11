import { test, expect } from '@playwright/test';

test.describe('Admin Products Route Mismatch Bug', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'admin@vetkind.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForNavigation();
  });

  test('should render Products page and NOT Inquiries page', async ({ page }) => {
    await page.goto('http://localhost:3000/admin/products');
    
    // Assert the URL is correct
    await expect(page).toHaveURL(/.*\/admin\/products/);
    
    // Assert the heading is Products
    await expect(page.locator('h1', { hasText: 'Products' })).toBeVisible();
    
    // Assert it does NOT contain the Inquiries heading
    await expect(page.locator('h1', { hasText: 'Inquiries' })).not.toBeVisible();
    
    // Assert the description doesn't match inquiries
    const bodyText = await page.locator('body').innerText();
    expect(bodyText).not.toContain('View and manage contact form submissions and bulk requests.');
  });
});
