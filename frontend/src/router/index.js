import { createRouter, createWebHistory } from 'vue-router';
import UserHome from '../views/UserHome.vue';
import AppLogin from '../pages/AppLogin.vue';
import AppointmentDashboard from '../views/AppointmentDashboard.vue';
import UserDashboard from '../pages/UserDashboard.vue';
import AdminDashboard from '../pages/AdminDashboard.vue';
import AppointmentCalendar from '../pages/AppointmentCalendar.vue';
import BookAppointment from '../booking/BookAppointment.vue';
import ScheduledAppointments from '../booking/ScheduledAppointments.vue';
import AppNavigation from '../pages/AppNavigation.vue';
import UserRegister from '../pages/UserRegister.vue';

const routes = [
  {
    path: '/',
    name: 'UserHome',
    component: UserHome,
  },
  {
    path: '/login',
    name: 'Login',
    component: AppLogin,
  },
  {
    path: '/UserDashboard',
    name: 'UserDashboard',
    component: UserDashboard,
  },
  {
    path: '/AdminDashboard',
    name: 'AdminDashboard',
    component: AdminDashboard,
  },
  {
    path: '/AppointmentCalendar',
    name: 'AppointmentCalendar',
    component: AppointmentCalendar,
  },
  {
    path: '/BookAppointment',
    name: 'BookAppointment',
    component: BookAppointment,
  },
  {
    path: '/ScheduledAppointments',
    name: 'ScheduledAppointments',
    component: ScheduledAppointments,
  },
  {
    path: '/AppointmentDashboard',
    name: 'AppointmentDashboard',
    component: AppointmentDashboard,
  },
  {
    path: '/AppNavigation',
    name: 'AppNavigation',
    component: AppNavigation,
  },
  {
    path: '/register',
    name: 'UserRegister',
    component: UserRegister // Add the route for Register component
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
