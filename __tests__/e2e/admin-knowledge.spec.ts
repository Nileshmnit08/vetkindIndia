import { test, expect } from '@playwright/test';

test.describe('Admin Knowledge Base Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'admin@vetkind.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForNavigation();
  });

  test('should render the knowledge base page with filters and table', async ({ page }) => {
    await page.goto('http://localhost:3000/admin/knowledge');
    await expect(page.locator('h1', { hasText: 'Knowledge Base' })).toBeVisible();
    await expect(page.locator('input[placeholder*="Search articles"]')).toBeVisible();
    await expect(page.locator('select').filter({ hasText: 'All Categories' })).toBeVisible();
    await expect(page.locator('select').filter({ hasText: 'All Statuses' })).toBeVisible();
    await expect(page.locator('table')).toBeVisible();
  });

  test('should filter articles by search query', async ({ page }) => {
    await page.goto('http://localhost:3000/admin/knowledge');
    await page.fill('input[placeholder*="Search articles"]', 'TestKnowledgeArticleXYZ');
    await page.keyboard.press('Enter');
    
    await page.waitForURL(/q=TestKnowledgeArticleXYZ/);
    const tableText = await page.locator('table').innerText();
    expect(tableText).toContain('No articles found matching your criteria.');
  });

  test('should have working row action dropdowns', async ({ page }) => {
    await page.goto('http://localhost:3000/admin/knowledge');
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
