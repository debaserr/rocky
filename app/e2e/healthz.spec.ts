import { test, expect } from '@playwright/test';

test('GET /api/healthz returns 200 with ok and db connected', async ({ request }) => {
  const response = await request.get('/api/healthz');
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body).toEqual({ ok: true, db: 'connected' });
});
