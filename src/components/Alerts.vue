<script setup>
import { computed, ref } from 'vue'

const selectedStatus = ref('All alerts')
const selectedBatch = ref('All batches')
const selectedType = ref('All types')

const selectedAlert = ref(null)

const alerts = ref([
  {
    id: 1,
    status: 'CRITICAL',
    type: 'Machine Downtime',
    reference: 'MC-014',
    title: 'Machine downtime above limit',
    description: 'Accumulated downtime: 47 min · Maximum allowed: 30 min',
    action: 'View Machine',
    accumulated: '47 min',
    limit: '30 min',
    excess: '17 min',
    machine: 'MC-014 — Overlock',
    batch: 'All batches'
  },

  {
    id: 2,
    status: 'CRITICAL',
    type: 'Defect Rate',
    reference: 'LOT-024',
    title: 'Defect rate above tolerance',
    description: 'Accumulated defective garments: 5.6% · Maximum allowed: 5%',
    action: 'View Batch',
    accumulated: '5.6%',
    limit: '5%',
    excess: '0.6%',
    machine: 'LOT-024',
    batch: 'LOT-024'
  },

  {
    id: 3,
    status: 'WARNING',
    type: 'Rework Rate',
    reference: 'LOT-021',
    title: 'Rework rate within target',
    description: 'Current rework rate: 1.7% · Optimal flow threshold: below 2%',
    action: 'View Batch',
    accumulated: '1.7%',
    limit: '2%',
    excess: '0%',
    machine: 'LOT-021',
    batch: 'LOT-021'
  },

  {
    id: 4,
    status: 'OPTIMAL',
    type: 'Machine Downtime',
    reference: 'MC-008',
    title: 'Machine downtime normalized',
    description: 'Accumulated downtime: 12 min · Maximum allowed: 30 min',
    action: 'View Machine',
    accumulated: '12 min',
    limit: '30 min',
    excess: '0 min',
    machine: 'MC-008 — Sewing',
    batch: 'All batches'
  }
])

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
</script>

<template>

  <main class="alerts-page">

    <!-- HEADER -->

    <header class="alerts-header">

      <div>

        <h1>
          Alerts
        </h1>

        <p>
          Monitor waste, rework and machine downtime across the production line.
        </p>

      </div>

    </header>


    <!-- FILTERS -->

    <section class="alerts-filters">

      <div class="alert-filter">

        <label>
          Status
        </label>

        <select v-model="selectedStatus">

          <option>
            All alerts
          </option>

          <option value="CRITICAL">
            Critical
          </option>

          <option value="WARNING">
            Warning
          </option>

          <option value="OPTIMAL">
            Optimal
          </option>

        </select>

      </div>


      <div class="alert-filter">

        <label>
          Batch
        </label>

        <select v-model="selectedBatch">

          <option>
            All batches
          </option>

          <option>
            LOT-024
          </option>

          <option>
            LOT-021
          </option>

        </select>

      </div>


      <div class="alert-filter">

        <label>
          Alert Type
        </label>

        <select v-model="selectedType">

          <option>
            All types
          </option>

          <option>
            Machine Downtime
          </option>

          <option>
            Defect Rate
          </option>

          <option>
            Rework Rate
          </option>

        </select>

      </div>

    </section>


    <!-- SUMMARY -->

    <section class="alerts-summary">

      <div class="alert-summary-card">

        <div class="summary-icon critical-icon">
          !
        </div>

        <div>

          <span>
            Critical Alerts
          </span>

          <strong>
            {{ criticalAlerts }}
          </strong>

          <small>
            require intervention
          </small>

        </div>

      </div>


      <div class="alert-summary-card">

        <div class="summary-icon warning-icon">
          !
        </div>

        <div>

          <span>
            Batches at Risk
          </span>

          <strong>
            {{ batchesAtRisk }}
          </strong>

          <small>
            above tolerance
          </small>

        </div>

      </div>


      <div class="alert-summary-card">

        <div class="summary-icon optimal-icon"></div>

        <div>

          <span>
            Optimal Flow
          </span>

          <strong>
            {{ optimalFlow }}
          </strong>

          <small>
            batches within target
          </small>

        </div>

      </div>

    </section>


    <!-- ALERT LIST -->

    <section class="production-alerts">

      <div class="alerts-section-header">

        <h2>
          Production Alerts
        </h2>

        <p>
          Alerts are generated automatically when operational tolerance thresholds are exceeded.
        </p>

      </div>


      <div class="alerts-list">

        <div
            v-for="alert in filteredAlerts"
            :key="alert.id"
            class="alert-row"
            :class="`alert-${alert.status.toLowerCase()}`"
            @click="selectAlert(alert)"
        >

          <div
              class="alert-status"
              :class="`status-${alert.status.toLowerCase()}`"
          >
            {{ alert.status }}
          </div>


          <div class="alert-information">

            <strong>
              {{ alert.reference }} — {{ alert.title }}
            </strong>

            <span>
              {{ alert.description }}
            </span>

          </div>


          <button
              class="alert-action"
              @click.stop="selectAlert(alert)"
          >
            {{ alert.action }} →
          </button>

        </div>


        <div
            v-if="!filteredAlerts.length"
            class="no-alerts"
        >
          No alerts found.
        </div>

      </div>

    </section>


    <!-- ALERT DETAIL -->

    <section
        v-if="selectedAlert"
        class="alert-detail"
    >

      <div class="detail-header">

        <h2>
          Alert Detail — {{ selectedAlert.reference }}
        </h2>

        <p>
          Operational indicators for the selected alert.
        </p>

      </div>


      <div class="detail-content">

        <div class="detail-item">

          <span>
            Accumulated Downtime
          </span>

          <strong>
            {{ selectedAlert.accumulated }}
          </strong>

        </div>


        <div class="detail-item">

          <span>
            Configured Limit
          </span>

          <strong>
            {{ selectedAlert.limit }}
          </strong>

        </div>


        <div class="detail-item">

          <span>
            Excess Time
          </span>

          <strong
              :class="{
                'detail-danger':
                  selectedAlert.status === 'CRITICAL'
              }"
          >
            {{ selectedAlert.excess }}
          </strong>

        </div>


        <div class="detail-item machine-detail">

          <span>
            Machine
          </span>

          <strong>
            {{ selectedAlert.machine }}
          </strong>

        </div>


        <div class="detail-status">

          <span>
            Status
          </span>

          <strong
              :class="`detail-status-${selectedAlert.status.toLowerCase()}`"
          >
            {{ selectedAlert.status }}
          </strong>

        </div>


        <button class="review-button">
          Review Machine
        </button>

      </div>

    </section>


    <section
        v-else
        class="alert-detail empty-detail"
    >

      <span>
        Select an alert to view its details.
      </span>

    </section>

  </main>

</template>