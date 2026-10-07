<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { Chart, registerables } from 'chart.js'
import { useProductionStore } from '../stores/production'

Chart.register(...registerables)

const productionStore = useProductionStore()

const chartCanvas = ref(null)

let productionChart = null

const createChart = () => {
  if (!chartCanvas.value) {
    return
  }

  if (productionChart) {
    productionChart.destroy()
  }

  const data = productionStore.productionData

  productionChart = new Chart(chartCanvas.value, {
    type: 'line',

    data: {
      labels: data.map(item => item.hour),

      datasets: [
        {
          label: 'Garments produced',
          data: data.map(item => Number(item.garments)),
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
        legend: {
          display: false
        },

        tooltip: {
          callbacks: {
            label: (context) => {
              return `${context.parsed.y} garments`
            }
          }
        }
      },

      scales: {
        x: {
          grid: {
            display: false
          }
        },

        y: {
          beginAtZero: true,

          ticks: {
            precision: 0
          }
        }
      }
    }
  })
}

watch(
    () => productionStore.productionData,
    () => {
      if (productionStore.productionData.length > 0) {
        createChart()
      }
    },
    {
      deep: true
    }
)

onMounted(() => {
  if (productionStore.productionData.length > 0) {
    createChart()
  }
})

onBeforeUnmount(() => {
  if (productionChart) {
    productionChart.destroy()
  }
})
</script>

<template>
  <div class="card production-card">

    <div class="card-header">

      <h2>
        Production by hour
      </h2>

      <p>
        Garments produced during the selected day
      </p>

    </div>

    <div
        v-if="productionStore.loading"
        class="chart-message"
    >
      Loading production data...
    </div>

    <div
        v-else-if="productionStore.error"
        class="chart-message"
    >
      {{ productionStore.error }}
    </div>

    <div
        v-else-if="!productionStore.productionData.length"
        class="chart-message"
    >
      No production data available
    </div>

    <div
        v-else
        class="chart-container"
    >
      <canvas ref="chartCanvas"></canvas>
    </div>

  </div>
</template>