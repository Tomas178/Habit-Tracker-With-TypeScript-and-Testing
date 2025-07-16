import { ref, watch, nextTick, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { parseISO, format, isAfter } from 'date-fns';
import { DATE_FORMAT } from '@/helpers/constants';

const selectedDate = ref(new Date());
const selectedYear = ref(selectedDate.value.getFullYear());
const selectedMonth = ref(selectedDate.value.getMonth());
const selectedDay = ref(selectedDate.value.getDate());

const dateOfToday: Date = new Date();

const isFutureDate = computed(() => {
  if (!dateOfToday) return false;
  return isAfter(selectedDate.value, dateOfToday);
});

export default function useCurrentDate() {
  const route = useRoute();
  const router = useRouter();

  async function setDateToToday() {
    if (dateOfToday) {
      const currentYear = dateOfToday.getFullYear();
      const currentMonth = dateOfToday.getMonth();
      const currentDay = dateOfToday.getDate();

      selectedYear.value = currentYear;
      selectedMonth.value = currentMonth;
      selectedDay.value = currentDay;
      selectedDate.value = new Date(currentYear, currentMonth, currentDay);

      await nextTick();
      await router.push('/');
    }
  }

  function setDateFromRoute(): void {
    if (route.params.date) {
      let routeDate = route.params.date;
      if (Array.isArray(routeDate)) {
        [routeDate] = routeDate;
      }
      const date = parseISO(routeDate);
      if (!Number.isNaN(date.getTime())) {
        selectedYear.value = date.getFullYear();
        selectedMonth.value = date.getMonth();
        selectedDay.value = date.getDate();
        selectedDate.value = date;
      }
    }
  }

  watch(
    () => route.params.date,
    () => {
      setDateFromRoute();
    },
    { immediate: false },
  );

  watch(
    [selectedYear, selectedMonth, selectedDay],
    ([newYear, newMonth, newDay]) => {
      const newDate = new Date(newYear, newMonth, newDay);
      selectedDate.value = newDate;

      const formattedDate = format(newDate, DATE_FORMAT);

      if (route.params.date !== formattedDate) {
        router.push(`/day/${formattedDate}`);
      }
    },
    { immediate: false },
  );

  return {
    selectedDate,
    selectedYear,
    selectedMonth,
    selectedDay,
    isFutureDate,
    setDateToToday,
    setDateFromRoute,
  };
}
