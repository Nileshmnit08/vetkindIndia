import { test, expect } from '@playwright/test';

test.describe('Product Management and Public Experience', () => {
  const testProduct = {
    name: `Test Product ${Date.now()}`,
    slug: `test-product-${Date.now()}`,
    category: 'Nutrition',
    price: '999.99',
  };

  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'admin@vetkind.com');
    await page.fill('input[name="password"]', 'admin123'); // Updated password!
    await page.click('button[type="submit"]');
    await page.waitForURL('http://localhost:3000/admin/dashboard');
  });

  test('Admin Products Page renders and can create product', async ({ page }) => {
    await page.goto('http://localhost:3000/admin/products');
    await expect(page.locator('h1')).toContainText('Products');

    // Create a new product
    await page.click('text="Add Product"');
    await page.waitForURL('http://localhost:3000/admin/products/new');
    
    await page.fill('input[name="name"]', testProduct.name);
    // Slug should auto-fill, but we ensure it matches testProduct.slug by typing it
    await page.fill('input[name="slug"]', testProduct.slug);
    await page.fill('input[name="category"]', testProduct.category);
    await page.fill('input[name="price"]', testProduct.price);
    
    // Check "Published" is checked by default
    await expect(page.locator('input[name="published"]')).toBeChecked();

    await page.click('button:has-text("Save Product")');
    await page.waitForURL('http://localhost:3000/admin/products');

    // Verify it's in the table
    await expect(page.locator(`text=${testProduct.name}`)).toBeVisible();
  });

  test('Public Products Page shows the new product and filters work', async ({ page }) => {
    // Go to public products
    await page.goto('http://localhost:3000/products');
    
    // Check if the product is visible
    // We might need to search for it since pagination is 12 per page
    await page.fill('input[placeholder="Search products..."]', testProduct.name);
    await page.press('input[placeholder="Search products..."]', 'Enter');
    
    await page.waitForTimeout(1000); // Wait for search params to update and page to reload
    
    await expect(page.locator(`h3:has-text("${testProduct.name}")`)).toBeVisible();
    
    // Click on product to see details
    await page.click(`h3:has-text("${testProduct.name}")`);
    await page.waitForURL(`http://localhost:3000/products/${testProduct.slug}`);
    
    await expect(page.locator('h1')).toContainText(testProduct.name);
    await expect(page.locator(`text=${testProduct.category}`)).toBeVisible();
  });

  test('Can edit product and toggle publish status', async ({ page }) => {
    await page.goto('http://localhost:3000/admin/products');
    
    // Edit product
    // The actions menu requires clicking MoreHorizontal (a button)
    // We find the row with our product
    const row = page.locator(`tr:has-text("${testProduct.name}")`);
    await row.locator('button[aria-haspopup="true"]').click();
    await row.locator('text="Edit"').click();
    
    await page.waitForURL(`http://localhost:3000/admin/products/*/edit`);
    
    const editedName = `${testProduct.name} Edited`;
    await page.fill('input[name="name"]', editedName);
    await page.click('button:has-text("Save Product")');
    
    await page.waitForURL('http://localhost:3000/admin/products');
    await expect(page.locator(`text=${editedName}`)).toBeVisible();

    // Test unpublish
    const editedRow = page.locator(`tr:has-text("${editedName}")`);
    await editedRow.locator('button[aria-haspopup="true"]').click();
    await editedRow.locator('text="Unpublish"').click();
    
    await expect(editedRow.locator('text="Draft"')).toBeVisible();

    // Verify it's NOT on the public page
    await page.goto('http://localhost:3000/products');
    await expect(page.locator(`h3:has-text("${editedName}")`)).not.toBeVisible();
  });

  test('Can delete product', async ({ page }) => {
    await page.goto('http://localhost:3000/admin/products');
    
    // Search for product to delete (using playwright locator)
    const editedName = `${testProduct.name} Edited`;
    const row = page.locator(`tr:has-text("${editedName}")`);
    
    // Since previous test might run independently, let's just delete the original name if edited name isn't there
    // Actually, each test runs in isolation but uses the same DB unless we clean it up. Let's find any test product and delete it.
    const allTestRows = page.locator(`tr:has-text("Test Product")`);
    const count = await allTestRows.count();
    
    for (let i = 0; i < count; i++) {
      // Need to click more options then Delete. Note: there is a confirm dialog.
      page.on('dialog', dialog => dialog.accept());
      await allTestRows.nth(0).locator('button[aria-haspopup="true"]').click();
      await allTestRows.nth(0).locator('text="Delete"').click();
      await page.waitForTimeout(500); // wait for revalidation
    }
  });
});
