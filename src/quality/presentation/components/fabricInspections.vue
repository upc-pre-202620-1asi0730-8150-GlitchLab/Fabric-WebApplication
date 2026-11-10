<template>
  <div class="fabric-inspections">
    <div class="stats-grid">
      <div class="stat-card">
        <p class="stat-title">{{ t('quality.fabric.stats.rolls') }}</p>
        <h3>{{ totalRolls }}</h3>
        <span>{{ t('quality.fabric.stats.registered') }}</span>
      </div>

      <div class="stat-card">
        <p class="stat-title">{{ t('quality.fabric.stats.available') }}</p>
        <h3>{{ availableRolls }}</h3>
        <span>{{ t('quality.fabric.stats.conformingRolls') }}</span>
      </div>

      <div class="stat-card">
        <p class="stat-title">{{ t('quality.fabric.stats.observed') }}</p>
        <h3>{{ observedRolls }}</h3>
        <span>{{ t('quality.fabric.stats.blockedRolls') }}</span>
      </div>

      <div class="stat-card">
        <p class="stat-title">{{ t('quality.fabric.stats.pendingTests') }}</p>
        <h3>{{ pendingTests }}</h3>
        <span>{{ t('quality.fabric.stats.requireReview') }}</span>
      </div>
    </div>

    <div class="filters-row">
      <div class="filter-field search-field">
        <div class="search-input-wrapper">
          <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
              v-model="searchRoll"
              type="text"
              :placeholder="t('quality.fabric.filters.searchRoll')"
          />
        </div>
      </div>

      <div class="filter-field">
        <select v-model="supplierFilter" :aria-label="t('quality.fabric.filters.supplier')">
          <option value="">{{ t('quality.fabric.filters.supplier') }}</option>
          <option v-for="supplier in suppliers" :key="supplier" :value="supplier">
            {{ supplier }}
          </option>
        </select>
      </div>

      <div class="filter-field">
        <select v-model="resultFilter" :aria-label="t('quality.fabric.filters.result')">
          <option value="">{{ t('quality.fabric.filters.result') }}</option>
          <option v-for="option in resultOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>

      <div class="filter-field">
        <input
            v-model="dateFilter"
            type="date"
            :aria-label="t('quality.fabric.filters.date')"
        />
      </div>

      <button class="new-inspection-btn" @click="goToNewInspection">
        {{ t('quality.fabric.newInspection') }}
      </button>
    </div>

    <div class="table-container">
      <table class="inspections-table">
        <thead>
        <tr>
          <th>{{ t('quality.fabric.columns.rollId') }}</th>
          <th>{{ t('quality.fabric.columns.supplier') }}</th>
          <th>{{ t('quality.fabric.columns.inspectionDate') }}</th>
          <th>{{ t('quality.fabric.columns.initialResult') }}</th>
          <th>{{ t('quality.fabric.columns.shrinkageTest') }}</th>
          <th>{{ t('quality.fabric.columns.rollStatus') }}</th>
          <th class="actions-header">{{ t('quality.fabric.columns.actions') }}</th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="inspection in filteredInspections" :key="inspection.id">
          <td class="roll-id">{{ inspection.rollId }}</td>
          <td class="supplier-col">{{ inspection.supplier }}</td>
          <td class="date-col">{{ inspection.inspectionDate }}</td>

          <td>
              <span
                  class="badge"
                  :class="inspection.initialResult === 'Conforming' ? 'badge-conforming' : 'badge-observed'"
              >
                {{ display(RESULT_STATUS_DISPLAY, inspection.initialResult) }}
              </span>
          </td>

          <td>
              <span
                  v-if="inspection.shrinkageTest && inspection.shrinkageTest !== '—'"
                  class="badge"
                  :class="{
                  'badge-conforming': inspection.shrinkageTest === 'Approved',
                  'badge-observed': inspection.shrinkageTest === 'Pending',
                  'badge-blocked': inspection.shrinkageTest === 'Non-Compliant'
                }"
              >
                {{ display(SHRINKAGE_STATUS_DISPLAY, inspection.shrinkageTest) }}
              </span>
            <span v-else class="text-muted">—</span>
          </td>

          <td>
              <span
                  class="badge"
                  :class="{
                  'badge-conforming': inspection.rollStatus === 'Available for Cutting',
                  'badge-blocked': inspection.rollStatus === 'Blocked',
                  'badge-neutral': inspection.rollStatus === 'Not Available'
                }"
              >
                {{ display(ROLL_STATUS_DISPLAY, inspection.rollStatus) }}
              </span>
          </td>

          <td class="actions-cell">
            <div class="dropdown-wrapper">
              <button
                  class="dots-btn"
                  :aria-label="t('quality.fabric.actions.label')"
                  @click.stop="toggleMenu(inspection.id)"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="5" r="2"></circle>
                  <circle cx="12" cy="12" r="2"></circle>
                  <circle cx="12" cy="19" r="2"></circle>
                </svg>
              </button>

              <div
                  v-if="openMenuId === inspection.id"
                  class="dropdown-menu"
                  @click.stop
              >
                <button @click="goToShrinkageTest(inspection.id)">
                  {{ t('quality.fabric.actions.shrinkageTest') }}
                </button>
                <button @click="goToInspectionParameters(inspection.id)">
                  {{ t('quality.fabric.actions.parameters') }}
                </button>
              </div>
            </div>
          </td>
        </tr>

        <tr v-if="filteredInspections.length === 0">
          <td colspan="7" class="empty-table">
            {{ t('quality.fabric.empty') }}
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <div class="table-legend">
      <p>{{ t('quality.fabric.legend.rowActions') }}</p>
      <p>{{ t('quality.fabric.legend.defectsHint') }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { FabricInspectionService } from '../../infrastructure/fabric-inspection.service.js'
import {
  RESULT_OPTIONS,
  RESULT_STATUS_DISPLAY,
  ROLL_STATUS_DISPLAY,
  SHRINKAGE_STATUS_DISPLAY
} from '../inspection-options.js'

const router = useRouter()
const { t } = useI18n()
const fabricInspections = ref([])
const searchRoll = ref('')
const supplierFilter = ref('')
const resultFilter = ref('')
const dateFilter = ref('')
const openMenuId = ref(null)

const resultOptions = computed(() => RESULT_OPTIONS.map(({ value, labelKey }) => ({ value, label: t(labelKey) })))

const display = (map, value) => map[value] ? t(map[value].labelKey) : value

const loadFabricInspections = async () => {
  try {
    const data = await FabricInspectionService.getAll()
    fabricInspections.value = data
  } catch (err) {
    console.error('Error fetching inspections:', err)
  }
}

const suppliers = computed(() => {
  return [...new Set(fabricInspections.value.map(i => i.supplier).filter(Boolean))]
})

const totalRolls = computed(() => fabricInspections.value.length)
const availableRolls = computed(() => fabricInspections.value.filter(i => i.rollStatus === 'Available for Cutting').length)
const observedRolls = computed(() => fabricInspections.value.filter(i => i.initialResult === 'Observed').length)
const pendingTests = computed(() => fabricInspections.value.filter(i => i.shrinkageTest === 'Pending').length)

const filteredInspections = computed(() => {
  return fabricInspections.value.filter(item => {
    const matchesRoll = !searchRoll.value || (item.rollId && item.rollId.toLowerCase().includes(searchRoll.value.toLowerCase()))
    const matchesSupplier = !supplierFilter.value || item.supplier === supplierFilter.value
    const matchesResult = !resultFilter.value || item.initialResult === resultFilter.value
    const matchesDate = !dateFilter.value || item.inspectionDate === dateFilter.value
    return matchesRoll && matchesSupplier && matchesResult && matchesDate
  })
})

const toggleMenu = (id) => {
  openMenuId.value = openMenuId.value === id ? null : id
}

const closeMenu = () => {
  openMenuId.value = null
}

const goToNewInspection = () => {
  router.push('/quality/inspections/new')
}

const goToShrinkageTest = (id) => {
  closeMenu()
  router.push(`/quality/inspections/${id}/shrinkage-test`)
}

const goToInspectionParameters = (id) => {
  closeMenu()
  router.push(`/quality/inspections/${id}/parameters`)
}

onMounted(() => {
  loadFabricInspections()
  window.addEventListener('click', closeMenu)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', closeMenu)
})
</script>

<style scoped>
.fabric-inspections {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  width: 100%;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  padding: 18px 20px;
  background: #ffffff;
  border: 1px solid #e8ecef;
  border-radius: 12px;
}

.stat-title {
  margin: 0 0 10px;
  font-size: 13px;
  font-weight: 500;
  color: #7a828a;
}

.stat-card h3 {
  margin: 0 0 4px;
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
}

.stat-card span {
  font-size: 12px;
  color: #8c959f;
}

.filters-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  width: 100%;
}

