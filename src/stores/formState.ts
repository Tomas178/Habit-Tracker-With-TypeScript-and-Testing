import { ref, computed } from 'vue';

const error = ref('');
const newHabitName = ref('');
const currentLength = computed(() => newHabitName.value.length);
const isValidLength = computed(() => currentLength.value <= 20);

export default {
  error,
  newHabitName,
  currentLength,
  isValidLength,
};
