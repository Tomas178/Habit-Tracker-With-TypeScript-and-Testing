import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

const ERROR_TOO_LONG_NAME = 'Name too long! Maximum is 20!';
const ERROR_EMPTY_NAME = 'Habit name cannot be empty!';
const ERROR_NAME_EXISTS = 'Habit with this name already exists!';
const HABITS: string[] = ['Run a mile', 'Go to gym', 'Learn a skill'];

test('Add Habit flow', async ({ page }) => {
  await expect(page.getByTestId('habit-list')).toBeHidden();
  await page.getByRole('button', { name: 'Create new habit' }).click();
  await expect(page.getByTestId('app-header-section')).toHaveClass('blur');
  await expect(page.getByTestId('app-main-section')).toHaveClass('blur');
  await expect(page.getByTestId('add-habit-form')).toBeVisible();

  await page.getByLabel('Habit:').fill('a'.repeat(21));
  await expect(page.getByTestId('habit-name-current-length')).toHaveClass('error-msg');
  await page.getByLabel('Habit:').fill('a'.repeat(20));
  await expect(page.getByTestId('habit-name-current-length')).not.toHaveClass('error-msg');
  await page.getByLabel('Habit:').fill('a'.repeat(21));
  await expect(page.getByTestId('habit-name-current-length')).toHaveClass('error-msg');
  await page.getByRole('button', { name: 'Add habit' }).click();
  await expect(page.getByTestId('error-message')).toBeVisible();
  await expect(page.getByTestId('error-message')).toHaveText(ERROR_TOO_LONG_NAME);

  await page.getByLabel('Habit:').fill('');
  await page.getByRole('button', { name: 'Add habit' }).click();
  await expect(page.getByTestId('error-message')).toBeVisible();
  await expect(page.getByTestId('error-message')).toHaveText(ERROR_EMPTY_NAME);

  await page.getByLabel('Habit:').fill(HABITS[0]);
  await page.getByRole('button', { name: 'Add habit' }).click();

  await expect(page.getByTestId('app-header-section')).not.toHaveClass('blur');
  await expect(page.getByTestId('app-main-section')).not.toHaveClass('blur');
  await expect(page.getByTestId('habit-list')).toBeVisible();
  await expect(page.getByTestId('habit-container').filter({ hasText: HABITS[0] })).toBeVisible();
  await checkHabitsLengthInLocalStorage(page, 1);

  await page.getByRole('button', { name: 'Create new habit' }).click();
  await expect(page.getByTestId('app-header-section')).toHaveClass('blur');
  await expect(page.getByTestId('app-main-section')).toHaveClass('blur');
  await expect(page.getByTestId('add-habit-form')).toBeVisible();
  await page.getByLabel('Habit:').fill(HABITS[0]);
  await page.getByRole('button', { name: 'Add habit' }).click();
  await expect(page.getByTestId('error-message')).toBeVisible();
  await expect(page.getByTestId('error-message')).toHaveText(ERROR_NAME_EXISTS);

  await page.getByLabel('Habit:').fill(HABITS[1]);
  await page.getByRole('button', { name: 'Add habit' }).click();
  await expect(page.getByTestId('app-header-section')).not.toHaveClass('blur');
  await expect(page.getByTestId('app-main-section')).not.toHaveClass('blur');
  await expect(page.getByTestId('habit-list')).toBeVisible();
  await expect(page.getByTestId('habit-container').filter({ hasText: HABITS[0] })).toBeVisible();
  await expect(page.getByTestId('habit-container').filter({ hasText: HABITS[1] })).toBeVisible();
  await checkHabitsLengthInLocalStorage(page, 2);

  await page.getByRole('button', { name: 'Create new habit' }).click();
  await expect(page.getByTestId('app-header-section')).toHaveClass('blur');
  await expect(page.getByTestId('app-main-section')).toHaveClass('blur');
  await expect(page.getByTestId('add-habit-form')).toBeVisible();
  await page.getByLabel('Habit:').fill(HABITS[2]);
  await page.getByRole('button', { name: 'Add habit' }).click();
  await expect(page.getByTestId('app-header-section')).not.toHaveClass('blur');
  await expect(page.getByTestId('app-main-section')).not.toHaveClass('blur');
  await expect(page.getByTestId('habit-list')).toBeVisible();
  await expect(page.getByTestId('habit-container').filter({ hasText: HABITS[0] })).toBeVisible();
  await expect(page.getByTestId('habit-container').filter({ hasText: HABITS[1] })).toBeVisible();
  await expect(page.getByTestId('habit-container').filter({ hasText: HABITS[2] })).toBeVisible();
  await checkHabitsLengthInLocalStorage(page, 3);
});

async function checkHabitsLengthInLocalStorage(page: Page, expected: number) {
  return page.waitForFunction(
    e => JSON.parse(localStorage.getItem('habits') || '[]')?.length === e,
    expected,
  );
}
