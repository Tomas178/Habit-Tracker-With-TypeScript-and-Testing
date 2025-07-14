import { test, expect } from '@playwright/test';
import {
  HABITS_TO_ADD,
  checkHabitsLengthInLocalStorage,
  addSingleHabit,
  checkIfHabitIsAdded,
  checkIfOnlyAddFormActive,
  checkIfAddFormNotActive,
  checkIfCurrentLengthReactive,
  checkIfErrorMessageDisplayed,
} from './utils/habitHelpers';

import { ERROR_TOO_LONG_NAME, ERROR_NAME_EXISTS, ERROR_EMPTY_NAME } from '@/helpers/constants';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test.describe('Add new habits', () => {
  test('Should allow me to add habits', async ({ page }) => {
    await expect(page.getByTestId('habit-list')).toBeHidden();
    await page.getByRole('button', { name: 'Create new habit' }).click();
    await checkIfOnlyAddFormActive(page);
    await addSingleHabit(page, HABITS_TO_ADD[0]);
    await checkIfHabitIsAdded(page, HABITS_TO_ADD[0]);
    await checkHabitsLengthInLocalStorage(page, 1);
    await expect(page.getByTestId('habit-list')).toBeVisible();

    await page.getByRole('button', { name: 'Create new habit' }).click();
    await checkIfOnlyAddFormActive(page);
    await addSingleHabit(page, HABITS_TO_ADD[1]);
    await checkIfHabitIsAdded(page, HABITS_TO_ADD[1]);
    await checkHabitsLengthInLocalStorage(page, 2);
    await expect(page.getByTestId('habit-list')).toBeVisible();

    await page.getByRole('button', { name: 'Create new habit' }).click();
    await checkIfOnlyAddFormActive(page);
    await addSingleHabit(page, HABITS_TO_ADD[2]);
    await checkIfHabitIsAdded(page, HABITS_TO_ADD[2]);
    await checkHabitsLengthInLocalStorage(page, 3);
    await expect(page.getByTestId('habit-list')).toBeVisible();
  });

  test('Input value should be empty after closing Add form', async ({ page }) => {
    await page.getByRole('button', { name: 'Create new habit' }).click();
    await checkIfOnlyAddFormActive(page);
    await page.getByLabel('Habit:').fill(HABITS_TO_ADD[0]);
    await page.getByRole('button', { name: 'Close button' }).click();
    await checkIfAddFormNotActive(page);
    await page.getByRole('button', { name: 'Create new habit' }).click();
    await expect(page.getByLabel('Habit:')).toHaveText('');
  });
});

test.describe('Form validation & reactiveness', () => {
  test.beforeEach(async ({ page }) => {
    await page.getByRole('button', { name: 'Create new habit' }).click();
  });

  test('Check if current length text is reactive', async ({ page }) => {
    await checkIfCurrentLengthReactive(page);
  });

  test('Should display an error on too long habit name', async ({ page }) => {
    await addSingleHabit(page, 'a'.repeat(21));
    await checkIfErrorMessageDisplayed(page, ERROR_TOO_LONG_NAME);
  });

  test('Should display an error on an empty habit name', async ({ page }) => {
    await addSingleHabit(page, '');
    await checkIfErrorMessageDisplayed(page, ERROR_EMPTY_NAME);
  });

  test('Should display an error on already existing habit name', async ({ page }) => {
    await addSingleHabit(page, HABITS_TO_ADD[0]);
    await checkIfAddFormNotActive(page);
    await page.getByRole('button', { name: 'Create new habit' }).click();
    await checkIfOnlyAddFormActive(page);
    await addSingleHabit(page, HABITS_TO_ADD[0]);
    await checkIfErrorMessageDisplayed(page, ERROR_NAME_EXISTS);
  });
});
