<template>
  <!-- O componente Vue é envolvido por <v-app>, que é um componente do Vuetify que define a estrutura básica da aplicação. -->
  <v-app>
    <!-- Aqui, o componente <default-view /> é renderizado dentro de <v-app>. -->
    <default-view />
  </v-app>
</template>

<script setup>
  // Importa o componente DefaultView.vue, que será renderizado dentro de App.vue.
  import DefaultView from './ViewInicial.vue'
</script>
