<template>
  <div :class="{ 'page-container': !embedded }">
    <div v-if="!embedded" class="top-nav">
      <div>
        <h1 class="page-title">{{ t('quality.shrinkage.title') }}</h1>
        <p class="page-subtitle">{{ t('quality.shrinkage.subtitle') }}</p>
      </div>
      <button class="back-link" @click="goBack">← {{ t('quality.back') }}</button>
    </div>

    <div v-if="!embedded" class="info-card">
      <h3 class="card-caption">{{ t('quality.shrinkage.info.title') }}</h3>
      <div class="info-row">
        <div class="info-item">
          <span>{{ t('quality.shrinkage.info.rollId') }}</span>
          <strong>{{ roll.rollId || '—' }}</strong>
        </div>
        <div class="info-item">
          <span>{{ t('quality.shrinkage.info.supplier') }}</span>
          <strong>{{ roll.supplier || '—' }}</strong>
        </div>
        <div class="info-item">
          <span>{{ t('quality.shrinkage.info.sample') }}</span>
          <strong>{{ roll.sample || 'T-Shirt Basic' }}</strong>
        </div>
        <div class="info-item">
          <span>{{ t('quality.shrinkage.info.color') }}</span>
          <strong>{{ roll.color || 'Navy' }}</strong>
        </div>
        <div class="info-item">
          <span>{{ t('quality.shrinkage.info.result') }}</span>
          <span class="badge badge-conforming">{{ display(RESULT_STATUS_DISPLAY, roll.initialResult || 'Conforming') }}</span>
        </div>
        <div class="info-item">
          <span>{{ t('quality.shrinkage.info.status') }}</span>
          <span class="badge badge-conforming">{{ display(ROLL_STATUS_DISPLAY, roll.rollStatus || 'Available for Cutting') }}</span>
        </div>
      </div>
    </div>

    <form class="section-card" @submit.prevent="saveTest">
      <h2 class="section-title">{{ t('quality.shrinkage.form.title') }}</h2>
      <p class="section-subtitle">{{ t('quality.shrinkage.form.subtitle') }}</p>

      <div class="form-grid">
        <div class="form-group">
          <label>{{ t('quality.shrinkage.fields.testDate') }} *</label>
          <input v-model="testForm.testDate" type="date" required />
        </div>

        <div class="form-group">
          <label>{{ t('quality.shrinkage.fields.method') }} *</label>
          <input v-model="testForm.method" type="text" required />
        </div>

        <div class="form-group">
          <label>{{ t('quality.shrinkage.fields.sampleId') }} *</label>
          <input v-model="testForm.sampleId" type="text" :placeholder="t('quality.shrinkage.placeholders.sampleId')" required />
        </div>

        <div class="form-group">
          <label>{{ t('quality.shrinkage.fields.initialMeasures') }} *</label>
          <div class="dual-inputs">
            <div>
              <span class="input-sublabel">{{ t('quality.shrinkage.length') }}</span>
              <input v-model.number="testForm.initialLen" type="number" step="0.1" placeholder="100.0" required />
            </div>
            <div>
              <span class="input-sublabel">{{ t('quality.shrinkage.width') }}</span>
              <input v-model.number="testForm.initialWidth" type="number" step="0.1" placeholder="100.0" required />
            </div>
          </div>
        </div>

        <div class="form-group">
          <label>{{ t('quality.shrinkage.fields.finalMeasures') }} *</label>
          <div class="dual-inputs">
            <div>
              <span class="input-sublabel">{{ t('quality.shrinkage.length') }}</span>
              <input v-model.number="testForm.finalLen" type="number" step="0.1" placeholder="98.5" required />
            </div>
            <div>
              <span class="input-sublabel">{{ t('quality.shrinkage.width') }}</span>
              <input v-model.number="testForm.finalWidth" type="number" step="0.1" placeholder="97.8" required />
            </div>
          </div>
        </div>

        <div class="form-group">
          <label>{{ t('quality.shrinkage.fields.shrinkagePercent') }}</label>
          <div class="dual-inputs">
            <div>
              <span class="input-sublabel">{{ t('quality.shrinkage.length') }}</span>
              <input type="text" :value="lenShrinkageFormatted" readonly class="input-readonly" />
            </div>
            <div>
              <span class="input-sublabel">{{ t('quality.shrinkage.width') }}</span>
              <input type="text" :value="widthShrinkageFormatted" readonly class="input-readonly" />
            </div>
          </div>
        </div>

        <div class="form-group">
          <label>{{ t('quality.shrinkage.fields.result') }} *</label>
          <select v-model="testForm.result" required>
            <option v-for="option in resultOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
          </select>
        </div>

        <div class="form-group col-span-2">
          <label>{{ t('quality.shrinkage.fields.note') }}</label>
          <input v-model="testForm.note" type="text" :placeholder="t('quality.shrinkage.placeholders.note')" />
        </div>
      </div>

      <div class="actions-right">
        <button type="button" class="btn-cancel" @click="goBack">{{ t('quality.shrinkage.actions.cancel') }}</button>
        <button type="submit" class="btn-submit">{{ t('quality.shrinkage.actions.save') }}</button>
      </div>
    </form>

    <div class="section-card">
      <h2 class="section-title">{{ t('quality.shrinkage.history.title') }}</h2>
      <p class="section-subtitle">{{ t('quality.shrinkage.history.subtitle') }}</p>

      <table class="history-table">
        <thead>
        <tr>
          <th>{{ t('quality.shrinkage.history.columns.testDate') }}</th>
          <th>{{ t('quality.shrinkage.history.columns.sampleId') }}</th>
          <th>{{ t('quality.shrinkage.history.columns.method') }}</th>
          <th>{{ t('quality.shrinkage.history.columns.shrinkage') }}</th>
          <th>{{ t('quality.shrinkage.history.columns.result') }}</th>
          <th>{{ t('quality.shrinkage.history.columns.notes') }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(test, index) in roll.testHistory" :key="index">
          <td>{{ test.testDate }}</td>
          <td>{{ test.sampleId }}</td>
          <td>{{ labelOf(methodOptions, test.method) }}</td>
          <td>{{ t('quality.shrinkage.history.lenWid', { len: formatPercent(test.lenShrinkage), wid: formatPercent(test.widthShrinkage) }) }}</td>
          <td>
              <span
                  class="badge"
                  :class="{
                  'badge-conforming': test.result === 'Approved',
                  'badge-observed': test.result === 'Pending',
                  'badge-blocked': test.result === 'Non-Compliant'
                }"
              >
                {{ display(SHRINKAGE_STATUS_DISPLAY, test.result) }}
              </span>
          </td>
          <td>{{ test.note || '—' }}</td>
        </tr>
        <tr v-if="!roll.testHistory || roll.testHistory.length === 0">
          <td colspan="6" class="empty-cell">{{ t('quality.shrinkage.history.empty') }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { FabricInspectionService } from '../../infrastructure/fabric-inspection.service.js'
import {
  RESULT_STATUS_DISPLAY,
  ROLL_STATUS_DISPLAY,
  SHRINKAGE_STATUS_DISPLAY,
  WASH_METHOD_OPTIONS
} from '../inspection-options.js'

defineProps({ embedded: { type: Boolean, default: false } })
const emit = defineEmits(['saved'])
const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const roll = ref({})

const RESULT_VALUES = ['Approved', 'Pending', 'Non-Compliant']

const display = (map, value) => map[value] ? t(map[value].labelKey) : (value ?? '—')

const resultOptions = computed(() => RESULT_VALUES.map(value => ({ value, label: display(SHRINKAGE_STATUS_DISPLAY, value) })))
const methodOptions = computed(() => WASH_METHOD_OPTIONS.map(({ value, labelKey }) => ({ value, label: t(labelKey) })))

const labelOf = (options, value) => options.find(option => option.value === value)?.label ?? value

const formatPercent = (value) => typeof value === 'number' ? `${value}%` : value

const testForm = reactive({
  testDate: new Date().toISOString().split('T')[0],
  method: 'Washing (ISO 6330)',
  sampleId: '',
  initialLen: 100.0,
  initialWidth: 100.0,
  finalLen: 98.5,
  finalWidth: 97.8,
  result: 'Approved',
  note: ''
})

const calculateShrinkage = (initial, final) => {
  if (!initial || !final || initial === 0) return null
  return (((final - initial) / initial) * 100).toFixed(1)
}

const lenShrinkageFormatted = computed(() => {
  const res = calculateShrinkage(testForm.initialLen, testForm.finalLen)
  return res !== null ? `${res}%` : '-'
})

const widthShrinkageFormatted = computed(() => {
  const res = calculateShrinkage(testForm.initialWidth, testForm.finalWidth)
  return res !== null ? `${res}%` : '-'
})

const loadRoll = async () => {
  try {
    const data = await FabricInspectionService.getById(route.params.id)
    roll.value = data
    if (!roll.value.testHistory) roll.value.testHistory = []
  } catch (err) {
    console.error('Error fetching roll inspection:', err)
  }
}

const goBack = () => {
  router.push('/quality')
}

const saveTest = async () => {
  const newTest = {
    testDate: testForm.testDate,
    method: testForm.method,
    sampleId: testForm.sampleId || `SMP-${Date.now().toString().slice(-4)}`,
    lenShrinkage: lenShrinkageFormatted.value,
    widthShrinkage: widthShrinkageFormatted.value,
    result: testForm.result,
    note: testForm.note
  }

  const updatedHistory = [...(roll.value.testHistory || []), newTest]

  try {
    await FabricInspectionService.update(roll.value.id, {
      testHistory: updatedHistory,
      shrinkageTest: testForm.result
    })
    roll.value.testHistory = updatedHistory
    roll.value.shrinkageTest = testForm.result
    testForm.note = ''
    emit('saved')
  } catch (err) {
    console.error('Error saving shrinkage test:', err)
  }
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
  font-size: 0.9rem;
  font-weight: 600;
  color: #55621f;
  cursor: pointer;
}

.info-card,
.section-card {
  background: #ffffff;
  border: 1px solid #e8ecef;
  border-radius: 12px;
  padding: 24px 28px;
  margin-bottom: 24px;
}

.card-caption {
  font-size: 15px;
  font-weight: 700;
  margin: 0 0 16px;
  color: #1a1a1a;
}

.info-row {
  display: flex;
  gap: 36px;
  align-items: center;
  flex-wrap: wrap;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.info-item span {
  font-size: 11px;
  color: #8c959f;
  font-weight: 500;
}

.info-item strong {
  font-size: 14px;
  color: #1a1a1a;
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 4px;
  color: #1a1a1a;
}

.section-subtitle {
  font-size: 12px;
  color: #8c959f;
  margin: 0 0 20px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px 20px;
}

.col-span-2 {
  grid-column: span 2;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 12px;
  font-weight: 600;
  color: #374151;
}

.form-group input,
.form-group select {
  height: 40px;
  padding: 0 12px;
  border: 1px solid #dfe3e6;
  border-radius: 7px;
  font-size: 13px;
  color: #1a1a1a;
}

.dual-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.input-sublabel {
  font-size: 10px;
  color: #8c959f;
  display: block;
  margin-bottom: 2px;
}

.input-readonly {
  background-color: #f7f9fa;
  color: #555e68;
}

.actions-right {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.btn-cancel {
  height: 40px;
  padding: 0 20px;
  border: 1px solid #dfe3e6;
  border-radius: 7px;
  background: #ffffff;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
}

.btn-submit {
  height: 40px;
  padding: 0 22px;
  border: none;
  border-radius: 7px;
  background: #4a5826;
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.history-table {
  width: 100%;
  border-collapse: collapse;
}

.history-table th {
  padding: 12px 14px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: #55616c;
  border-bottom: 1px solid #e8ecef;
}

.history-table td {
  padding: 14px;
  font-size: 13px;
  border-bottom: 1px solid #f0f2f5;
}

.badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 5px;
  font-size: 11px;
  font-weight: 600;
}

.badge-conforming {
  background-color: #e5ecd3;
  color: #3b4c19;
}

.badge-observed {
  background-color: #f5ebd9;
  color: #7b5921;
}

.badge-blocked {
  background-color: #ede2d5;
  color: #6a533f;
}

.empty-cell {
  text-align: center;
  color: #8c959f;
  padding: 24px !important;
}
</style>