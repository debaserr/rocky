import { test, expect } from '@playwright/test';

test('--rk-accent CSS custom property is lime #C6FF3D', async ({ page }) => {
  await page.goto('/');
  const accent = await page.evaluate(
    () => getComputedStyle(document.documentElement).getPropertyValue('--rk-accent').trim()
  );
  expect(accent.toLowerCase()).toBe('#c6ff3d');
});

test('--rk-bg CSS custom property is dark #0A0B0B', async ({ page }) => {
  await page.goto('/');
  const bg = await page.evaluate(
    () => getComputedStyle(document.documentElement).getPropertyValue('--rk-bg').trim()
  );
  expect(bg.toLowerCase()).toBe('#0a0b0b');
});
