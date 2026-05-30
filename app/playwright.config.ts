import { defineConfig, devices } from '@playwright/test';
import { config as loadEnv } from 'dotenv';
import * as path from 'path';

// Load .env.local so DATABASE_URL_TEST is available for the webServer env override below.
loadEnv({ path: path.resolve(process.cwd(), '.env.local'), override: false });

export default defineConfig({
  testDir: './e2e',
  globalSetup: './e2e/global-setup.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json',
      },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    env: {
      // Override DATABASE_URL with the test branch only when DATABASE_URL_TEST is set.
      // When unset, Next.js reads .env.local directly — don't override with empty string.
      ...(process.env.DATABASE_URL_TEST ? { DATABASE_URL: process.env.DATABASE_URL_TEST } : {}),
      PLAYWRIGHT: 'true',
    },
  },
});