.search-field {
  flex: 1.4;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: #8c959f;
}

.search-input-wrapper input {
  padding-left: 36px;
}

.filter-field {
  flex: 1;
}

.filter-field input,
.filter-field select {
  width: 100%;
  height: 40px;
  padding: 0 14px;
  border: 1px solid #dfe3e6;
  border-radius: 8px;
  background: #ffffff;
  font-size: 13px;
  color: #444b54;
  outline: none;
}

.filter-field input:focus,
.filter-field select:focus {
  border-color: #4a5826;
}

.new-inspection-btn {
  height: 40px;
  padding: 0 20px;
  border: none;
  border-radius: 8px;
  background: #4a5826;
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.2s;
}

.new-inspection-btn:hover {
  background: #3b461e;
}

.table-container {
  width: 100%;
  border: 1px solid #e8ecef;
  border-radius: 12px;
  background: #ffffff;
  overflow: visible;
}

.inspections-table {
  width: 100%;
  border-collapse: collapse;
}

.inspections-table th {
  padding: 14px 18px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: #495057;
  border-bottom: 1px solid #e8ecef;
}

.inspections-table td {
  padding: 16px 18px;
  border-bottom: 1px solid #f0f2f5;
  font-size: 13px;
  color: #212529;
}

.roll-id {
  font-weight: 700;
  color: #111827;
}

