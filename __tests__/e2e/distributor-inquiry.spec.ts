import { test, expect } from '@playwright/test';

test.describe('Distributor Inquiry Flow', () => {
  test('should navigate to distributor inquiry from products page CTA', async ({ page }) => {
    await page.goto('http://localhost:3000/products');
    
    // Click the Apply as Distributor CTA
    const applyLink = page.locator('a', { hasText: 'Apply as Distributor' }).first();
    await applyLink.click();
    
    // Should arrive at the inquiry page
    await page.waitForURL('http://localhost:3000/distributor-inquiry');
    await expect(page.locator('h1', { hasText: 'Become a Distributor' })).toBeVisible();
  });

  test('should enforce form validation', async ({ page }) => {
    await page.goto('http://localhost:3000/distributor-inquiry');
    
    // Try submitting empty form
    const submitBtn = page.locator('button', { hasText: 'Submit Application' });
    await submitBtn.click();
    
    // Native HTML5 validation prevents submission, but if we bypass it,
    // the server action should still return an error state. 
    // Let's verify HTML5 validation first by checking if the form submits (it shouldn't)
    await expect(page.locator('text=Application Received')).not.toBeVisible();
  });

  test('should submit successfully when all required fields are filled', async ({ page }) => {
    await page.goto('http://localhost:3000/distributor-inquiry');
    
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test.distributor@example.com');
    await page.fill('input[name="company"]', 'Test Corp');
    await page.fill('input[name="phone"]', '9876543210');
    await page.fill('input[name="cityState"]', 'Test City');
    await page.selectOption('select[name="businessType"]', 'Wholesale Distributor');
    await page.selectOption('select[name="productsOfInterest"]', 'Dairy Nutrition');
    await page.fill('textarea[name="message"]', 'Interested in partnering with VetKind.');

    const submitBtn = page.locator('button', { hasText: 'Submit Application' });
    await submitBtn.click();

    // Wait for success message
    await expect(page.locator('text=Application Received')).toBeVisible();
    await expect(page.locator('text=Your application has been received successfully!')).toBeVisible();
  });

  test('should show duplicate inquiry error for same email', async ({ page }) => {
    await page.goto('http://localhost:3000/distributor-inquiry');
    
    // Fill the same email used in previous test
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test.distributor@example.com');
    await page.fill('input[name="company"]', 'Test Corp');
    await page.fill('input[name="phone"]', '9876543210');
    await page.fill('input[name="cityState"]', 'Test City');
    await page.selectOption('select[name="businessType"]', 'Wholesale Distributor');
    await page.fill('textarea[name="message"]', 'Interested again.');

    const submitBtn = page.locator('button', { hasText: 'Submit Application' });
    await submitBtn.click();

    // Should show error state because it is a duplicate
    await expect(page.locator('text=You already have a pending inquiry. Our team will contact you soon.')).toBeVisible();
  });
});
