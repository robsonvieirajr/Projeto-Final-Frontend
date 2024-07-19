<template>
  <v-card>
    <v-card-title>Precipitação Mensal</v-card-title>
    <v-card-text>
      <canvas ref="lineChart"></canvas>
    </v-card-text>
  </v-card>
</template>

<script>
import { Chart } from 'chart.js/auto'

export default {
  name: 'LineChart',
  mounted() {
    const ctx = this.$refs.lineChart.getContext('2d')
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho'],
        datasets: [
          {
            label: 'Precipitação (mm)',
            backgroundColor: '#42A5F5',
            borderColor: '#42A5F5',
            data: [40, 20, 12, 39, 10, 40],
            fill: false,
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
