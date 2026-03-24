import { test, expect } from '@playwright/test';

test('homepage has contact form', async ({ page }) => {
  await page.goto('/');

  // Scroll to bottom or wait for contact section
  await page.locator('#contact').scrollIntoViewIfNeeded();

  // Verify the form renders
  await expect(page.locator('form')).toBeVisible();
  await expect(page.locator('input[name="name"]')).toBeVisible();
  
  // Submit with no data
  await page.locator('button[type="submit"]').click();
  
  // Wait for react-hook-form errors (which are rendered to the DOM)
  await expect(page.getByText('Name must be at least 2 characters.')).toBeVisible();
});
