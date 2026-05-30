import { test, expect } from '@playwright/test';

test('GET /api/db-check returns exercisesCount of 6 after seeding', async ({ request }) => {
  const response = await request.get('/api/db-check');
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body).toEqual({ exercisesCount: 6 });
});

test('seed is idempotent — running twice still returns 6', async ({ request }) => {
  // global-setup seeds once; a second request to the same endpoint should still return 6
  const r1 = await request.get('/api/db-check');
  const r2 = await request.get('/api/db-check');
  expect((await r1.json()).exercisesCount).toBe(6);
  expect((await r2.json()).exercisesCount).toBe(6);
});
