<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
})

const chartCanvas = ref(null)
let productionChart = null

const createChart = () => {
  if (!chartCanvas.value || !props.data.length) return

  if (productionChart) {
    productionChart.destroy()
  }

  productionChart = new Chart(chartCanvas.value, {
    type: 'line',
    data: {
      labels: props.data.map(item => item.date),
      datasets: [
        {
          label: 'Garments produced',
          data: props.data.map(item => Number(item.totalProduced)),
          borderWidth: 2,
          tension: 0.35,
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) => `${context.parsed.y} garments`
          }
        }
      },
      scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: true, ticks: { precision: 0 } }
      }
    }
  })
}

watch(() => props.data, () => {
  if (props.data.length > 0) createChart()
}, { deep: true })

onMounted(() => {
  if (props.data.length > 0) createChart()
})

onBeforeUnmount(() => {
  if (productionChart) productionChart.destroy()
})
</script>

<template>
  <div class="card production-card">
    <div class="card-header">
      <h2>Production by day</h2>
      <p>Garments produced over the last days</p>
    </div>

    <div v-if="!data.length" class="chart-message">
      No production data available
    </div>

    <div v-else class="chart-container">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </div>
</template>