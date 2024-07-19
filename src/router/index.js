import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/store/authStore';

const DefaultLayout = () => import('@/layouts/dashboard/Default.vue');
const HomeView = () => import('@/views/Home.vue');
const AboutView = () => import('@/views/About.vue');
const AcudesView = () => import('@/views/Acudes.vue');
const ReportsView = () => import('@/views/Reports.vue');
const SettingsView = () => import('@/views/Settings.vue');
const LoginView = () => import('@/views/Login.vue');
const ResetPassword = () => import('@/views/ResetPassword.vue');

const routes = [
  {
    path: '/',
    redirect: '/login',  // Adiciona um redirecionamento direto para login na raiz
    component: DefaultLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'home',  // Mudança da rota home para '/home'
        name: 'Home',
        component: HomeView,
        meta: { requiresAuth: true }
      },
      {
        path: 'about',
        name: 'About',
        component: AboutView,
        meta: { requiresAuth: true }
      },
      {
        path: 'acudes',
        name: 'Acudes',
        component: AcudesView,
        meta: { requiresAuth: true }
      },
      {
        path: 'reports',
        name: 'Reports',
        component: ReportsView,
        meta: { requiresAuth: true }
      },
      {
        path: 'settings',
        name: 'Settings',
        component: SettingsView,
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresAuth: false }
  },
  {
    path: '/reset-password',  // Adiciona a rota para redefinição de senha
    name: 'ResetPassword',
    component: ResetPassword,
    meta: { requiresAuth: false }
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  // Verifica a autenticação e a necessidade de autenticação da rota
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');  // Redireciona para o login se não estiver autenticado
  } else {
    next();  // Permite o acesso se estiver autenticado ou se a rota não requer autenticação
  }
});


export default router;
