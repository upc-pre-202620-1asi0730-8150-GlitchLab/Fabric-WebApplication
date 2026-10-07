<template>
  <div class="page-container" v-if="batch">
    <div class="page-header">
      <div>
        <h1 class="page-title">Batch Detail</h1>
        <p class="page-subtitle">Update the operational stage and register production progress.</p>
      </div>
      <router-link to="/production-batches" class="back-link">&larr; Back to Production Batches</router-link>
    </div>

    <!-- Info Card -->
    <div class="info-card">
      <div class="info-grid">
        <div><span class="info-label">Batch ID</span><span class="info-value">{{ batch.batchNumber }}</span></div>
        <div><span class="info-label">Garment Model</span><span class="info-value">{{ batch.garmentModel }}</span></div>
        <div><span class="info-label">Current Stage</span><span class="info-value">{{ batch.currentStage }}</span></div>
        <div><span class="info-label">Projected Qty</span><span class="info-value">{{ batch.projectedQuantity }} pieces</span></div>
      </div>
      <button class="btn-olive" @click="$router.push(`/production-batches/${batch.id}/operators`)">Assign Operators</button>
    </div>

    <!-- Stepper Card -->
    <div class="card">
      <h3 class="card-title">Production Stages</h3>
      <p class="card-subtitle">Current operational progress of the batch.</p>

      <div class="stepper">
        <div v-for="(stage, idx) in stages" :key="stage" class="step-wrapper">
          <div :class="['step-item', getStageStatus(stage)]">
            <div class="step-circle">{{ getStageStatus(stage) === 'completed' ? '✓' : idx + 1 }}</div>
            <span :class="['step-label', { bold: stage === batch.currentStage }]">{{ stage }}</span>
          </div>
          <div v-if="idx < stages.length - 1" :class="['step-line', { active: idx < currentStageIndex }]"></div>
        </div>
      </div>
    </div>

    <!-- Update Stage Card -->
    <div class="card">
      <h3 class="card-title">Update Production Stage</h3>
      <p class="card-subtitle">Register the quantity processed and move the batch to its next stage.</p>

      <div class="form-grid">
        <div class="form-group">
          <label>New Stage *</label>
          <select v-model="updateForm.newStage" class="custom-select">
            <option v-for="s in stages" :key="s" :value="s">{{ s }}</option>
          </select>
        </div>
        <div class="form-group">
          <label>Processed Quantity *</label>
          <div class="input-with-suffix">
            <input type="number" v-model.number="updateForm.quantity" placeholder="e.g. 640" class="custom-input" />
            <span class="suffix">garments</span>
          </div>
        </div>
        <div class="form-group full-width">
          <label>Notes</label>
          <input type="text" v-model="updateForm.notes" placeholder="Optional production notes" class="custom-input" />
        </div>
      </div>

      <div class="form-actions">
        <button class="btn-cancel" @click="$router.push('/production-batches')">Cancel</button>
        <button class="btn-olive" @click="saveStageUpdate">Update Stage</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { http } from '../../../shared/infrastructure/base-api.js'

const route = useRoute()
const router = useRouter()
const batch = ref(null)

const stages = ['Cutting', 'Sewing', 'Finishing', 'Quality Check', 'Completed']

const updateForm = ref({ newStage: '', quantity: null, notes: '' })

const fetchBatch = async () => {
  try {
    const { data } = await http.get(`/batches/${route.params.id}`)
    batch.value = data
    updateForm.value.newStage = batch.value.currentStage
  } catch (err) {
    console.error('Error fetching batch:', err)
  }
}

onMounted(fetchBatch)

const currentStageIndex = computed(() => {
  if (!batch.value) return 0
  return stages.indexOf(batch.value.currentStage)
})

const getStageStatus = (stage) => {
  const index = stages.indexOf(stage)
  if (index < currentStageIndex.value) return 'completed'
  if (index === currentStageIndex.value) return 'current'
  return 'future'
}

const formatMovementDate = (d) => d.toLocaleString('en-US', {
  month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false
})

