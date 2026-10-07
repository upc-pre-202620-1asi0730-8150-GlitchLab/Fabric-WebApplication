<!--
  @summary Presentation component displaying top summary header for a selected batch.
  @author Diego Sebastian Reategui Galarcep (u20201F165)
-->
<template>
  <div class="surface-card p-4 border-round shadow-1 mb-4 flex flex-column md:flex-row align-items-start md:align-items-center justify-content-between gap-3">
    <div class="grid w-full">
      <div class="col-6 md:col-3">
        <span class="text-xs text-500 uppercase font-semibold">Batch ID</span>
        <div class="text-lg font-bold text-900 mt-1">{{ batch.batchNumber }}</div>
      </div>
      <div class="col-6 md:col-3">
        <span class="text-xs text-500 uppercase font-semibold">Garment Model</span>
        <div class="text-lg font-bold text-900 mt-1">{{ batch.garmentModel }}</div>
      </div>
      <div class="col-6 md:col-3">
        <span class="text-xs text-500 uppercase font-semibold">Current Stage</span>
        <div class="text-lg font-bold text-900 mt-1">{{ batch.currentStage }}</div>
      </div>
      <div class="col-6 md:col-3">
        <span class="text-xs text-500 uppercase font-semibold">Quantity / Status</span>
        <div class="flex align-items-center gap-2 mt-1">
          <span class="text-lg font-bold text-900">{{ batch.projectedQuantity }} pieces</span>
          <pv-tag v-if="batch.status" :value="batch.status" severity="info" class="text-xs" />
        </div>
      </div>
    </div>

    <!-- Optional Action Button -->
    <div v-if="showAssignButton" class="whitespace-nowrap">
      <pv-button
          label="Assign Operators"
          class="custom-olive-btn p-button-sm px-3"
          @click="$emit('assign-click')"
      />
    </div>
  </div>
</template>

<script>
import { ProductionBatch } from '../../domain/model/production-batch.entity.js';

export default {
  name: 'batch-info-card',
  props: {
    batch: {
      type: Object,
      required: true
    },
    showAssignButton: {
      type: Boolean,
      default: false
    }
  },
  emits: ['assign-click']
};
</script>

<style scoped>
.custom-olive-btn {
  background-color: #536228 !important;
  border-color: #536228 !important;
}
</style>