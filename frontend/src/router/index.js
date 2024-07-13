import { createRouter, createWebHistory } from 'vue-router'
import UserHome from '@/components/UserHome.vue'
import UserRegister from '@/components/UserRegister.vue'
import AdminDashboard from '@/components/AdminDashboard.vue'
import AppointmentCalender from '@/components/AppointmentCalender.vue'

const routes = [
    { path: '/', name: 'Home', component: UserHome },
    { path: '/UserRegister', name: 'UserRegister', component: UserRegister},
    { path: '/AdminDashboard', name: 'AdminDashboard', component: AdminDashboard },
    { path: '/AppointmentCalendar', name: 'AppointmentCalendar', component: AppointmentCalender },
];

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router