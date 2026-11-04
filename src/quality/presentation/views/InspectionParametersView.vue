<template>
  <div class="page-container">
    <div class="top-nav">
      <div>
        <h1 class="page-title">Inspection Parameters</h1>
        <p class="page-subtitle">Register the parameters evaluated during the fabric roll inspection.</p>
      </div>
      <button class="back-link" @click="goBack">← Back to Quality</button>
    </div>

    <div class="info-card">
      <h3 class="card-caption">Fabric Roll Information</h3>
      <div class="info-row">
        <div class="info-item">
          <span>Roll ID</span>
          <strong>{{ roll.rollId || '—' }}</strong>
        </div>
        <div class="info-item">
          <span>Supplier</span>
          <strong>{{ roll.supplier || '—' }}</strong>
        </div>
        <div class="info-item">
          <span>Reception Date</span>
          <strong>{{ roll.inspectionDate || '—' }}</strong>
        </div>
        <div class="info-item">
          <span>Fabric / Client Sample</span>
          <strong>{{ roll.sample || 'T-Shirt Basic' }}</strong>
        </div>
        <div class="info-item">
          <span>Initial Result</span>
          <span
              class="badge"
              :class="roll.initialResult === 'Conforming' ? 'badge-conforming' : 'badge-observed'"
          >
            {{ roll.initialResult || 'Conforming' }}
          </span>
        </div>
      </div>
    </div>

    <form class="section-card" @submit.prevent="saveParameters">
      <div class="section-header">
        <div class="step-badge">1</div>
        <div>
          <h2 class="section-title">Inspection Parameters</h2>
          <p class="section-subtitle">Record the physical and visual conditions evaluated during the inspection.</p>
        </div>
      </div>

      <div class="form-grid">
        <div class="form-group">
          <label>Fabric Width *</label>
          <div class="input-with-suffix">
            <input v-model.number="paramsForm.fabricWidth" type="number" placeholder="e.g. 150" required />
            <span class="suffix">cm</span>
          </div>
        </div>

        <div class="form-group">
          <label>Fabric Weight / GSM *</label>
          <div class="input-with-suffix">
            <input v-model.number="paramsForm.fabricWeight" type="number" placeholder="e.g. 220" required />
            <span class="suffix">g/m²</span>
          </div>
        </div>

        <div class="form-group">
          <label>Shade / Color Condition *</label>
          <select v-model="paramsForm.shadeCondition" required>
            <option value="Matches approved sample">Matches approved sample</option>
            <option value="Slight variation">Slight variation</option>
            <option value="Off-shade">Off-shade</option>
          </select>
        </div>

        <div class="form-group">
          <label>Weave Condition *</label>
          <select v-model="paramsForm.weaveCondition" required>
            <option value="No weave defects">No weave defects</option>
            <option value="Minor slubs">Minor slubs</option>
            <option value="Defects detected">Defects detected</option>
          </select>
        </div>

        <div class="form-group">
          <label>Surface Condition *</label>
          <select v-model="paramsForm.surfaceCondition" required>
            <option value="No stains or damage">No stains or damage</option>
            <option value="Slight grease traces">Slight grease traces</option>
            <option value="Damaged surface">Damaged surface</option>
          </select>
        </div>

        <div class="form-group">
          <label>Defects Detected</label>
          <select v-model="paramsForm.defectsDetected">
            <option value="None">None</option>
            <option value="Holes">Holes</option>
            <option value="Stains">Stains</option>
            <option value="Shade difference">Shade difference</option>
          </select>
        </div>

        <div class="form-group full-width">
          <label>Inspection Evidence / Observations</label>
          <textarea
              v-model="paramsForm.observations"
              rows="3"
              placeholder="Describe findings, variations, defects or conditions observed during the inspection."
          ></textarea>
        </div>
      </div>

      <div class="form-footer">
        <div class="evidence-note">
          These parameters will be stored as evidence of the material condition at reception.
        </div>
        <div class="footer-actions">
          <button type="button" class="btn-cancel" @click="goBack">Cancel</button>
          <button type="submit" class="btn-submit">Save Parameters</button>
        </div>
      </div>
    </form>

    <div class="section-card">
      <h2 class="section-title">Inspection Record History</h2>
      <p class="section-subtitle">Previous physical and visual condition parameter records for this roll.</p>

      <table class="history-table">
        <thead>
        <tr>
          <th>Record Date</th>
          <th>Width / Weight</th>
          <th>Shade Condition</th>
          <th>Weave & Surface</th>
          <th>Defects Detected</th>
          <th>Observations</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(record, index) in roll.parameterHistory" :key="index">
          <td>{{ record.date }}</td>
          <td>{{ record.fabricWidth }} cm · {{ record.fabricWeight }} g/m²</td>
          <td>{{ record.shadeCondition }}</td>
          <td>{{ record.weaveCondition }} / {{ record.surfaceCondition }}</td>
          <td>
              <span
                  class="badge"
                  :class="record.defectsDetected === 'None' ? 'badge-conforming' : 'badge-observed'"
              >
                {{ record.defectsDetected }}
              </span>
          </td>
          <td>{{ record.observations || '—' }}</td>
        </tr>
        <tr v-if="!roll.parameterHistory || roll.parameterHistory.length === 0">
          <td colspan="6" class="empty-cell">No inspection parameter records registered yet for this roll.</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { FabricInspectionService } from '../../infrastructure/fabric-inspection.service.js'

