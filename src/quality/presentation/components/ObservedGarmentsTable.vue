<template>
  <div class="observed-table-wrapper">
    <div class="card-header">
      <div>
        <h2 class="title">Observed Garments</h2>
        <p class="subtitle">Review pending defects and define their final disposition.</p>
      </div>

      <div class="grouping-control">
        <label>Group by:</label>
        <select v-model="groupBy" class="group-select">
          <option value="none">None (Individual)</option>
          <option value="type">Defect Type</option>
          <option value="machine">Machine</option>
          <option value="batch">Batch</option>
        </select>
      </div>
    </div>

    <div v-if="groupBy !== 'none'" class="recurrence-box">
      <div class="summary-card" v-for="group in groupedSummary" :key="group.name">
        <span class="group-title font-mono">{{ group.name }}</span>
        <div class="group-meta">
          <span>Incidences: <strong>{{ group.count }}</strong></span>
          <span>Total Qty: <strong>{{ group.totalQuantity }}</strong></span>
        </div>
      </div>
    </div>

    <div class="table-container">
      <table class="data-table">
        <thead>
        <tr>
          <th>DEFECT</th>
          <th>BATCH</th>
          <th>DEFECT TYPE</th>
          <th class="text-center">QTY</th>
          <th class="text-center">STATUS</th>
          <th class="text-right">ACTIONS</th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="item in defects"
            :key="item.id"
            :class="{ selected: selectedDefect?.id === item.id }"
            @click="handleRowSelect(item)"
        >
          <td class="font-mono font-bold">{{ item.id }}</td>
          <td class="font-mono">{{ item.batchId }}</td>
          <td>
            {{ item.defectType }}
            <span v-if="item.evidences && item.evidences.length > 0" class="evidence-tag">
                📷 {{ item.evidences.length }}
              </span>
          </td>
          <td class="text-center font-mono">{{ item.quantity }}</td>
          <td class="text-center">
              <span class="badge" :class="getBadgeClass(item.status)">
                {{ item.status }}
              </span>
          </td>
          <td class="text-right action-cell">
            <button
                type="button"
                class="btn-more"
                @click.stop="toggleMenu(item.id)"
            >
              ⋮
            </button>

            <div v-if="openMenuId === item.id" class="dropdown-menu">
              <button type="button" class="menu-btn" @click.stop="openEvidence(item)">
                <span>📷</span> Add Evidence
              </button>
              <button type="button" class="menu-btn" @click.stop="openDisposition(item)">
                <span>⚖️</span> Disposition
              </button>
            </div>
          </td>
        </tr>
        <tr v-if="defects.length === 0">
          <td colspan="6" class="text-center py-4 text-muted">No observed garments recorded.</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  defects: {
    type: Array,
    required: true
  },
  selectedDefect: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['select-defect', 'navigate-to-evidence'])

const groupBy = ref('none')
const openMenuId = ref(null)

const toggleMenu = (id) => {
  openMenuId.value = openMenuId.value === id ? null : id
}

const closeMenu = () => {
  openMenuId.value = null
}

onMounted(() => window.addEventListener('click', closeMenu))
onUnmounted(() => window.removeEventListener('click', closeMenu))

const handleRowSelect = (item) => {
  emit('select-defect', item)
}

const openDisposition = (item) => {
  emit('select-defect', item)
  openMenuId.value = null
}

const openEvidence = (item) => {
  openMenuId.value = null
  emit('navigate-to-evidence', item)
}

const groupedSummary = computed(() => {
  if (groupBy.value === 'none') return []
  const groups = {}
  props.defects.forEach(d => {
    let key = d.defectType
    if (groupBy.value === 'machine') key = d.machineId
    if (groupBy.value === 'batch') key = d.batchId

    if (!groups[key]) {
      groups[key] = { name: key, count: 0, totalQuantity: 0 }
    }
    groups[key].count += 1
    groups[key].totalQuantity += Number(d.quantity)
  })
  return Object.values(groups)
})

const getBadgeClass = (status) => {
  switch (status) {
    case 'Pending Decision': return 'badge-pending'
    case 'In Evaluation': return 'badge-eval'
    case 'Send to Rework': return 'badge-rework'
    case 'Permanent Discard': return 'badge-discard'
    default: return 'badge-default'
  }
}
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 14px;
}
.title {
  font-family: 'Poppins', sans-serif;
  font-size: 1.15rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 4px 0;
}
.subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  color: #8892a0;
  margin: 0;
}
.grouping-control {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 0.775rem;
  color: #8892a0;
}
.group-select {
  padding: 4px 8px;
  border: 1px solid #eaeaea;
  border-radius: 6px;
  font-size: 0.8rem;
  outline: none;
}
.recurrence-box {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 16px;
  background: #fbfdf9;
  padding: 12px;
  border-radius: 8px;
  border: 1px dashed #c9a87c;
}
.summary-card {
  background: #ffffff;
  border: 1px solid #eaeaea;
  border-radius: 6px;
  padding: 6px 12px;
}
.group-title {
  font-size: 0.8rem;
  font-weight: 600;
  color: #485320;
}
.group-meta {
  font-size: 0.75rem;
  color: #64748b;
  display: flex;
  gap: 8px;
  margin-top: 2px;
}
.table-container {
  overflow-x: visible;
}
.data-table {
  width: 100%;
  border-collapse: collapse;
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
}
.data-table th {
  text-align: left;
  padding: 10px 12px;
  color: #8892a0;
  font-size: 0.725rem;
  font-weight: 600;
  border-bottom: 1px solid #eaeaea;
}
.data-table td {
  padding: 14px 12px;
  border-bottom: 1px solid #f5f7fa;
  color: #1a1a1a;
}
.data-table tbody tr {
  cursor: pointer;
  transition: background-color 0.15s;
}
.data-table tbody tr:hover {
  background-color: #fafbf8;
}
.data-table tbody tr.selected {
  background-color: #f6f8ef;
}
.evidence-tag {
  display: inline-block;
  margin-left: 6px;
  font-size: 0.7rem;
  background-color: #f5f7fa;
  padding: 2px 6px;
  border-radius: 10px;
  color: #485320;
}
.badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
}
.badge-pending { background-color: #edf2d8; color: #485320; }
.badge-eval { background-color: #fef3c7; color: #92400e; }
.badge-rework { background-color: #e0e7ff; color: #3730a3; }
.badge-discard { background-color: #fee2e2; color: #991b1b; }

.action-cell {
  position: relative;
}
.btn-more {
  background: transparent;
  border: none;
  font-size: 1.3rem;
  color: #8892a0;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
}
.btn-more:hover {
  background-color: #f5f7fa;
  color: #1a1a1a;
}
.dropdown-menu {
  position: absolute;
  right: 0;
  top: 38px;
  background: #ffffff;
  border: 1px solid #eaeaea;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  z-index: 100;
  min-width: 160px;
  padding: 6px 0;
  display: flex;
  flex-direction: column;
}
.menu-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  font-size: 0.8rem;
  color: #1a1a1a;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
}
.menu-btn:hover {
  background-color: #f5f7fa;
  color: #485320;
}
.font-mono { font-family: 'JetBrains Mono', monospace; }
.font-bold { font-weight: 600; }
.text-center { text-align: center; }
.text-right { text-align: right; }
.text-muted { color: #8892a0; }
.py-4 { padding-top: 1rem; padding-bottom: 1rem; }
</style>