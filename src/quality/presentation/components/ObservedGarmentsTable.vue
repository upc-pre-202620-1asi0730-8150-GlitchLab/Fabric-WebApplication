<template>
  <div class="observed-table-card">
    <div class="table-header">
      <h3 class="card-title">Observed Garments</h3>
      <p class="card-subtitle">Review pending defects and define their final disposition.</p>
    </div>

    <div class="table-container">
      <table class="table">
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
            :class="{ 'row-selected': selectedDefect?.id === item.id }"
            @click="$emit('select-defect', item)"
        >
          <td class="font-mono font-bold">{{ item.id }}</td>
          <td class="font-mono">{{ item.batchId.split(' ')[0] }}</td>
          <td>{{ item.defectType }}</td>
          <td class="text-center font-mono">{{ item.quantity }}</td>
          <td class="text-center">
              <span class="badge" :class="getBadgeClass(item.status)">
                {{ item.status }}
              </span>
          </td>
          <td class="text-right">
            <button class="btn-icon" @click.stop="$emit('open-menu', item)">
              &vellip;
            </button>
          </td>
        </tr>
        <tr v-if="defects.length === 0">
          <td colspan="6" class="text-center py-4 text-muted">No defects recorded yet.</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
defineProps({
  defects: {
    type: Array,
    required: true
  },
  selectedDefect: {
    type: Object,
    default: null
  }
});

defineEmits(['select-defect', 'open-menu']);

const getBadgeClass = (status) => {
  switch (status) {
    case 'Pending Decision':
      return 'badge-pending';
    case 'In Evaluation':
      return 'badge-evaluation';
    case 'Send to Rework':
      return 'badge-rework';
    case 'Permanent Discard':
      return 'badge-discard';
    default:
      return 'badge-default';
  }
};
</script>

<style scoped>
.observed-table-card {
  margin-bottom: 24px;
}
.card-title {
  font-family: 'Poppins', sans-serif;
  font-size: 1.15rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 4px 0;
}
.card-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 0.825rem;
  color: #8892a0;
  margin: 0 0 16px 0;
}
.table-container {
  overflow-x: auto;
}
.table {
  width: 100%;
  border-collapse: collapse;
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
}
.table th {
  text-align: left;
  padding: 8px 12px;
  color: #8892a0;
  font-size: 0.725rem;
  font-weight: 600;
  border-bottom: 1px solid #eaeaea;
}
.table td {
  padding: 14px 12px;
  border-bottom: 1px solid #f5f7fa;
  color: #1a1a1a;
}
.row-selected {
  background-color: #f7f9f2;
}
.table tbody tr {
  cursor: pointer;
  transition: background-color 0.15s;
}
.table tbody tr:hover {
  background-color: #f5f7fa;
}
.badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
}
.badge-pending {
  background-color: #edf2d8;
  color: #485320;
}
.badge-evaluation {
  background-color: #fef3c7;
  color: #92400e;
}
.badge-rework {
  background-color: #e0e7ff;
  color: #3730a3;
}
.badge-discard {
  background-color: #fee2e2;
  color: #991b1b;
}
.btn-icon {
  background: transparent;
  border: none;
  font-size: 1.25rem;
  color: #8892a0;
  cursor: pointer;
  padding: 0 4px;
}
.font-mono {
  font-family: 'JetBrains Mono', monospace;
}
.font-bold {
  font-weight: 600;
}
.text-center { text-align: center; }
.text-right { text-align: right; }
.text-muted { color: #8892a0; }
</style>