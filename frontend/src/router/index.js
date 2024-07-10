import { createRouter, createWebHistory } from 'vue-router'
import UserLogin from '@/components/UserLogin.vue'
import UserRegister from '@/components/UserRegister.vue'
import AdminDashboard from '@/components/AdminDashboard.vue'
import AppointmentCalender from '@/components/AppointmentCalender.vue'

const routes = [
    { path: '/', component: UserLogin },
    { path: '/register', component: UserRegister},
    { path: '/dashboard', component: AdminDashboard },
    { path: '/calender', component: AppointmentCalender },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router