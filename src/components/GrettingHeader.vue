<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
  <h1><RouterLink :to="{ name: 'Home' }">Habit Tracker</RouterLink></h1>
</template>

<style scoped lang="scss">
h1 {
  @apply py-4 text-center text-primary text-xl font-primary text-primary-dark;
}

a {
  @apply inline-block;
}

@media (screen(lg)) {
  a {
    &:hover {
      @apply scale-110;
    }
  }
}
</style>
