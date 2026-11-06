<!--
  @summary Presentation component rendering movement traceability history and quantity differences.
  @author Diego Sebastian Reategui Galarcep (u20201F165)
-->
<template>
  <div class="card">
    <h3 class="card-title">Movement History</h3>
    <p class="card-subtitle">Chronological record of batch movements, quantities and responsible operators.</p>

    <table class="custom-table">
      <thead>
      <tr>
        <th>STAGE</th>
        <th>DATE & TIME</th>
        <th>QTY IN</th>
        <th>QTY OUT</th>
        <th>DIFFERENCE</th>
        <th>RESPONSIBLE</th>
        <th>STATUS</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in movements" :key="item.id || item.stage">
        <td>{{ item.stage }}</td>
        <td>{{ item.dateTime }}</td>
        <td>{{ item.qtyIn }}</td>
        <td>{{ item.qtyOut }}</td>
        <td>
          <span v-if="item.difference < 0" class="diff-badge">{{ item.difference }}</span>
          <span v-else>{{ item.difference }}</span>
        </td>
        <td>{{ item.responsible }}</td>
        <td>{{ item.status }}</td>
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