const saveStageUpdate = async () => {
  if (!batch.value) return

  const newIndex = stages.indexOf(updateForm.value.newStage)
  if (newIndex < 0) return
  const calculatedProgress = Math.round(((newIndex + 1) / stages.length) * 100)
  const batchId = batch.value.id

  try {
    // Register the processed quantity in the traceability history
    const quantity = Number(updateForm.value.quantity)
    if (quantity > 0) {
      const { data: history } = await http.get('/traceabilityHistory', { params: { batchId } })
      const last = history[history.length - 1]
      const qtyIn = last ? Number(last.qtyOut) : Number(batch.value.projectedQuantity)

      await Promise.all(
          history
              .filter(h => h.status === 'Current')
              .map(h => http.patch(`/traceabilityHistory/${h.id}`, { status: 'Completed' }))
      )

      await http.post('/traceabilityHistory', {
        batchId,
        stage: batch.value.currentStage,
        dateTime: formatMovementDate(new Date()),
        qtyIn,
        qtyOut: quantity,
        difference: quantity - qtyIn,
        responsible: 'Supervisor',
        status: 'Current'
      })
    }

    await http.patch(`/batches/${batchId}`, {
      currentStage: updateForm.value.newStage,
      progressPercentage: calculatedProgress,
      status: updateForm.value.newStage === 'Completed' ? 'Completed' : batch.value.status
    })
    router.push('/production-batches')
  } catch (err) {
    console.error('Error updating stage:', err)
    alert('Could not update the stage. Please try again.')
  }
}
</script>

<style scoped>
.page-container { padding: 32px 40px; background: #ffffff; font-family: system-ui, sans-serif; }
.page-header { display: flex; justify-content: space-between; margin-bottom: 24px; }
.page-title { font-size: 28px; font-weight: 700; margin: 0; }
.page-subtitle { font-size: 14px; color: #6B7280; margin-top: 4px; }
.back-link { font-size: 14px; color: #6B7280; text-decoration: none; }

.info-card { border: 1px solid #E5E7EB; border-radius: 12px; padding: 20px 24px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.info-grid { display: flex; gap: 48px; }
.info-label { display: block; font-size: 12px; color: #6B7280; margin-bottom: 4px; }
.info-value { font-size: 15px; font-weight: 700; color: #111827; }

.card { border: 1px solid #E5E7EB; border-radius: 12px; padding: 24px; margin-bottom: 20px; }
.card-title { font-size: 16px; font-weight: 700; margin: 0; }
.card-subtitle { font-size: 13px; color: #6B7280; margin: 4px 0 24px 0; }

.stepper { display: flex; align-items: center; justify-content: space-between; padding: 0 20px; }
.step-wrapper { display: flex; align-items: center; flex: 1; }
.step-wrapper:last-child { flex: 0; }
.step-item { text-align: center; }
.step-circle { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; margin: 0 auto 8px auto; }
.completed .step-circle, .current .step-circle { background-color: #48532B; color: #ffffff; }
.future .step-circle { background-color: #E5E7EB; color: #6B7280; }
.step-line { flex: 1; height: 2px; background-color: #E5E7EB; margin: 0 12px -20px 12px; }
.step-line.active { background-color: #48532B; }
.step-label { font-size: 13px; color: #6B7280; }
.step-label.bold { font-weight: 700; color: #111827; }

.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
.full-width { grid-column: span 2; }
.form-group label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; }
.custom-input, .custom-select { width: 100%; height: 40px; border: 1px solid #E5E7EB; border-radius: 8px; padding: 0 12px; box-sizing: border-box; }
.input-with-suffix { position: relative; display: flex; align-items: center; }
.suffix { position: absolute; right: 12px; color: #9CA3AF; font-size: 12px; }

.form-actions { display: flex; justify-content: flex-end; gap: 12px; }
.btn-olive { background: #48532B; color: #fff; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer; }
.btn-cancel { background: #fff; border: 1px solid #E5E7EB; padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer; }
</style>