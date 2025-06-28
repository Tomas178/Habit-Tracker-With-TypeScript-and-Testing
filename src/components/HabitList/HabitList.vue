<script setup lang="ts">
import { computed } from 'vue';
import { format } from 'date-fns';
import HabitContainer from '@/components/HabitList/HabitContainer.vue';
import habitData from '@/stores/habitData';
import useCurrentDate from '@/composables/useCurrentDate';
import isActiveConfirmContainer from '@/stores/confirmContainer';
import { isActiveEditForm } from '@/stores/editHabitForm';
import isActiveUnpauseHabitsForm from '@/stores/unpauseHabitsForm';
import useHabitList from '@/composables/useHabitList';
import type Habit from '@/models/Habit';

const { selectedDate, isFutureDate } = useCurrentDate();

const habitsRef = useHabitList();

const activeDate = computed(() => format(selectedDate.value, 'yyyy-MM-dd'));

const completedIds = computed(() => habitData.completedHabits.value[activeDate.value] || []);

const filteredHabits = computed(() => {
  const currentDate = activeDate.value;

  return habitData.habits.value.filter(habit => {
    const pauses = habitData.pausedHabits.value[habit.id];
    if (!pauses || pauses.length === 0) return true;

    const isCurrentlyPaused = pauses.some(pause => {
      const fromDate = pause.from;
      const toDate = pause.to;

      if (toDate === null) {
        return currentDate >= fromDate;
      }

      return currentDate >= fromDate && currentDate < toDate;
    });

    return !isCurrentlyPaused;
  });
});

function toggleHabitCompletion(habitId: number) {
  if (isFutureDate.value) return;

  const dateKey = activeDate.value;
  const completed = habitData.completedHabits.value[dateKey] || [];

  if (completed.includes(habitId)) {
    const updatedCompleted = completed.filter(id => id !== habitId);

    if (updatedCompleted.length === 0) {
      delete habitData.completedHabits.value[dateKey];
    } else {
      habitData.completedHabits.value[dateKey] = updatedCompleted;
    }
  } else {
    habitData.completedHabits.value[dateKey] = [...completed, habitId];
  }
}

function handleStop(habitId: number) {
  if (isFutureDate.value) return;

  const pauses = habitData.pausedHabits.value[habitId] || [];
  const currentDate = activeDate.value;

  const isAlreadyPaused = pauses.some(pause => {
    const toDate = pause.to;

    if (toDate === null) {
      return true;
    }
    return false;
  });

  if (isAlreadyPaused) {
    const habitComponent = habitsRef.habits.value.get(habitId);
    if (habitComponent) {
      habitComponent?.showPauseError();
    }
    return;
  }

  habitData.pauseHabit(habitId, currentDate);
}

function goToEditHabit(habitId: number, habitName: string) {
  if (isFutureDate.value) return;

  isActiveEditForm.value = true;
  localStorage.setItem('HabitToEdit', JSON.stringify({ id: habitId, name: habitName }));
}

function handleRemove(habitId: number, habitName: string) {
  if (isFutureDate.value) return;

  isActiveConfirmContainer.value = true;
  const habitToRemove: Habit = { id: habitId, name: habitName };
  localStorage.setItem('HabitToRemove', JSON.stringify(habitToRemove));
}

function handlePauseHabitsButton() {
  if (isFutureDate.value) return;

  isActiveUnpauseHabitsForm.value = true;
}

function getPausedDate(habitId: number) {
  const pauses = habitData.pausedHabits.value[habitId];
  if (!pauses || pauses.length === 0) return null;

  const activePause = pauses.find(pause => pause.to === null);
  return activePause ? activePause.from : null;
}
</script>

<template>
  <div>
    <div class="paused-habits-button">
      <button type="button" :disabled="isFutureDate" @click="handlePauseHabitsButton">
        <i class="pi pi-play"></i> Paused Habits List
      </button>
    </div>

    <div class="habit-list">
      <HabitContainer
        v-for="habit in filteredHabits"
        :key="habit.id"
        :ref="el => habitsRef.functionRef(el, habit.id)"
        :habit="habit"
        :is-done="completedIds.includes(habit.id)"
        :is-disabled="isFutureDate"
        :paused-date="getPausedDate(habit.id)"
        @toggle-done="toggleHabitCompletion"
        @stop="handleStop"
        @edit="goToEditHabit"
        @remove="handleRemove"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.habit-list {
  @apply mb-3 mt-2 flex flex-col-reverse gap-3;
}

.paused-habits-button {
  @apply mb-4 flex justify-center;

  button {
    @apply mt-6 cursor-pointer rounded-2xl bg-primary-dark px-3 py-3 text-sm text-primary-light;

    &:disabled {
      @apply cursor-not-allowed opacity-40;
    }
  }
}

@media (screen(lg)) {
  .habit-list {
    @apply grid grid-cols-2;
  }

  .paused-habits-button {
    button {
      &:hover {
        @apply scale-110;
      }
    }
  }
}
</style>
