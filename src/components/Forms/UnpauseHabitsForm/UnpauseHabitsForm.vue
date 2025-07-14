<script setup lang="ts">
import { computed } from 'vue';
import { format, isAfter, parseISO } from 'date-fns';
import useCurrentDate from '@/composables/useCurrentDate';
import isActiveUnpauseHabitsForm from '@/stores/unpauseHabitsForm';
import habitData from '@/stores/habitData';
import UnpauseHabitContainer from '@/components/Forms/UnpauseHabitsForm/UnpauseHabitContainer.vue';
import { DATE_FORMAT } from '@/helpers/constants';

const { selectedDate } = useCurrentDate();

const pausedHabitsList = computed(() => {
  const currentDate = selectedDate.value;

  return Object.entries(habitData.pausedHabits.value)
    .filter(([, pauses]) => pauses.some(p => p.to === null))
    .map(([id, pauses]) => {
      const habit = habitData.habits.value.find(h => h.id === Number(id));
      const activePause = pauses.find(p => p.to === null);

      return {
        id: Number(id),
        name: habit ? habit.name : 'Unknown',
        from: activePause ? activePause.from : null,
      };
    })
    .filter(habit => {
      if (!habit.from) return true;
      return !isAfter(parseISO(habit.from), currentDate);
    });
});

const pausedHabits = computed(() => pausedHabitsList.value.length > 0);

function handleUnpause(habitId: number) {
  habitData.unpauseHabit(habitId, format(selectedDate.value, DATE_FORMAT));
}
</script>

<template>
  <div class="page-container">
    <div data-testid="paused-habits-modal" id="unpause-form">
      <div class="form-header">
        <div class="header-text">
          <span v-if="pausedHabits">Paused Habits:</span>
          <span v-else>No habits available to unpause for this date! </span>
        </div>
        <div class="button-wrapper">
          <button
            type="button"
            title="Close button"
            aria-label="Close Button"
            class="close-button"
            @click="isActiveUnpauseHabitsForm = false"
          >
            <i class="pi pi-times" style="font-size: 0.75rem"></i>
          </button>
        </div>
      </div>
      <div id="list-wrapper">
        <UnpauseHabitContainer
          v-for="habit in pausedHabitsList"
          :key="habit.id"
          :habit="habit"
          @unpause="handleUnpause"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.page-container {
  @apply fixed inset-0 z-50 flex items-center justify-center;
}

#unpause-form {
  @apply mx-4 flex flex-col gap-4 rounded-md bg-primary-dark p-2;

  .form-header {
    @apply mx-4 flex justify-between;

    .header-text {
      @apply text-primary-light;
    }

    .close-button {
      @apply ml-2 font-bold text-primary-green;
    }
  }

  #list-wrapper {
    @apply flex flex-col;

    #unpause-habits-list {
      @apply flex flex-col justify-evenly gap-2;
    }
  }
}
</style>
