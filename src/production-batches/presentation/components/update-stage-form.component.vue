<!--
  @summary Presentation component form to advance a production batch to its next stage.
  @author Diego Sebastian Reategui Galarcep (u20201F165)
-->
<template>
  <div class="surface-card p-4 border-round shadow-1">
    <h3 class="m-0 text-xl font-bold text-900 mb-1">Update Production Stage</h3>
    <p class="m-0 text-sm text-600 mb-4">Register the quantity processed and move the batch to its next stage.</p>

    <form @submit.prevent="handleUpdate">
      <div class="grid p-fluid">
        <!-- New Stage Selection -->
        <div class="col-12 md:col-6">
          <label for="newStage" class="font-semibold block mb-2 text-700">New Stage *</label>
          <pv-dropdown
              id="newStage"
              v-model="form.newStage"
              :options="availableStages"
              placeholder="Select new stage"
              required
          />
        </div>

        <!-- Processed Quantity -->
        <div class="col-12 md:col-6">
          <label for="processedQuantity" class="font-semibold block mb-2 text-700">Processed Quantity *</label>
          <div class="p-inputgroup">
            <pv-input-text
                id="processedQuantity"
                v-model.number="form.processedQuantity"
                type="number"
                placeholder="e.g. 640"
                required
            />
            <span class="p-inputgroup-addon">garments</span>
          </div>
        </div>

        <!-- Notes -->
        <div class="col-12">
          <label for="stageNotes" class="font-semibold block mb-2 text-700">Notes</label>
          <pv-input-text
              id="stageNotes"
              v-model="form.notes"
              placeholder="Optional production notes"
              class="w-full"
          />
        </div>
      </div>

      <div class="flex justify-content-end gap-3 mt-4">
        <pv-button label="Cancel" type="button" class="p-button-outlined p-button-secondary px-4" @click="$emit('cancel')" />
        <pv-button label="Update Stage" type="submit" class="custom-olive-btn px-4" />
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'update-stage-form',
  emits: ['update-stage', 'cancel'],
  data() {
    return {
      form: {
        newStage: 'Finishing',
        processedQuantity: null,
        notes: ''
      },
      availableStages: ['Cutting', 'Sewing', 'Finishing', 'Completed']
    };
  },
  methods: {
    handleUpdate() {
      this.$emit('update-stage', { ...this.form });
    }
  }
};
</script>

<style scoped>
.custom-olive-btn {
  background-color: #536228 !important;
  border-color: #536228 !important;
}
</style>