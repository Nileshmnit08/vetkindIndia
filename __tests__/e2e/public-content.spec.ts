import { test, expect } from '@playwright/test';

test.describe('Public Content Pages', () => {
  test('should render News & Events index page', async ({ page }) => {
    await page.goto('http://localhost:3000/news-events');
    await expect(page.locator('h1', { hasText: 'News & Events' })).toBeVisible();
  });

  test('should render Blog index page', async ({ page }) => {
    await page.goto('http://localhost:3000/blog');
    await expect(page.locator('h1', { hasText: 'The VetKind Blog' })).toBeVisible();
  });
});
