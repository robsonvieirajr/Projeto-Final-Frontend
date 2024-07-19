<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card class="mb-4">
          <v-card-title>
            <v-row>
              <v-col cols="12" class="text-center">
                <h1>Dashboard Pluviométrico</h1>
              </v-col>
            </v-row>
          </v-card-title>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <LineChart />
      </v-col>
      <v-col cols="12" md="6">
        <BarChart />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <DailyPrecipitationChart />
      </v-col>
      <v-col cols="12" md="6">
        <AnnualComparisonChart />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { onMounted } from 'vue'
import LineChart from '@/components/LineChart.vue'
import BarChart from '@/components/BarChart.vue'
import DailyPrecipitationChart from '@/components/DailyPrecipitationChart.vue'
import AnnualComparisonChart from '@/components/AnnualComparisonChart.vue'

onMounted(() => {
  console.log('Página Home montada com sucesso')
})
</script>

<style scoped>
h1 {
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  color: #2c3e50;
}
</style>
