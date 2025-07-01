import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

const HABITS: string[] = ['Run a mile', 'Go to gym', 'Learn a skill'];
const MONTHS: string[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

test('Date navigation flow', async ({ page }) => {
  const yearSelect = page.getByLabel('Year:');
  await expect(yearSelect).toBeVisible();
  const monthSelect = page.getByLabel('Month:');
  await expect(monthSelect).toBeVisible();
  const dateButtonsWrapper = page.getByTestId('date-buttons-wrapper');
  await expect(dateButtonsWrapper).toBeVisible();
  await expect(dateButtonsWrapper.filter({ has: page.getByLabel('Select day') })).toBeVisible();
  const habitList = page.getByTestId('habit-list');
  await expect(habitList).toBeHidden();

  await yearSelect.selectOption('2025');
  await monthSelect.selectOption('May');
  await page.getByLabel('Select day').first().click();
  await expect(page).toHaveURL('/day/2025-05-01');

  await page.getByRole('link', { name: 'Habit Tracker' }).click();
  await expect(page).toHaveURL('/');
  const selectedYearOption = yearSelect.locator('option:checked');
  await expect(selectedYearOption).toHaveText(String(new Date().getFullYear()));
  const selectedMonthOption = monthSelect.locator('option:checked');
  await expect(selectedMonthOption).toHaveText(MONTHS[new Date().getMonth()]);

  await page.getByRole('button', { name: 'Create new habit' }).click();
  await page.getByLabel('Habit:').fill('Read a book');
  await page.getByRole('button', { name: 'Add habit' }).click();
  await expect(habitList).toBeVisible();
  await expect(habitList).not.toHaveClass('disabled');
  // check if the next day of dateOfToday is disabled.
  await monthSelect.selectOption(MONTHS[new Date().getMonth() + 1]);
  await expect(habitList).toBeVisible();
  await expect(habitList).toContainClass('disabled');
});

async function createDefaultHabits(page: Page) {
  for (const habit of HABITS) {
    await page.getByRole('button', { name: 'Create new habit' }).click();
    await page.getByLabel('Habit:').fill(habit);
    await page.getByRole('button', { name: 'Add habit' }).click();
  }
}
