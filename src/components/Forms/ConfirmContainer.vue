<script setup lang="ts">
import isActiveConfirmContainer from '@/stores/confirmContainer';
import habitData from '@/stores/habitData';
import type Habit from '@/models/Habit';

const habitToRemoveRaw = localStorage.getItem('HabitToRemove');
const habitToRemove: Habit | null = habitToRemoveRaw ? JSON.parse(habitToRemoveRaw) : null;

function handleConfirm() {
  if (!habitToRemove) return;

  habitData.removeHabit(habitToRemove.id);
  isActiveConfirmContainer.value = false;
  localStorage.removeItem('HabitToRemove');
}

function handleCancel() {
  isActiveConfirmContainer.value = false;
  localStorage.removeItem('HabitToRemove');
}
</script>

<template>
  <div v-if="isActiveConfirmContainer" class="page-container">
    <div class="form-wrapper">
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
    @apply hover:bg-primary-light hover:text-primary-dark;
  }
}
</style>
