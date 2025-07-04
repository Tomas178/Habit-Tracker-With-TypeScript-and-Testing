import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import HabitContainer from '@/components/HabitList/HabitContainer.vue';
import type Habit from '@/models/Habit';
import type { HabitContainerInstance } from '@/models/HabitContainerInstance';

const habit: Habit = {
  id: 1,
  name: 'Read a book',
};

const pausedDate: string = '2025-05-06';

describe('HabitContainer', () => {
  it('Renders properly with required props', () => {
    const wrapper = mount(HabitContainer, { props: { habit: habit, isDone: false } });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.text()).toContain(habit.name);
  });

  it('Renders properly with all props', async () => {
    const wrapper = mount(HabitContainer, {
      props: { habit: habit, isDone: false, isDisabled: false, pausedDate: pausedDate },
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.text()).toContain(habit.name);
    await wrapper.get('[aria-label="Start stop button"]').trigger('click');
    (wrapper.vm as HabitContainerInstance).showPauseError();
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain(pausedDate);
  });
});
