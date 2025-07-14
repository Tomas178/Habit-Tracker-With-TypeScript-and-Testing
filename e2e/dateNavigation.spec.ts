import { test, expect } from '@playwright/test';
import { format } from 'date-fns';
import { HABITS_TO_ADD, checkHabitsLengthInLocalStorage } from './utils/habitHelpers';
import { createDefaultHabits } from './utils/habitManipulationHelpers';
import {
  INVALID_URLS,
  VALID_URLS,
  goToInvalidURL,
  goToValidURL,
  changeYear,
  checkYearSelector,
  checkOnlyURLYear,
  changeMonth,
  checkMonthSelector,
  checkOnlyURLMonth,
  changeDay,
  checkDaySelector,
  checkOnlyURLDay,
  changeFullDateThroughURL,
  checkIfDayViewIsDisabled,
} from './utils/dateNavigationHelpers';

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
    await checkHabitsLengthInLocalStorage(page, HABITS_TO_ADD.length);

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
