<template>
  <!-- Card Container -->
  <v-card class="mx-auto" width="250">
    <!-- Card Image -->
    <v-img
      :src="props.image"
      height="200px"
      cover
    ></v-img>

    <!-- Card Title and Subtitle -->
    <v-card-title>{{ props.title }}</v-card-title>
    <v-card-subtitle>{{ props.subtitle }}</v-card-subtitle>

    <!-- Card Actions -->
    <v-card-actions>
      <v-btn color="orange-lighten-2" variant="text">Explore</v-btn>
      <v-spacer></v-spacer>
      <v-btn
        :icon="show ? 'mdi-chevron-up' : 'mdi-chevron-down'"
        @click="show = !show"
      ></v-btn>
    </v-card-actions>

    <!-- Expandable Text Section -->
    <v-expand-transition>
      <div v-show="show">
        <v-divider></v-divider>
        <v-card-text>
          {{ props.text }}
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script setup>
// Imports
import { ref, defineProps } from 'vue';

// Define component properties
const props = defineProps({
  image: String,
  title: String,
  subtitle: String,
  text: String
});

// State for toggling expandable content
const show = ref(false);
</script>

<style>
/* Additional styling can be added here */
</style>
