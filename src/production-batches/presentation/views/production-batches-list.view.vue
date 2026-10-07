<template>
  <div class="page-container" @click="activeMenuId = null">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Production Batches</h1>
        <p class="page-subtitle">Manage and track your production batches.</p>
      </div>
      <button class="btn-olive" @click="$router.push('/production-batches/create')">
        + Create Batch
      </button>
    </div>

    <!-- Filters -->
    <div class="filters-grid">
      <div class="filter-field">
        <label>Search by Batch ID</label>
        <input type="text" v-model="filters.batchId" placeholder="e.g. LOT-024" class="custom-input" />
      </div>
      <div class="filter-field">
        <label>Status</label>
        <select v-model="filters.status" class="custom-select">
          <option value="">All statuses</option>
          <option value="In Production">In Production</option>
          <option value="At Risk">At Risk</option>
          <option value="Completed">Completed</option>
          <option value="Delayed">Delayed</option>
        </select>
      </div>
      <div class="filter-field">
        <label>Date</label>
        <select v-model="filters.date" class="custom-select">
          <option value="">All dates</option>
        </select>
      </div>
      <div class="filter-field">
        <label>Garment Model</label>
        <select v-model="filters.model" class="custom-select">
          <option value="">All models</option>
          <option value="T-Shirt Basic">T-Shirt Basic</option>
          <option value="Hoodie">Hoodie</option>
          <option value="Polo Shirt">Polo Shirt</option>
        </select>
      </div>
    </div>

    <!-- Table Container -->
    <div class="table-card">
      <table class="custom-table">
        <thead>
        <tr>
          <th>Batch ID</th>
          <th>Garment Model</th>
          <th>Projected Quantity</th>
          <th>Current Stage</th>
          <th>Progress</th>
          <th>Delivery Date</th>
          <th>Status</th>
          <th class="text-center">Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="batch in filteredBatches" :key="batch.id">
          <td class="font-bold text-dark">{{ batch.batchNumber }}</td>
          <td>{{ batch.garmentModel }}</td>
          <td>{{ Number(batch.projectedQuantity).toLocaleString() }}</td>
          <td>{{ batch.currentStage }}</td>
          <td>
            <div class="progress-container">
              <div class="progress-bar-bg">
                <div class="progress-bar-fill" :style="{ width: batch.progressPercentage + '%' }"></div>
              </div>
              <span class="progress-text">{{ batch.progressPercentage }}%</span>
            </div>
          </td>
          <td>{{ batch.deliveryDate }}</td>
          <td>
              <span :class="['status-badge', getStatusClass(batch.status)]">
                {{ batch.status }}
              </span>
          </td>
          <td class="text-center">
            <div class="menu-wrapper">
              <button class="btn-icon" @click.stop="toggleMenu(batch.id)">⋮</button>

              <!-- Floating Menu -->
              <div v-if="activeMenuId === batch.id" class="dropdown-menu" @click.stop>
                <div class="dropdown-item" @click="goToAction(batch.id, '')">
                  <span class="item-icon">🔍</span> Traceability
                </div>
                <div class="dropdown-item" @click="goToAction(batch.id, '/history')">
                  <span class="item-icon">📜</span> History
                </div>
                <div class="dropdown-item" @click="goToAction(batch.id, '/observations')">
                  <span class="item-icon">💬</span> Batch Observations
                </div>
              </div>
            </div>
          </td>
        </tr>
        </tbody>
      </table>

      <!-- Table Footer -->
      <div class="table-footer">
        <span class="footer-info">Showing {{ filteredBatches.length }} of {{ batches.length }} batches</span>
        <div class="pagination">
          <button class="page-btn nav-btn" disabled>&lt;</button>
          <button class="page-btn active">1</button>
          <button class="page-btn nav-btn">&gt;</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const filters = ref({ batchId: '', status: '', date: '', model: '' })
const batches = ref([])
const activeMenuId = ref(null)

const fetchBatches = async () => {
  try {
    const res = await fetch('http://localhost:3000/batches')
    batches.value = await res.json()
  } catch (err) {
    console.error('Error fetching batches:', err)
  }
}

onMounted(() => {
  fetchBatches()
})

