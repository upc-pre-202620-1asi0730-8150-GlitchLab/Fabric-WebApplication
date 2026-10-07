<template>
  <div class="page-container" v-if="batch">
    <div class="page-header">
      <div>
        <h1 class="page-title">Traceability History</h1>
        <p class="page-subtitle">View the complete movement history of the selected production batch.</p>
      </div>
      <router-link :to="`/production-batches/${batch.id}`" class="back-link">&larr; Back to Batch Detail</router-link>
    </div>

    <!-- Info Card -->
    <div class="info-card">
      <div class="info-grid">
        <div><span class="info-label">Batch ID</span><span class="info-value">{{ batch.batchNumber }}</span></div>
        <div><span class="info-label">Garment Model</span><span class="info-value">{{ batch.garmentModel }}</span></div>
        <div><span class="info-label">Projected Quantity</span><span class="info-value">{{ batch.projectedQuantity }} pieces</span></div>
        <div><span class="info-label">Current Stage</span><span class="info-value">{{ batch.currentStage }}</span></div>
        <div><span class="badge-in-production">{{ batch.status }}</span></div>
      </div>
    </div>

    <!-- History Table -->
    <div class="card">
      <h3 class="card-title">Movement History</h3>
      <p class="card-subtitle">Chronological record of batch movements, quantities and responsible operators.</p>

      <table class="custom-table">
        <thead>
        <tr>
          <th>STAGE</th>
          <th>DATE & TIME</th>
          <th>QTY IN</th>
          <th>QTY OUT</th>
          <th>DIFFERENCE</th>
          <th>RESPONSIBLE</th>
          <th>STATUS</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in history" :key="item.id">
          <td>{{ item.stage }}</td>
          <td>{{ item.dateTime }}</td>
          <td>{{ item.qtyIn }}</td>
          <td>{{ item.qtyOut }}</td>
          <td>
            <span v-if="item.difference < 0" class="diff-badge">{{ item.difference }}</span>
            <span v-else>{{ item.difference }}</span>
          </td>
          <td>{{ item.responsible }}</td>
          <td>{{ item.status }}</td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Alert Banner (if difference) -->
    <div v-if="totalDifference < 0" class="alert-card">
      <h4 class="alert-title">Quantity difference detected</h4>
      <p class="alert-sub">A total difference of {{ totalDifference }} pieces was recorded across stages.</p>
    </div>

    <!-- Summary Card -->
    <div class="card">
      <h3 class="card-title">Traceability Summary</h3>
      <div class="summary-grid">
        <div>Projected: <strong class="text-dark">{{ batch.projectedQuantity }} pieces</strong></div>
        <div>Current: <strong class="text-dark">{{ currentQty }} pieces</strong></div>
        <div class="text-red font-bold">Total Difference: {{ totalDifference }} pieces</div>
        <div>Current Stage: <strong class="text-dark">{{ batch.currentStage }}</strong></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const batch = ref(null)
const history = ref([])

const fetchData = async () => {
  try {
    const batchRes = await fetch(`http://localhost:3000/batches/${route.params.id}`)
    batch.value = await batchRes.json()

    const histRes = await fetch(`http://localhost:3000/traceabilityHistory?batchId=${route.params.id}`)
    history.value = await histRes.json()
  } catch (err) {
    console.error('Error fetching traceability history:', err)
  }
}

onMounted(fetchData)

const totalDifference = computed(() => {
  return history.value.reduce((acc, curr) => acc + curr.difference, 0)
})

const currentQty = computed(() => {
  if (history.value.length === 0) return batch.value?.projectedQuantity || 0
  return history.value[history.value.length - 1].qtyOut
})
</script>

<style scoped>
.page-container { padding: 32px 40px; background: #ffffff; font-family: system-ui, sans-serif; }
.page-header { display: flex; justify-content: space-between; margin-bottom: 24px; }
.page-title { font-size: 28px; font-weight: 700; margin: 0; }
.page-subtitle { font-size: 14px; color: #6B7280; margin-top: 4px; }
.back-link { font-size: 14px; color: #6B7280; text-decoration: none; }

.info-card { border: 1px solid #E5E7EB; border-radius: 12px; padding: 20px 24px; margin-bottom: 20px; }
.info-grid { display: flex; gap: 40px; align-items: center; }
.info-label { display: block; font-size: 12px; color: #6B7280; margin-bottom: 4px; }
.info-value { font-size: 15px; font-weight: 700; color: #111827; }
.badge-in-production { background: #ECEFE6; color: #48532B; padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 600; }

.card { border: 1px solid #E5E7EB; border-radius: 12px; padding: 24px; margin-bottom: 20px; }
.card-title { font-size: 16px; font-weight: 700; margin: 0; }
.card-subtitle { font-size: 13px; color: #6B7280; margin: 4px 0 20px 0; }

.custom-table { width: 100%; border-collapse: collapse; font-size: 13px; text-align: left; }
.custom-table th { padding: 12px; color: #374151; font-weight: 700; border-bottom: 1px solid #E5E7EB; background: #F9FAFB; }
.custom-table td { padding: 14px 12px; border-bottom: 1px solid #F3F4F6; color: #4B5563; }

.diff-badge { background: #FCE8E8; color: #B93838; font-weight: 700; padding: 2px 8px; border-radius: 4px; font-size: 12px; }

.alert-card { background: #FDF2F2; border: 1px solid #F87171; border-radius: 12px; padding: 16px 20px; margin-bottom: 20px; }
.alert-title { font-size: 14px; font-weight: 700; color: #991B1B; margin: 0 0 4px 0; }
.alert-sub { font-size: 13px; color: #B93838; margin: 0; }

.summary-grid { display: flex; justify-content: space-between; font-size: 13px; color: #6B7280; }
.text-dark { color: #111827; }
.text-red { color: #B93838; }
.font-bold { font-weight: 700; }
</style>