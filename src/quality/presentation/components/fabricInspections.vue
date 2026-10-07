<template>
  <div class="fabric-inspections">

    <h2>Fabric Inspections</h2>

    <!-- KPI CARDS -->
    <div class="stats-grid">
      <div class="stat-card">
        <p class="stat-title">Fabric Rolls</p>
        <h3>{{ totalRolls }}</h3>
        <span>registered</span>
      </div>

      <div class="stat-card">
        <p class="stat-title">Available for Cutting</p>
        <h3>{{ availableRolls }}</h3>
        <span>conforming rolls</span>
      </div>

      <div class="stat-card">
        <p class="stat-title">Observed</p>
        <h3>{{ observedRolls }}</h3>
        <span>blocked rolls</span>
      </div>

      <div class="stat-card">
        <p class="stat-title">Pending Tests</p>
        <h3>{{ pendingTests }}</h3>
        <span>require review</span>
      </div>
    </div>

    <!-- FILTERS -->
    <div class="filters-row">
      <div class="filter-field">
        <label>Search Roll ID</label>
        <input
            v-model="searchRoll"
            type="text"
            placeholder="ROLL-001"
        />
      </div>

      <div class="filter-field">
        <label>Supplier</label>
        <select v-model="supplierFilter">
          <option value="">All suppliers</option>

          <option
              v-for="supplier in suppliers"
              :key="supplier"
              :value="supplier"
          >
            {{ supplier }}
          </option>
        </select>
      </div>

      <div class="filter-field">
        <label>Result</label>
        <select v-model="resultFilter">
          <option value="">All results</option>
          <option value="Conforming">Conforming</option>
          <option value="Observed">Observed</option>
        </select>
      </div>

      <div class="filter-field">
        <label>Date</label>
        <input
            v-model="dateFilter"
            type="date"
        />
      </div>

      <button class="new-inspection-btn">
        + New Inspection
      </button>
    </div>

    <!-- TABLE -->
    <div class="table-container">
      <table class="inspections-table">

        <thead>
        <tr>
          <th>Roll ID</th>
          <th>Supplier</th>
          <th>Inspection Date</th>
          <th>Initial Result</th>
          <th>Shrinkage Test</th>
          <th>Roll Status</th>
          <th>Actions</th>
        </tr>
        </thead>

        <tbody>
        <tr
            v-for="inspection in filteredInspections"
            :key="inspection.id"
        >
          <td class="roll-id">
            {{ inspection.rollId }}
          </td>

          <td>
            {{ inspection.supplier }}
          </td>

          <td>
            {{ inspection.inspectionDate }}
          </td>

          <td>
              <span
                  class="badge"
                  :class="
                  inspection.initialResult === 'Conforming'
                    ? 'badge-success'
                    : 'badge-warning'
                "
              >
                {{ inspection.initialResult }}
              </span>
          </td>

          <td>
              <span
                  v-if="inspection.shrinkageTest"
                  class="badge"
                  :class="{
                  'badge-success':
                    inspection.shrinkageTest === 'Approved',

                  'badge-warning':
                    inspection.shrinkageTest === 'Pending',

                  'badge-danger':
                    inspection.shrinkageTest === 'Non-Compliant'
                }"
              >
                {{ inspection.shrinkageTest }}
              </span>

            <span v-else>
                —
              </span>
          </td>

          <td>
              <span
                  class="badge"
                  :class="{
                  'badge-success':
                    inspection.rollStatus === 'Available for Cutting',

                  'badge-warning':
                    inspection.rollStatus === 'Blocked',

                  'badge-danger':
                    inspection.rollStatus === 'Not Available'
                }"
              >
                {{ inspection.rollStatus }}
              </span>
          </td>

          <td>
            <button class="action-btn">
              View
            </button>
          </td>
        </tr>

        <tr v-if="filteredInspections.length === 0">
          <td
              colspan="7"
              class="empty-table"
          >
            No fabric inspections found.
          </td>
        </tr>
        </tbody>

      </table>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { FabricInspectionService } from '../../infrastructure/fabric-inspection.service.js'

const fabricInspections = ref([])

const searchRoll = ref('')
const supplierFilter = ref('')
const resultFilter = ref('')
const dateFilter = ref('')


// GET FABRIC INSPECTIONS
const loadFabricInspections = async () => {
  const data = await FabricInspectionService.getAll()

  fabricInspections.value = data

  console.log('FABRIC INSPECTIONS:', data)
}


