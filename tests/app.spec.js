const { test, expect } = require('@playwright/test');

test.describe('Tesla Charge Planner', () => {
  
  test.beforeEach(async ({ page }) => {
    // Go to the homepage (index.html)
    await page.goto('/');
  });

  test('should load the application with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Tesla Charge Planner/);
    await expect(page.getByRole('heading', { name: 'Tesla Charge Planner' })).toBeVisible();
  });

  test('should display calculation results by default', async ({ page }) => {
    // Since defaults are set (20% -> 100%), a recommendation should appear immediately
    await expect(page.getByText('Recommendation')).toBeVisible();
    await expect(page.getByText('Set Charger To')).toBeVisible();
    
    // Check if we have an Amp value displayed (e.g., "16A")
    const amps = page.locator('div.text-6xl');
    await expect(amps).toBeVisible();
    await expect(amps).toContainText(/A$/); // Ends with A
  });

  test('should open and close the About modal', async ({ page }) => {
    // Click the About button in the footer
    await page.getByRole('button', { name: 'About' }).click();

    // Verify modal content appears
    await expect(page.getByText('How to use:')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'About Charge Planner' })).toBeVisible();

    // Close the modal (clicking the X icon or background)
    // We'll target the close button inside the modal header
    await page.locator('.modal-content button').click();

    // Verify modal is gone (or fading out)
    await expect(page.getByText('How to use:')).not.toBeVisible();
  });

  test('should allow toggling between 13A and 16A', async ({ page }) => {
    // 16A is default (highlighted orange). 13A should be gray text (slate-500)
    const btn13 = page.getByRole('button', { name: '13A' });
    const btn16 = page.getByRole('button', { name: '16A' });

    // Click 13A
    await btn13.click();

    // Verify 13A is now active (using the orange class we added)
    await expect(btn13).toHaveClass(/bg-orange-500/);
    await expect(btn16).not.toHaveClass(/bg-orange-500/);
  });
});