<script setup>
import { ref, computed, onMounted } from 'vue'
import { AlertsApiService } from '../../infrastructure/services/alerts-api.service.js'
import AlertRow from '../components/Alerts.vue'

const selectedStatus = ref('All alerts')
const selectedBatch = ref('All batches')
const selectedType = ref('All types')

const selectedAlert = ref(null)

const alerts = ref([])
const loading = ref(true)
const error = ref(null)

const alertsService = new AlertsApiService()

const fetchAlerts = async () => {
  try {
    loading.value = true
    alerts.value = await alertsService.getAll()
  } catch (err) {
    console.error('Error loading alerts:', err)
    error.value = 'Failed to load alerts from server.'
  } finally {
    loading.value = false
  }
}

const filteredAlerts = computed(() => {
  return alerts.value.filter(alert => {
    const statusMatches =
        selectedStatus.value === 'All alerts' ||
        alert.status === selectedStatus.value

    const batchMatches =
        selectedBatch.value === 'All batches' ||
        alert.batch === selectedBatch.value

    const typeMatches =
        selectedType.value === 'All types' ||
        alert.type === selectedType.value

    return statusMatches && batchMatches && typeMatches
  })
})

const criticalAlerts = computed(() => {
  return alerts.value.filter(
      alert => alert.status === 'CRITICAL'
  ).length
})

const batchesAtRisk = computed(() => {
  return alerts.value.filter(
      alert =>
          alert.status === 'CRITICAL' &&
          alert.type !== 'Machine Downtime'
  ).length
})

const optimalFlow = computed(() => {
  return alerts.value.filter(
      alert => alert.status === 'OPTIMAL'
  ).length
})

const selectAlert = (alert) => {
  selectedAlert.value = alert
}

onMounted(() => {
  fetchAlerts()
})
</script>

<template>
  <main class="alerts-page">
    <!-- HEADER -->
    <header class="alerts-header">
      <div>
        <h1>Alerts</h1>
        <p>Monitor waste, rework and machine downtime across the production line.</p>
      </div>
    </header>

    <!-- STATE MESSAGES -->
    <div v-if="loading" class="state-message">
      Loading alerts...
    </div>

    <div v-else-if="error" class="state-message error">
      {{ error }}
    </div>

    <template v-else>
      <!-- FILTERS -->
      <section class="alerts-filters">
        <div class="alert-filter">
          <label>Status</label>

          <div class="select-wrapper">
            <select v-model="selectedStatus">
              <option>All alerts</option>
              <option value="CRITICAL">Critical</option>
              <option value="WARNING">Warning</option>
              <option value="OPTIMAL">Optimal</option>
            </select>
          </div>
        </div>

        <div class="alert-filter">
          <label>Batch</label>

          <div class="select-wrapper">
            <select v-model="selectedBatch">
              <option>All batches</option>
              <option>LOT-024</option>
              <option>LOT-021</option>
            </select>
          </div>
        </div>

        <div class="alert-filter">
          <label>Alert Type</label>

          <div class="select-wrapper">
            <select v-model="selectedType">
              <option>All types</option>
              <option>Machine Downtime</option>
              <option>Defect Rate</option>
              <option>Rework Rate</option>
            </select>
          </div>
        </div>
      </section>

      <!-- SUMMARY -->
      <section class="alerts-summary">
        <div class="alert-summary-card">
          <div class="summary-icon critical-icon">!</div>
          <div>
            <span>Critical Alerts</span>
            <strong>{{ criticalAlerts }}</strong>
            <small>require intervention</small>
          </div>
        </div>

        <div class="alert-summary-card">
          <div class="summary-icon warning-icon">!</div>
          <div>
            <span>Batches at Risk</span>
            <strong>{{ batchesAtRisk }}</strong>
            <small>above tolerance</small>
          </div>
        </div>

        <div class="alert-summary-card">
          <div class="summary-icon optimal-icon">✓</div>
          <div>
            <span>Optimal Flow</span>
            <strong>{{ optimalFlow }}</strong>
            <small>batches within target</small>
          </div>
        </div>
      </section>

      <!-- ALERT LIST -->
      <section class="production-alerts">
        <div class="alerts-section-header">
          <h2>Production Alerts</h2>
          <p>Alerts are generated automatically when operational tolerance thresholds are exceeded.</p>
        </div>

        <div class="alerts-list">
          <AlertRow
              v-for="alert in filteredAlerts"
              :key="alert.id"
              :alert="alert"
              @select="selectAlert"
          />

          <div v-if="!filteredAlerts.length" class="no-alerts">
            No alerts found.
          </div>
        </div>
      </section>

      <!-- ALERT DETAIL -->
      <section v-if="selectedAlert" class="alert-detail">
        <div class="detail-header">
          <h2>Alert Detail — {{ selectedAlert.reference }}</h2>
          <p>Operational indicators for the selected alert.</p>
        </div>

        <div class="detail-content">
          <div class="detail-item">
            <span>ACCUMULATED DOWNTIME</span>
            <strong>{{ selectedAlert.accumulated }}</strong>
          </div>

          <div class="detail-item">
            <span>CONFIGURED LIMIT</span>
            <strong>{{ selectedAlert.limit }}</strong>
          </div>

          <div class="detail-item">
            <span>EXCESS TIME</span>
            <strong :class="{ 'detail-danger': selectedAlert.status === 'CRITICAL' }">
              {{ selectedAlert.excess }}
            </strong>
          </div>

          <div class="detail-item">
            <span>MACHINE</span>
            <strong>{{ selectedAlert.machine }}</strong>
          </div>

          <div class="detail-item">
            <span>STATUS</span>

            <div
                class="detail-status-badge"
                :class="`badge-${selectedAlert.status.toLowerCase()}`"
            >
              {{ selectedAlert.status }}
            </div>
          </div>

          <button class="review-button">
            Review Machine
          </button>
        </div>
      </section>

      <section v-else class="alert-detail empty-detail">
        <span>Select an alert to view its details.</span>
      </section>
    </template>
  </main>
