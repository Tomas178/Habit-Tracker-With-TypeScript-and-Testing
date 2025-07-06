import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { HABITS } from './habitHelpers';

export const MONTHS: string[] = [
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

export const INVALID_URLS: string[] = [
  '/day/0110-01-05',
  '/day/2019-12-30',
  '/day/2031-01-01',
  '/day/2004-05-26',
  '/day/2025-01-1',
  '/day/2024-1-15',
  '/day/2023-04-012',
  '/test-example',
  '/invalid/route',
];

export const VALID_URLS: string[] = [
  '/day/2025-01-01',
  '/day/2021-04-05',
  '/home',
  '/day/2021-04-07',
  '/',
  '/day/2028-07-12',
  '/day/2029-01-24',
];

export async function changeYear(page: Page, year: string) {
  const yearSelect = page.getByLabel('Year:');
  await expect(yearSelect).toBeVisible();
  await yearSelect.selectOption(year);
}

export async function checkYearSelector(page: Page, year: string) {
  const yearSelect = page.getByLabel('Year:');
  const selectedYearOption = yearSelect.locator('option:checked');
  await expect(selectedYearOption).toHaveText(year);
}

export async function checkOnlyURLYear(page: Page, year: string) {
  const yearURLRegex = new RegExp(`/day/${year}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$`);
  await expect(page).toHaveURL(yearURLRegex);
}

export async function changeMonth(page: Page, index: number) {
  const monthSelect = page.getByLabel('Month:');
  await expect(monthSelect).toBeVisible();
  await monthSelect.selectOption(MONTHS[index]);
}

export async function checkMonthSelector(page: Page, index: number) {
  const monthSelect = page.getByLabel('Month:');
  const selectedMonthOption = monthSelect.locator('option:checked');
  await expect(selectedMonthOption).toHaveText(MONTHS[index]);
}

export async function checkOnlyURLMonth(page: Page, index: number) {
  let convertedMonthDay: number | string = index + 1;
  if (convertedMonthDay >= 0 && convertedMonthDay <= 9) {
    convertedMonthDay = convertedMonthDay.toString().padStart(2, '0');
  }

  const monthURLRegex = new RegExp(`/day/\\d{4}-${convertedMonthDay}-(0[1-9]|[12][0-9]|3[01])$`);
  await expect(page).toHaveURL(monthURLRegex);
}
export async function changeDay(page: Page, day: number) {
  const zeroBasedDay = day - 1;
  await page.getByLabel('Select day').nth(zeroBasedDay).click();
}

export async function checkDaySelector(page: Page, day: number) {
  const zeroBasedDay = day - 1;
  await expect(page.getByLabel('Select day').nth(zeroBasedDay)).toContainClass('active');
}

export async function checkOnlyURLDay(page: Page, day: number) {
  const dayURLRegex = new RegExp(`/day/\\d{4}-(0[1-9]|1[0-2])-(0${day}|${day})$`);
  await expect(page).toHaveURL(dayURLRegex);
}

export async function goToInvalidURL(page: Page, url: string) {
  await page.goto(url);
  await expect(page).toHaveURL('/');
}

export async function goToValidURL(page: Page, url: string) {
  await page.goto(url);
  await expect(page).toHaveURL(url);
}

export async function changeFullDateThroughURL(page: Page, date: string) {
  await page.goto(`/day/${date}`);
  await expect(page).toHaveURL(`/day/${date}`);
}

export async function checkIfDayViewIsDisabled(page: Page) {
  for (const habit of HABITS) {
    await checkIfAllHabitButtonsDisabled(page, habit);
  }
  await expect(page.getByRole('button', { name: 'Paused Habits List' })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Create new habit' })).toBeDisabled();
}

export async function checkIfAllHabitButtonsDisabled(page: Page, habit: string) {
  await expect(
    page.getByTestId(`habit-container-${habit}`).getByRole('button', { name: 'Edit button' }),
  ).toBeDisabled();
  await expect(
    page.getByTestId(`habit-container-${habit}`).getByRole('button', { name: 'Start stop button' }),
  ).toBeDisabled();
  await expect(
    page.getByTestId(`habit-container-${habit}`).getByRole('button', { name: 'Toggle button' }),
  ).toBeDisabled();
  await expect(
    page.getByTestId(`habit-container-${habit}`).getByRole('button', { name: 'Remove button' }),
  ).toBeDisabled();
}
