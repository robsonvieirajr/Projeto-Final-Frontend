import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import { useAuthStore } from '@/store/authStore';
import { Chart, registerables } from 'chart.js';
import { registerPlugins } from '@/plugins';
import router from './router'; // Ajuste o caminho conforme necessário

// Registra todos os componentes do Chart.js
Chart.register(...registerables);

// Cria uma instância da aplicação Vue
const app = createApp(App);

// Cria e registra uma instância do Pinia
const pinia = createPinia();
app.use(pinia);

// Registra os plugins na instância da aplicação
registerPlugins(app);

// Obtém a instância da store de autenticação
const authStore = useAuthStore();
authStore.checkTokenExpirationOnLoad();

// Monta a aplicação no elemento com o id 'app' no HTML
app.use(router).mount('#app');
