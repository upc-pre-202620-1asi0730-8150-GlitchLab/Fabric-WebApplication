<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ReportAnalyticsApiService } from '../../infrastructure/services/report-analytics-api.service'
import StatCard from '../components/StatCard.vue'
import ProductionChart from '../components/ProductionChart.vue'
import BatchesStage from '../components/BatchesStage.vue'
import BatchProgress from '../components/BatchProgress.vue'
import ExportReportModal from '../components/ExportReportModal.vue'
import { useProductionStore } from '../../../production-batches/application/store/production.js'

const { t, locale } = useI18n()
const selectedDate = ref(null)
const selectedBatch = ref(null)

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

const availableDates = computed(() => productionHistory.value.map(record => record.date).sort().reverse())
const visibleBatches = computed(() => selectedBatch.value === null
    ? productionStore.batches
    : productionStore.batches.filter(batch => batch.id === selectedBatch.value))

const formatDate = (date) =>
    new Intl.DateTimeFormat(locale.value, { dateStyle: 'medium' }).format(new Date(`${date}T00:00:00`))

const loadMetrics = async () => {
  metrics.value = await reportService.getDashboardData(selectedDate.value)
}

const loadDashboardData = async () => {
  try {
    loading.value = true
    error.value = null
    productionHistory.value = await reportService.getDashboardHistory()
    selectedDate.value = availableDates.value[0] ?? null
    await loadMetrics()
  } catch (err) {
    console.error('Error loading dashboard:', err)
    error.value = 'dashboard.loadError'
  } finally {
    loading.value = false
  }
}

const onDateChange = async () => {
  try {
    error.value = null
    await loadMetrics()
  } catch (err) {
    console.error('Error loading dashboard:', err)
    error.value = 'dashboard.loadError'
  }
}

onMounted(() => {
  productionStore.fetchBatches()
  loadDashboardData()
})

const downloadCsv = (rows, filename) => {
  const csv = rows.map(r => r.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
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
  <div class="report-container">
    <header class="report-header">
      <div class="report-title">
        <h1>{{ t('dashboard.title') }}</h1>
        <p>{{ t('dashboard.subtitle') }}</p>

        <div class="report-filters">
          <div class="report-filter-group">
            <label for="report-date">{{ t('dashboard.date') }}</label>
            <select id="report-date" v-model="selectedDate" :disabled="!availableDates.length" @change="onDateChange">
              <option v-for="date in availableDates" :key="date" :value="date">{{ formatDate(date) }}</option>
            </select>
          </div>

          <div class="report-filter-group">
            <label for="report-batch">{{ t('dashboard.batch') }}</label>
            <select id="report-batch" v-model="selectedBatch">
              <option :value="null">{{ t('dashboard.allBatches') }}</option>
              <option v-for="batch in productionStore.batches" :key="batch.id" :value="batch.id">
                {{ batch.batchNumber }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <button class="report-export-button" @click="showExport = true">
        ↓ {{ t('dashboard.exportReport') }}
      </button>
    </header>

    <div v-if="loading" class="report-state">
      {{ t('dashboard.loading') }}
    </div>

    <div v-else-if="error" class="report-state report-state-error">
      {{ t(error) }}
    </div>

    <template v-else>
      <section class="report-stats-grid">
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

      <section class="report-grid">
        <ProductionChart :data="productionHistory" />
        <BatchesStage :batches="visibleBatches" />
      </section>

      <BatchProgress :batches="visibleBatches" />
    </template>

    <ExportReportModal v-if="showExport" @close="showExport = false" @export="onExport" />
  </div>
</template>
