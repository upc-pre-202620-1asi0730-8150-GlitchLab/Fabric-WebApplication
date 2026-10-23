<script setup>
import { ref, onMounted } from 'vue'
import { ReportAnalyticsApiService } from '../../infrastructure/services/report-analytics-api.service'
import StatCard from '../components/StatCard.vue'
import ProductionChart from '../components/ProductionChart.vue'
import BatchesStage from '../components/BatchesStage.vue'
import BatchProgress from '../components/BatchProgress.vue'
import ExportReportModal from '../components/ExportReportModal.vue'
import { useProductionStore } from '../../../stores/production.js'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const selectedDate = ref('2026-10-04')
const selectedBatch = ref('All batches')

const metrics = ref({
  totalProduced: 0,
  averagePerHour: 0,
  dailyCompliance: 0
})

const loading = ref(true)
const error = ref(null)
const showExport = ref(false)
const productionHistory = ref([])

const reportService = new ReportAnalyticsApiService()
const productionStore = useProductionStore()

const loadDashboardData = async () => {
  try {
    loading.value = true
    error.value = null
    const [data, history] = await Promise.all([
      reportService.getDashboardData(selectedDate.value),
      reportService.getDashboardHistory()
    ])
    metrics.value = data
    productionHistory.value = history
  } catch (err) {
    console.error('Error loading dashboard:', err)
    error.value = 'dashboard.loadError'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  productionStore.fetchBatches()
  loadDashboardData()
})

// Export: Excel option downloads a CSV (opens in Excel), PDF option opens the print dialog
const downloadCsv = (rows, filename) => {
  const csv = rows.map(r => r.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

const onExport = (options) => {
  if (options.format === 'excel') {
    const rows = [[t('dashboard.date'), t('dashboard.stats.totalProduced'), t('dashboard.stats.averagePerHour'), `${t('dashboard.stats.dailyCompliance')} (%)`]]
    productionHistory.value
        .filter(r => r.date >= options.startDate && r.date <= options.endDate)
        .forEach(r => rows.push([r.date, r.totalProduced, r.averagePerHour, r.dailyCompliance]))
    downloadCsv(rows, `fabric-report-${options.startDate}_${options.endDate}.csv`)
  } else {
    window.print()
  }
  showExport.value = false
}
</script>

<template>
  <div class="dashboard-container">
    <header class="dashboard-header">
      <div class="dashboard-title">
        <h1>{{ t('dashboard.title') }}</h1>
        <p>{{ t('dashboard.subtitle') }}</p>

        <div class="filters">
          <div class="filter-group">
            <label>{{ t('dashboard.date') }}</label>
            <select v-model="selectedDate" @change="loadDashboardData">
              <option value="2026-10-04">{{ t('dashboard.today') }}</option>
              <option value="2026-10-03">{{ t('dashboard.october3') }}</option>
              <option value="2026-10-02">{{ t('dashboard.october2') }}</option>
            </select>
          </div>

          <div class="filter-group">
            <label>{{ t('dashboard.batch') }}</label>
            <select v-model="selectedBatch">
              <option>{{ t('dashboard.allBatches') }}</option>
            </select>
          </div>
        </div>
      </div>

      <button class="export-report-button" @click="showExport = true">
        ↓ {{ t('dashboard.exportReport') }}
      </button>
    </header>

    <div v-if="loading" class="state-message">
      {{ t('dashboard.loading') }}
    </div>

    <div v-else-if="error" class="state-message error">
      {{ t(error) }}
    </div>

    <template v-else>
      <section class="stats-grid">
        <StatCard
            :title="t('dashboard.stats.totalProduced')"
            :value="metrics.totalProduced"
            :description="t('dashboard.stats.garments')"
        />
        <StatCard
            :title="t('dashboard.stats.averagePerHour')"
            :value="metrics.averagePerHour"
            :description="t('dashboard.stats.garmentsPerHour')"
        />
        <StatCard
            :title="t('dashboard.stats.dailyCompliance')"
            :value="`${metrics.dailyCompliance}%`"
            :description="t('dashboard.stats.dailyTarget')"
        />
      </section>

      <section class="dashboard-grid">
        <ProductionChart :data="productionHistory" />
        <BatchesStage />
      </section>

      <BatchProgress />
    </template>

    <ExportReportModal v-if="showExport" @close="showExport = false" @export="onExport" />
  </div>
</template>

<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.dashboard-title h1 {
  margin: 0;
  font-size: 1.75rem;
  color: #0f172a;
}

.dashboard-title p {
  margin: 0.25rem 0 1rem 0;
  color: #64748b;
}

.filters {
  display: flex;
  gap: 1rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.filter-group label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #475569;
}

.filter-group select {
  padding: 0.5rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  background-color: #ffffff;
}

.export-report-button {
  padding: 0.6rem 1.2rem;
  background-color: #0f172a;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1rem;
}

.state-message {
  padding: 2rem;
  text-align: center;
  color: #64748b;
}

.state-message.error {
  color: #dc2626;
}
</style>