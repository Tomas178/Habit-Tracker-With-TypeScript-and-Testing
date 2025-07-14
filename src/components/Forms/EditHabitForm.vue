<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { isActiveEditForm, cleanEditForm } from '@/stores/editHabitForm';
import habitData from '@/stores/habitData';
import formState from '@/stores/formState';
import type { Habit } from '@/models/Habit';
import { HABIT_TO_EDIT } from '@/helpers/constants';

const { error, newHabitName, currentLength, isValidLength } = formState;

const habitToEditRaw = localStorage.getItem(HABIT_TO_EDIT);
const habitToEdit: Habit | null = habitToEditRaw ? JSON.parse(habitToEditRaw) : null;

const habitInput = ref<HTMLInputElement | null>(null);

onMounted(() => {
  habitInput.value?.focus();
});

function submitEdit() {
  if (!habitToEdit) return;

  habitData.editHabit(habitToEdit.id, newHabitName.value);
}
</script>

<template>
  <div v-if="isActiveEditForm" class="page-container">
    <form @submit.prevent="submitEdit">
      <div data-testid="edit-habit-form" id="edit-form">
        <div class="form-header">
          <button type="button" class="close-button" @click="cleanEditForm">
            <i class="pi pi-times" style="font-size: 0.75rem"></i>
          </button>
        </div>
        <div class="form-row">
          <div class="form-group">
            <div id="form-input-information">
              <label class="text-primary-light" for="habit-name">Habit:</label>
              <div id="input-length" :class="[isValidLength ? '' : 'error-msg']">
                Current Length: {{ currentLength }}
              </div>
            </div>
            <input
              type="text"
              autocomplete="off"
              placeholder="Enter new name..."
              v-model.trim="newHabitName"
              id="habit-name"
              ref="habitInput"
            />
            <div v-if="error" class="error-msg">{{ error }}</div>
          </div>
        </div>
        <div class="form-actions">
          <button type="submit">Change habit</button>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped lang="scss">
.page-container {
  @apply fixed inset-0 z-50 flex items-center justify-center;
}

#input-length {
  @apply mt-1 text-sm text-primary-light;
}

#edit-form {
  @apply flex flex-col gap-4 rounded-md bg-primary-dark;

  .form-header {
    @apply flex justify-end;

    .close-button {
      @apply mr-4 text-2xl font-bold text-primary-green;
    }
  }

  .form-row {
    @apply mx-4 flex gap-4;

    .form-group {
      @apply flex flex-1 flex-col gap-2;

      #form-input-information {
        @apply flex justify-between;
      }
    }
  }

  .form-actions {
    @apply my-4 flex justify-center;

    button[type='submit'] {
      @apply w-auto rounded-md bg-primary-green px-4 py-2;
    }
  }

  .error-msg {
    @apply mt-1 text-sm text-red-500;
  }
}

@media (screen(lg)) {
  button[type='submit'] {
    &:hover {
      @apply scale-110;
    }
  }
}
</style>
