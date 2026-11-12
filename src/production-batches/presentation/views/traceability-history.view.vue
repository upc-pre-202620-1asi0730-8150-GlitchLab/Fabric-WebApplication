<template>
  <div :class="embedded ? 'batch-tab-content' : 'page-container'" v-if="batch">
    <div v-if="!embedded" class="page-header">
      <div>
        <h1 class="page-title">{{ t('productionBatches.views.traceabilityTitle') }}</h1>
        <p class="page-subtitle">{{ t('productionBatches.views.traceabilitySubtitle') }}</p>
      </div>
      <router-link :to="`/production-batches/${batch.id}`" class="back-link">&larr; {{ t('productionBatches.views.backToBatchDetail') }}</router-link>
    </div>

    <div v-if="!embedded" class="info-card">
      <div class="info-grid">
        <div><span class="info-label">{{ t('productionBatches.batchInfo.batchId') }}</span><span class="info-value">{{ batch.batchNumber }}</span></div>
        <div><span class="info-label">{{ t('productionBatches.batchInfo.garmentModel') }}</span><span class="info-value">{{ translateModel(batch.garmentModel) }}</span></div>
        <div><span class="info-label">{{ t('productionBatches.table.projectedQuantity') }}</span><span class="info-value">{{ batch.projectedQuantity }} {{ t('productionBatches.batchInfo.pieces') }}</span></div>
        <div><span class="info-label">{{ t('productionBatches.batchInfo.currentStage') }}</span><span class="info-value">{{ translateStage(batch.currentStage) }}</span></div>
        <div><span class="badge-in-production">{{ translateStatus(batch.status) }}</span></div>
      </div>
    </div>

    <movement-history-table :movements="history" />

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
import { useI18n } from 'vue-i18n'
import { useProductionStore } from '../../application/store/production.js'
import MovementHistoryTable from '../components/movement-history-table.component.vue'
import TraceabilitySummaryCard from '../components/traceability-summary-card.component.vue'

defineProps({ embedded: { type: Boolean, default: false } })
const route = useRoute()
const { t } = useI18n()
const productionStore = useProductionStore()
const batch = ref(null)
const history = ref([])

const translateModel = (model) => {
  const keys = {
    'T-Shirt Basic': 'tshirtBasic',
    Hoodie: 'hoodie',
    'Polo Shirt': 'poloShirt',
    'Jogger Pants': 'joggerPants',
    Crewneck: 'crewneck',
    'Tank Top': 'tankTop',
    Leggings: 'leggings'
  }
  return keys[model] ? t(`productionBatches.models.${keys[model]}`) : model
}

const translateStage = (stage) => {
  const keys = {
    Cutting: 'cutting',
    Sewing: 'sewing',
    Finishing: 'finishing',
    'Quality Check': 'qualityCheck',
    Completed: 'completed'
  }
  return keys[stage] ? t(`productionBatches.stages.${keys[stage]}`) : stage
}

const translateStatus = (status) => {
  const keys = {
    'In Production': 'inProduction',
    'At Risk': 'atRisk',
    Completed: 'completed',
    Delayed: 'delayed'
  }
  return keys[status] ? t(`productionBatches.statuses.${keys[status]}`) : status
}

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