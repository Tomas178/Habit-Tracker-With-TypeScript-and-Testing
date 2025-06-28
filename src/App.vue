<script setup lang="ts">
import { computed } from 'vue';
import { RouterView } from 'vue-router';
import GrettingHeader from '@/components/GrettingHeader.vue';
import DateNavigation from '@/components/DateNavigation/DateNavigation.vue';
import FeaturesHeader from '@/components/FeaturesHeader.vue';
import { isActiveAddForm } from '@/stores/addHabitForm';
import { isActiveEditForm } from '@/stores/editHabitForm';
import isActiveUnpauseHabitsForm from '@/stores/unpauseHabitsForm';
import isActiveConfirmContainer from '@/stores/confirmContainer';
import AddHabitForm from '@/components/Forms/AddHabitForm.vue';
import EditHabitForm from '@/components/Forms/EditHabitForm.vue';
import UnpauseHabitsForm from '@/components/Forms/UnpauseHabitsForm/UnpauseHabitsForm.vue';
import ConfirmContainer from '@/components/Forms/ConfirmContainer.vue';

const isAnyActiveForm = computed(
  () =>
    isActiveAddForm.value ||
    isActiveEditForm.value ||
    isActiveUnpauseHabitsForm.value ||
    isActiveConfirmContainer.value,
);
</script>

<template>
  <header :class="{ blur: isAnyActiveForm }">
    <div class="wrapper">
      <GrettingHeader />
    </div>
  </header>
  <main :class="{ blur: isAnyActiveForm }">
    <FeaturesHeader />
    <DateNavigation />
    <RouterView />
  </main>

  <AddHabitForm v-if="isActiveAddForm" />
  <EditHabitForm v-if="isActiveEditForm" />
  <UnpauseHabitsForm v-if="isActiveUnpauseHabitsForm" />
  <ConfirmContainer v-if="isActiveConfirmContainer" />
</template>

<style scoped lang="scss">
.wrapper {
  @apply flex flex-col items-center justify-center px-4;
}
</style>
