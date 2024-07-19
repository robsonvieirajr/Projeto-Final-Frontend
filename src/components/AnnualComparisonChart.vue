<template>
    <v-card>
      <v-card-title>Comparação de Precipitação Anual</v-card-title>
      <v-card-text>
        <v-chart
          type="bar"
          :data="chartData"
          :options="options"
        />
      </v-card-text>
    </v-card>
  </template>
  
  <script>
  import { defineComponent } from 'vue'
  import { Bar } from 'vue-chartjs'
  import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
  
  ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)
  
  export default defineComponent({
    name: 'AnnualComparisonChart',
    components: {
      'v-chart': Bar,
    },
    data() {
      return {
        chartData: {
          labels: ['2020', '2021', '2022', '2023'],
          datasets: [
            {
              label: 'Precipitação (mm)',
              backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#AB47BC'],
              data: [1200, 1350, 1100, 1450]
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      }
    }
  })
  </script>
  