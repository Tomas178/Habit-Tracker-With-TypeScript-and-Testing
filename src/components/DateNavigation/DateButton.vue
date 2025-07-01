<script setup lang="ts">
import { isSameDay, parseISO } from 'date-fns';
import useCurrentDate from '@/composables/useCurrentDate';
import type DateForNavigation from '@/models/DateForNavigation';

const { selectedDate } = useCurrentDate();

interface DateButtonProps {
  day: DateForNavigation;
  disabled: boolean;
}

const { day, disabled = false } = defineProps<DateButtonProps>();

const emit = defineEmits(['day-change']);

function handleClick() {
  if (!disabled) {
    emit('day-change', day.dateDay);
  }
}
</script>

<template>
  <button
    type="button"
    class="date"
    :class="{ active: isSameDay(selectedDate, parseISO(day.fullDate)), disabled }"
    :disabled="disabled"
    @click="handleClick"
    aria-label="Select day"
  >
    <span>{{ day.nameDay }}</span>
    <span>{{ day.dateDay }}</span>
  </button>
</template>

<style scoped lang="scss">
.date {
  @apply flex flex-col items-center justify-center rounded-e-3xl rounded-s-3xl border-2 border-primary-dark bg-primary-light py-2 text-center text-secondary text-sm text-primary-dark;
  flex: 0 1 1;
  min-width: 2.4rem;
  cursor: pointer;
}

.active {
  @apply bg-primary-dark text-primary-light;
}

.disabled {
  @apply cursor-not-allowed opacity-40;
}
</style>
