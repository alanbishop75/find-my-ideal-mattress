import { defineConfig } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000';
const useExternalBaseUrl = Boolean(process.env.PLAYWRIGHT_BASE_URL);

export default defineConfig({
  testDir: './tests',
  testMatch: '*.spec.ts',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: process.env.CI ? [['github'], ['line']] : [['list']],
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  webServer: useExternalBaseUrl
    ? undefined
    : {
        command: process.env.CI ? 'npm run start' : 'npm run dev',
        url: baseURL,
        reuseExistingServer: false,
        timeout: 120000,
      },
});
