import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { createRouter, createWebHistory } from 'vue-router';
import DateButton from '@/components/DateNavigation//DateButton.vue';
import type DateForNavigation from '@/models/DateForNavigation';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/day/:date',
      name: 'DateRoute',
      component: { template: '<div></div>' },
    },
  ],
});

const someDate: DateForNavigation = {
  dateDay: 15,
  nameDay: 'TU',
  fullDate: '2025-07-15',
};

describe('DateButton', () => {
  it('Renders properly', async () => {
    router.push({ name: 'DateRoute', params: { date: someDate.fullDate } });
    await router.isReady();

    const button = mount(DateButton, {
      global: {
        plugins: [router],
      },
      props: {
        day: someDate,
        disabled: false,
      },
    });

    expect(button.exists()).toBe(true);
    expect(button.text()).toContain(`${someDate.nameDay}${someDate.dateDay}`);
  });
});
