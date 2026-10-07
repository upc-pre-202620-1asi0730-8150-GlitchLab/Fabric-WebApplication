<script setup>
import { computed, onMounted, ref } from 'vue'
import { useProductionStore } from '../../../stores/production.js'
import BatchFilters from '../components/batch-filters.component.vue'
import BatchListTable from '../components/batch-list-table.component.vue'

const productionStore = useProductionStore()
const filters = ref({ batchId: '', status: null, date: null, garmentModel: null })

onMounted(() => {
  productionStore.fetchBatches()
})

const onFilterChange = (newFilters) => {
  filters.value = newFilters
}

const sameDay = (a, b) => a.toDateString() === b.toDateString()
const startOfWeek = (d) => {
  const copy = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  copy.setDate(copy.getDate() - ((copy.getDay() + 6) % 7))
  return copy
}

// "Date" filter is applied to the delivery date of each batch
const matchesDate = (batch, period) => {
  if (!period) return true
  if (!batch.deliveryDate) return false
  const delivery = new Date(`${batch.deliveryDate}T00:00:00`)
  const now = new Date()
  if (period === 'today') return sameDay(delivery, now)
  if (period === 'week') return sameDay(startOfWeek(delivery), startOfWeek(now))
  if (period === 'month') return delivery.getMonth() === now.getMonth() && delivery.getFullYear() === now.getFullYear()
  return true
}

const filteredBatches = computed(() => {
  const term = (filters.value.batchId || '').trim().toLowerCase()
  return productionStore.batches.filter(batch =>
      (!term || String(batch.batchNumber || '').toLowerCase().includes(term)) &&
      (!filters.value.status || batch.status === filters.value.status) &&
      (!filters.value.garmentModel || batch.garmentModel === filters.value.garmentModel) &&
      matchesDate(batch, filters.value.date)
  )
})
</script>

<template>
  <div class="page-container">
    <div class="page-header">
      <div>
        <h1 class="page-title">Production Batches</h1>
        <p class="page-subtitle">Track every batch, its stage and delivery status.</p>
      </div>
      <router-link to="/production-batches/create" class="create-link">+ Create Batch</router-link>
    </div>

    <BatchFilters @filter-change="onFilterChange" />

    <div v-if="productionStore.loading" class="state-text">Loading production batches...</div>
    <div v-else-if="productionStore.error" class="state-text state-error">{{ productionStore.error }}</div>
    <BatchListTable v-else :batches="filteredBatches" :total-batches="filteredBatches.length" />
  </div>
</template>

<style scoped>
.page-container { padding: 32px 40px; font-family: system-ui, -apple-system, sans-serif; }
.page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
.page-title { font-size: 28px; font-weight: 700; margin: 0; color: #111827; }
.page-subtitle { font-size: 14px; color: #6B7280; margin-top: 4px; }
.create-link { background: #48532B; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; font-size: 14px; }
.state-text { color: #6B7280; padding: 16px 0; }
.state-error { color: #B91C1C; }
</style>
