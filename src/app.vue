<script setup>
import { ref } from 'vue'

import Sidebar from './components/Sidebar.vue'
import ReportAnalyticsView from './report-analytics/presentation/views/report-analytics.vue'
import AlertsView from './alerts/presentation/views/alerts.vue'
import QualityView from './quality/presentation/views/quality.vue'

const currentPage = ref('dashboard')

const changePage = (page) => {
  currentPage.value = page
}
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
      <ReportAnalyticsView />
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
      <AlertsView />
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