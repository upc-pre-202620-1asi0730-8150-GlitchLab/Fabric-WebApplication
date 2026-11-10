<template>
  <div class="card">
    <h3 class="card-title">{{ $t('productionBatches.assignment.assignedTitle') }}</h3>
    <p class="card-subtitle">{{ $t('productionBatches.assignment.assignedSubtitle') }}</p>

    <table class="custom-table">
      <thead>
        <tr>
          <th>{{ $t('productionBatches.assignment.table.operator') }}</th>
          <th>{{ $t('productionBatches.assignment.table.specialty') }}</th>
          <th>{{ $t('productionBatches.assignment.table.stage') }}</th>
          <th>{{ $t('productionBatches.assignment.table.assignedAt') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="assigned in operators" :key="assigned.id">
          <td class="font-bold">{{ assigned.operatorName }}</td>
          <td>{{ assigned.specialty }}</td>
          <td>{{ translateStage(assigned.stage) }}</td>
          <td>{{ assigned.assignedAt }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'assigned-operators-table',
  props: {
    operators: {
      type: Array,
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
    }
  }
};
</script>

<style scoped>
.card { border: 1px solid #E5E7EB; border-radius: 12px; padding: 24px; margin-bottom: 20px; }
.card-title { font-size: 16px; font-weight: 700; margin: 0; color: #111827; }
.card-subtitle { font-size: 13px; color: #6B7280; margin: 4px 0 20px 0; }
.custom-table { width: 100%; border-collapse: collapse; font-size: 13px; text-align: left; }
.custom-table th { padding: 12px; color: #374151; font-weight: 700; border-bottom: 1px solid #E5E7EB; }
.custom-table td { padding: 14px 12px; border-bottom: 1px solid #F3F4F6; color: #6B7280; }
.font-bold { font-weight: 700; color: #111827; }
</style>
