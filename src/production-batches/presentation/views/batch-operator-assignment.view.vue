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

    <!-- Modal de Éxito -->
    <div v-if="showSuccessModal" class="modal-overlay" @click.self="showSuccessModal = false">
      <div class="modal-card">
        <button type="button" class="modal-close-btn" @click="showSuccessModal = false">&times;</button>

        <div class="icon-circle icon-success">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#48532B" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>

        <h2 class="modal-title">Operators Assigned Successfully</h2>
        <p class="modal-description">
          The selected operators have been assigned to <strong>{{ batch.batchNumber }}</strong> in the <strong>{{ batch.currentStage }}</strong> stage.
        </p>

        <div class="modal-actions">
          <button type="button" class="btn-outline-olive" @click="goToBatch">View Batch</button>
          <button type="button" class="btn-olive modal-btn" @click="showSuccessModal = false">OK</button>
        </div>
      </div>
    </div>

    <!-- Modal de Error -->
    <div v-if="showErrorModal" class="modal-overlay" @click.self="showErrorModal = false">
      <div class="modal-card">
        <button type="button" class="modal-close-btn" @click="showErrorModal = false">&times;</button>

        <div class="icon-circle icon-error">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D32F2F" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </div>

        <h2 class="modal-title">Unable to Assign Operators</h2>
        <p class="modal-description">
          No operators have been selected.<br />Please select at least one operator to continue.
        </p>

        <div class="modal-actions">
          <button type="button" class="btn-olive modal-btn full-width" @click="showErrorModal = false">OK</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const batch = ref(null)
const operators = ref([])
const assignedList = ref([])
const selectedOperatorId = ref('')
const errorMessage = ref('')

// Estados para los modales
const showSuccessModal = ref(false)
const showErrorModal = ref(false)

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

.card { border: 1px solid #E5E7EB; border-radius: 12px; padding: 24px; margin-bottom: 20px; }
.card-title { font-size: 16px; font-weight: 700; margin: 0; color: #111827; }
.card-subtitle { font-size: 13px; color: #6B7280; margin: 4px 0 20px 0; }

.assign-row { display: flex; gap: 16px; align-items: flex-end; margin-bottom: 16px; }
.flex-1 { flex: 1; }
.flex-2 { flex: 2; }
.self-end { align-self: flex-end; }

.form-group label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; color: #374151; }
.custom-input, .custom-select { width: 100%; height: 44px; border: 1px solid #E5E7EB; border-radius: 8px; padding: 0 14px; box-sizing: border-box; font-size: 14px; color: #374151; outline: none; background-color: #ffffff; }
.custom-input.disabled { background-color: #F9FAFB; }

.warning-banner { background: #FDF2F2; color: #B93838; padding: 12px 16px; border-radius: 8px; font-size: 13px; margin-top: 12px; }

.custom-table { width: 100%; border-collapse: collapse; font-size: 13px; text-align: left; }
.custom-table th { padding: 12px; color: #374151; font-weight: 700; border-bottom: 1px solid #E5E7EB; }
.custom-table td { padding: 14px 12px; border-bottom: 1px solid #F3F4F6; color: #6B7280; }
.font-bold { font-weight: 700; color: #111827; }
.btn-olive { background: #48532B; color: #ffffff; border: none; padding: 0 24px; border-radius: 8px; font-weight: 600; cursor: pointer; height: 44px; font-size: 14px; }

/* Estilos de Modales */
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