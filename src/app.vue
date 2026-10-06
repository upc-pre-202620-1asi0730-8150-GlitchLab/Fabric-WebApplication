<script setup>
import { ref, onMounted } from 'vue'
import { useProductionStore } from './stores/production'

import Sidebar from './components/Sidebar.vue'
import StatCard from './components/StatCard.vue'
import ProductionChart from './components/ProductionChart.vue'
import BatchesStage from './components/BatchesStage.vue'
import BatchProgress from './components/BatchProgress.vue'
import Alerts from './components/Alerts.vue'
import QualityView from './quality/presentation/views/quality.vue'

const productionStore = useProductionStore()

const currentPage = ref('dashboard')

const selectedDate = ref('2026-10-04')
const selectedBatch = ref('All batches')

const loadData = async () => {
  await productionStore.loadDashboard(selectedDate.value)
}

const changePage = (page) => {
  currentPage.value = page
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="app">
    <Sidebar
        :current-page="currentPage"
        @change-page="changePage"
    />

    <main
        v-if="currentPage === 'dashboard'"
        class="main-content"
    >
      <header class="dashboard-header">
        <div class="dashboard-title">
          <h1>Dashboard</h1>
          <p>Overview of today's production</p>

          <div class="filters">
            <div class="filter-group">
              <label>Date</label>
              <select v-model="selectedDate" @change="loadData">
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

      <section class="stats-grid">
        <StatCard
            title="Total produced today"
            :value="productionStore.totalProduced"
            description="garments"
        />
        <StatCard
            title="Average per hour"
            :value="productionStore.averagePerHour"
            description="garments / hour"
        />
        <StatCard
            title="Daily compliance"
            :value="`${productionStore.dailyCompliance}%`"
            description="daily production target"
        />
      </section>

      <section class="dashboard-grid">
        <ProductionChart />
        <BatchesStage />
      </section>

      <BatchProgress />
    </main>

    <main
        v-else-if="currentPage === 'quality'"
        class="main-content quality-main-wrapper"
    >
      <QualityView @navigate-to-dashboard="changePage('dashboard')" />
    </main>

    <main
        v-else-if="currentPage === 'alerts'"
        class="main-content"
    >
      <Alerts />
    </main>

    <main
        v-else
        class="main-content"
    >
      <div class="card coming-soon">
        <h2>{{ currentPage }}</h2>
        <p>This section is still being developed.</p>
      </div>
    </main>
  </div>
</template>

<style scoped>
.quality-main-wrapper {
  padding: 0 !important;
  background-color: #ffffff;
}
</style>