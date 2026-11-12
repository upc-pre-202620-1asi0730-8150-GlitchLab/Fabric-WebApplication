<template>
  <div class="page-container">
    <div class="top-nav">
      <div>
        <h1 class="page-title">{{ t('quality.sheet.title') }}</h1>
        <p class="page-subtitle">{{ t('quality.sheet.subtitle') }}</p>
      </div>
      <button class="back-link" @click="goBack">← {{ t('quality.back') }}</button>
    </div>

    <div class="info-card">
      <div class="info-row">
        <div class="info-item">
          <span>{{ t('quality.parameters.info.rollId') }}</span>
          <strong>{{ roll.rollId || '—' }}</strong>
        </div>
        <div class="info-item">
          <span>{{ t('quality.parameters.info.supplier') }}</span>
          <strong>{{ roll.supplier || '—' }}</strong>
        </div>
        <div class="info-item">
          <span>{{ t('quality.fabric.columns.rollStatus') }}</span>
          <span class="badge" :class="rollStatusClass">{{ display(ROLL_STATUS_DISPLAY, roll.rollStatus) }}</span>
        </div>
      </div>
    </div>

    <div class="sheet-steps" role="tablist">
      <button
        v-for="(step, index) in steps"
        :key="step.key"
        type="button"
        role="tab"
        :class="['sheet-step', { 'sheet-step-active': activeStep === step.key }]"
        @click="selectStep(step.key)"
      >
        <span :class="['sheet-step-number', { 'sheet-step-done': step.done }]">{{ step.done ? '✓' : index + 1 }}</span>
        <span class="sheet-step-text">
          <strong>{{ t(`quality.sheet.steps.${step.key}`) }}</strong>
          <small>{{ step.done ? t('quality.sheet.done') : t('quality.sheet.pending') }}</small>
        </span>
      </button>
    </div>

    <div v-if="activeStep === 'initial'" class="info-card">
      <div class="info-row">
        <div class="info-item">
          <span>{{ t('quality.parameters.info.receptionDate') }}</span>
          <strong>{{ roll.inspectionDate || '—' }}</strong>
        </div>
        <div class="info-item">
          <span>{{ t('quality.parameters.info.sample') }}</span>
          <strong>{{ roll.sample || '—' }}</strong>
        </div>
        <div class="info-item">
          <span>{{ t('quality.shrinkage.info.color') }}</span>
          <strong>{{ roll.color || '—' }}</strong>
        </div>
        <div class="info-item">
          <span>{{ t('quality.parameters.info.initialResult') }}</span>
          <span class="badge" :class="roll.initialResult === 'Conforming' ? 'badge-conforming' : 'badge-observed'">
            {{ display(RESULT_STATUS_DISPLAY, roll.initialResult) }}
          </span>
        </div>
      </div>
    </div>

    <inspection-parameters-view v-else-if="activeStep === 'parameters'" embedded @saved="loadRoll" />
    <shrinkage-test-view v-else-if="activeStep === 'shrinkage'" embedded @saved="loadRoll" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { FabricInspectionService } from '../../infrastructure/fabric-inspection.service.js'
import { RESULT_STATUS_DISPLAY, ROLL_STATUS_DISPLAY } from '../inspection-options.js'
import InspectionParametersView from './InspectionParametersView.vue'
import ShrinkageTestView from './ShrinkageTestView.vue'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const roll = ref({})

const display = (map, value) => (map[value] ? t(map[value].labelKey) : value || '—')

const parametersDone = computed(() => (roll.value.parameterHistory?.length ?? 0) > 0)
const shrinkageDone = computed(() => !!roll.value.shrinkageTest && !['Pending', '—'].includes(roll.value.shrinkageTest))

const steps = computed(() => [
  { key: 'initial', done: true },
  { key: 'parameters', done: parametersDone.value },
  { key: 'shrinkage', done: shrinkageDone.value }
])

const stepKeys = ['initial', 'parameters', 'shrinkage']

const defaultStep = computed(() => {
  if (!parametersDone.value) return 'parameters'
  if (!shrinkageDone.value) return 'shrinkage'
  return 'initial'
})

const activeStep = computed(() => (stepKeys.includes(route.query.step) ? route.query.step : defaultStep.value))

const rollStatusClass = computed(() => ({
  'badge-conforming': roll.value.rollStatus === 'Available for Cutting',
  'badge-blocked': roll.value.rollStatus === 'Blocked',
  'badge-neutral': roll.value.rollStatus === 'Not Available'
}))

const selectStep = (step) => {
  router.replace({ query: { step } })
}

const loadRoll = async () => {
  try {
    roll.value = await FabricInspectionService.getById(route.params.id)
  } catch (err) {
    console.error('Error fetching roll inspection:', err)
  }
}

const goBack = () => {
  router.push('/quality')
}

onMounted(loadRoll)
</script>

<style scoped>
.page-container {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  padding: 32px 40px;
  background-color: #fcfcfc;
  min-height: 100vh;
}

.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.page-title {
  font-family: 'Poppins', sans-serif;
  font-size: 1.85rem;
  font-weight: 700;
  margin: 0 0 6px;
  color: #1a1a1a;
}

.page-subtitle {
  font-size: 0.95rem;
  color: #8c959f;
  margin: 0;
}

.back-link {
  background: transparent;
  border: none;
  color: #6B7280;
  font-size: 14px;
  cursor: pointer;
}

.info-card {
  background: #ffffff;
  border: 1px solid #e8ecef;
  border-radius: 12px;
  padding: 20px 24px;
  margin-bottom: 20px;
}

.info-row {
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  align-items: center;
}

.info-item span:first-child {
  display: block;
  font-size: 12px;
  color: #6B7280;
  margin-bottom: 4px;
}

.badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.badge-conforming { background: #ECEFE6; color: #48532B; }
.badge-observed { background: #FEF3C7; color: #92400E; }
.badge-blocked { background: #FCE8E6; color: #B91C1C; }
.badge-neutral { background: #F3F4F6; color: #4B5563; }
</style>
