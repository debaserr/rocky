import { test, expect } from '@playwright/test';

// /dev/ui is a dev-only route that renders all Rocky UI primitives.
test('RKButton renders without errors', async ({ page }) => {
  await page.goto('/dev/ui');
  await expect(page.getByTestId('rk-button-primary')).toBeVisible();
});

test('RKCard renders without errors', async ({ page }) => {
  await page.goto('/dev/ui');
  await expect(page.getByTestId('rk-card')).toBeVisible();
});

test('RKLabel renders without errors', async ({ page }) => {
  await page.goto('/dev/ui');
  await expect(page.getByTestId('rk-label')).toBeVisible();
});

test('PhoneFooterBar renders without errors', async ({ page }) => {
  await page.goto('/dev/ui');
  await expect(page.getByTestId('phone-footer-bar')).toBeVisible();
});

test('Icons render without errors', async ({ page }) => {
  await page.goto('/dev/ui');
  await expect(page.getByTestId('icons')).toBeVisible();
});
