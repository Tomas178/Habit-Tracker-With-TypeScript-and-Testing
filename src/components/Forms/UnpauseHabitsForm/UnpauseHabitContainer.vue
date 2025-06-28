<script setup lang="ts">
import type Habit from '@/models/Habit';

const { habit } = defineProps<{ habit: Habit }>();
const emit = defineEmits(['unpause']);
</script>

<template>
  <div class="habit">
    <div class="habit-name">{{ habit.name }}</div>
    <div class="button-wrapper">
      <div class="unpause-button" @click="emit('unpause', habit.id)">
        <i class="pi pi-play" style="font-size: 0.75rem"></i>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.habit {
  @apply mx-7 mt-2 flex w-auto animate-fadeinleft items-center justify-between rounded-3xl bg-secondary-light py-3 text-base text-primary-dark;

  .habit-name {
    @apply mx-4;
    max-width: 80%;
    word-break: break-word;
    overflow-wrap: break-word;
  }

  .button-wrapper {
    @apply mr-4 self-stretch border-l-2 border-l-primary-green pl-3;

    .unpause-button {
      @apply cursor-pointer place-self-center;
    }
  }
}

@media (screen(lg)) {
  .unpause-button {
    &:hover {
      @apply scale-105;
    }
  }
}
</style>
