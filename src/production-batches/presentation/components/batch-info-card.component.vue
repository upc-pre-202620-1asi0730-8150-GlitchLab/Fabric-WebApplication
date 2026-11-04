<template>
  <div class="info-card">
    <div class="info-grid">
      <div><span class="info-label">Batch ID</span><span class="info-value">{{ batch.batchNumber }}</span></div>
      <div><span class="info-label">Garment Model</span><span class="info-value">{{ batch.garmentModel }}</span></div>
      <div><span class="info-label">Current Stage</span><span class="info-value">{{ batch.currentStage }}</span></div>
      <div><span class="info-label">Projected Qty</span><span class="info-value">{{ batch.projectedQuantity }} pieces</span></div>
    </div>
    <button v-if="showAssignButton" class="btn-olive" @click="$emit('assign-click')">Assign Operators</button>
  </div>
</template>

<script>
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
.info-card { border: 1px solid #E5E7EB; border-radius: 12px; padding: 20px 24px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.info-grid { display: flex; gap: 48px; }
.info-label { display: block; font-size: 12px; color: #6B7280; margin-bottom: 4px; }
.info-value { font-size: 15px; font-weight: 700; color: #111827; }
.btn-olive { background: #48532B; color: #fff; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer; }
</style>
