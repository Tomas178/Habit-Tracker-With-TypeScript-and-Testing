import { describe, it, expect, beforeEach } from 'vitest';
import habitData from '@/stores/habitData';
import formState from '@/stores/formState';

const { error } = formState;

const emptyHabitName: string = '';
const tooLongHabitName: string = 'a'.repeat(21);
const validHabitName: string = 'Read a book';
const secondValidHabitName: string = 'Learn a skill';

const ERROR_TOO_LONG_NAME: string = 'Name too long! Maximum is 20!';
const ERROR_EMPTY_NAME: string = 'Habit name cannot be empty!';
const ERROR_NAME_EXISTS: string = 'Habit with this name already exists!';

beforeEach(() => {
  habitData.habits.value = [];
  habitData.completedHabits.value = {};
  habitData.pausedHabits.value = {};
});

describe('Add habit', () => {
  it('Sets an error when empty habit name is given', () => {
    habitData.addHabit(emptyHabitName);
    expect(error.value).toBe(ERROR_EMPTY_NAME);
  });

  it('Sets an error when too long habit name is given', () => {
    habitData.addHabit(tooLongHabitName);
    expect(error.value).toBe(ERROR_TOO_LONG_NAME);
  });

  it('Sets an error when an existing habit name is given', () => {
    habitData.addHabit(validHabitName);
    expect(error.value).toBeFalsy();
    habitData.addHabit(validHabitName);
    expect(error.value).toBe(ERROR_NAME_EXISTS);
  });

  it('Succesfully adds new habits', () => {
    habitData.addHabit(validHabitName);
    expect(habitData.habits.value[0]).toMatchObject({ id: 1, name: validHabitName });
    habitData.addHabit(secondValidHabitName);
    expect(habitData.habits.value[1]).toMatchObject({ id: 2, name: secondValidHabitName });
    expect(habitData.habits.value).toHaveLength(2);
  });
});

describe('Edit habit', () => {
  it('Successfully edits a habit name', () => {
    habitData.addHabit(validHabitName);
    habitData.editHabit(1, secondValidHabitName);
    expect(habitData.habits.value[0].name).toBe(secondValidHabitName);
  });

  it('Sets error when editing to empty name', () => {
    habitData.addHabit(validHabitName);
    habitData.editHabit(1, '');
    expect(error.value).toBe(ERROR_EMPTY_NAME);
  });

  it('Sets error when editing to too long name', () => {
    habitData.addHabit(validHabitName);
    habitData.editHabit(1, 'a'.repeat(21));
    expect(error.value).toBe(ERROR_TOO_LONG_NAME);
  });

  it('Sets error when editing to a duplicate name', () => {
    habitData.addHabit(validHabitName);
    habitData.addHabit(secondValidHabitName);
    habitData.editHabit(2, validHabitName);
    expect(error.value).toBe(ERROR_NAME_EXISTS);
  });

  it('Does nothing when editing a non-existent habit', () => {
    habitData.addHabit(validHabitName);
    habitData.editHabit(999, 'New name');
    expect(habitData.habits.value).toHaveLength(1);
    expect(habitData.habits.value[0].name).toBe(validHabitName);
  });
});

describe('Unpause habit', () => {
  it('Successfully unpauses a paused habit', () => {
    const pauseDate = '2025-01-01';
    const unpauseDate = '2025-02-01';
    habitData.addHabit(validHabitName);
    habitData.pauseHabit(1, pauseDate);
    habitData.unpauseHabit(1, unpauseDate);

    const pauses = habitData.pausedHabits.value[1];
    expect(pauses[0].from).toBe(pauseDate);
    expect(pauses[0].to).toBe(unpauseDate);
  });

  it('Does nothing when no active pause exists', () => {
    const pauseDate = '2025-01-01';
    const unpauseDate = '2025-02-01';
    habitData.addHabit(validHabitName);
    habitData.pauseHabit(1, pauseDate);
    habitData.unpauseHabit(1, unpauseDate);
    habitData.unpauseHabit(1, '2025-03-01');

    const pauses = habitData.pausedHabits.value[1];
    expect(pauses).toHaveLength(1);
    expect(pauses[0].from).toBe(pauseDate);
    expect(pauses[0].to).toBe(unpauseDate);
  });

  it('Does nothing when no pauses exist for the habit', () => {
    habitData.addHabit(validHabitName);
    habitData.unpauseHabit(1, '2025-01-01');
    expect(habitData.pausedHabits.value[1]).toBeUndefined();
  });
});

describe('nameExists', () => {
  it('Returns true for existing habit name (case insensitive)', () => {
    habitData.addHabit(validHabitName);
    expect(habitData.nameExists(validHabitName)).toBe(true);
    expect(habitData.nameExists(validHabitName.toUpperCase())).toBe(true);
  });

  it('Returns false for non-existing habit name', () => {
    expect(habitData.nameExists(secondValidHabitName)).toBe(false);
  });
});

describe('Remove habit', () => {
  it('Succesfully Removes Habits', () => {
    habitData.addHabit(validHabitName);
    habitData.addHabit(secondValidHabitName);
    expect(habitData.habits.value).toHaveLength(2);
    habitData.removeHabit(1);
    expect(habitData.habits.value).toHaveLength(1);
    habitData.removeHabit(2);
    expect(habitData.habits.value).toHaveLength(0);
  });
});

describe('Pause habit', () => {
  it('Pause habits', () => {
    habitData.addHabit(validHabitName);
    habitData.addHabit(secondValidHabitName);

    habitData.pauseHabit(1, '2025-05-06');
    habitData.pauseHabit(2, '2024-06-04');

    const pausedHabitsEntries = Object.entries(habitData.pausedHabits.value);

    expect(pausedHabitsEntries).toHaveLength(2);

    for (const [, pauses] of pausedHabitsEntries) {
      expect(Array.isArray(pauses)).toBe(true);
      expect(pauses).toHaveLength(1);

      const pause = pauses[0];
      expect(pause).toHaveProperty('from');
      expect(pause).toHaveProperty('to');
      expect(pause.to).toBeNull();
    }
  });
});
