<!--
  @summary Presentation component rendering movement traceability history and quantity differences.
  @author Diego Sebastian Reategui Galarcep (u20201F165)
-->
<template>
  <div class="surface-card p-4 border-round shadow-1 mb-4">
    <h3 class="m-0 text-xl font-bold text-900 mb-1">Movement History</h3>
    <p class="m-0 text-sm text-600 mb-4">Chronological record of batch movements, quantities and responsible operators.</p>

    <pv-data-table :value="movements" responsiveLayout="scroll" class="p-datatable-sm">
      <pv-column field="stageName" header="STAGE" class="font-bold text-900"></pv-column>
      <pv-column field="timestamp" header="DATE & TIME"></pv-column>
      <pv-column field="qtyIn" header="QTY IN"></pv-column>
      <pv-column field="qtyOut" header="QTY OUT"></pv-column>

      <!-- Difference Badge -->
      <pv-column header="DIFFERENCE">
        <template #body="slotProps">
          <span
              class="px-2 py-1 border-round font-bold text-xs"
              :class="slotProps.data.difference !== 0 ? 'bg-red-100 text-red-600' : 'text-700'"
          >
            {{ slotProps.data.difference > 0 ? `-${slotProps.data.difference}` : '0' }}
          </span>
        </template>
      </pv-column>

      <pv-column field="responsiblePerson" header="RESPONSIBLE"></pv-column>
      <pv-column field="status" header="STATUS">
        <template #body="slotProps">
          <span class="text-sm font-semibold text-600">{{ slotProps.data.status || 'Completed' }}</span>
        </template>
      </pv-column>
    </pv-data-table>
  </div>
</template>

<script>
export default {
  name: 'movement-history-table',
  props: {
    movements: {
      type: Array,
      default: () => [
        { id: 1, stageName: 'Cutting', timestamp: 'Sep 14, 2026 09:15', qtyIn: 500, qtyOut: 500, difference: 0, responsiblePerson: 'Carlos Mendoza', status: 'Completed' },
        { id: 2, stageName: 'Sewing', timestamp: 'Sep 15, 2026 14:20', qtyIn: 500, qtyOut: 492, difference: 8, responsiblePerson: 'Ana Torres', status: 'Completed' },
        { id: 3, stageName: 'Finishing', timestamp: 'Sep 16, 2026 10:30', qtyIn: 492, qtyOut: 487, difference: 5, responsiblePerson: 'Luis Ramos', status: 'Completed' },
        { id: 4, stageName: 'Quality Check', timestamp: 'Sep 17, 2026 15:10', qtyIn: 487, qtyOut: 487, difference: 0, responsiblePerson: 'Maria Lopez', status: 'Current' }
      ]
    }
  }
};
</script>