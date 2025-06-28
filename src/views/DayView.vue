<script setup lang="ts">
import useCurrentDate from '@/composables/useCurrentDate';
import HabitList from '@/components/HabitList/HabitList.vue';

useCurrentDate();
</script>

<template>
  <HabitList />
</template>
