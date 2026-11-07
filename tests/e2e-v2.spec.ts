import { test, expect } from '@playwright/test';
import { completeQuestionnaire } from './helpers/questionnaire';

test.describe('FindYourIdealMattress MVP E2E V2', () => {
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
    await expect(page.getByText(/best-fit mattresses/i)).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Your Best Match', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Best Value', exact: true })).toBeVisible();
  });
});
