import { test, expect } from '@playwright/test';

test.describe('Admin User Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'admin@vetkind.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForNavigation();
  });

  test('should render the User Management section and table', async ({ page }) => {
    await page.goto('http://localhost:3000/admin/dashboard');
    
    // Verify section title
    await expect(page.locator('h2', { hasText: 'User Management' })).toBeVisible();
    
    // Verify Add User button
    await expect(page.locator('button', { hasText: 'Add User' })).toBeVisible();
    
    // Verify search input
    await expect(page.locator('input[placeholder="Search users by name or email..."]')).toBeVisible();
    
    // Verify table headers
    await expect(page.locator('th', { hasText: 'Name' })).toBeVisible();
    await expect(page.locator('th', { hasText: 'Email' })).toBeVisible();
    await expect(page.locator('th', { hasText: 'Role' })).toBeVisible();
    await expect(page.locator('th', { hasText: 'Status' })).toBeVisible();
  });

  test('should allow creating a new user', async ({ page }) => {
    await page.goto('http://localhost:3000/admin/dashboard');
    
    // Open modal
    await page.click('button:has-text("Add User")');
    
    // Verify modal is open
    await expect(page.locator('h3', { hasText: 'Add New User' })).toBeVisible();
    
    const testEmail = `testuser_${Date.now()}@example.com`;
    
    // Fill form
    await page.fill('input[name="name"]', 'Test E2E User');
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', 'password123');
    await page.selectOption('select[name="role"]', 'EDITOR');
    await page.selectOption('select[name="status"]', 'ACTIVE');
    
    // Submit
    await page.click('button[type="submit"]:has-text("Save User")');
    
    // Wait for the modal to close and the new user to appear in the table
    await expect(page.locator('h3', { hasText: 'Add New User' })).not.toBeVisible();
    await expect(page.locator(`text=${testEmail}`)).toBeVisible();
  });

  test('should allow searching for a user', async ({ page }) => {
    await page.goto('http://localhost:3000/admin/dashboard');
    
    await page.fill('input[placeholder="Search users by name or email..."]', 'admin@vetkind.com');
    
    // The table should filter automatically
    const tableText = await page.locator('table').innerText();
    expect(tableText).toContain('admin@vetkind.com');
  });
});
