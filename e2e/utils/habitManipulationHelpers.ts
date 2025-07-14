import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { HABITS_TO_ADD } from './habitHelpers';

export async function createDefaultHabits(page: Page) {
  for (const habit of HABITS_TO_ADD) {
    await page.getByRole('button', { name: 'Create new habit' }).click();
    await page.getByLabel('Habit:').fill(habit);
    await page.getByRole('button', { name: 'Add habit' }).click();
  }
}

export async function checkIfEditHabitFormActive(page: Page) {
  await expect(page.getByTestId('app-header-section')).toContainClass('blur');
  await expect(page.getByTestId('app-main-section')).toContainClass('blur');
  await expect(page.getByTestId('edit-habit-form')).toBeVisible();
}

export async function checkIfEditHabitFormNotActive(page: Page) {
  await expect(page.getByTestId('app-header-section')).not.toContainClass('blur');
  await expect(page.getByTestId('app-main-section')).not.toContainClass('blur');
  await expect(page.getByTestId('edit-habit-form')).toBeHidden();
}

export async function editHabit(page: Page, habitToEdit: string, newHabitName: string) {
  await page
    .getByTestId(`habit-container-${habitToEdit}`)
    .getByRole('button', { name: 'Edit button' })
    .click();
  await checkIfEditHabitFormActive(page);
  await page.getByLabel('Habit:').fill(newHabitName);
  await page.getByRole('button', { name: 'Change habit' }).click();
  await checkIfEditHabitFormNotActive(page);
}

export async function checkIfPausedHabitsFormActive(page: Page) {
  await expect(page.getByTestId('app-header-section')).toContainClass('blur');
  await expect(page.getByTestId('app-main-section')).toContainClass('blur');
  await expect(page.getByTestId('paused-habits-modal')).toBeVisible();
}

export async function checkIfPausedHabitsFormNotActive(page: Page) {
  await expect(page.getByTestId('app-header-section')).not.toContainClass('blur');
  await expect(page.getByTestId('app-main-section')).not.toContainClass('blur');
  await expect(page.getByTestId('paused-habits-modal')).toBeHidden();
}

export async function unpauseHabit(page: Page, habit: string) {
  await page
    .getByTestId(`habit-container-${habit}`)
    .getByRole('button', { name: 'Unpause button' })
    .click();
  await checkIfPausedHabitsFormActive(page);
  await expect(
    page.getByTestId('habit-list').getByTestId(`habit-container-${habit}`),
  ).toBeVisible();
  await expect(
    page
      .getByTestId('paused-habits-modal')
      .getByTestId(`habit-container-${habit}`)
      .getByRole('button', { name: 'Unpause button' }),
  ).toBeHidden();
}

export async function toggleHabitDone(page: Page, habit: string) {
  await page
    .getByTestId(`habit-container-${habit}`)
    .getByRole('button', { name: 'Toggle button' })
    .click();
  await expect(page.getByTestId(`habit-container-${habit}`)).toContainClass('done');
}

export async function toggleHabitNotDone(page: Page, habit: string) {
  await page
    .getByTestId(`habit-container-${habit}`)
    .getByRole('button', { name: 'Toggle button' })
    .click();
  await expect(page.getByTestId(`habit-container-${habit}`)).not.toContainClass('done');
}

export async function checkIfRemoveHabitFormActive(page: Page) {
  await expect(page.getByTestId('app-header-section')).toContainClass('blur');
  await expect(page.getByTestId('app-main-section')).toContainClass('blur');
  await expect(page.getByTestId('remove-habit-form')).toBeVisible();
}

export async function checkIfRemoveHabitFormNotActive(page: Page) {
  await expect(page.getByTestId('app-header-section')).not.toContainClass('blur');
  await expect(page.getByTestId('app-main-section')).not.toContainClass('blur');
  await expect(page.getByTestId('remove-habit-form')).toBeHidden();
}

export async function removeHabit(page: Page, habit: string) {
  await page
    .getByTestId(`habit-container-${habit}`)
    .getByRole('button', { name: 'Remove button' })
    .click();
  await checkIfRemoveHabitFormActive(page);
  await page.getByRole('button', { name: 'Confirm' }).click();
  await checkIfRemoveHabitFormNotActive(page);
}
