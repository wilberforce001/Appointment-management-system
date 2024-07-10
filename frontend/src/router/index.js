import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/components/Login.vue'
import Register from '@/components/Register.vue'
import Dashboard from '@/components/Dashboard.vue'
import Calender from '@/components/Calender.vue'
import { component } from 'vue/types/umd'

const routes = [
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    { path: '/dashboard', component: Dashboard },
    { path: '/calender', component: Calender },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router