</template>

<style scoped>
.alerts-page {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.alerts-header h1 {
  margin: 0;
  font-size: 1.75rem;
  color: #0f172a;
}

.alerts-header p {
  margin: 0.25rem 0 0 0;
  color: #64748b;
}

/* FILTROS (Solución Imagen 1) */
.alerts-filters {
  display: flex;
  gap: 1.25rem;
  flex-wrap: wrap;
  background-color: #ffffff;
  padding: 1.25rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.alert-filter {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  flex: 1;
  min-width: 180px;
}

.alert-filter label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #334155;
}

.select-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.alert-filter select {
  width: 100%;
  height: 40px;
  padding: 0 2rem 0 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.875rem;
  line-height: 40px;
  color: #1e293b;
  background-color: #ffffff;
  box-sizing: border-box;
  outline: none;
  cursor: pointer;
  vertical-align: middle;
  appearance: auto;
}

.alert-filter select:focus {
  border-color: #2563eb;
}

/* RESUMEN */
.alerts-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.alert-summary-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background-color: #ffffff;
  padding: 1.25rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.summary-icon {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.1rem;
}

.critical-icon {
  background-color: #fee2e2;
  color: #dc2626;
}

.warning-icon {
  background-color: #fef3c7;
  color: #d97706;
}

.optimal-icon {
  background-color: #d1fae5;
  color: #059669;
}

.alert-summary-card span {
  display: block;
  font-size: 0.85rem;
  color: #64748b;
}

.alert-summary-card strong {
  font-size: 1.5rem;
  color: #0f172a;
}

.alert-summary-card small {
  display: block;
  font-size: 0.75rem;
  color: #94a3b8;
}

/* LISTA DE ALERTAS */
.production-alerts {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: #ffffff;
  padding: 1.25rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.alerts-section-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: #0f172a;
}

.alerts-section-header p {
  margin: 0.25rem 0 0 0;
  font-size: 0.875rem;
  color: #64748b;
}

.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.no-alerts {
  padding: 1.5rem;
  text-align: center;
  color: #94a3b8;
  font-style: italic;
}

/* DETALLE DE ALERTA (Solución Imagen 2) */
.alert-detail {
  background-color: #ffffff;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.detail-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: #0f172a;
  font-weight: 700;
}

.detail-header p {
  margin: 0.25rem 0 0 0;
  font-size: 0.85rem;
  color: #64748b;
}

.detail-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1.25rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding-right: 1.5rem;
  border-right: 1px solid #e2e8f0;
  flex: 1;
  min-width: 140px;
}

.detail-item:nth-last-child(2) {
  border-right: none;
}

.detail-item span {
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.detail-item strong {
  font-size: 1.15rem;
  font-weight: 700;
  color: #0f172a;
}

.detail-danger {
  color: #dc2626 !important;
}

/* Badge del Status en Detalle */
.detail-status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.3rem 0.65rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 700;
  width: fit-content;
  letter-spacing: 0.02em;
}

.badge-critical {
  background-color: #dc2626;
  color: #ffffff;
}

.badge-warning {
  background-color: #d97706;
  color: #ffffff;
}

.badge-optimal {
  background-color: #059669;
  color: #ffffff;
}

/* Botón Review Machine */
.review-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  background-color: #384d1d;
  color: #ffffff;
  border: 2px solid #384d1d;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.95rem;
  line-height: 1;
  text-align: center;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  min-width: max-content;
  transition: all 0.25s ease-in-out;
}

.review-button:hover {
  background-color: #ffffff;
  color: #384d1d;
  border-color: #384d1d;
}

.empty-detail {
  text-align: center;
  color: #94a3b8;
  padding: 2rem;
}

.state-message {
  text-align: center;
  padding: 2rem;
  color: #64748b;
}

.state-message.error {
  color: #dc2626;
}
</style>