const toggleMenu = (id) => {
  activeMenuId.value = activeMenuId.value === id ? null : id
}

const goToAction = (id, pathSuffix) => {
  activeMenuId.value = null
  router.push(`/production-batches/${id}${pathSuffix}`)
}

const filteredBatches = computed(() => {
  return batches.value.filter(b => {
    const matchId = !filters.value.batchId || b.batchNumber.toLowerCase().includes(filters.value.batchId.toLowerCase())
    const matchStatus = !filters.value.status || b.status === filters.value.status
    const matchModel = !filters.value.model || b.garmentModel === filters.value.model
    return matchId && matchStatus && matchModel
  })
})

const getStatusClass = (status) => {
  switch (status) {
    case 'In Production': return 'badge-in-production'
    case 'At Risk': return 'badge-at-risk'
    case 'Completed': return 'badge-completed'
    case 'Delayed': return 'badge-delayed'
    default: return ''
  }
}
</script>

<style scoped>
.page-container {
  padding: 32px 40px;
  background-color: #ffffff;
  min-height: 100vh;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: #111827;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 28px;
}

.page-title { font-size: 28px; font-weight: 700; margin: 0; color: #111827; }
.page-subtitle { font-size: 14px; color: #6B7280; margin: 4px 0 0 0; }

.btn-olive {
  background-color: #48532B;
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.filter-field label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 6px;
}

.custom-input, .custom-select {
  width: 100%;
  height: 42px;
  padding: 0 14px;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  font-size: 14px;
  color: #374151;
  background-color: #ffffff;
  outline: none;
  box-sizing: border-box;
}

.table-card {
  background: #F9FAFB;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  overflow: visible; /* Allows popover to overflow */
}

.custom-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 13px;
}

.custom-table th {
  background-color: #F3F4F6;
  padding: 14px 16px;
  font-weight: 700;
  color: #111827;
  border-bottom: 1px solid #E5E7EB;
}

.custom-table td {
  padding: 16px;
  background-color: #ffffff;
  border-bottom: 1px solid #F3F4F6;
  color: #4B5563;
  position: relative;
}

.font-bold { font-weight: 700; }
.text-dark { color: #111827; }
.text-center { text-align: center; }

.progress-container { display: flex; align-items: center; gap: 10px; }
.progress-bar-bg { flex: 1; height: 8px; background-color: #E5E7EB; border-radius: 999px; overflow: hidden; }
.progress-bar-fill { height: 100%; background-color: #48532B; border-radius: 999px; }
.progress-text { font-size: 12px; color: #6B7280; min-width: 32px; }

.status-badge { display: inline-block; padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 600; }
.badge-in-production { background-color: #ECEFE6; color: #48532B; }
.badge-at-risk { background-color: #F5F2E6; color: #7A6A24; }
.badge-completed { background-color: #E2EFE2; color: #2E6838; }
.badge-delayed { background-color: #F7E8E8; color: #B93838; }

.menu-wrapper { position: relative; display: inline-block; }
.btn-icon { background: none; border: none; font-size: 18px; color: #6B7280; cursor: pointer; padding: 4px 8px; }

/* Dropdown Menu Popup */
.dropdown-menu {
  position: absolute;
  right: 0;
  top: 100%;
  margin-top: 4px;
  background: #ffffff;
  border: 1px solid #E5E7EB;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  width: 180px;
  z-index: 50;
  overflow: hidden;
  text-align: left;
}

.dropdown-item {
  padding: 10px 14px;
  font-size: 13px;
  color: #374151;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.15s ease;
}

.dropdown-item:hover {
  background-color: #F3F4F6;
  color: #111827;
}

.item-icon { font-size: 14px; }

.table-footer { display: flex; justify-content: space-between; align-items: center; padding: 14px 20px; background-color: #ffffff; }
.footer-info { font-size: 13px; color: #6B7280; }
.pagination { display: flex; gap: 4px; }
.page-btn { width: 32px; height: 32px; border-radius: 6px; border: 1px solid transparent; background: transparent; font-size: 13px; font-weight: 600; color: #374151; cursor: pointer; }
.page-btn.active { background-color: #48532B; color: #ffffff; }
.page-btn.nav-btn { border-color: #E5E7EB; color: #9CA3AF; }
</style>