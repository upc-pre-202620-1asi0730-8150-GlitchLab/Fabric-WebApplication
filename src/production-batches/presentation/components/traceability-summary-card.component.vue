<!--
  @summary Presentation component displaying quantity discrepancy alerts and traceability summary.
  @author Diego Sebastian Reategui Galarcep (u20201F165)
-->
<template>
  <div>
    <!-- Warning Banner (Conditional if total difference exists) -->
    <div v-if="totalDifference < 0" class="alert-card">
      <h4 class="alert-title">{{ $t('productionBatches.traceability.alertTitle') }}</h4>
      <p class="alert-sub">{{ $t('productionBatches.traceability.alertDescription', { quantity: totalDifference }) }}</p>
    </div>

    <!-- Summary Box -->
    <div class="card">
      <h3 class="card-title">{{ $t('productionBatches.traceability.summaryTitle') }}</h3>
      <div class="summary-grid">
        <div>{{ $t('productionBatches.traceability.projected') }} <strong class="text-dark">{{ projectedQuantity }} {{ $t('productionBatches.batchInfo.pieces') }}</strong></div>
        <div>{{ $t('productionBatches.traceability.current') }} <strong class="text-dark">{{ currentQty }} {{ $t('productionBatches.batchInfo.pieces') }}</strong></div>
        <div class="text-red font-bold">{{ $t('productionBatches.traceability.totalDifference') }} {{ totalDifference }} {{ $t('productionBatches.batchInfo.pieces') }}</div>
        <div>{{ $t('productionBatches.traceability.currentStage') }} <strong class="text-dark">{{ translateStage(currentStage) }}</strong></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'traceability-summary-card',
  props: {
    projectedQuantity: {
      type: [Number, String],
      default: 0
    },
    currentQty: {
      type: [Number, String],
      default: 0
    },
    totalDifference: {
      type: Number,
      default: 0
    },
    currentStage: {
      type: String,
      default: ''
    }
  },
  methods: {
    translateStage(stage) {
      const keys = {
        Cutting: 'cutting',
        Sewing: 'sewing',
        Finishing: 'finishing',
        'Quality Check': 'qualityCheck',
        Completed: 'completed'
      };
      return keys[stage] ? this.$t(`productionBatches.stages.${keys[stage]}`) : stage;
    }
  }
};
</script>

<style scoped>
.card { border: 1px solid #E5E7EB; border-radius: 12px; padding: 24px; margin-bottom: 20px; }
.card-title { font-size: 16px; font-weight: 700; margin: 0; }

.alert-card { background: #FDF2F2; border: 1px solid #F87171; border-radius: 12px; padding: 16px 20px; margin-bottom: 20px; }
.alert-title { font-size: 14px; font-weight: 700; color: #991B1B; margin: 0 0 4px 0; }
.alert-sub { font-size: 13px; color: #B93838; margin: 0; }

.summary-grid { display: flex; justify-content: space-between; font-size: 13px; color: #6B7280; }
.text-dark { color: #111827; }
.text-red { color: #B93838; }
.font-bold { font-weight: 700; }
</style>