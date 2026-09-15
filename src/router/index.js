import { createRouter, createWebHistory } from 'vue-router'

import AccueilView from '../views/AccueilView.vue'
import AdminView from '../views/AdminView.vue'
import AjouterView from '../views/AjouterView.vue'
import ArticleDetailView from '../views/ArticleDetailView.vue'
import ArticlesView from '../views/ArticlesView.vue'
import LoginView from '../views/LoginView.vue'
import PanierView from '../views/PanierView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'accueil', component: AccueilView },
    { path: '/articles', name: 'articles', component: ArticlesView },
    { path: '/article/:id', name: 'article-detail', component: ArticleDetailView },
    { path: '/ajouter', name: 'ajouter', component: AjouterView },
    { path: '/panier', name: 'panier', component: PanierView },
    { path: '/login', name: 'login', component: LoginView },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView,
      meta: { requiresAuth: true },
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.beforeEach((to) => {
  const session = localStorage.getItem('ama-zone-session')
  let isConnected = false

  if (session) {
    try {
      isConnected = Boolean(JSON.parse(session).isConnected)
    } catch {
      localStorage.removeItem('ama-zone-session')
    }
  }

  return !to.meta.requiresAuth || isConnected
    ? true
    : {
        name: 'login',
        query: { redirect: to.fullPath },
      }
})

export default router
