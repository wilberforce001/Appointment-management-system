import { createRouter, createWebHistory } from 'vue-router';
import UserRegister from '@/pages/UserRegister.vue';
import UserHome from '../pages/UserHome.vue';
import UserDashboard from '../pages/UserDashboard.vue';
import AdminDashboard from '@/pages/AdminDashboard.vue';


const routes = [
    { path: '/', name: 'UserHome', component: UserHome },
    { path: '/login', name: 'Login', component: UserHome },
    { path: '/UserRegister', name: 'UserRegister', component: UserRegister }, 
    { path: '/UserDashboard', name: 'UserDashboard', component: UserDashboard },
    { path: '/AdminDashboard', name: 'AdminDashboard', component: AdminDashboard }, 
];

const router = createRouter({
    history: createWebHistory(process.env.VUE_APP_BASE_URL),
    routes,
});

export default router;