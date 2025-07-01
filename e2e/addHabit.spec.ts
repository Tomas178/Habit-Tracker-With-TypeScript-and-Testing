import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

const ERROR_TOO_LONG_NAME = 'Name too long! Maximum is 20!';
const ERROR_EMPTY_NAME = 'Habit name cannot be empty!';
const ERROR_NAME_EXISTS = 'Habit with this name already exists!';
const HABITS: string[] = ['Run a mile', 'Go to gym', 'Learn a skill'];

test.describe('Add new habits', () => {
  test('Should allow me to add habits', async ({ page }) => {
    await expect(page.getByTestId('habit-list')).toBeHidden();
    await page.getByRole('button', { name: 'Create new habit' }).click();
    await checkIfOnlyAddFormActive(page);
    await addSingleHabit(page, HABITS[0]);
    await checkIfHabitIsAdded(page, HABITS[0]);
    await checkHabitsLengthInLocalStorage(page, 1);
    await expect(page.getByTestId('habit-list')).toBeVisible();

    await page.getByRole('button', { name: 'Create new habit' }).click();
    await checkIfOnlyAddFormActive(page);
    await addSingleHabit(page, HABITS[1]);
    await checkIfHabitIsAdded(page, HABITS[1]);
    await checkHabitsLengthInLocalStorage(page, 2);
    await expect(page.getByTestId('habit-list')).toBeVisible();

    await page.getByRole('button', { name: 'Create new habit' }).click();
    await checkIfOnlyAddFormActive(page);
    await addSingleHabit(page, HABITS[2]);
    await checkIfHabitIsAdded(page, HABITS[2]);
    await checkHabitsLengthInLocalStorage(page, 3);
    await expect(page.getByTestId('habit-list')).toBeVisible();
  });

  test('Should display errors on invalid habit names', async ({ page }) => {
    await page.getByRole('button', { name: 'Create new habit' }).click();
    await checkIfCurrentLengthReactive(page);
    await addSingleHabit(page, 'a'.repeat(21));
    await checkIfErrorMessageDisplayed(page, ERROR_TOO_LONG_NAME);

    await addSingleHabit(page, '');
    await checkIfErrorMessageDisplayed(page, ERROR_EMPTY_NAME);

    await addSingleHabit(page, HABITS[0]);
    await checkIfAddFormNotActive(page);
    await page.getByRole('button', { name: 'Create new habit' }).click();
    await checkIfOnlyAddFormActive(page);
    await addSingleHabit(page, HABITS[0]);
    await checkIfErrorMessageDisplayed(page, ERROR_NAME_EXISTS);
  });

  test('Input value should be empty after closing Add form', async ({ page }) => {
    await page.getByRole('button', { name: 'Create new habit' }).click();
    await checkIfOnlyAddFormActive(page);
    await page.getByLabel('Habit:').fill(HABITS[0]);
    await page.getByRole('button', { name: 'Close form' }).click();
    await checkIfAddFormNotActive(page);
    await page.getByRole('button', { name: 'Create new habit' }).click();
    await expect(page.getByLabel('Habit:')).toHaveText('');
  });
});

async function checkHabitsLengthInLocalStorage(page: Page, expected: number) {
  return page.waitForFunction(
    e => JSON.parse(localStorage.getItem('habits') || '[]')?.length === e,
    expected,
  );
}

async function addSingleHabit(page: Page, habit: string) {
  await page.getByLabel('Habit:').fill(habit);
  await page.getByRole('button', { name: 'Add habit' }).click();
}

async function checkIfHabitIsAdded(page: Page, habit: string) {
  await expect(page.getByTestId('habit-container').filter({ hasText: habit })).toBeVisible();
}

async function checkIfOnlyAddFormActive(page: Page) {
  await expect(page.getByTestId('app-header-section')).toContainClass('blur');
  await expect(page.getByTestId('app-main-section')).toContainClass('blur');
  await expect(page.getByTestId('add-habit-form')).toBeVisible();
}

async function checkIfAddFormNotActive(page: Page) {
  await expect(page.getByTestId('app-header-section')).not.toContainClass('blur');
  await expect(page.getByTestId('app-main-section')).not.toContainClass('blur');
  await expect(page.getByTestId('add-habit-form')).toBeHidden();
}

async function checkIfCurrentLengthReactive(page: Page) {
  await page.getByLabel('Habit:').fill('a'.repeat(21));
  await expect(page.getByTestId('habit-name-current-length')).toContainClass('error-msg');
  await page.getByLabel('Habit:').fill('a'.repeat(20));
  await expect(page.getByTestId('habit-name-current-length')).not.toContainClass('error-msg');
  await page.getByLabel('Habit:').fill('a'.repeat(21));
  await expect(page.getByTestId('habit-name-current-length')).toContainClass('error-msg');
}

async function checkIfErrorMessageDisplayed(page: Page, message: string) {
  await expect(page.getByTestId('error-message')).toBeVisible();
  await expect(page.getByTestId('error-message')).toHaveText(message);
}