.badge {
  display: inline-block;
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
}

.badge-conforming {
  background-color: #e5ecd3;
  color: #3b4c19;
}

.badge-observed {
  background-color: #f5ebd9;
  color: #7b5921;
}

.badge-blocked {
  background-color: #ede2d5;
  color: #6a533f;
}

.badge-neutral {
  background-color: #e7e5e4;
  color: #57534e;
}

.text-muted {
  color: #9ca3af;
}

.actions-header {
  text-align: right;
  padding-right: 24px;
}

.actions-cell {
  text-align: right;
  position: relative;
  padding-right: 24px;
}

.dropdown-wrapper {
  position: relative;
  display: inline-block;
}

.dots-btn {
  background: transparent;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dots-btn:hover {
  background: #f3f4f6;
  color: #111827;
}

.dropdown-menu {
  position: absolute;
  right: 0;
  top: 100%;
  margin-top: 4px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  min-width: 180px;
  z-index: 50;
  padding: 4px 0;
  text-align: left;
}

.dropdown-menu button {
  width: 100%;
  padding: 9px 14px;
  background: transparent;
  border: none;
  font-size: 12px;
  font-weight: 500;
  color: #374151;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.15s;
}

.dropdown-menu button:hover {
  background: #f9fafb;
  color: #4a5826;
}

.table-legend {
  margin-top: 16px;
  font-size: 11px;
  color: #8c959f;
  line-height: 1.5;
}

.table-legend p {
  margin: 2px 0;
}

.empty-table {
  text-align: center;
  padding: 36px !important;
  color: #8c959f;
}
</style>