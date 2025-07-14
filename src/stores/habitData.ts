import { useLocalStorage } from '@vueuse/core';
import formState from '@/stores/formState';
import { cleanAddForm } from '@/stores/addHabitForm';
import { cleanEditForm } from '@/stores/editHabitForm';
import type { Habit, CompletedHabits, StoppedHabits } from '@/models/Habit';
import {
  COMPLETED_HABITS,
  ERROR_EMPTY_NAME,
  ERROR_NAME_EXISTS,
  ERROR_TOO_LONG_NAME,
  HABITS,
  PAUSED_HABITS,
} from '@/helpers/constants';

const { error } = formState;

const habits = useLocalStorage<Habit[]>(HABITS, []);

const completedHabits = useLocalStorage<CompletedHabits>(COMPLETED_HABITS, {});
const pausedHabits = useLocalStorage<StoppedHabits>(PAUSED_HABITS, {});

function addHabit(name: string) {
  if (isValidHabitName(name)) {
    const newId = habits.value.length ? Math.max(...habits.value.map(h => h.id)) + 1 : 1;
    habits.value.push({ id: newId, name });
    cleanAddForm();
  }
}

function editHabit(id: number, name: string) {
  if (isValidHabitName(name)) {
    const habit = habits.value.find(h => h.id === id);
    if (habit) {
      habit.name = name;
    }
    cleanEditForm();
  }
}

function removeHabit(id: number) {
  habits.value = habits.value.filter(habit => habit.id !== id);

  Object.keys(completedHabits.value).forEach(date => {
    completedHabits.value[date] = completedHabits.value[date].filter(habitId => habitId !== id);
    if (completedHabits.value[date].length === 0) {
      delete completedHabits.value[date];
    }
  });

  if (pausedHabits.value[id]) {
    delete pausedHabits.value[id];
  }
}

function pauseHabit(habitId: number, date: string) {
  if (!pausedHabits.value[habitId]) {
    pausedHabits.value[habitId] = [];
  }

  const activePause = pausedHabits.value[habitId].find(p => p.to === null);
  if (!activePause) {
    pausedHabits.value[habitId].push({ from: date, to: null });
  }
}

function unpauseHabit(habitId: number, date: string) {
  const pauses = pausedHabits.value[habitId];
  if (!pauses) return;

  const activePause = pauses.find(p => p.to === null);
  if (activePause) activePause.to = date;
}

function nameExists(newHabitName: string) {
  return habits.value.some(habit => habit.name.toLowerCase() === newHabitName.toLowerCase());
}

function isValidHabitName(name: string) {
  if (name.length > 20) {
    error.value = ERROR_TOO_LONG_NAME;
    return false;
  }

  if (name === '') {
    error.value = ERROR_EMPTY_NAME;
    return false;
  }

  if (nameExists(name)) {
    error.value = ERROR_NAME_EXISTS;
    return false;
  }

  return true;
}

export default {
  habits,
  completedHabits,
  pausedHabits,
  addHabit,
  editHabit,
  removeHabit,
  pauseHabit,
  unpauseHabit,
  nameExists,
};
