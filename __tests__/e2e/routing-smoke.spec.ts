import { test, expect } from '@playwright/test';

const MAJOR_ROUTES = [
  '/',
  '/products',
  '/solutions',
  '/knowledge',
  '/research',
  '/news-events',
  '/blog',
  '/about',
  '/contact',
  '/distributor-inquiry',
  '/privacy-policy',
  '/terms-of-service',
];

test.describe('Routing Smoke Tests', () => {
  for (const route of MAJOR_ROUTES) {
    test(`Route ${route} should render successfully`, async ({ page }) => {
      const response = await page.goto(`http://localhost:3000${route}`);
      
      // Ensure the page loaded successfully (200 OK)
      expect(response?.status()).toBe(200);
      
      // Ensure we didn't hit a Next.js 404 page
      const pageTitle = await page.title();
      expect(pageTitle).not.toContain('404');
    });
  }

  test('Admin dashboard should redirect to login if unauthenticated', async ({ page }) => {
    // Admin dashboard should redirect or 401 when unauthenticated
    const response = await page.goto('http://localhost:3000/admin/dashboard');
    
    // Check if it redirected to the login page (or auth failure)
    expect(page.url()).toContain('/login');
  });
});
