<!--
  @summary Presentation component for assigning operators to a batch stage.
  @author Diego Sebastian Reategui Galarcep (u20201F165)
-->
<template>
  <div class="surface-card p-4 border-round shadow-1 mb-4">
    <h3 class="m-0 text-xl font-bold text-900 mb-1">Assign Operators</h3>
    <p class="m-0 text-sm text-600 mb-4">Assign one or more operators to the current production stage.</p>

    <form @submit.prevent="handleAssign">
      <div class="grid p-fluid align-items-end">
        <!-- Stage -->
        <div class="col-12 md:col-4">
          <label for="stage" class="font-semibold block mb-2 text-700">Production Stage *</label>
          <pv-input-text id="stage" v-model="form.stage" disabled class="bg-gray-100" />
        </div>

        <!-- Operators Selection -->
        <div class="col-12 md:col-5">
          <label for="operators" class="font-semibold block mb-2 text-700">Operators *</label>
          <pv-dropdown
              id="operators"
              v-model="form.selectedOperator"
              :options="operatorsList"
              optionLabel="name"
              placeholder="Select operators"
              required
          />
        </div>

        <!-- Submit Button -->
        <div class="col-12 md:col-3">
          <pv-button label="Assign Operators" type="submit" class="custom-olive-btn w-full" />
        </div>
      </div>

      <!-- Warning Duplicate Banner -->
      <div v-if="duplicateWarning" class="p-3 bg-gray-100 border-round text-sm text-600 mt-3 flex align-items-center gap-2">
        <i class="pi pi-exclamation-circle text-gray-500"></i>
        <span><strong>Duplicate assignment</strong> &rarr; Operator is already assigned to this batch and stage.</span>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'assign-operator-form',
  emits: ['assign-operator'],
  data() {
    return {
      form: {
        stage: 'Sewing',
        selectedOperator: null
      },
      duplicateWarning: true,
      operatorsList: [
        { id: 1, name: 'Carlos Mendoza', specialty: 'Overlock' },
        { id: 2, name: 'Ana Torres', specialty: 'Straight Stitch' },
        { id: 3, name: 'Luis Ramos', specialty: 'Finishing' }
      ]
    };
  },
  methods: {
    handleAssign() {
      if (this.form.selectedOperator) {
        this.$emit('assign-operator', { ...this.form });
      }
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