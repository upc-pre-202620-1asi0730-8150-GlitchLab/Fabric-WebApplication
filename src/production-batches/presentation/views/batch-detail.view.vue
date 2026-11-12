<template>
  <div class="page-container" v-if="batch">
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ t('productionBatches.views.batchDetailTitle') }}</h1>
        <p class="page-subtitle">{{ t('productionBatches.views.batchDetailSubtitle') }}</p>
      </div>
      <router-link to="/production-batches" class="back-link">&larr; {{ t('productionBatches.views.backToBatches') }}</router-link>
    </div>

    <batch-info-card :batch="batch" />

    <div class="batch-tabs" role="tablist">
      <button
        v-for="tab in tabs"
        :key="tab"
        type="button"
        role="tab"
        :class="['batch-tab', { 'batch-tab-active': activeTab === tab }]"
        @click="selectTab(tab)"
      >
        {{ t(`productionBatches.tabs.${tab}`) }}
      </button>
    </div>

    <div v-if="activeTab === 'summary'">
      <stage-progress-stepper :stages="stages" :current-stage="batch.currentStage" />
      <update-stage-form
        :stages="stages"
        :current-stage="batch.currentStage"
        @cancel="router.push('/production-batches')"
        @update-stage="saveStageUpdate"
      />
    </div>

    <batch-operator-assignment v-else-if="activeTab === 'operators'" embedded />
    <batch-observations v-else-if="activeTab === 'observations'" embedded />
    <traceability-history v-else-if="activeTab === 'traceability'" :key="traceabilityKey" embedded />
    <batch-defects-card v-else-if="activeTab === 'defects'" :batch-number="batch.batchNumber" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useProductionStore } from '../../application/store/production.js'
import BatchInfoCard from '../components/batch-info-card.component.vue'
import StageProgressStepper from '../components/stage-progress-stepper.component.vue'
import UpdateStageForm from '../components/update-stage-form.component.vue'
import BatchDefectsCard from '../components/batch-defects-card.component.vue'
import BatchOperatorAssignment from './batch-operator-assignment.view.vue'
import BatchObservations from './batch-observations.view.vue'
import TraceabilityHistory from './traceability-history.view.vue'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const productionStore = useProductionStore()
const batch = ref(null)
const traceabilityKey = ref(0)

const stages = ['Cutting', 'Sewing', 'Finishing', 'Quality Check', 'Completed']
const tabs = ['summary', 'operators', 'observations', 'traceability', 'defects']

const activeTab = computed(() => (tabs.includes(route.query.tab) ? route.query.tab : 'summary'))

const selectTab = (tab) => {
  router.replace({ query: tab === 'summary' ? {} : { tab } })
}

const fetchBatch = async () => {
  try {
    batch.value = await productionStore.loadBatch(route.params.id)
  } catch (err) {
    console.error('Error fetching batch:', err)
  }
}

onMounted(fetchBatch)

const saveStageUpdate = async (updateForm) => {
  if (!batch.value) return

  try {
    await productionStore.updateBatchStage(batch.value, updateForm, stages)
    await fetchBatch()
    traceabilityKey.value++
    selectTab('traceability')
  } catch (err) {
    console.error('Error updating stage:', err)
    alert(t('productionBatches.validation.updateFailure'))
  }
}
</script>

<style scoped>
.page-container { padding: 32px 40px; background: #ffffff; font-family: system-ui, sans-serif; }
.page-header { display: flex; justify-content: space-between; margin-bottom: 24px; }
.page-title { font-size: 28px; font-weight: 700; margin: 0; }
.page-subtitle { font-size: 14px; color: #6B7280; margin-top: 4px; }
.back-link { font-size: 14px; color: #6B7280; text-decoration: none; }
</style>