import { test, expect } from '@playwright/test';
import { completeQuestionnaire } from './helpers/questionnaire';

test.describe('FindYourIdealMattress MVP E2E Smoke', () => {
  test.setTimeout(60000);

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('cookie_consent', 'denied');
    });
  });

  test('Homepage renders and navigates to questionnaire', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1, name: /find your ideal mattress/i })).toBeVisible();
    await page.getByRole('link', { name: /start quiz/i }).click();
    await expect(page).toHaveURL(/questionnaire/);
  });

  test('Questionnaire flow works and navigates to results', async ({ page }) => {
    await page.goto('/mattress/questionnaire');

    await completeQuestionnaire(page);

    await expect(page).toHaveURL(/results/);
    await expect(page.getByText(/best-fit mattresses/i)).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Your Best Match', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Strong Alternative', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Best Value', exact: true })).toBeVisible();
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
