<template>
  <div class="page-container" v-if="batch">
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ t('productionBatches.views.operatorAssignmentTitle') }}</h1>
        <p class="page-subtitle">{{ t('productionBatches.views.operatorAssignmentSubtitle') }}</p>
      </div>
      <router-link to="/production-batches" class="back-link mb-20">&larr; {{ t('productionBatches.views.backToBatches') }}</router-link>
    </div>

    <div class="info-card">
      <div class="info-grid">
        <div><span class="info-label">{{ t('productionBatches.batchInfo.batchId') }}</span><span class="info-value">{{ batch.batchNumber }}</span></div>
        <div><span class="info-label">{{ t('productionBatches.batchInfo.garmentModel') }}</span><span class="info-value">{{ translateModel(batch.garmentModel) }}</span></div>
        <div><span class="info-label">{{ t('productionBatches.batchInfo.currentStage') }}</span><span class="info-value">{{ translateStage(batch.currentStage) }}</span></div>
        <div><span class="badge-in-production">{{ translateStatus(batch.status) }}</span></div>
      </div>
    </div>

    <assign-operator-form
      v-model="selectedOperatorId"
      :current-stage="batch.currentStage"
      :operators="operators"
      :error-message="errorMessage"
      @assign-operator="assignOperator"
    />

    <assigned-operators-table :operators="assignedList" />

    <div v-if="showSuccessModal" class="modal-overlay" @click.self="showSuccessModal = false">
      <div class="modal-card">
        <button type="button" class="modal-close-btn" @click="showSuccessModal = false">&times;</button>

        <div class="icon-circle icon-success">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#48532B" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>

        <h2 class="modal-title">{{ t('productionBatches.assignment.successTitle') }}</h2>
        <p class="modal-description">
          {{ t('productionBatches.assignment.successDescription', { batch: batch.batchNumber, stage: translateStage(batch.currentStage) }) }}
        </p>

        <div class="modal-actions">
          <button type="button" class="btn-outline-olive" @click="goToBatch">{{ t('productionBatches.assignment.viewBatch') }}</button>
          <button type="button" class="btn-olive modal-btn" @click="showSuccessModal = false">{{ t('productionBatches.assignment.ok') }}</button>
        </div>
      </div>
    </div>

    <div v-if="showErrorModal" class="modal-overlay" @click.self="showErrorModal = false">
      <div class="modal-card">
        <button type="button" class="modal-close-btn" @click="showErrorModal = false">&times;</button>

        <div class="icon-circle icon-error">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D32F2F" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </div>

        <h2 class="modal-title">{{ t('productionBatches.assignment.errorTitle') }}</h2>
        <p class="modal-description">
          {{ t('productionBatches.assignment.errorNoOperators') }}<br />{{ t('productionBatches.assignment.errorSelectOperator') }}
        </p>

        <div class="modal-actions">
          <button type="button" class="btn-olive modal-btn full-width" @click="showErrorModal = false">{{ t('productionBatches.assignment.ok') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useProductionStore } from '../../application/store/production.js'
import AssignOperatorForm from '../components/assign-operator-form.component.vue'
import AssignedOperatorsTable from '../components/assigned-operators-table.component.vue'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const productionStore = useProductionStore()

const batch = ref(null)
const operators = ref([])
const assignedList = ref([])
const selectedOperatorId = ref('')
const errorMessage = ref('')

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

const showSuccessModal = ref(false)
const showErrorModal = ref(false)

const fetchData = async () => {
  try {
    const [batchData, opData, assignedData] = await Promise.all([
      productionStore.loadBatch(route.params.id),
      productionStore.loadOperators(),
      productionStore.loadAssignedOperators(route.params.id)
    ])
    batch.value = batchData
    operators.value = opData
    assignedList.value = assignedData
  } catch (err) {
    console.error('Error fetching operator data:', err)
  }
}

onMounted(fetchData)

const assignOperator = async () => {
  errorMessage.value = ''

  if (!selectedOperatorId.value) {
    showErrorModal.value = true
    return
  }

  const operatorObj = operators.value.find(o => o.id === selectedOperatorId.value)
  if (!operatorObj) return

  const duplicate = assignedList.value.some(
      a => a.operatorName === operatorObj.name && a.stage === batch.value.currentStage
  )

  if (duplicate) {
    errorMessage.value = t('productionBatches.assignment.duplicate')
    return
  }

  const newAssignment = {
    batchId: route.params.id,
    operatorName: operatorObj.name,
    specialty: operatorObj.specialty,
    stage: batch.value.currentStage,
    assignedAt: new Date().toLocaleString()
  }

  try {
    const saved = await productionStore.assignOperator(newAssignment)
    assignedList.value.push(saved)
    selectedOperatorId.value = ''

    showSuccessModal.value = true
  } catch (err) {
    console.error('Error assigning operator:', err)
  }
}

const goToBatch = () => {
  showSuccessModal.value = false
  router.push('/production-batches')
}
</script>

<style scoped>
.page-container { padding: 32px 40px; background: #ffffff; font-family: system-ui, sans-serif; }
.page-header { margin-bottom: 12px; }
.page-title { font-size: 28px; font-weight: 700; margin: 0; color: #111827; }
.page-subtitle { font-size: 14px; color: #6B7280; margin-top: 4px; }
.back-link { display: block; font-size: 14px; color: #6B7280; text-decoration: none; margin-bottom: 20px; font-weight: 500; }

.info-card { border: 1px solid #E5E7EB; border-radius: 12px; padding: 20px 24px; margin-bottom: 20px; }
.info-grid { display: flex; gap: 48px; align-items: center; }
.info-label { display: block; font-size: 12px; color: #6B7280; margin-bottom: 4px; }
.info-value { font-size: 15px; font-weight: 700; color: #111827; }
.badge-in-production { background: #ECEFE6; color: #48532B; padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 600; }


.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 36px 32px 28px;
  width: 100%;
  max-width: 440px;
  text-align: center;
  position: relative;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.modal-close-btn {
  position: absolute;
  top: 16px;
  right: 20px;
  background: transparent;
  border: none;
  font-size: 24px;
  color: #6B7280;
  cursor: pointer;
  line-height: 1;
}

.modal-close-btn:hover {
  color: #111827;
}

.icon-circle {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.icon-success {
  background-color: #E2E8D8;
}

.icon-error {
  background-color: #FCE8E6;
}

.modal-title {
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 10px 0;
}

.modal-description {
  font-size: 14px;
  color: #6B7280;
  margin: 0 0 28px 0;
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.modal-btn {
  flex: 1;
}

.btn-outline-olive {
  background-color: #ffffff;
  color: #48532B;
  border: 1px solid #48532B;
  padding: 0 24px;
  height: 44px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  flex: 1;
}

.full-width {
  width: 100%;
}
</style>