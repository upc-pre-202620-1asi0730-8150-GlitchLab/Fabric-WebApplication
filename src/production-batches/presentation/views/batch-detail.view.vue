<template>
  <div class="page-container" v-if="batch">
    <div class="page-header">
      <div>
        <h1 class="page-title">Batch Detail</h1>
        <p class="page-subtitle">Update the operational stage and register production progress.</p>
      </div>
      <router-link to="/production-batches" class="back-link">&larr; Back to Production Batches</router-link>
    </div>

    <batch-info-card
      :batch="batch"
      show-assign-button
      @assign-click="router.push(`/production-batches/${batch.id}/operators`)"
    />

    <stage-progress-stepper :stages="stages" :current-stage="batch.currentStage" />

    <update-stage-form
      :stages="stages"
      :current-stage="batch.currentStage"
      @cancel="router.push('/production-batches')"
      @update-stage="saveStageUpdate"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { http } from '../../../shared/infrastructure/base-api.js'
import BatchInfoCard from '../components/batch-info-card.component.vue'
import StageProgressStepper from '../components/stage-progress-stepper.component.vue'
import UpdateStageForm from '../components/update-stage-form.component.vue'

const route = useRoute()
const router = useRouter()
const batch = ref(null)

const stages = ['Cutting', 'Sewing', 'Finishing', 'Quality Check', 'Completed']

const fetchBatch = async () => {
  try {
    const { data } = await http.get(`/batches/${route.params.id}`)
    batch.value = data
  } catch (err) {
    console.error('Error fetching batch:', err)
  }
}

onMounted(fetchBatch)

const formatMovementDate = (d) => d.toLocaleString('en-US', {
  month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false
})

const saveStageUpdate = async (updateForm) => {
  if (!batch.value) return

  const newIndex = stages.indexOf(updateForm.newStage)
  if (newIndex < 0) return
  const calculatedProgress = Math.round(((newIndex + 1) / stages.length) * 100)
  const batchId = batch.value.id

  try {
    // Register the processed quantity in the traceability history
    const quantity = Number(updateForm.processedQuantity)
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
      currentStage: updateForm.newStage,
      progressPercentage: calculatedProgress,
      status: updateForm.newStage === 'Completed' ? 'Completed' : batch.value.status
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
</style>