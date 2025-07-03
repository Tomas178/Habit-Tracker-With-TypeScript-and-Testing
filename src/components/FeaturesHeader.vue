<script setup lang="ts">
import useCurrentDate from '@/composables/useCurrentDate';
import { isActiveAddForm } from '@/stores/addHabitForm';
import isDarkMode from '@/stores/darkMode';

const { selectedYear, selectedMonth, isFutureDate } = useCurrentDate();

const YEARS: number[] = Array.from({ length: 11 }, (_, i) => 2020 + i);
const MONTHS: string[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function handleAddHabit() {
  if (isFutureDate.value) return;

  isActiveAddForm.value = true;
}
</script>

<template>
  <div class="selectors-wrapper">
    <div class="form-group">
      <label for="year-select">Year:</label>
      <select id="year-select" v-model="selectedYear">
        <option v-for="year in YEARS" :key="year" :value="year">
          {{ year }}
        </option>
      </select>
    </div>

    <div class="form-group">
      <label for="month-select">Month:</label>
      <select id="month-select" v-model="selectedMonth">
        <option v-for="(month, index) in MONTHS" :key="month" :value="index">
          {{ month }}
        </option>
      </select>
    </div>

    <button
      type="button"
      :disabled="isFutureDate"
      id="add-habit"
      @click="handleAddHabit"
      aria-label="Create new habit"
    >
      <i class="pi pi-plus" style="font-size: 0.65rem"></i>New habit
    </button>

    <button
      type="button"
      title="Toggle theme"
      aria-label="Toggle theme"
      id="toggle-mode-button"
      @click="isDarkMode = !isDarkMode"
    >
      <i v-if="isDarkMode" class="pi pi-sun text-white"></i>
      <i v-else class="pi pi-moon"></i>
    </button>
  </div>
</template>

<style scoped lang="scss">
.selectors-wrapper {
  @apply mb-4 flex justify-evenly gap-4;
}

.form-group {
  @apply flex flex-col;
}

label {
  @apply mb-1 text-sm text-primary-dark;
}

select {
  @apply cursor-pointer rounded border border-gray-300 px-2 py-1 text-sm;
}

#add-habit {
  @apply w-fit cursor-pointer self-center rounded-2xl bg-primary-dark px-3 py-3 text-sm text-primary-light;

  &:disabled {
    @apply cursor-not-allowed opacity-40;
  }
}

@media (screen(lg)) {
  .selectors-wrapper {
    @apply justify-around;
  }

  #toggle-mode-button {
    &:hover {
      @apply scale-125;
    }
  }

  #add-habit {
    &:not(:disabled) {
      &:hover {
        @apply scale-110;
      }
    }
  }
}
</style>
