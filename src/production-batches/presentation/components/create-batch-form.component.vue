<!--
  @summary Presentation component for creating a new production batch with technical sheet drag-and-drop.
  @author Diego Sebastian Reategui Galarcep (u20201F165)
-->
<template>
  <div class="surface-card p-5 border-round shadow-1 w-full mx-auto">
    <form @submit.prevent="handleSubmit">
      <!-- Section 1: Basic Information -->
      <div class="mb-5">
        <div class="flex align-items-center gap-3 mb-3">
          <div class="border-circle bg-gray-200 text-800 font-bold w-2rem h-2rem flex align-items-center justify-content-center">1</div>
          <div>
            <h3 class="m-0 text-xl font-bold text-900">Basic Information</h3>
            <p class="m-0 text-sm text-600">Enter the main details of the production batch.</p>
          </div>
        </div>

        <div class="grid p-fluid">
          <!-- Garment Model -->
          <div class="col-12 md:col-6">
            <label for="garmentModel" class="font-semibold block mb-2 text-700">Garment Model *</label>
            <pv-dropdown
                id="garmentModel"
                v-model="form.garmentModel"
                :options="garmentModels"
                placeholder="Select a garment model"
                class="w-full"
                style="height: 44px !important; display: flex !important; align-items: center !important;"
                :inputStyle="{ height: '44px', display: 'flex', alignItems: 'center', fontSize: '0.95rem', padding: '0 0.85rem' }"
                :panelStyle="{ maxHeight: '280px' }"
                scrollHeight="280px"
                appendTo="body"
                required
            />
          </div>

          <!-- Projected Quantity -->
          <div class="col-12 md:col-6">
            <label for="projectedQuantity" class="font-semibold block mb-2 text-700">Projected Quantity *</label>
            <div class="p-inputgroup" style="height: 44px !important;">
              <pv-input-text
                  id="projectedQuantity"
                  v-model.number="form.projectedQuantity"
                  type="number"
                  placeholder="e.g. 500"
                  style="height: 44px !important; font-size: 0.95rem !important; padding: 0 0.85rem !important;"
                  required
              />
              <span class="p-inputgroup-addon" style="height: 44px !important; display: flex !important; align-items: center !important;">units</span>
            </div>
          </div>

          <!-- Delivery Date -->
          <div class="col-12 md:col-6">
            <label for="deliveryDate" class="font-semibold block mb-2 text-700">Delivery Date *</label>
            <pv-input-text
                id="deliveryDate"
                v-model="form.deliveryDate"
                type="date"
                class="w-full"
                style="height: 44px !important; font-size: 0.95rem !important; padding: 0 0.85rem !important; box-sizing: border-box !important;"
                required
            />
          </div>

          <!-- Technical Sheet Dropzone -->
          <div class="col-12 md:col-6">
            <label class="font-semibold block mb-2 text-700">Technical Sheet *</label>
            <div
                class="border-2 border-dashed border-300 border-round p-4 text-center cursor-pointer hover:surface-hover transition-colors flex flex-column align-items-center justify-content-center"
                style="min-height: 110px;"
                @click="triggerFileUpload"
            >
              <i class="pi pi-upload text-3xl text-500 mb-2"></i>
              <p class="m-0 text-sm font-semibold text-700">Click to upload or drag and drop</p>
              <span class="text-xs text-500">PDF, JPG or PNG (Max. 5 MB)</span>
            </div>
          </div>
        </div>
      </div>

      <hr class="border-top-1 border-300 my-4" />

      <!-- Section 2: Additional Information -->
      <div class="mb-5">
        <div class="flex align-items-center gap-3 mb-3">
          <div class="border-circle bg-gray-200 text-800 font-bold w-2rem h-2rem flex align-items-center justify-content-center">2</div>
          <div>
            <h3 class="m-0 text-xl font-bold text-900">Additional Information</h3>
            <p class="m-0 text-sm text-600">Add any relevant notes for the batch (optional).</p>
          </div>
        </div>

        <div>
          <label for="notes" class="font-semibold block mb-2 text-700">Notes</label>
          <textarea
              id="notes"
              v-model="form.notes"
              rows="4"
              class="p-inputtext w-full"
              style="font-size: 0.95rem !important; padding: 0.75rem !important;"
              placeholder="e.g. special instructions, fabric details, client, etc."
          ></textarea>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-content-end gap-3">
        <pv-button label="Cancel" type="button" class="p-button-outlined p-button-secondary px-4" @click="$emit('cancel')" />
        <pv-button label="Create Batch" type="submit" class="custom-olive-btn px-4" />
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'create-batch-form',
  emits: ['save', 'cancel'],
  data() {
    return {
      form: {
        garmentModel: '',
        projectedQuantity: null,
        deliveryDate: '',
        technicalSheetUrl: 'https://example.com/spec.pdf',
        notes: ''
      },
      garmentModels: [
        'T-Shirt Basic',
        'Hoodie',
        'Polo Shirt',
        'Jogger Pants',
        'Crewneck',
        'Tank Top',
        'Leggings'
      ]
    };
  },
  methods: {
    triggerFileUpload() {
      alert('File selector opened');
    },
    handleSubmit() {
      this.$emit('save', { ...this.form });
    }
  }
};
</script>

<style>
.p-dropdown-panel .p-dropdown-items {
  padding: 0.5rem 0 !important;
}

.p-dropdown-panel .p-dropdown-item {
  padding: 0.65rem 1rem !important;
  font-size: 0.95rem !important;
}
</style>

<style scoped>
.custom-olive-btn {
  background-color: #536228 !important;
  border-color: #536228 !important;
  color: #ffffff !important;
}
</style>