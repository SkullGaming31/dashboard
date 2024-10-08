import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue';
import DashboardView from '../views/DashboardView.vue';
import EditSettings from '@/views/EditSettings.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/',
      name: 'login',
      component: LoginView, // The login page
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView, // The dashboard page
    },
    {
      path: '/edit-settings/:guildId', // Dynamic route for editing guild settings
      name: 'EditSettings',
      component: EditSettings,
      props: true, // Pass route params as props to the component
    },
  ]
})

export default router
