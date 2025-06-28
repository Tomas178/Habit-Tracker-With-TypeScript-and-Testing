import type { ComponentPublicInstance } from 'vue';

export type HabitContainerInstance = ComponentPublicInstance & {
  showPauseError: () => void;
};
