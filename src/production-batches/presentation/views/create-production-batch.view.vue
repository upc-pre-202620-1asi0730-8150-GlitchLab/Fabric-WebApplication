<template>
  <div class="page-container">
    <div class="page-header">
      <div>
        <h1 class="page-title">Create Production Batch</h1>
        <p class="page-subtitle">Add the batch information to start its traceability.</p>
      </div>
      <router-link to="/production-batches" class="back-link">&larr; Back to Production Batches</router-link>
    </div>

    <form @submit.prevent="createBatch" class="form-card">
      <div class="section-header">
        <div class="step-number">1</div>
        <div>
          <h2 class="section-title">Basic Information</h2>
          <p class="section-subtitle">Enter the main details of the production batch.</p>
        </div>
      </div>

      <div class="form-grid">
        <!-- Garment Model -->
        <div class="form-group">
          <label>Garment Model *</label>
          <select v-model="form.garmentModel" required class="custom-select">
            <option value="" disabled selected>Select a garment model</option>
            <option v-for="model in garmentModels" :key="model" :value="model">
              {{ model }}
            </option>
          </select>
        </div>

        <!-- Projected Quantity -->
        <div class="form-group">
          <label>Projected Quantity *</label>
          <div class="input-with-suffix">
            <input
                type="number"
                min="1"
                v-model.number="form.projectedQuantity"
                placeholder="e.g. 500"
                required
                class="custom-input"
            />
            <span class="suffix">units</span>
          </div>
        </div>

        <!-- Delivery Date -->
        <div class="form-group">
          <label>Delivery Date *</label>
          <input type="date" v-model="form.deliveryDate" required class="custom-input custom-date-input" />
        </div>

        <!-- Technical Sheet -->
        <div class="form-group">
          <label>Technical Sheet *</label>
          <div class="upload-box">
            <div class="upload-icon">↑</div>
            <p class="upload-main">Click to upload or drag and drop</p>
            <p class="upload-sub">PDF, JPG or PNG (Max. 5 MB)</p>
          </div>
        </div>
      </div>

      <hr class="divider" />

      <div class="section-header">
        <div class="step-number">2</div>
        <div>
          <h2 class="section-title">Additional Information</h2>
          <p class="section-subtitle">Add any relevant notes for the batch (optional).</p>
        </div>
      </div>

      <div class="form-group mb-28">
        <label>Notes</label>
        <textarea v-model="form.notes" rows="4" placeholder="e.g. special instructions, fabric details, client, etc." class="custom-textarea"></textarea>
      </div>

      <div class="form-actions">
        <button type="button" class="btn-cancel" @click="$router.push('/production-batches')">Cancel</button>
        <button type="submit" class="btn-olive">Create Batch</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = ref({
  garmentModel: '',
  projectedQuantity: null,
  deliveryDate: '',
  notes: ''
})

const garmentModels = [
  'T-Shirt Basic',
  'Hoodie',
  'Polo Shirt',
  'Jogger Pants',
  'Crewneck',
  'Tank Top',
  'Leggings'
]

const createBatch = async () => {
  if (form.value.projectedQuantity <= 0) {
    alert('Projected quantity must be greater than 0.')
    return
  }

  const newBatch = {
    batchNumber: `LOT-0${Math.floor(Math.random() * 90 + 10)}`,
    garmentModel: form.value.garmentModel,
    projectedQuantity: form.value.projectedQuantity,
    currentStage: 'Cutting',
    progressPercentage: 10,
    deliveryDate: form.value.deliveryDate,
    status: 'In Production',
    notes: form.value.notes
  }

  try {
    await fetch('http://localhost:3000/batches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBatch)
    })
    router.push('/production-batches')
  } catch (err) {
    console.error('Error creating batch:', err)
  }
}
</script>

<style scoped>
.page-container { padding: 32px 40px; background-color: #ffffff; min-height: 100vh; font-family: system-ui, -apple-system, sans-serif; }
.page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
.page-title { font-size: 28px; font-weight: 700; margin: 0; color: #111827; }
.page-subtitle { font-size: 14px; color: #6B7280; margin-top: 4px; }
.back-link { font-size: 14px; color: #6B7280; text-decoration: none; font-weight: 500; }

.form-card { border: 1px solid #E5E7EB; border-radius: 12px; padding: 32px; background: #ffffff; }
.section-header { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 24px; }
.step-number { width: 32px; height: 32px; border-radius: 50%; background-color: #E5E7EB; color: #374151; font-weight: 700; display: flex; align-items: center; justify-content: center; font-size: 14px; }
.section-title { font-size: 18px; font-weight: 700; margin: 0; color: #111827; }
.section-subtitle { font-size: 13px; color: #6B7280; margin-top: 2px; }

.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 28px; }
.form-group label { display: block; font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 6px; }

.custom-input, .custom-select, .custom-textarea {
  width: 100%;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  padding: 0 14px;
  height: 44px;
  min-height: 44px;
  font-size: 14px !important;
  font-family: inherit;
  color: #374151;
  box-sizing: border-box;
  outline: none;
  background-color: #ffffff;
}

.custom-select option {
  font-size: 14px;
  padding: 8px;
}

.custom-date-input {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px !important;
  font-family: inherit;
  line-height: 44px;
  appearance: none;
  -webkit-appearance: none;
}

.custom-date-input::-webkit-date-and-time-value {
  text-align: left;
  margin: 0;
  padding: 0;
  height: 100%;
  display: flex;
  align-items: center;
  font-size: 14px !important;
}

.custom-date-input::-webkit-calendar-picker-indicator {
  cursor: pointer;
  opacity: 0.6;
}

.custom-textarea {
  height: auto;
  min-height: 100px;
  padding: 10px 14px;
  font-size: 14px !important;
}

.input-with-suffix {
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
}

.input-with-suffix .custom-input {
  padding-right: 50px;
}

.suffix {
  position: absolute;
  right: 14px;
  color: #9CA3AF;
  font-size: 14px;
  pointer-events: none;
}

.upload-box {
  border: 2px dashed #E5E7EB;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  background: #FAFAFA;
  cursor: pointer;
  height: 110px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.upload-icon { font-size: 20px; color: #6B7280; margin-bottom: 4px; }
.upload-main { font-size: 14px; font-weight: 600; color: #374151; margin: 0; }
.upload-sub { font-size: 12px; color: #9CA3AF; margin: 2px 0 0 0; }

.divider { border: 0; border-top: 1px solid #E5E7EB; margin: 28px 0; }
.mb-28 { margin-bottom: 28px; }

.form-actions { display: flex; justify-content: flex-end; gap: 12px; }
.btn-olive {
  background-color: #48532B;
  color: #ffffff;
  border: none;
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  height: 44px;
}

.btn-cancel {
  background-color: #ffffff;
  color: #374151;
  border: 1px solid #E5E7EB;
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  height: 44px;
}
</style>