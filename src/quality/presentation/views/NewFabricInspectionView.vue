<template>
  <div class="page-container">
    <header class="header">
      <h1 class="page-title">Quality</h1>
      <p class="page-subtitle">Manage fabric inspections, quality tests and garment defects.</p>
    </header>

    <div class="tabs">
      <button class="tab active" @click="goBack">Fabric Inspections</button>
      <button class="tab" @click="goToDefects">Defects</button>
    </div>

    <form class="inspection-form-card" @submit.prevent="saveInspection">
      <div class="section-header">
        <div class="step-badge">1</div>
        <div>
          <h2 class="section-title">Fabric Roll Information</h2>
          <p class="section-subtitle">Enter the identification and reception data of the incoming roll.</p>
        </div>
      </div>

      <div class="form-grid">
        <div class="form-group">
          <label>Roll ID *</label>
          <input v-model="form.rollId" type="text" placeholder="e.g. ROLL-001" required />
        </div>

        <div class="form-group">
          <label>Supplier *</label>
          <select v-model="form.supplier" required>
            <option value="" disabled>Select supplier</option>
            <option value="Textile A">Textile A</option>
            <option value="Supplier B">Supplier B</option>
            <option value="Supplier C">Supplier C</option>
          </select>
        </div>

        <div class="form-group">
          <label>Reception Date *</label>
          <input v-model="form.inspectionDate" type="date" required />
        </div>

        <div class="form-group">
          <label>Fabric / Client Sample *</label>
          <select v-model="form.sample" required>
            <option value="" disabled>Select reference</option>
            <option value="T-Shirt Basic">T-Shirt Basic</option>
            <option value="Hoodie">Hoodie</option>
            <option value="Crewneck">Crewneck</option>
            <option value="Leggings">Leggings</option>
          </select>
        </div>

        <div class="form-group">
          <label>Shade / Color *</label>
          <input v-model="form.color" type="text" placeholder="e.g. Navy Blue" required />
        </div>

        <div class="form-group suffix-group">
          <label>Roll Length</label>
          <div class="input-with-suffix">
            <input v-model="form.rollLength" type="number" placeholder="e.g. 50" />
            <span class="suffix">m</span>
          </div>
        </div>
      </div>

      <hr class="divider" />

      <div class="section-header">
        <div class="step-badge">2</div>
        <div>
          <h2 class="section-title">Initial Quality Inspection</h2>
          <p class="section-subtitle">Compare the roll with the client's approved sample and record any severe variation.</p>
        </div>
      </div>

      <div class="form-grid">
        <div class="form-group">
          <label>Shade Match *</label>
          <select v-model="form.shadeMatch" required>
            <option value="Matches client sample">Matches client sample</option>
            <option value="Slight variation">Slight variation</option>
            <option value="Severe mismatch">Severe mismatch</option>
          </select>
        </div>

        <div class="form-group">
          <label>Weave Condition *</label>
          <select v-model="form.weaveCondition" required>
            <option value="No weave holes detected">No weave holes detected</option>
            <option value="Minor irregularities">Minor irregularities</option>
            <option value="Severe weave defects">Severe weave defects</option>
          </select>
        </div>

        <div class="form-group">
          <label>Inspection Result *</label>
          <select v-model="form.initialResult" required>
            <option value="Conforming">Conforming</option>
            <option value="Observed">Observed</option>
          </select>
        </div>

        <div class="form-group full-width">
          <label>Observation / Reason</label>
          <textarea
              v-model="form.observation"
              rows="3"
              placeholder="Required when the roll is marked as Observed. Describe shade variation, weave holes, or other findings."
          ></textarea>
        </div>
      </div>

      <div class="form-footer">
        <div class="logic-banner">
          Conforming → Available for Cutting | Observed → Blocked from cutting batches
        </div>

        <div class="footer-actions">
          <button type="button" class="btn-cancel" @click="goBack">Cancel</button>
          <button type="submit" class="btn-submit">Save Inspection</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { FabricInspectionService } from '../../infrastructure/fabric-inspection.service.js'

const router = useRouter()

const form = reactive({
  rollId: '',
  supplier: '',
  inspectionDate: new Date().toISOString().split('T')[0],
  sample: '',
  color: '',
  rollLength: '',
  shadeMatch: 'Matches client sample',
  weaveCondition: 'No weave holes detected',
  initialResult: 'Conforming',
  observation: ''
})

const goBack = () => {
  router.push('/quality')
}

const goToDefects = () => {
  router.push('/quality?tab=defects')
}

const saveInspection = async () => {
  const isConforming = form.initialResult === 'Conforming'
  const newInspection = {
    id: String(Date.now()),
    rollId: form.rollId,
    supplier: form.supplier,
    inspectionDate: form.inspectionDate,
    sample: form.sample,
    color: form.color,
    rollLength: form.rollLength ? Number(form.rollLength) : null,
    shadeMatch: form.shadeMatch,
    weaveCondition: form.weaveCondition,
    initialResult: form.initialResult,
    observation: form.observation,
    shrinkageTest: 'Pending',
    rollStatus: isConforming ? 'Available for Cutting' : 'Blocked',
    testHistory: [],
    parameters: null
  }

  try {
    await FabricInspectionService.create(newInspection)
    router.push('/quality')
  } catch (error) {
    console.error('Error saving inspection:', error)
  }
}
</script>

<style scoped>
.page-container {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  padding: 32px 40px;
  background-color: #fcfcfc;
  min-height: 100vh;
}

.page-title {
  font-family: 'Poppins', sans-serif;
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 6px 0;
  color: #1a1a1a;
}

.page-subtitle {
  font-size: 0.95rem;
  color: #8c959f;
  margin: 0 0 24px 0;
}

.tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.tab {
  padding: 8px 32px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  border: 1px solid #e5e7eb;
  background-color: #ffffff;
  color: #1a1a1a;
  cursor: pointer;
}

.tab.active {
  background-color: #4a5826;
  border-color: #4a5826;
  color: #ffffff;
}

.inspection-form-card {
  background: #ffffff;
  border: 1px solid #e8ecef;
  border-radius: 14px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
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
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.full-width {
  grid-column: 1 / -1;
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
  background: #ffffff;
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

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #4a5826;
}

.input-with-suffix {
  position: relative;
  display: flex;
  align-items: center;
}

.input-with-suffix input {
  padding-right: 30px;
}

.suffix {
  position: absolute;
  right: 14px;
  font-size: 13px;
  color: #8c959f;
}

.divider {
  border: none;
  border-top: 1px solid #f0f2f5;
  margin: 32px 0 28px;
}

.form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 32px;
}

.logic-banner {
  background: #f4f5f6;
  border-radius: 8px;
  padding: 12px 18px;
  font-size: 12px;
  color: #555e68;
  font-weight: 500;
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
</style>