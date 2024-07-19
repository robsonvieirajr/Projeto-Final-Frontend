// src/plugins/index.js

import vuetify from './vuetify' // Plugin Vuetify
import pinia from '../store' // Plugin Pinia
import router from '../router' // Plugin Router

export function registerPlugins(app) {
  app
    .use(vuetify)
    .use(pinia)
    .use(router)
}
