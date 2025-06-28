import { ref } from 'vue';
import formState from '@/stores/formState';

const { error, newHabitName } = formState;

export const isActiveAddForm = ref(false);

export function cleanAddForm() {
  isActiveAddForm.value = false;
  error.value = '';
  newHabitName.value = '';
}
