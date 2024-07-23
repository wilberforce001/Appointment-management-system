import { createRouter, createWebHistory } from 'vue-router';
import UserRegister from '@/pages/UserRegister.vue';
import UserHome from '../pages/UserHome.vue';
import UserDashboard from '../pages/UserDashboard.vue';
import AdminDashboard from '@/pages/AdminDashboard.vue';
import NotFoundPage from '@/pages/NotFoundPage.vue';


const routes = [
    { path: '/', name: 'UserHome', component: UserHome },
    { path: '/login', name: 'Login', component: UserHome },
    { path: '/UserRegister', name: 'UserRegister', component: UserRegister }, 
    { path: '/UserDashboard', name: 'UserDashboard', component: UserDashboard },
    { path: '/AdminDashboard', name: 'AdminDashboard', component: AdminDashboard, meta: {requiresAuth: true } },
    { path: '/:catchAll(.*)', name: 'NotFound', component: NotFoundPage, }, 
];

const router = createRouter({
    history: createWebHistory(process.env.VUE_APP_BASE_URL),
    routes,
});

// Navigation guard to check authentication
router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const isAuthenticated = !!localStorage.getItem('token');
  
    if (requiresAuth && !isAuthenticated) {
      next('/login');
    } else {
      next();
    }
  });

export default router;