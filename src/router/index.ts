import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';

const validYearRange = { min: 2020, max: 2030 };

function isValidDateParam(dateString: string) {
  // Match YYYY-MM-DD format strictly
  const isoDateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
  if (!isoDateRegex.test(dateString)) return false;

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return false;

  const year = date.getFullYear();
  return year >= validYearRange.min && year <= validYearRange.max;
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView,
      alias: '/home',
    },
    {
      path: '/day/:date',
      name: 'Day-view',
      component: () => import('../views/DayView.vue'),
      beforeEnter: (to, _from, next) => {
        const dateParam = to.params.date;

        if (typeof dateParam === 'string' && isValidDateParam(dateParam)) {
          next();
        } else {
          next('/');
        }
      },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
});

export default router;
