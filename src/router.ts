import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'dashboard',
    component: () => import('@ui/pages/DashboardPage.vue'),
    meta: { title: 'Mes comparaisons' },
  },
  {
    path: '/compare/:id?',
    name: 'compare',
    component: () => import('@ui/pages/ComparisonPage.vue'),
    meta: { title: 'Comparaison' },
  },
  {
    path: '/learn',
    name: 'learn',
    component: () => import('@ui/pages/ExplanationsPage.vue'),
    meta: { title: 'Comprendre les calculs' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const title = (to.meta.title as string) ?? 'InvestCompare'
  document.title = `${title} — InvestCompare`
})

export default router
