<script setup lang="ts">
import { computed } from 'vue';
import { isAfter, parseISO, format } from 'date-fns';
import useCurrentDate from '@/composables/useCurrentDate';
import DateButton from '@/components/DateNavigation/DateButton.vue';
import type DateForNavigation from '@/models/DateForNavigation';

const { selectedYear, selectedMonth, selectedDay } = useCurrentDate();

const today = new Date();

const daysOfWeek = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];

const daysInMonth = computed(() => {
  const year: number = selectedYear.value;
  const month: number = selectedMonth.value;

  const date = new Date(year, month, 1);
  const days: DateForNavigation[] = [];

  while (date.getMonth() === month) {
    const dateDay: number = date.getDate();
    const nameDay: string = daysOfWeek[date.getDay()];
    const fullDate: string = format(date, 'yyyy-MM-dd');

    days.push({ dateDay, nameDay, fullDate });

    date.setDate(dateDay + 1);
  }

  return days;
});

function updateSelectedDay(dayNumber: number) {
  const newDate = new Date(selectedYear.value, selectedMonth.value, dayNumber);

  if (isAfter(newDate, today)) {
    return;
  }

  selectedDay.value = dayNumber;
}
</script>

<template>
  <div id="date-wrapper">
    <DateButton
      v-for="day in daysInMonth"
      :key="day.fullDate"
      :day="day"
      :disabled="isAfter(parseISO(day.fullDate), today)"
      @day-change="updateSelectedDay"
    />
  </div>
</template>

<style scoped lang="scss">
#date-wrapper {
  @apply flex justify-around gap-2 overflow-x-auto px-2;
}

@media (screen(lg)) {
  #date-wrapper {
    @apply gap-6;
  }
}
</style>
