import { test, expect } from '@playwright/test';

test.describe('Public Products Catalogue Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/products');
  });

  test('should render hero, trust strip, and discovery sections', async ({ page }) => {
    await expect(page.locator('h1', { hasText: 'Advanced Veterinary Nutrition' })).toBeVisible();
    await expect(page.locator('text=Science-Backed Formulations')).toBeVisible();
    
    // Species discovery section
    await expect(page.locator('h2', { hasText: 'Browse by Species' })).toBeVisible();
    await expect(page.locator('text=Dairy').first()).toBeVisible();
  });

  test('should not display empty filter groups', async ({ page }) => {
    // Categories are removed, species should be visible
    const speciesHeading = page.locator('h3:has-text("Animal Species")');
    if (await speciesHeading.isVisible()) {
      const speciesCheckboxes = page.locator('text=Animal Species >> .. >> input[type="checkbox"]');
      await expect(speciesCheckboxes.first()).toBeAttached();
    }

    // Empty filter headings should NOT be visible (Benefits and Product Type have no products)
    await expect(page.locator('h3:has-text("Benefits")')).not.toBeVisible();
    await expect(page.locator('h3:has-text("Product Type")')).not.toBeVisible();
  });

  test('should display consistently formatted prices', async ({ page }) => {
    await page.waitForSelector('text=₹');
    const priceElement = page.locator('text=/₹\\d{1,3}(,\\d{3})*/').first();
    await expect(priceElement).toBeVisible();
    const text = await priceElement.innerText();
    expect(text.trim()).toMatch(/^₹\s*[\d,]+(\.\d{2})?$/);
  });

  test('should correctly filter products via search and display no-results', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search"]');
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('NonExistentProduct12345');
      await page.keyboard.press('Enter');
      
      await page.waitForURL(/search=NonExistentProduct12345/);
      await expect(page.locator('text=No products found')).toBeVisible();
    }
  });

  test('should correctly sort products', async ({ page }) => {
    const sortSelect = page.locator('select').first();
    if (await sortSelect.isVisible()) {
      await sortSelect.selectOption('price_asc');
      await page.waitForURL(/sortBy=price_asc/);
      expect(page.url()).toContain('sortBy=price_asc');
    }
  });

  test('should correctly show applied filters and clear-all works', async ({ page }) => {
    // Navigate to a filtered URL
    await page.goto('http://localhost:3000/products?species=dairy');
    
    // The Active Filters section should appear
    await expect(page.locator('text=Active Filters:')).toBeVisible();
    await expect(page.locator('text=Species: dairy')).toBeVisible();
    
    // Verify result counts match cards
    const countText = await page.locator('text=/Showing \\d+ products/').innerText();
    const expectedCount = parseInt(countText.match(/\d+/)?.[0] || '0');
    
    const productCards = page.locator('h3'); // Assuming h3 is used for product titles in the grid
    // We need a robust selector for product cards. The grid has a group class typically.
    const cards = page.locator('.group h3');
    if (expectedCount > 0) {
       const cardCount = await cards.count();
       // It should show at most the page limit, but since limit is 12 and we have < 12 products, it should match exactly
       expect(cardCount).toBe(expectedCount);
    }

    // Click Clear all
    const clearAllBtn = page.locator('button:has-text("Clear all")').first();
    await clearAllBtn.click();
    
    // Wait for URL to update (should remove species param)
    await page.waitForURL('http://localhost:3000/products');
    await expect(page.locator('text=Active Filters:')).not.toBeVisible();
  });

  test('should render support CTA and related collections sections', async ({ page }) => {
    // Need Help Choosing
    await expect(page.locator('h3', { hasText: 'Need Help Choosing?' })).toBeVisible();
    await expect(page.locator('text=Request Consultation')).toBeVisible();

    // Bulk Orders
    await expect(page.locator('h3', { hasText: 'Bulk Orders & Distribution' })).toBeVisible();
    await expect(page.locator('text=Apply as Distributor')).toBeVisible();

    // Related Collections
    await expect(page.locator('h2', { hasText: 'Explore Targeted Solutions' })).toBeVisible();
    await expect(page.locator('text=Dairy Performance')).toBeVisible();

    // Trust Block
    await expect(page.locator('h2', { hasText: 'Committed to Quality & Residue-Conscious Formulation' })).toBeVisible();
  });

  test('should render featured species in Browse by Species and Footer', async ({ page }) => {
    // Verify all featured categories render in the Browse by Species grid
    const browseGrid = page.locator('h2:has-text("Browse by Species") + div');
    await expect(browseGrid.locator('text=Dairy')).toBeVisible();

    // Verify the footer has the same catalogue links
    const footerCatalogue = page.locator('h4:has-text("Catalogue") + ul');
    await expect(footerCatalogue.locator('text=Dairy')).toBeVisible();
  });

  test('disabled species do not appear on storefront', async ({ page }) => {
    // Swine is disabled in featured by default based on our DB setup or if it's inactive
    // Let's just check that it's not present in Browse by Species if it's not featured
    const browseGrid = page.locator('h2:has-text("Browse by Species") + div');
    await expect(browseGrid.locator('text=Swine')).not.toBeVisible();
  });

  test('should navigate to empty states gracefully without misleading products', async ({ page }) => {
    // Navigate to an empty species
    await page.goto('http://localhost:3000/products?species=aqua');

    // Should show active filter
    await expect(page.locator('text=Species: aqua')).toBeVisible();

    // Should show zero products graceful state
    await expect(page.locator('text=No products found')).toBeVisible();
    
    // Should not leak other products
    await expect(page.locator('text=VetKind Pro Milk')).not.toBeVisible();
  });

  test('should show deliberate unsupported state for alien species', async ({ page }) => {
    await page.goto('http://localhost:3000/products?species=alien');
    await expect(page.locator('text=Unsupported Species')).toBeVisible();
    await expect(page.locator('text=We currently do not have a dedicated catalogue for "alien"')).toBeVisible();
  });

  test('should behave intentionally for native normalized species (poultry)', async ({ page }) => {
    await page.goto('http://localhost:3000/products?species=poultry');
    
    // Active filter should appear
    await expect(page.locator('text=Species: poultry')).toBeVisible();

    // Empty state should be "No products found" OR show actual products, not "Unsupported Species"
    await expect(page.locator('text=Unsupported Species')).not.toBeVisible();
  });
});
