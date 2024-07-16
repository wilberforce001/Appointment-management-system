import { createRouter, createWebHistory } from 'vue-router';
import UserHome from '@/components/UserHome.vue'
import UserRegister from '@/components/UserRegister.vue'
import AdminDashboard from '@/components/AdminDashboard.vue'
import AppointmentCalendar from '@/components/AppointmentCalendar.vue'
import UserProfile from '@/components/UserProfile.vue'
import ClientAppointments from '@/components/ClientAppointments.vue'
import AppointmentBooking from '@/components/AppointmentBooking.vue';
import ManageAppointments from '@/components/ManageAppointments.vue';

const routes = [
    { path: '/', name: 'Home', component: UserHome }, 
    { path: '/UserProfile', name: 'UserProfile', component: UserProfile },
    { path: '/ClientAppointments', name: 'ClientAppointments', component: ClientAppointments },
    { path: '/UserRegister', name: 'UserRegister', component: UserRegister},
    { path: '/AdminDashboard', name: 'AdminDashboard', component: AdminDashboard },
    { path: '/AppointmentCalendar', name: 'AppointmentCalendar', component: AppointmentCalendar },
    { path: '/AppointmentBooking', name: 'AppointmentBooking', component: AppointmentBooking },
    { path: '/ManageAppointments', name: 'ManageAppointments', component: ManageAppointments },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

router.beforeEach((to, from, next) => {
    const publicPages = ['/', '/UserRegister']; 
    const authRequired = !publicPages.includes(to.path);
    const loggedIn = localStorage.getItem('token');

    if (authRequired && !loggedIn) {
        return next('/');
    }
    next();
});

export default router