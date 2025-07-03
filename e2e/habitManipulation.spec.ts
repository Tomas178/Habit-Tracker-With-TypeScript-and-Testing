import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

const HABITS: string[] = ['Run a mile', 'Go to gym', 'Learn a skill'];

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

async function checkIfEditHabitFormActive(page: Page) {
  await expect(page.getByTestId('app-header-section')).toContainClass('blur');
  await expect(page.getByTestId('app-main-section')).toContainClass('blur');
  await expect(page.getByTestId('edit-habit-form')).toBeVisible();
}

async function checkIfEditHabitFormNotActive(page: Page) {
  await expect(page.getByTestId('app-header-section')).not.toContainClass('blur');
  await expect(page.getByTestId('app-main-section')).not.toContainClass('blur');
  await expect(page.getByTestId('edit-habit-form')).toBeHidden();
}

async function editHabit(page: Page, habitToEdit: string, newHabitName: string) {
  await page
    .getByTestId(`habit-container-${habitToEdit}`)
    .getByRole('button', { name: 'Edit button' })
    .click();
  await checkIfEditHabitFormActive(page);
  await page.getByLabel('Habit:').fill(newHabitName);
  await page.getByRole('button', { name: 'Change habit' }).click();
  await checkIfEditHabitFormNotActive(page);
}

async function checkIfPausedHabitsFormActive(page: Page) {
  await expect(page.getByTestId('app-header-section')).toContainClass('blur');
  await expect(page.getByTestId('app-main-section')).toContainClass('blur');
  await expect(page.getByTestId('paused-habits-modal')).toBeVisible();
}

async function checkIfPausedHabitsFormNotActive(page: Page) {
  await expect(page.getByTestId('app-header-section')).not.toContainClass('blur');
  await expect(page.getByTestId('app-main-section')).not.toContainClass('blur');
  await expect(page.getByTestId('paused-habits-modal')).toBeHidden();
}

async function unpauseHabit(page: Page, habit: string) {
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

async function toggleHabitDone(page: Page, habit: string) {
  await page
    .getByTestId(`habit-container-${habit}`)
    .getByRole('button', { name: 'Toggle button' })
    .click();
  await expect(page.getByTestId(`habit-container-${habit}`)).toContainClass('done');
}

async function toggleHabitNotDone(page: Page, habit: string) {
  await page
    .getByTestId(`habit-container-${habit}`)
    .getByRole('button', { name: 'Toggle button' })
    .click();
  await expect(page.getByTestId(`habit-container-${habit}`)).not.toContainClass('done');
}

async function checkIfRemoveHabitFormActive(page: Page) {
  await expect(page.getByTestId('app-header-section')).toContainClass('blur');
  await expect(page.getByTestId('app-main-section')).toContainClass('blur');
  await expect(page.getByTestId('remove-habit-form')).toBeVisible();
}

async function checkIfRemoveHabitFormNotActive(page: Page) {
  await expect(page.getByTestId('app-header-section')).not.toContainClass('blur');
  await expect(page.getByTestId('app-main-section')).not.toContainClass('blur');
  await expect(page.getByTestId('remove-habit-form')).toBeHidden();
}

async function removeHabit(page: Page, habit: string) {
  await page
    .getByTestId(`habit-container-${habit}`)
    .getByRole('button', { name: 'Remove button' })
    .click();
  await checkIfRemoveHabitFormActive(page);
  await page.getByRole('button', { name: 'Confirm' }).click();
  await checkIfRemoveHabitFormNotActive(page);
}
