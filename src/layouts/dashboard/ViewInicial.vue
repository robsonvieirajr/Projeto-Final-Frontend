<template>
  <v-app :theme="theme" id="inspire">
    <v-navigation-drawer v-model="drawer" app>
      <v-img
        src="https://picsum.photos/1920/1080?random"
        gradient="to top right, rgba(19,84,122,.8), rgba(128,208,199,.8)"
        height="80"
        cover
        class="pt-2"
      >
        <v-list>
          <v-list-item prepend-avatar=""> </v-list-item>
        </v-list>
      </v-img>

      <v-divider></v-divider>

      <v-list dense nav>
        <router-link
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          tag="div"
          @click.native="fazerLogoff(item)"
        >
          <v-list-item :value="item" color="primary">
            <template v-slot:prepend>
              <v-icon :icon="item.icon"></v-icon>
            </template>
            <v-list-item-title :textContent="item.text"></v-list-item-title>
          </v-list-item>
        </router-link>
      </v-list>
      
      <!-- Adicionando espaço extra para separar o switch -->
      <v-spacer></v-spacer>

      <!-- Switch para mudar o tema -->
      <v-list-item>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
        <v-icon v-if="isDark" mall color="blue">mdi-lightbulb-off-outline</v-icon>
      <v-icon v-else mall color="blue">mdi-lightbulb-on-outline</v-icon>
        <v-switch v-model="isDark" label="" @change="toggleTheme" ></v-switch>
      </v-list-item>
    </v-navigation-drawer>

    <v-app-bar color="teal-darken-4" dense app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>

    <v-footer color="teal-darken-4" padless app>
      <v-img
        gradient="to top right, rgba(19,84,122,.8), rgba(128,208,199,.8)"
        class="white--text text-center"
        width="100%"
      >
        ©2024 Gerenciamento de Recursos Hídricos. Todos os direitos reservados.
      </v-img>
    </v-footer>
  </v-app>
</template>

<script setup>
import { ref, inject } from 'vue';
import { useThemeStore } from '@/store/themeStore';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'vue-router';

const themeStore = useThemeStore();
const theme = inject('theme');

const drawer = ref(true);
const isDark = ref(themeStore.darkMode);
const router = useRouter();

function toggleTheme() {
  themeStore.toggleTheme();
  isDark.value = themeStore.darkMode;
}

function fazerLogoff(item) {
  if (item.text === 'Logout') {
    useAuthStore().logOut();
    router.push('/login');
  } else {
    router.push(item.to);
  }
}

const items = [
  { text: 'Home', icon: 'mdi-home', to: '/home' },
  { text: 'Acudes', icon: 'mdi-water', to: '/acudes' },
  { text: 'Manejo', icon: 'mdi-nature-people', to: '/manejo' },
  { text: 'Medição', icon: 'mdi-speedometer', to: '/medicao' },
  { text: 'Sensor', icon: 'mdi mdi-leak', to: '/sensor' },
  { text: 'Sobre', icon: 'mdi-information', to: '/about' },
  { text: 'Logout', icon: 'mdi-logout', to: '/login' },
];
</script>

<style scoped>
a {
  text-decoration: none;
  color: inherit;
}

.v-list-item {
  margin-bottom: 10px;
}

.v-footer {
  background-color: #004d40;
  color: white;
  padding: 10px 0;
}
</style>
