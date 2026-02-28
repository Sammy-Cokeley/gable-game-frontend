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
  {
    path: '/contact',
    component: () => import('./views/ContactPage.vue')
  },
  {
    path: '/match',
    component: () => import('./views/MatchPage.vue')
  },
  {
    path: '/admin',
    component: () => import('./components/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      { path: 'rankings', component: () => import('./views/admin/rankings/AdminRankingsReleases.vue') },
      { path: 'rankings/new', component: () => import('./views/admin/rankings/AdminRankingsCreateRelease.vue') },
      { path: 'rankings/:releaseId', component: () => import('./views/admin/rankings/AdminRankingsReleaseDetail.vue'), props: true },
      { path: 'rankings/:releaseId/resolve', component: () => import('./views/admin/rankings/AdminRankingsResolve.vue'), props: true },
    ]
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

  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    return next('/')
  }

  next();
});


export default router;
