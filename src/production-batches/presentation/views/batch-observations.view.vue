<!--
  @summary Presentation view component for managing batch observations and timeline.
  @author Diego Sebastian Reategui Galarcep (u20201F165)
-->
<template>
  <div class="page-container" v-if="batch">
    <div class="page-header">
      <div>
        <h1 class="page-title">Batch Observations</h1>
        <p class="page-subtitle">Register and review notes associated with a production batch.</p>
      </div>
      <router-link to="/production-batches" class="back-link">&larr; Back to Production Batches</router-link>
    </div>

    <!-- Info Card (Mantenida localmente sin usar batch-info-card) -->
    <div class="info-card">
      <div class="info-grid">
        <div><span class="info-label">Batch ID</span><span class="info-value">{{ batch.batchNumber }}</span></div>
        <div><span class="info-label">Garment Model</span><span class="info-value">{{ batch.garmentModel }}</span></div>
        <div><span class="info-label">Current Stage</span><span class="info-value">{{ batch.currentStage }}</span></div>
      </div>
    </div>

    <!-- Observations Timeline Component -->
    <batch-observations-timeline
        :observations="observations"
        @save-observation="addObservation"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProductionStore } from '../../application/store/production.js'
import BatchObservationsTimeline from '../components/batch-observations-timeline.component.vue'

const route = useRoute()
const productionStore = useProductionStore()
const batch = ref(null)
const observations = ref([])

const fetchData = async () => {
  try {
    const [batchData, obsData] = await Promise.all([
      productionStore.loadBatch(route.params.id),
      productionStore.loadObservations(route.params.id)
    ])
    batch.value = batchData
    observations.value = obsData.slice().reverse()
  } catch (err) {
    console.error('Error fetching observations:', err)
  }
}

onMounted(fetchData)

const addObservation = async (text) => {
  if (!text.trim()) return

  const now = new Date()
  const timestamp = `${now.toLocaleDateString()} · ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`

  try {
    const savedObs = await productionStore.addObservation({
      batchId: route.params.id,
      timestamp,
      text: text.trim()
    })
    observations.value.unshift(savedObs)
  } catch (err) {
    console.error('Error adding observation:', err)
  }
}
</script>

<style scoped>
.page-container { padding: 32px 40px; background: #ffffff; font-family: system-ui, sans-serif; }
.page-header { display: flex; justify-content: space-between; margin-bottom: 24px; }
.page-title { font-size: 28px; font-weight: 700; margin: 0; }
.page-subtitle { font-size: 14px; color: #6B7280; margin-top: 4px; }
.back-link { font-size: 14px; color: #6B7280; text-decoration: none; }

.info-card { border: 1px solid #E5E7EB; border-radius: 12px; padding: 20px 24px; margin-bottom: 20px; }
.info-grid { display: flex; gap: 60px; }
.info-label { display: block; font-size: 12px; color: #6B7280; margin-bottom: 4px; }
.info-value { font-size: 15px; font-weight: 700; color: #111827; }
</style>