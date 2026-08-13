import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard and User Management', () => {
  // Use a unique email to avoid conflicts
  const testUserEmail = `testuser_${Date.now()}@vetkind.com`;

  test.beforeEach(async ({ page }) => {
    // 1. Login as admin
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'admin@vetkind.com');
    await page.fill('input[name="password"]', 'admin123'); // Assuming default admin password is admin123
    await page.click('button[type="submit"]');
    await page.waitForURL('http://localhost:3000/admin/dashboard');
  });

  test('Dashboard loads correctly and metric cards render', async ({ page }) => {
    // Page title and heading
    await expect(page).toHaveTitle(/Admin Portal|VetKind/);
    await expect(page.locator('h1')).toContainText('Admin Dashboard');

    // Metric cards
    await expect(page.locator('text=Total Products')).toBeVisible();
    await expect(page.locator('text=Distributors')).toBeVisible();
    await expect(page.locator('text=Inquiries')).toBeVisible();
    await expect(page.locator('text=System Status')).toBeVisible();
    
    // Recent inquiries block
    await expect(page.locator('h2', { hasText: 'Recent Inquiries' })).toBeVisible();
  });

  test('User Management Table renders and search works', async ({ page }) => {
    // User management section
    await expect(page.locator('h2', { hasText: 'User Management' })).toBeVisible();

    // Table rows
    const tableRows = page.locator('tbody tr');
    await expect(tableRows.first()).toBeVisible();

    // Search input
    await page.fill('input[placeholder="Search users by name or email..."]', 'admin@vetkind.com');
    
    // Wait for filter to apply
    await page.waitForTimeout(500);
    
    const filteredRows = page.locator('tbody tr');
    expect(await filteredRows.count()).toBeGreaterThan(0);
    await expect(filteredRows.first()).toContainText('admin@vetkind.com');
  });

  test('User lifecycle (Add, Edit, Deactivate, Delete)', async ({ page }) => {
    // Add User
    await page.click('button:has-text("Add User")');
    await expect(page.locator('h3', { hasText: 'Add New User' })).toBeVisible();
    
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', testUserEmail);
    await page.fill('input[name="password"]', 'password123');
    await page.selectOption('select[name="role"]', 'USER');
    await page.click('button:has-text("Save User")');
    
    // Verify user was added
    await page.waitForTimeout(1000); // Wait for reload
    await page.fill('input[placeholder="Search users by name or email..."]', testUserEmail);
    await page.waitForTimeout(500);
    
    const userRow = page.locator('tbody tr').filter({ hasText: testUserEmail });
    await expect(userRow).toBeVisible();
    await expect(userRow).toContainText('Test User');
    await expect(userRow).toContainText('USER');
    await expect(userRow).toContainText('ACTIVE');

    // Edit User
    await userRow.locator('button[title="Edit User"]').click();
    await expect(page.locator('h3', { hasText: 'Edit User' })).toBeVisible();
    await page.fill('input[name="name"]', 'Updated Test User');
    await page.click('button:has-text("Save User")');
    
    // Verify user was edited
    await page.waitForTimeout(1000); // Wait for reload
    await page.fill('input[placeholder="Search users by name or email..."]', testUserEmail);
    await page.waitForTimeout(500);
    const updatedUserRow = page.locator('tbody tr').filter({ hasText: testUserEmail });
    await expect(updatedUserRow).toContainText('Updated Test User');

    // Deactivate User
    await updatedUserRow.locator('button[title="Deactivate User"]').click();
    await page.waitForTimeout(1000); // Wait for reload
    await page.fill('input[placeholder="Search users by name or email..."]', testUserEmail);
    await page.waitForTimeout(500);
    const inactiveUserRow = page.locator('tbody tr').filter({ hasText: testUserEmail });
    await expect(inactiveUserRow).toContainText('INACTIVE');

    // Delete User
    await inactiveUserRow.locator('button[title="Delete User"]').click();
    await expect(page.locator('h3', { hasText: 'Confirm Deletion' })).toBeVisible();
    await page.click('button:has-text("Delete User")');
    
    // Verify deletion
    await page.waitForTimeout(1000); // Wait for reload
    await page.fill('input[placeholder="Search users by name or email..."]', testUserEmail);
    await page.waitForTimeout(500);
    await expect(page.locator('text=No users match your search.')).toBeVisible();
  });

  test('Logout works correctly', async ({ page }) => {
    // Click logout in the sidebar
    await page.click('button:has-text("Logout")');
    
    // Verify redirect to homepage or login
    await page.waitForURL('**/');
    
    // Attempting to go back to admin dashboard should redirect
    await page.goto('http://localhost:3000/admin/dashboard');
    await page.waitForURL('**/login*');
  });
});
