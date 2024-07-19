<template>
    <v-card>
      <v-card-title>Precipitação Diária</v-card-title>
      <v-card-text>
        <v-chart
          type="line"
          :data="chartData"
          :options="options"
        />
      </v-card-text>
    </v-card>
  </template>
  
  <script>
  import { defineComponent } from 'vue'
  import { Line } from 'vue-chartjs'
  import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js'
  
  ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)
  
  export default defineComponent({
    name: 'DailyPrecipitationChart',
    components: {
      'v-chart': Line,
    },
    data() {
      return {
        chartData: {
          labels: Array.from({ length: 31 }, (_, i) => i + 1),
          datasets: [
            {
              label: 'Precipitação (mm)',
              backgroundColor: '#42A5F5',
              borderColor: '#42A5F5',
              data: [10, 20, 15, 5, 30, 25, 10, 20, 15, 5, 30, 25, 10, 20, 15, 5, 30, 25, 10, 20, 15, 5, 30, 25, 10, 20, 15, 5, 30, 25, 10],
              fill: false
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
  