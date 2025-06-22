import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from './store/auth.store'

const routes = [
  {
    path: '/',
    component: () => import('./views/Home.vue')
  },
  {
    path: '/login',
    component: () => import('./views/Login.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    component: () => import('./views/Register.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/verify-email',
    component: () => import('./views/VerifyEmail.vue')
  },
  {
    path: '/privacy-policy',
    component: () => import('./views/PrivacyPolicy.vue')
  },
  {
    path: '/about',
    component: () => import('./views/AboutPage.vue')
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next('/login');
  }

  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    return next('/');
  }

  next();
});

export default router;
