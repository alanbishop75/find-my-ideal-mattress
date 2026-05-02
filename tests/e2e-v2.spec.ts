import { test, expect } from '@playwright/test';
import { completeQuestionnaire } from './helpers/questionnaire';

test.describe('FindMyIdealPillow MVP E2E V2', () => {
  test.setTimeout(60000);

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('cookie_consent', 'denied');
    });
  });

  test('V2 questionnaire flow works and navigates to v2 results', async ({ page }) => {
    await page.goto('/questionnaire/v2');

    await completeQuestionnaire(page);

    await expect(page).toHaveURL(/results/);
    await expect(page.getByText(/best-fit pillows/i)).toBeVisible();
    await expect(page.getByText(/Best Match/i)).toBeVisible();
    await expect(page.getByText(/Best Value/i)).toBeVisible();
  });
});
