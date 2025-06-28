<script setup lang="ts">
import HabitList from '@/components/HabitList/HabitList.vue';
import useCurrentDate from '@/composables/useCurrentDate';

const { setDateToToday } = useCurrentDate();

setDateToToday();
</script>

<template>
  <HabitList />
</template>
