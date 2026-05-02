import { expect, type Page } from '@playwright/test';

export async function completeQuestionnaire(page: Page, maxSteps = 14) {
  await expect(page.getByTestId('questionnaire-ready')).toBeAttached();

  for (let i = 0; i < maxSteps; i++) {
    if (page.url().includes('/results')) return;

    const progressText = await page.getByText(/% complete/i).first().textContent();
    const before = Number((progressText ?? '0').replace(/[^0-9]/g, '')) || 0;

    const option = page.getByTestId('question-option').first();
    await expect(option).toBeVisible();
    await expect(option).toBeEnabled();
    await option.click();

    if (before >= 100) {
      await expect(page).toHaveURL(/results/, { timeout: 10000 });
      return;
    }

    await expect
      .poll(
        async () => {
          if (page.url().includes('/results')) return 101;
          const nextText = await page.getByText(/% complete/i).first().textContent();
          return Number((nextText ?? '0').replace(/[^0-9]/g, '')) || 0;
        },
        { timeout: 10000 },
      )
      .toBeGreaterThan(before);
  }

  await expect(page).toHaveURL(/results/);
}
