<template>
  <v-app :theme="theme">
    <router-view />
  </v-app>
</template>

<script setup>
import { computed, provide } from 'vue';
import { useThemeStore } from '@/store/themeStore';

const themeStore = useThemeStore();
const theme = computed(() => (themeStore.darkMode ? 'dark' : 'light'));
provide('theme', theme);
</script>
