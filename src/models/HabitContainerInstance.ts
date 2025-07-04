import type { ComponentPublicInstance } from 'vue';

export interface HabitContainerInstance extends ComponentPublicInstance {
  showPauseError: () => void;
}
