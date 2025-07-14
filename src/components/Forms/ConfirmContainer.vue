<script setup lang="ts">
import isActiveConfirmContainer from '@/stores/confirmContainer';
import habitData from '@/stores/habitData';
import type { Habit } from '@/models/Habit';
import { HABIT_TO_REMOVE } from '@/helpers/constants';

const habitToRemoveRaw = localStorage.getItem(HABIT_TO_REMOVE);
const habitToRemove: Habit | null = habitToRemoveRaw ? JSON.parse(habitToRemoveRaw) : null;

function handleConfirm() {
  if (!habitToRemove) return;

  habitData.removeHabit(habitToRemove.id);
  isActiveConfirmContainer.value = false;
  localStorage.removeItem(HABIT_TO_REMOVE);
}

function handleCancel() {
  isActiveConfirmContainer.value = false;
  localStorage.removeItem(HABIT_TO_REMOVE);
}
</script>

<template>
  <div v-if="isActiveConfirmContainer" class="page-container">
    <div data-testid="remove-habit-form" class="form-wrapper">
      <div v-if="habitToRemove" class="habit-info">
        <span
          >Habit to be removed:
          <span class="text-primary-error">{{ habitToRemove.name }}</span></span
        >
      </div>
      <div class="actions-wrapper">
        <div class="action-button">
          <button type="button" @click="handleConfirm">Confirm</button>
        </div>
        <div class="action-button">
          <button type="button" @click="handleCancel">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.page-container {
  @apply fixed inset-0 z-50 flex items-center justify-center;
}

.form-wrapper {
  @apply flex flex-col gap-6 rounded-md bg-primary-dark px-6 py-3;

  .habit-info {
    @apply text-primary-light;
  }

  .actions-wrapper {
    @apply flex flex-row justify-around gap-5 text-primary-light;
  }
}

.action-button {
  @apply cursor-pointer rounded-md;
}

@media (screen(lg)) {
  .action-button {
    &:hover {
      @apply bg-primary-light text-primary-dark;
    }
  }
}
</style>
