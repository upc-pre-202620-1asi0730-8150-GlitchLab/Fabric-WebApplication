<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { Chart, registerables } from 'chart.js'
import { useI18n } from 'vue-i18n'

Chart.register(...registerables)

const CHART_LINE_COLOR = '#43521f'
const CHART_FILL_COLOR = 'rgba(67, 82, 31, 0.12)'
const { t, locale } = useI18n()

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
          label: t('dashboard.chart.series'),
          data: props.data.map(item => Number(item.totalProduced)),
          borderColor: CHART_LINE_COLOR,
          backgroundColor: CHART_FILL_COLOR,
          pointBackgroundColor: CHART_LINE_COLOR,
          borderWidth: 2,
          tension: 0.35,
          pointRadius: 5,
          pointHoverRadius: 7,
          fill: true
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
            label: (context) => `${context.parsed.y} ${t('dashboard.chart.garments')}`
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

watch([() => props.data, locale], () => {
  if (props.data.length > 0) createChart()
}, { deep: true, flush: 'post' })

onMounted(() => {
  if (props.data.length > 0) createChart()
})

onBeforeUnmount(() => {
  if (productionChart) productionChart.destroy()
})
</script>

<template>
  <div class="report-card report-production-card">
    <div class="report-card-header">
      <h2>{{ t('dashboard.chart.title') }}</h2>
      <p>{{ t('dashboard.chart.subtitle') }}</p>
    </div>

    <div v-if="!data.length" class="report-empty">
      {{ t('dashboard.chart.empty') }}
    </div>

    <div v-else class="report-chart-container">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </div>
</template>