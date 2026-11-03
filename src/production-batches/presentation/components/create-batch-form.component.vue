
<template>
  <form @submit.prevent="handleSubmit" class="form-card">

    <!-- Section 1: Basic Information -->
    <div class="section-header">
      <div class="step-number">1</div>

      <div>
        <h2 class="section-title">{{ $t('productionBatches.createBatch.createBatchTable.basicInfo') }}</h2>
        <p class="section-subtitle">
          {{ $t('productionBatches.createBatch.createBatchTable.basicInfoDesc') }}
        </p>
      </div>
    </div>

    <div class="form-grid">

      <!-- Garment Model -->
      <div class="form-group">
        <label for="garmentModel">{{ $t('productionBatches.createBatch.createBatchTable.garmentModel') }}</label>

        <select
            id="garmentModel"
            v-model="form.garmentModel"
            required
            class="custom-select"
        >
          <option value="" disabled>
            {{ $t('productionBatches.createBatch.createBatchTable.garmentModelPlaceholder') }}
          </option>

          <option
              v-for="model in garmentModels"
              :key="model"
              :value="model"
          >
            {{ model }}
          </option>
        </select>
      </div>

      <!-- Projected Quantity -->
      <div class="form-group">
        <label for="projectedQuantity">{{ $t('productionBatches.createBatch.createBatchTable.projectedQuantity') }}</label>

        <div class="input-with-suffix">
          <input
              id="projectedQuantity"
              type="number"
              min="1"
              v-model.number="form.projectedQuantity"
              required
              class="custom-input"
              :placeholder="$t('productionBatches.createBatch.createBatchTable.projectedQuantityPlaceholder')"
          />

          <span class="suffix">{{ $t('productionBatches.createBatch.createBatchTable.projectedQuantityUnits') }}</span>
        </div>
      </div>

      <!-- Delivery Date -->
      <div class="form-group">
        <label for="deliveryDate">{{ $t('productionBatches.createBatch.createBatchTable.deliveryDate') }}</label>

        <input
            id="deliveryDate"
            type="date"
            v-model="form.deliveryDate"
            required
            class="custom-input custom-date-input"
        />
      </div>

      <!-- Technical Sheet -->
      <div class="form-group">
        <label for="technicalSheet">{{ $t('productionBatches.createBatch.createBatchTable.technicalSheet') }}</label>

        <div
            class="upload-box"
            @click="$refs.fileInput.click()"
            @dragover.prevent
            @drop.prevent="handleFileDrop"
        >
          <input
              ref="fileInput"
              id="technicalSheet"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              hidden
              @change="handleFileChange"
          />

          <div class="upload-icon">↑</div>

          <p class="upload-main">
            {{ selectedFile ? selectedFile.name : $t('productionBatches.createBatch.createBatchTable.technicalSheetPlaceholder') }}
          </p>

          <p class="upload-sub">
            PDF, JPG or PNG (Max. 5 MB)
          </p>
        </div>
      </div>

    </div>

    <hr class="divider" />

    <!-- Section 2: Additional Information -->
    <div class="section-header">
      <div class="step-number">2</div>

      <div>
        <h2 class="section-title">{{ $t('productionBatches.createBatch.createBatchTable.additionalInfo') }}</h2>
        <p class="section-subtitle">
          {{ $t('productionBatches.createBatch.createBatchTable.additionalInfoDesc') }}
        </p>
      </div>
    </div>

    <!-- Notes -->
    <div class="form-group mb-28">
      <label for="notes">{{ $t('productionBatches.createBatch.createBatchTable.notes') }}</label>

      <textarea
          id="notes"
          v-model="form.notes"
          rows="4"
          :placeholder="$t('productionBatches.createBatch.createBatchTable.notesPlaceholder')"
          class="custom-textarea"
      ></textarea>
    </div>

    <!-- Action Buttons -->
    <div class="form-actions">

      <button
          type="button"
          class="btn-cancel"
          :disabled="saving"
          @click="$emit('cancel')"
      >
        {{ $t('productionBatches.createBatch.createBatchTable.cancel') }}
      </button>

      <button
          type="submit"
          class="btn-olive"
          :disabled="saving"
      >
        {{ saving ? $t('productionBatches.createBatch.createBatchTable.creating') : $t('productionBatches.createBatch.createBatchTable.submit') }}
      </button>

    </div>

  </form>
</template>

<script>
export default {
  name: 'CreateBatchForm',

  emits: ['save', 'cancel'],

  props: {
    saving: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      form: {
        garmentModel: '',
        projectedQuantity: null,
        deliveryDate: '',
        notes: ''
      },

      selectedFile: null,

      garmentModels: [
        'T-Shirt Basic',
        'Hoodie',
        'Polo Shirt',
        'Jogger Pants',
        'Crewneck',
        'Tank Top',
        'Leggings'
      ]
    }
  },

  methods: {
    handleFileChange(event) {
      const file = event.target.files[0]

      if (file) {
        this.validateFile(file)
      }
    },

    handleFileDrop(event) {
      const file = event.dataTransfer.files[0]

      if (file) {
        this.validateFile(file)
      }
    },

    validateFile(file) {
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png'
      ]

      const maxSize = 5 * 1024 * 1024

      if (!allowedTypes.includes(file.type)) {
        alert('Please select a PDF, JPG or PNG file.')
        return
      }

      if (file.size > maxSize) {
        alert('The file must not exceed 5 MB.')
        return
      }

      this.selectedFile = file
    },

    handleSubmit() {
      if (
          !this.form.garmentModel ||
          !this.form.projectedQuantity ||
          this.form.projectedQuantity <= 0 ||
          !this.form.deliveryDate
      ) {
        return
      }

      this.$emit('save', {
        ...this.form,
        technicalSheetFile: this.selectedFile
      })
    }
  }
}
</script>

<style scoped>
.form-card {
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  padding: 32px;
  background: #ffffff;
}

.section-header {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 24px;
}

.step-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #E5E7EB;
  color: #374151;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  flex-shrink: 0;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  color: #111827;
}

.section-subtitle {
  font-size: 13px;
  color: #6B7280;
  margin-top: 2px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 28px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 6px;
}

.custom-input,
.custom-select,
.custom-textarea {
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

.custom-input:focus,
.custom-select:focus,
.custom-textarea:focus {
  border-color: #48532B;
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
  resize: vertical;
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
  overflow: hidden;
}

.upload-box:hover {
  background-color: #F3F4F6;
}

.upload-icon {
  font-size: 20px;
  color: #6B7280;
  margin-bottom: 4px;
}

.upload-main {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin: 0;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.upload-sub {
  font-size: 12px;
  color: #9CA3AF;
  margin: 2px 0 0 0;
}

.divider {
  border: 0;
  border-top: 1px solid #E5E7EB;
  margin: 28px 0;
}

.mb-28 {
  margin-bottom: 28px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

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

.btn-olive:hover:not(:disabled) {
  background-color: #394322;
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

.btn-cancel:hover:not(:disabled) {
  background-color: #F9FAFB;
}

.btn-olive:disabled,
.btn-cancel:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .form-card {
    padding: 20px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .form-actions button {
    width: 100%;
  }
}
</style>
