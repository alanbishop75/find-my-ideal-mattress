import { test, expect } from '@playwright/test';
import { completeQuestionnaire } from './helpers/questionnaire';

test.describe('FindMyIdealPillow MVP E2E Smoke', () => {
  test.setTimeout(60000);

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('cookie_consent', 'denied');
    });
  });

  test('Homepage renders and navigates to questionnaire', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1, name: /find your ideal pillow/i })).toBeVisible();
    await page.getByRole('link', { name: /start fitting/i }).click();
    await expect(page).toHaveURL(/questionnaire/);
  });

  test('Questionnaire flow works and navigates to results', async ({ page }) => {
    await page.goto('/pillow/questionnaire');

    await completeQuestionnaire(page);

    await expect(page).toHaveURL(/results/);
    await expect(page.getByText(/best-fit pillows/i)).toBeVisible();
    await expect(page.getByText(/Best Match/i)).toBeVisible();
    await expect(page.getByText(/Strong Alternative/i)).toBeVisible();
    await expect(page.getByText(/Best Value/i)).toBeVisible();
  });

  test('Footer links and contact page are reachable', async ({ page }) => {
    await page.goto('/');
    const footerContactLink = page.locator('footer a[href="/contact"]');
    await expect(footerContactLink).toHaveCount(1);

    await page.goto('/contact');
    await expect(page).toHaveURL(/contact/);
    await expect(page.getByRole('heading', { name: /contact us/i })).toBeVisible();
    await expect(page.getByText(/Showing information for the (United States|United Kingdom)/i)).toBeVisible();
  });

  test('Privacy page shows legal region indicator', async ({ page }) => {
    await page.goto('/privacy-policy');
    await expect(page.getByRole('heading', { name: /privacy policy/i })).toBeVisible();
    await expect(page.getByText(/Showing legal details for the (United States|United Kingdom)/i)).toBeVisible();
  });

  test('Admin route is reachable (hub or login)', async ({ page }) => {
    await page.goto('/admin/login');
    await expect(page.getByRole('heading', { name: /^Admin$/i })).toBeVisible();
  });
});
