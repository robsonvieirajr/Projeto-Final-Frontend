// src/main.js

import { registerPlugins } from '@/plugins'
import App from './App.vue'
import { createApp } from 'vue'
import { Chart, registerables } from 'chart.js'



// Registra todos os componentes do Chart.js
Chart.register(...registerables)

// Cria uma instância da aplicação Vue
const app = createApp(App)

// Registra os plugins na instância da aplicação
registerPlugins(app)



// Monta a aplicação no elemento com o id 'app' no HTML
app.mount('#app')
