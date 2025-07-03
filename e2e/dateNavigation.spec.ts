import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { format } from 'date-fns';

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

const INVALID_URLS: string[] = [
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

const VALID_URLS: string[] = [
  '/day/2025-01-01',
  '/day/2021-04-05',
  '/home',
  '/day/2021-04-07',
  '/',
  '/day/2028-07-12',
  '/day/2029-01-24',
];

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test.describe('Navigation through different dates', () => {
  test('Changing to invalid URL should redirect to home page', async ({ page }) => {
    for (const url of INVALID_URLS) {
      await goToInvalidURL(page, url);
    }
  });

  test('Changing to valid URL should redirect to the URL', async ({ page }) => {
    for (const url of VALID_URLS) {
      await goToValidURL(page, url);
    }
  });

  test('URL and year selector should change when changing year through selector', async ({
    page,
  }) => {
    const previousYear: string = String(new Date().getFullYear() - 1);
    await changeYear(page, previousYear);
    await checkYearSelector(page, previousYear);
    await checkOnlyURLYear(page, previousYear);

    const year2020: string = '2020';
    await changeYear(page, year2020);
    await checkYearSelector(page, year2020);
    await checkOnlyURLYear(page, year2020);

    const year2027: string = '2027';
    await changeYear(page, year2027);
    await checkYearSelector(page, year2027);
    await checkOnlyURLYear(page, year2027);
  });

  test('URL and month selector should change when changing month through selector', async ({
    page,
  }) => {
    const currentMonthIndex: number = new Date().getMonth();
    const previousMonthIndex: number = (currentMonthIndex + 11) % 12;
    await changeMonth(page, previousMonthIndex);
    await checkMonthSelector(page, previousMonthIndex);
    await checkOnlyURLMonth(page, previousMonthIndex);

    const januaryIndex: number = 0;
    await changeMonth(page, januaryIndex);
    await checkMonthSelector(page, januaryIndex);
    await checkOnlyURLMonth(page, januaryIndex);

    const decemberIndex: number = 11;
    await changeMonth(page, decemberIndex);
    await checkMonthSelector(page, decemberIndex);
    await checkOnlyURLMonth(page, decemberIndex);
  });

  test('URL and active day should change when changing day through Date Button', async ({
    page,
  }) => {
    const currentDay: number = new Date().getDate();
    await checkDaySelector(page, currentDay);
    const currentMonthIndex: number = new Date().getMonth();
    const previousMonthIndex: number = (currentMonthIndex + 11) % 12;
    await changeMonth(page, previousMonthIndex);
    await checkMonthSelector(page, previousMonthIndex);

    const fifteenthDayOfMonth: number = 15;
    await changeDay(page, fifteenthDayOfMonth);
    await checkDaySelector(page, fifteenthDayOfMonth);
    await checkOnlyURLDay(page, fifteenthDayOfMonth);

    const fourteenthDayOfMonth = fifteenthDayOfMonth - 1;
    await changeDay(page, fourteenthDayOfMonth);
    await checkDaySelector(page, fourteenthDayOfMonth);
    await checkOnlyURLDay(page, fourteenthDayOfMonth);

    const firstDayOfMonth: number = 1;
    await changeDay(page, firstDayOfMonth);
    await checkDaySelector(page, firstDayOfMonth);
    await checkOnlyURLDay(page, firstDayOfMonth);
  });

  test('Navigating to future date should display disabled buttons and habits', async ({ page }) => {
    await createDefaultHabits(page);
    await checkHabitsLengthInLocalStorage(page, HABITS.length);

    const today = new Date();
    const tommorow = new Date(today);
    tommorow.setDate(tommorow.getDate() + 1);
    const zeroBasedDay = tommorow.getDate() - 1;
    await changeFullDateThroughURL(page, format(tommorow, 'yyyy-MM-dd'));
    await expect(page.getByLabel('Select day').nth(zeroBasedDay)).toContainClass('active');
    await checkIfDayViewIsDisabled(page);

    const nextYear = (today.getFullYear() + 1).toString();
    await changeYear(page, nextYear);
    await checkOnlyURLYear(page, nextYear);
    await checkYearSelector(page, nextYear);
    await checkIfDayViewIsDisabled(page);

    const nextMonth: number = (today.getMonth() + 1) % 12;
    await changeMonth(page, nextMonth);
    await checkOnlyURLMonth(page, nextMonth);
    await checkMonthSelector(page, nextMonth);
    await checkIfDayViewIsDisabled(page);
  });
});

async function createDefaultHabits(page: Page) {
  for (const habit of HABITS) {
    await page.getByRole('button', { name: 'Create new habit' }).click();
    await page.getByLabel('Habit:').fill(habit);
    await page.getByRole('button', { name: 'Add habit' }).click();
  }
}

async function checkHabitsLengthInLocalStorage(page: Page, expected: number) {
  return page.waitForFunction(
    e => JSON.parse(localStorage.getItem('habits') || '[]')?.length === e,
    expected,
  );
}

async function changeYear(page: Page, year: string) {
  const yearSelect = page.getByLabel('Year:');
  await expect(yearSelect).toBeVisible();
  await yearSelect.selectOption(year);
}

async function checkYearSelector(page: Page, year: string) {
  const yearSelect = page.getByLabel('Year:');
  const selectedYearOption = yearSelect.locator('option:checked');
  await expect(selectedYearOption).toHaveText(year);
}

async function checkOnlyURLYear(page: Page, year: string) {
  const yearURLRegex = new RegExp(`/day/${year}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$`);
  await expect(page).toHaveURL(yearURLRegex);
}

async function changeMonth(page: Page, index: number) {
  const monthSelect = page.getByLabel('Month:');
  await expect(monthSelect).toBeVisible();
  await monthSelect.selectOption(MONTHS[index]);
}

async function checkMonthSelector(page: Page, index: number) {
  const monthSelect = page.getByLabel('Month:');
  const selectedMonthOption = monthSelect.locator('option:checked');
  await expect(selectedMonthOption).toHaveText(MONTHS[index]);
}

async function checkOnlyURLMonth(page: Page, index: number) {
  let convertedMonthDay: number | string = index + 1;
  if (convertedMonthDay >= 0 && convertedMonthDay <= 9) {
    convertedMonthDay = convertedMonthDay.toString().padStart(2, '0');
  }

  const monthURLRegex = new RegExp(`/day/\\d{4}-${convertedMonthDay}-(0[1-9]|[12][0-9]|3[01])$`);
  await expect(page).toHaveURL(monthURLRegex);
}
async function changeDay(page: Page, day: number) {
  const zeroBasedDay = day - 1;
  await page.getByLabel('Select day').nth(zeroBasedDay).click();
}

async function checkDaySelector(page: Page, day: number) {
  const zeroBasedDay = day - 1;
  await expect(page.getByLabel('Select day').nth(zeroBasedDay)).toContainClass('active');
}

async function checkOnlyURLDay(page: Page, day: number) {
  const dayURLRegex = new RegExp(`/day/\\d{4}-(0[1-9]|1[0-2])-(0${day}|${day})$`);
  await expect(page).toHaveURL(dayURLRegex);
}

async function goToInvalidURL(page: Page, url: string) {
  await page.goto(url);
  await expect(page).toHaveURL('/');
}

async function goToValidURL(page: Page, url: string) {
  await page.goto(url);
  await expect(page).toHaveURL(url);
}

async function changeFullDateThroughURL(page: Page, date: string) {
  await page.goto(`/day/${date}`);
  await expect(page).toHaveURL(`/day/${date}`);
}

async function checkIfDayViewIsDisabled(page: Page) {
  for (const habit of HABITS) {
    await checkIfAllHabitButtonsDisabled(page, habit);
  }
  await expect(page.getByRole('button', { name: 'Paused Habits List' })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Create new habit' })).toBeDisabled();
}

async function checkIfAllHabitButtonsDisabled(page: Page, habit: string) {
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