// SUPPLIERS
const suppliers = computed(() => {
  return [
    ...new Set(
        fabricInspections.value.map(
            inspection => inspection.supplier
        )
    )
  ]
})


// KPI
const totalRolls = computed(() => {
  return fabricInspections.value.length
})

const availableRolls = computed(() => {
  return fabricInspections.value.filter(
      inspection =>
          inspection.rollStatus === 'Available for Cutting'
  ).length
})

const observedRolls = computed(() => {
  return fabricInspections.value.filter(
      inspection =>
          inspection.initialResult === 'Observed'
  ).length
})

const pendingTests = computed(() => {
  return fabricInspections.value.filter(
      inspection =>
          inspection.shrinkageTest === 'Pending'
  ).length
})


// FILTERS
const filteredInspections = computed(() => {

  return fabricInspections.value.filter(inspection => {

    const matchesRoll =
        inspection.rollId
            .toLowerCase()
            .includes(
                searchRoll.value.toLowerCase()
            )

    const matchesSupplier =
        !supplierFilter.value ||
        inspection.supplier === supplierFilter.value

    const matchesResult =
        !resultFilter.value ||
        inspection.initialResult === resultFilter.value

    const matchesDate =
        !dateFilter.value ||
        inspection.inspectionDate === dateFilter.value

    return (
        matchesRoll &&
        matchesSupplier &&
        matchesResult &&
        matchesDate
    )
  })
})


onMounted(() => {
  loadFabricInspections()
})
</script>

<style scoped>
.fabric-inspections {
  width: 100%;
}

.fabric-inspections h2 {
  margin: 28px 0 20px;
  font-size: 28px;
  font-weight: 700;
  color: #171717;
}


/* KPI */

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
  width: 100%;
}

.stat-card {
  padding: 20px 22px;
  background: #ffffff;
  border: 1px solid #e3e7ea;
  border-radius: 10px;
}

.stat-title {
  margin: 0 0 12px;
  font-size: 15px;
  font-weight: 600;
  color: #55621f;
}

.stat-card h3 {
  margin: 0 0 4px;
  font-size: 30px;
  font-weight: 700;
  color: #171717;
}

.stat-card span {
  font-size: 14px;
  color: #73808c;
}


/* FILTERS */

.filters-row {
  display: flex;
  align-items: flex-end;
  gap: 14px;
  margin-top: 26px;
  width: 100%;
}

.filter-field {
  display: flex;
  flex-direction: column;
  gap: 7px;
  flex: 1;
}

.filter-field label {
  font-size: 14px;
  font-weight: 600;
  color: #171717;
}

.filter-field input,
.filter-field select {
  width: 100%;
  height: 42px;
  padding: 0 12px;
  border: 1px solid #dfe3e6;
  border-radius: 7px;
  background: #ffffff;
  font-size: 14px;
  color: #171717;
  box-sizing: border-box;
}

.filter-field input:focus,
.filter-field select:focus {
  outline: none;
  border-color: #55621f;
}

.new-inspection-btn {
  height: 42px;
  padding: 0 20px;
  border: none;
  border-radius: 7px;
  background: #55621f;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
}

.new-inspection-btn:hover {
  opacity: 0.9;
}


/* TABLE */

.table-container {
  width: 100%;
  margin-top: 22px;
  overflow-x: auto;
  border: 1px solid #e3e7ea;
  border-radius: 9px;
  background: #ffffff;
}

.inspections-table {
  width: 100%;
  border-collapse: collapse;
}

.inspections-table th {
  padding: 14px 16px;
  background: #f3f7fa;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  color: #55616c;
  white-space: nowrap;
}

.inspections-table td {
  padding: 15px 16px;
  border-top: 1px solid #e8ecef;
  font-size: 14px;
  color: #171717;
}

.roll-id {
  font-weight: 600;
}


/* STATUS */

.badge {
  display: inline-block;
  padding: 5px 9px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.badge-success {
  background: #eef3df;
  color: #55621f;
}

.badge-warning {
  background: #fff4d6;
  color: #8a6415;
}

.badge-danger {
  background: #fbe7e7;
  color: #a33a3a;
}


/* ACTIONS */

.action-btn {
  border: none;
  background: transparent;
  color: #55621f;
  font-weight: 600;
  cursor: pointer;
}

.action-btn:hover {
  text-decoration: underline;
}

.empty-table {
  text-align: center;
  color: #73808c !important;
  padding: 30px !important;
}


/* RESPONSIVE */

@media (max-width: 900px) {

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .filters-row {
    flex-wrap: wrap;
  }

  .filter-field {
    min-width: 180px;
  }
}
</style>