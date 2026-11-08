<template>
  <div class="info-card">
    <div class="info-grid">
      <div><span class="info-label">{{ $t('productionBatches.batchInfo.batchId') }}</span><span class="info-value">{{ batch.batchNumber }}</span></div>
      <div><span class="info-label">{{ $t('productionBatches.batchInfo.garmentModel') }}</span><span class="info-value">{{ translateValue(batch.garmentModel, 'models') }}</span></div>
      <div><span class="info-label">{{ $t('productionBatches.batchInfo.currentStage') }}</span><span class="info-value">{{ translateValue(batch.currentStage, 'stages') }}</span></div>
      <div><span class="info-label">{{ $t('productionBatches.batchInfo.projectedQuantity') }}</span><span class="info-value">{{ batch.projectedQuantity }} {{ $t('productionBatches.batchInfo.pieces') }}</span></div>
    </div>
    <button v-if="showAssignButton" class="btn-olive" @click="$emit('assign-click')">{{ $t('productionBatches.assignment.assignOperators') }}</button>
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
  emits: ['assign-click'],
  methods: {
    translateValue(value, category) {
      const keys = {
        models: {
          'T-Shirt Basic': 'tshirtBasic',
          Hoodie: 'hoodie',
          'Polo Shirt': 'poloShirt',
          'Jogger Pants': 'joggerPants',
          Crewneck: 'crewneck',
          'Tank Top': 'tankTop',
          Leggings: 'leggings'
        },
        stages: {
          Cutting: 'cutting',
          Sewing: 'sewing',
          Finishing: 'finishing',
          'Quality Check': 'qualityCheck',
          Completed: 'completed'
        }
      };
      const key = keys[category]?.[value];
      return key ? this.$t(`productionBatches.${category}.${key}`) : value;
    }
  }
};
</script>

<style scoped>
.info-card { border: 1px solid #E5E7EB; border-radius: 12px; padding: 20px 24px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.info-grid { display: flex; gap: 48px; }
.info-label { display: block; font-size: 12px; color: #6B7280; margin-bottom: 4px; }
.info-value { font-size: 15px; font-weight: 700; color: #111827; }
.btn-olive { background: #48532B; color: #fff; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer; }
</style>
