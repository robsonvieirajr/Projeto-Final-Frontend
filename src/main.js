import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import { useAuthStore } from '@/store/authStore';
import { Chart, registerables } from 'chart.js';
import { registerPlugins } from '@/plugins';
import router from './router'; // Ajuste o caminho conforme necessário
import { createVuetify } from 'vuetify';
import 'vuetify/styles';
import { pt } from 'vuetify/locale'; // Importação correta do locale

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

// Configuração do Vuetify com o locale pt-BR
const vuetify = createVuetify({
    locale: {
        locale: 'pt',
        messages: { pt },
    },
});

// Monta a aplicação no elemento com o id 'app' no HTML
app.use(router);
app.use(vuetify);  // Adiciona o Vuetify à instância Vue
app.mount('#app');
