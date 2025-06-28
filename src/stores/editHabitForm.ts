import { ref } from 'vue';
import formState from '@/stores/formState';

const { error, newHabitName } = formState;

export const isActiveEditForm = ref(false);

export function cleanEditForm() {
  isActiveEditForm.value = false;
  error.value = '';
  newHabitName.value = '';
  localStorage.removeItem('HabitToEdit');
}
