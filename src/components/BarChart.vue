<template>
  <v-card>
    <v-card-title>Chuva Anual</v-card-title>
    <v-card-text>
      <canvas ref="barChart"></canvas>
    </v-card-text>
  </v-card>
</template>

<script>
import { Chart } from 'chart.js/auto'

export default {
  name: 'BarChart',
  mounted() {
    const ctx = this.$refs.barChart.getContext('2d')
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho'],
        datasets: [
          {
            label: 'Precipitação (mm)',
            backgroundColor: '#42A5F5',
            data: [40, 20, 12, 39, 10, 40],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    })
  },
}
</script>
