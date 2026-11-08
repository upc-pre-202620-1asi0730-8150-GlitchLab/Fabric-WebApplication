<!--
  @summary Presentation component rendering movement traceability history and quantity differences.
  @author Diego Sebastian Reategui Galarcep (u20201F165)
-->
<template>
  <div class="card">
    <h3 class="card-title">{{ $t('productionBatches.movement.title') }}</h3>
    <p class="card-subtitle">{{ $t('productionBatches.movement.subtitle') }}</p>

    <table class="custom-table">
      <thead>
      <tr>
        <th>{{ $t('productionBatches.movement.stage') }}</th>
        <th>{{ $t('productionBatches.movement.dateTime') }}</th>
        <th>{{ $t('productionBatches.movement.qtyIn') }}</th>
        <th>{{ $t('productionBatches.movement.qtyOut') }}</th>
        <th>{{ $t('productionBatches.movement.difference') }}</th>
        <th>{{ $t('productionBatches.movement.responsible') }}</th>
        <th>{{ $t('productionBatches.movement.status') }}</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in movements" :key="item.id || item.stage">
        <td>{{ translateStage(item.stage) }}</td>
        <td>{{ item.dateTime }}</td>
        <td>{{ item.qtyIn }}</td>
        <td>{{ item.qtyOut }}</td>
        <td>
          <span v-if="item.difference < 0" class="diff-badge">{{ item.difference }}</span>
          <span v-else>{{ item.difference }}</span>
        </td>
        <td>{{ item.responsible }}</td>
        <td>{{ translateStatus(item.status) }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'movement-history-table',
  props: {
    movements: {
      type: Array,
      required: true,
      default: () => []
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
    },
    translateStatus(status) {
      const keys = {
        'In Production': 'inProduction',
        'At Risk': 'atRisk',
        Completed: 'completed',
        Delayed: 'delayed'
      };
      return keys[status] ? this.$t(`productionBatches.statuses.${keys[status]}`) : status;
    }
  }
};
</script>

<style scoped>
.card { border: 1px solid #E5E7EB; border-radius: 12px; padding: 24px; margin-bottom: 20px; }
.card-title { font-size: 16px; font-weight: 700; margin: 0; }
.card-subtitle { font-size: 13px; color: #6B7280; margin: 4px 0 20px 0; }

.custom-table { width: 100%; border-collapse: collapse; font-size: 13px; text-align: left; }
.custom-table th { padding: 12px; color: #374151; font-weight: 700; border-bottom: 1px solid #E5E7EB; background: #F9FAFB; }
.custom-table td { padding: 14px 12px; border-bottom: 1px solid #F3F4F6; color: #4B5563; }

.diff-badge { background: #FCE8E8; color: #B93838; font-weight: 700; padding: 2px 8px; border-radius: 4px; font-size: 12px; }
</style>