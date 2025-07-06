import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';

export const ERROR_TOO_LONG_NAME = 'Name too long! Maximum is 20!';
export const ERROR_EMPTY_NAME = 'Habit name cannot be empty!';
export const ERROR_NAME_EXISTS = 'Habit with this name already exists!';
export const HABITS: string[] = ['Run a mile', 'Go to gym', 'Learn a skill'];

export async function checkHabitsLengthInLocalStorage(page: Page, expected: number) {
  return page.waitForFunction(
    e => JSON.parse(localStorage.getItem('habits') || '[]')?.length === e,
    expected,
  );
}

export async function addSingleHabit(page: Page, habit: string) {
  await page.getByLabel('Habit:').fill(habit);
  await page.getByRole('button', { name: 'Add habit' }).click();
}

export async function checkIfHabitIsAdded(page: Page, habit: string) {
  await expect(page.getByTestId(`habit-container-${habit}`)).toBeVisible();
}

export async function checkIfOnlyAddFormActive(page: Page) {
  await expect(page.getByTestId('app-header-section')).toContainClass('blur');
  await expect(page.getByTestId('app-main-section')).toContainClass('blur');
  await expect(page.getByTestId('add-habit-form')).toBeVisible();
}

export async function checkIfAddFormNotActive(page: Page) {
  await expect(page.getByTestId('app-header-section')).not.toContainClass('blur');
  await expect(page.getByTestId('app-main-section')).not.toContainClass('blur');
  await expect(page.getByTestId('add-habit-form')).toBeHidden();
}

export async function checkIfCurrentLengthReactive(page: Page) {
  await page.getByLabel('Habit:').fill('a'.repeat(21));
  await expect(page.getByTestId('habit-name-current-length')).toContainClass('error-msg');
  await page.getByLabel('Habit:').fill('a'.repeat(20));
  await expect(page.getByTestId('habit-name-current-length')).not.toContainClass('error-msg');
  await page.getByLabel('Habit:').fill('a'.repeat(21));
  await expect(page.getByTestId('habit-name-current-length')).toContainClass('error-msg');
}

export async function checkIfErrorMessageDisplayed(page: Page, message: string) {
  await expect(page.getByTestId('error-message')).toBeVisible();
  await expect(page.getByTestId('error-message')).toHaveText(message);
}
