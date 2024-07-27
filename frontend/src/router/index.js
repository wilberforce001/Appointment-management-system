import { createRouter, createWebHistory } from 'vue-router';
import UserHome from '@/pages/UserHome.vue';
import UserRegister from '@/pages/UserRegister.vue';
import UserDashboard from '@/pages/UserDashboard.vue';
import AdminDashboard from '@/pages/AdminDashboard.vue';
import NotFoundPage from '@/pages/NotFoundPage.vue';
import AppointmentCalendar from '@/pages/AppointmentCalendar.vue';
import ScheduledAppointments from '@/booking/ScheduledAppointments.vue';
import BookAppointment from '@/booking/BookAppointment.vue';

const routes = [
  { path: '/', name: 'UserHome', component: UserHome },
  { path: '/login', name: 'Login', component: UserHome },
  { path: '/UserRegister', name: 'UserRegister', component: UserRegister },
  { path: '/UserDashboard', name: 'UserDashboard', component: UserDashboard, meta: { requiresAuth: true, requiresUser: true } },
  { path: '/AdminDashboard', name: 'AdminDashboard', component: AdminDashboard, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/BookAppointment', name: 'BookAppointment', component: BookAppointment },
  { path: '/ScheduledAppointments', name: 'ScheduledAppointments', component: ScheduledAppointments },
  { path: '/AppointmentCalendar', name: 'AppointmentCalendar', component: AppointmentCalendar, meta: { requiresAuth: true } },
  { path: '/:catchAll(.*)', name: 'NotFound', component: NotFoundPage },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);
  const requiresUser = to.matched.some(record => record.meta.requiresUser);

  if (requiresAuth && !token) {
    next('/login');
  } else if (requiresAuth && requiresAdmin && role !== 'admin') {
    next('/UserDashboard');
  } else if (requiresAuth && requiresUser && role !== 'user') {
    next('/AdminDashboard');
  } else {
    next();
  }
});

router.afterEach((to) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (to.path === '/login' && token) {
    if (role === 'admin') {
      router.push('/AdminDashboard');
    } else if (role === 'user') {
      router.push('/UserDashboard');
    }
  }
});

export default router;
