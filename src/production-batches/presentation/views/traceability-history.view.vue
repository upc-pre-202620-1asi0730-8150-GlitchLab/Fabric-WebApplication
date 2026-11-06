<!--
  @summary Presentation view component displaying movement traceability history and wastage differences.
  @author Diego Sebastian Reategui Galarcep (u20201F165)
-->
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

    <!-- Movement History Table Component -->
    <movement-history-table :movements="history" />

    <!-- Traceability Summary Card Component -->
    <traceability-summary-card
        :projected-quantity="batch.projectedQuantity"
        :current-qty="currentQty"
        :total-difference="totalDifference"
        :current-stage="batch.currentStage"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProductionStore } from '../../application/store/production.js'
import MovementHistoryTable from '../components/movement-history-table.component.vue'
import TraceabilitySummaryCard from '../components/traceability-summary-card.component.vue'

const route = useRoute()
const productionStore = useProductionStore()
const batch = ref(null)
const history = ref([])

const fetchData = async () => {
  try {
    const [batchData, movements] = await Promise.all([
      productionStore.loadBatch(route.params.id),
      productionStore.loadBatchMovements(route.params.id)
    ])
    batch.value = batchData
    history.value = movements
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
</style>