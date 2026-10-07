<script setup>
import { ref, onMounted } from 'vue'
import { ReportAnalyticsApiService } from '../../infrastructure/services/report-analytics-api.service'
import StatCard from '../components/StatCard.vue'
import ProductionChart from '../components/ProductionChart.vue'
import BatchesStage from '../components/BatchesStage.vue'
import BatchProgress from '../components/BatchProgress.vue'
import {useProductionStore} from "../../../stores/production.js";

const selectedDate = ref('2026-10-04')
const selectedBatch = ref('All batches')

const metrics = ref({
  totalProduced: 0,
  averagePerHour: 0,
  dailyCompliance: 0
})

const loading = ref(true)
const error = ref(null)

const reportService = new ReportAnalyticsApiService()

const productionStore = useProductionStore()

const loadDashboardData = async () => {
  try {
    loading.value = true
    const data = await reportService.getDashboardData(selectedDate.value)
    metrics.value = data
    await productionStore.loadDashboard(selectedDate.value)
  } catch (err) {
    console.error('Error loading dashboard:', err)
    error.value = 'Failed to load report analytics.'
  } finally {
    loading.value = false
  }
}

const productionHistory = ref([])

onMounted(async () => {
  await loadDashboardData()
  try {
    productionHistory.value = await reportService.getDashboardHistory()
  } catch (err) {
    console.error('Error loading production history:', err)
  }
})

onMounted(() => {
  loadDashboardData()
})
</script>

<template>
  <div class="dashboard-container">
    <header class="dashboard-header">
      <div class="dashboard-title">
        <h1>Dashboard</h1>
        <p>Overview of today's production</p>

        <div class="filters">
          <div class="filter-group">
            <label>Date</label>
            <select v-model="selectedDate" @change="loadDashboardData">
              <option value="2026-10-04">Today</option>
              <option value="2026-10-03">October 3, 2026</option>
              <option value="2026-10-02">October 2, 2026</option>
            </select>
          </div>

          <div class="filter-group">
            <label>Batch</label>
            <select v-model="selectedBatch">
              <option>All batches</option>
            </select>
          </div>
        </div>
      </div>

      <button class="export-report-button">
        ↓ Export Report
      </button>
    </header>

    <div v-if="loading" class="state-message">
      Loading production analytics...
    </div>

    <div v-else-if="error" class="state-message error">
      {{ error }}
    </div>

    <template v-else>
      <section class="stats-grid">
        <StatCard
            title="Total produced today"
            :value="metrics.totalProduced"
            description="garments"
        />
        <StatCard
            title="Average per hour"
            :value="metrics.averagePerHour"
            description="garments / hour"
        />
        <StatCard
            title="Daily compliance"
            :value="`${metrics.dailyCompliance}%`"
            description="daily production target"
        />
      </section>

      <section class="dashboard-grid">
        <ProductionChart :data="productionHistory" />
        <BatchesStage />
      </section>

      <BatchProgress />
    </template>
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