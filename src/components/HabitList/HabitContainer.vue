<script setup lang="ts">
import { ref } from 'vue';
import type Habit from '@/models/Habit';

interface props {
  habit: Habit;
  isDone: boolean;
  isDisabled?: boolean;
  pausedDate?: string | null;
}

const { habit, isDone, isDisabled = false, pausedDate = null } = defineProps<props>();

const emit = defineEmits(['toggle-done', 'stop', 'edit', 'remove']);

const pauseError = ref(false);

function showPauseError() {
  pauseError.value = true;
  setTimeout(() => {
    pauseError.value = false;
  }, 3000);
}

defineExpose({ showPauseError });
</script>

<template>
  <div :data-testid="`habit-container-${habit.name}`" class="habit" :class="{ done: isDone }">
    <div class="habit-name">{{ habit.name }}</div>
    <div class="buttons-error-wrapper">
      <div class="buttons-wrapper">
        <button
          type="button"
          title="Edit button"
          aria-label="Edit button"
          data-testid="removeButton-{{ habit.name }}"
          class="habit-button edit-button"
          @click="emit('edit', habit.id, habit.name)"
          :class="{ disabled: isDisabled }"
        >
          <i class="pi pi-pencil" style="font-size: 0.75rem"></i>
        </button>
        <button
          type="button"
          title="Start stop button"
          aria-label="Start stop button"
          data-testid="removeButton-{{ habit.name }}"
          class="habit-button start-stop-button"
          @click="emit('stop', habit.id)"
          :class="{ disabled: isDisabled }"
        >
          <i class="pi pi-pause" style="font-size: 0.75rem"></i>
        </button>
        <button
          type="button"
          title="Toggle button"
          aria-label="Toggle button"
          class="habit-button toggle-button"
          @click="emit('toggle-done', habit.id)"
          :class="{ disabled: isDisabled }"
        >
          <i class="pi pi-times" style="font-size: 0.75rem" v-if="isDone"></i>
          <i class="pi pi-check" style="font-size: 0.75rem" v-else></i>
        </button>
        <button
          type="button"
          title="Remove button"
          aria-label="Remove button"
          class="habit-button remove-button"
          @click="emit('remove', habit.id, habit.name)"
          :class="{ disabled: isDisabled }"
        >
          <i class="pi pi-ban" style="font-size: 0.75rem"></i>
        </button>
      </div>
      <div v-if="pauseError" class="pause-error">Currently paused!</div>
      <div v-if="pauseError" class="paused-info">Since: {{ pausedDate }}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.habit {
  @apply mx-7 mt-5 flex w-auto animate-fadeinleft items-center justify-between rounded-3xl bg-secondary-light py-3 text-base text-primary-dark;

  .habit-name {
    @apply mx-4;
    max-width: 80%;
    word-break: break-word;
    overflow-wrap: break-word;
  }

  &.done {
    @apply bg-primary-green text-black;

    .buttons-wrapper {
      @apply border-l-primary-dark;
    }
  }

  .buttons-wrapper {
    @apply mr-4 flex flex-row gap-4;

    .habit-button {
      @apply cursor-pointer place-self-center;

      &.disabled {
        @apply cursor-not-allowed;
      }
    }
  }
}

.buttons-error-wrapper {
  @apply flex flex-col justify-center self-stretch border-l-2 border-l-primary-green pl-3;
}

.pause-error,
.paused-info {
  @apply mt-2 text-left text-sm font-extrabold text-primary-error;
}

@media (screen(lg)) {
  .habit {
    @apply flex flex-col items-center justify-center;

    &:nth-child(even) {
      @apply animate-fadeinright animate-duration-700 animate-once;
    }

    &:nth-child(odd) {
      @apply animate-fadeinleft animate-duration-700 animate-once;
    }

    .habit-name {
      @apply mx-0 place-self-center whitespace-nowrap;
    }

    .buttons-error-wrapper {
      @apply items-center border-0;
    }

    .buttons-wrapper {
      @apply mr-0 w-72 justify-center rounded-3xl border-2 border-primary-dark;
    }

    .habit-button {
      &:not(.disabled) {
        &:hover {
          @apply scale-105;
        }
      }
    }
  }
}
</style>
