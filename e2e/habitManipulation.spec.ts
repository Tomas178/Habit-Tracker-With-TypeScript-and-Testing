import { test, expect } from '@playwright/test';
import { HABITS, checkHabitsLengthInLocalStorage } from './utils/habitHelpers';
import {
  createDefaultHabits,
  editHabit,
  unpauseHabit,
  checkIfPausedHabitsFormNotActive,
  toggleHabitDone,
  toggleHabitNotDone,
  removeHabit,
} from './utils/habitManipulationHelpers';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await createDefaultHabits(page);
  await checkHabitsLengthInLocalStorage(page, HABITS.length);
});

test.describe('Habit status toggling', () => {
  test('Allows editing habits', async ({ page }) => {
    const newHabitName = 'Make food';
    await editHabit(page, HABITS[0], newHabitName);
    await expect(page.getByTestId(`habit-container-${newHabitName}`)).toHaveText(newHabitName);
    await checkHabitsLengthInLocalStorage(page, 3);
  });

  test('Allows pausing habits', async ({ page }) => {
    for (const habit of HABITS) {
      await page
        .getByTestId(`habit-container-${habit}`)
        .getByRole('button', { name: 'Start stop Button' })
        .click();
    }
    await expect(page.getByTestId('habit-list')).toBeHidden();
    await checkHabitsLengthInLocalStorage(page, 3);
  });

  test('Allows unpausing habits', async ({ page }) => {
    for (const habit of HABITS) {
      await page
        .getByTestId(`habit-container-${habit}`)
        .getByRole('button', { name: 'Start stop button' })
        .click();
    }

    await page.getByLabel('Paused Habits List').click();

    for (const habit of HABITS) {
      await unpauseHabit(page, habit);
    }

    await page.getByRole('button', { name: 'Close Button' }).click();
    await checkIfPausedHabitsFormNotActive(page);

    // Check if the habits are visible when exited from the Paused Habits List
    for (const habit of HABITS) {
      await expect(
        page.getByTestId('habit-list').getByTestId(`habit-container-${habit}`),
      ).toBeVisible();
    }

    await checkHabitsLengthInLocalStorage(page, HABITS.length);
  });

  test('Allows changing habit status to done/not done', async ({ page }) => {
    // Click done on every habit
    for (const habit of HABITS) {
      await toggleHabitDone(page, habit);
    }

    // Secondly, click undone on every habit
    for (const habit of HABITS) {
      await toggleHabitNotDone(page, habit);
    }

    await checkHabitsLengthInLocalStorage(page, HABITS.length);
  });

  test('Allows removing habit', async ({ page }) => {
    for (const habit of HABITS) {
      await removeHabit(page, habit);
    }
    await checkHabitsLengthInLocalStorage(page, 0);
  });
});
