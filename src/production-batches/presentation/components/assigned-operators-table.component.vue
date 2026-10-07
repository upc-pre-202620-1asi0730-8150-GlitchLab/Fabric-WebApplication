<!--
  @summary Presentation component displaying list of operators assigned to a batch.
  @author Diego Sebastian Reategui Galarcep (u20201F165)
-->
<template>
  <div class="surface-card p-4 border-round shadow-1">
    <h3 class="m-0 text-xl font-bold text-900 mb-1">Assigned Operators</h3>
    <p class="m-0 text-sm text-600 mb-4">Operators assigned to this batch, grouped by production stage.</p>

    <pv-data-table :value="operators" responsiveLayout="scroll" class="p-datatable-sm">
      <pv-column field="fullName" header="OPERATOR" class="font-bold text-900"></pv-column>
      <pv-column field="specialty" header="SPECIALTY"></pv-column>
      <pv-column field="assignedStage" header="STAGE"></pv-column>
      <pv-column field="assignmentDate" header="ASSIGNED AT"></pv-column>
    </pv-data-table>
  </div>
</template>

<script>
export default {
  name: 'assigned-operators-table',
  props: {
    operators: {
      type: Array,
      default: () => [
        { id: 1, fullName: 'Carlos Mendoza', specialty: 'Overlock', assignedStage: 'Sewing', assignmentDate: '16/09/2026 09:15' },
        { id: 2, fullName: 'Ana Torres', specialty: 'Straight Stitch', assignedStage: 'Sewing', assignmentDate: '16/09/2026 09:18' }
      ]
    }
  }
};
</script>