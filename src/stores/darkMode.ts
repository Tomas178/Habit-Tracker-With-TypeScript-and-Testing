import { useLocalStorage } from '@vueuse/core';
import { watch } from 'vue';

const isDarkMode = useLocalStorage('DarkMode', false);

watch(
  isDarkMode,
  newValue => {
    const mode = newValue ? 'dark' : 'light';
    document.documentElement.setAttribute('data-mode', mode);
  },
  { immediate: true },
);

export default isDarkMode;