const route = useRoute()
const router = useRouter()
const roll = ref({})

const paramsForm = reactive({
  fabricWidth: 150,
  fabricWeight: 220,
  shadeCondition: 'Matches approved sample',
  weaveCondition: 'No weave defects',
  surfaceCondition: 'No stains or damage',
  defectsDetected: 'None',
  observations: ''
})

const loadRoll = async () => {
  try {
    const data = await FabricInspectionService.getById(route.params.id)
    roll.value = data

    if (!roll.value.parameterHistory) {
      roll.value.parameterHistory = []
    }

    if (data.parameters) {
      paramsForm.fabricWidth = data.parameters.fabricWidth ?? 150
      paramsForm.fabricWeight = data.parameters.fabricWeight ?? 220
      paramsForm.shadeCondition = data.parameters.shadeCondition ?? 'Matches approved sample'
      paramsForm.weaveCondition = data.parameters.weaveCondition ?? 'No weave defects'
      paramsForm.surfaceCondition = data.parameters.surfaceCondition ?? 'No stains or damage'
      paramsForm.defectsDetected = data.parameters.defectsDetected ?? 'None'
      paramsForm.observations = data.parameters.observations ?? ''
    }
  } catch (err) {
    console.error('Error fetching roll parameters:', err)
  }
}

const goBack = () => {
  router.push('/quality')
}

const saveParameters = async () => {
  const newRecord = {
    date: new Date().toISOString().split('T')[0],
    fabricWidth: paramsForm.fabricWidth,
    fabricWeight: paramsForm.fabricWeight,
    shadeCondition: paramsForm.shadeCondition,
    weaveCondition: paramsForm.weaveCondition,
    surfaceCondition: paramsForm.surfaceCondition,
    defectsDetected: paramsForm.defectsDetected,
    observations: paramsForm.observations
  }

  const updatedHistory = [newRecord, ...(roll.value.parameterHistory || [])]

  try {
    await FabricInspectionService.update(roll.value.id, {
      parameters: { ...paramsForm, updatedAt: new Date().toISOString() },
      parameterHistory: updatedHistory
    })

    roll.value.parameterHistory = updatedHistory
    paramsForm.observations = ''
  } catch (err) {
    console.error('Error saving inspection parameters:', err)
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

.section-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 24px;
}

.step-badge {
  width: 28px;
  height: 28px;
  background: #4a5826;
  color: #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 13px;
}

.section-title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
}

.section-subtitle {
  margin: 4px 0 0;
  font-size: 12px;
  color: #8c959f;
  margin-bottom: 20px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px 24px;
}

.full-width {
  grid-column: 1 / -1;
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
.form-group select,
.form-group textarea {
  width: 100%;
  height: 42px;
  padding: 0 14px;
  border: 1px solid #dfe3e6;
  border-radius: 8px;
  font-size: 13px;
  color: #1f2937;
  outline: none;
  box-sizing: border-box;
}

.form-group textarea {
  height: auto;
  padding: 12px 14px;
  resize: vertical;
}

.input-with-suffix {
  position: relative;
  display: flex;
  align-items: center;
}

.input-with-suffix input {
  padding-right: 44px;
}

.suffix {
  position: absolute;
  right: 14px;
  font-size: 12px;
  color: #8c959f;
}

.form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 32px;
}

.evidence-note {
  background: #f4f5f6;
  border-radius: 8px;
  padding: 12px 18px;
  font-size: 12px;
  color: #555e68;
}

.footer-actions {
  display: flex;
  gap: 12px;
}

.btn-cancel {
  height: 42px;
  padding: 0 24px;
  border: 1px solid #dfe3e6;
  border-radius: 8px;
  background: #ffffff;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
}

.btn-submit {
  height: 42px;
  padding: 0 24px;
  border: none;
  border-radius: 8px;
  background: #4a5826;
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-submit:hover {
  background: #3b461e;
}

.history-table {
  width: 100%;
  border-collapse: collapse;
}

.history-table th {
  padding: 12px 16px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: #55616c;
  border-bottom: 1px solid #e8ecef;
}

.history-table td {
  padding: 14px 16px;
  font-size: 13px;
  color: #212529;
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

.empty-cell {
  text-align: center;
  color: #8c959f;
  padding: 24px !important;
}
</style>