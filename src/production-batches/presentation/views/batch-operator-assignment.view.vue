<template>
  <div class="page-container" v-if="batch">
    <div class="page-header">
      <h1 class="page-title">Batch Operator Assignment</h1>
      <p class="page-subtitle">Assign operators to a production batch and stage.</p>
    </div>

    <router-link to="/production-batches" class="back-link mb-20">&larr; Back to Production Batches</router-link>

    <!-- Info Card -->
    <div class="info-card">
      <div class="info-grid">
        <div><span class="info-label">Batch ID</span><span class="info-value">{{ batch.batchNumber }}</span></div>
        <div><span class="info-label">Garment Model</span><span class="info-value">{{ batch.garmentModel }}</span></div>
        <div><span class="info-label">Current Stage</span><span class="info-value">{{ batch.currentStage }}</span></div>
        <div><span class="badge-in-production">{{ batch.status }}</span></div>
      </div>
    </div>

    <!-- Form Assign -->
    <div class="card">
      <h3 class="card-title">Assign Operators</h3>
      <p class="card-subtitle">Assign one or more operators to the current production stage.</p>

      <div class="assign-row">
        <div class="form-group flex-1">
          <label>Production Stage *</label>
          <input type="text" :value="batch.currentStage" disabled class="custom-input disabled" />
        </div>
        <div class="form-group flex-2">
          <label>Operators *</label>
          <select v-model="selectedOperatorId" class="custom-select">
            <option value="" disabled selected>Select operators</option>
            <option v-for="op in operators" :key="op.id" :value="op.id">
              {{ op.name }} ({{ op.specialty }})
            </option>
          </select>
        </div>
        <button class="btn-olive self-end" @click="assignOperator">Assign Operators</button>
      </div>

      <div v-if="errorMessage" class="warning-banner">
        {{ errorMessage }}
      </div>
    </div>

    <!-- Assigned Operators Table -->
    <div class="card">
      <h3 class="card-title">Assigned Operators</h3>
      <p class="card-subtitle">Operators assigned to this batch, grouped by production stage.</p>

      <table class="custom-table">
        <thead>
        <tr>
          <th>OPERATOR</th>
          <th>SPECIALTY</th>
          <th>STAGE</th>
          <th>ASSIGNED AT</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="assigned in assignedList" :key="assigned.id">
          <td class="font-bold">{{ assigned.operatorName }}</td>
          <td>{{ assigned.specialty }}</td>
          <td>{{ assigned.stage }}</td>
          <td>{{ assigned.assignedAt }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const batch = ref(null)
const operators = ref([])
const assignedList = ref([])
const selectedOperatorId = ref('')
const errorMessage = ref('')

const fetchData = async () => {
  try {
    const batchRes = await fetch(`http://localhost:3000/batches/${route.params.id}`)
    batch.value = await batchRes.json()

    const opRes = await fetch(`http://localhost:3000/operators`)
    operators.value = await opRes.json()

    const assignedRes = await fetch(`http://localhost:3000/assignedOperators?batchId=${route.params.id}`)
    assignedList.value = await assignedRes.json()
  } catch (err) {
    console.error('Error fetching operator data:', err)
  }
}

onMounted(fetchData)

const assignOperator = async () => {
  errorMessage.value = ''
  if (!selectedOperatorId.value) return

  const operatorObj = operators.value.find(o => o.id === selectedOperatorId.value)
  if (!operatorObj) return

  // Check duplicate
  const duplicate = assignedList.value.some(
      a => a.operatorName === operatorObj.name && a.stage === batch.value.currentStage
  )

  if (duplicate) {
    errorMessage.value = 'Duplicate assignment → Operator is already assigned to this batch and stage.'
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
    const res = await fetch('http://localhost:3000/assignedOperators', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAssignment)
    })
    const saved = await res.json()
    assignedList.value.push(saved)
    selectedOperatorId.value = ''
  } catch (err) {
    console.error('Error assigning operator:', err)
  }
}
</script>

<style scoped>
.page-container { padding: 32px 40px; background: #ffffff; font-family: system-ui, sans-serif; }
.page-header { margin-bottom: 12px; }
.page-title { font-size: 28px; font-weight: 700; margin: 0; }
.page-subtitle { font-size: 14px; color: #6B7280; margin-top: 4px; }
.back-link { display: block; font-size: 14px; color: #6B7280; text-decoration: none; margin-bottom: 20px; }

.info-card { border: 1px solid #E5E7EB; border-radius: 12px; padding: 20px 24px; margin-bottom: 20px; }
.info-grid { display: flex; gap: 48px; align-items: center; }
.info-label { display: block; font-size: 12px; color: #6B7280; margin-bottom: 4px; }
.info-value { font-size: 15px; font-weight: 700; color: #111827; }
.badge-in-production { background: #ECEFE6; color: #48532B; padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 600; }

.card { border: 1px solid #E5E7EB; border-radius: 12px; padding: 24px; margin-bottom: 20px; }
.card-title { font-size: 16px; font-weight: 700; margin: 0; }
.card-subtitle { font-size: 13px; color: #6B7280; margin: 4px 0 20px 0; }

.assign-row { display: flex; gap: 16px; align-items: flex-end; margin-bottom: 16px; }
.flex-1 { flex: 1; }
.flex-2 { flex: 2; }
.self-end { align-self: flex-end; }

.form-group label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; }
.custom-input, .custom-select { width: 100%; height: 40px; border: 1px solid #E5E7EB; border-radius: 8px; padding: 0 12px; box-sizing: border-box; }
.custom-input.disabled { background-color: #F9FAFB; }

.warning-banner { background: #FDF2F2; color: #B93838; padding: 12px 16px; border-radius: 8px; font-size: 12px; margin-top: 12px; }

.custom-table { width: 100%; border-collapse: collapse; font-size: 13px; text-align: left; }
.custom-table th { padding: 12px; color: #374151; font-weight: 700; border-bottom: 1px solid #E5E7EB; }
.custom-table td { padding: 14px 12px; border-bottom: 1px solid #F3F4F6; color: #6B7280; }
.font-bold { font-weight: 700; color: #111827; }
.btn-olive { background: #48532B; color: #fff; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer; height: 40px; }
</style>