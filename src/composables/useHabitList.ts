import { shallowRef, onBeforeUpdate } from 'vue';
import type { ComponentPublicInstance } from 'vue';
import type { HabitContainerInstance } from '@/models/HabitContainerInstance'; // Adjust path

function isHabitContainerInstance(
  obj: ComponentPublicInstance | Element | null,
): obj is HabitContainerInstance {
  return !!obj && typeof (obj as HabitContainerInstance).showPauseError === 'function';
}

export default function useHabitList() {
  const habits = shallowRef(new Map<number, HabitContainerInstance>());

  const functionRef = (el: Element | ComponentPublicInstance | null, id: number) => {
    if (isHabitContainerInstance(el)) {
      habits.value.set(id, el);
    } else {
      habits.value.delete(id);
    }
  };

  onBeforeUpdate(() => habits.value.clear());

  return { functionRef, habits };
}
