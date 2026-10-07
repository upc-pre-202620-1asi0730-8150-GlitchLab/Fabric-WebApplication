<!--
  @summary Presentation component displaying quantity discrepancy alerts and traceability summary.
  @author Diego Sebastian Reategui Galarcep (u20201F165)
-->
<template>
  <div>
    <!-- Warning Banner -->
    <div class="bg-red-50 border-1 border-red-200 border-round p-4 mb-4">
      <h4 class="m-0 text-red-700 font-bold mb-1">Quantity difference detected</h4>
      <p class="m-0 text-red-600 text-sm">
        A difference of 8 pieces was recorded during Sewing on Sep 15, 2026. Responsible: Ana Torres.
      </p>
    </div>

    <!-- Summary Box -->
    <div class="surface-card p-4 border-round shadow-1 flex flex-column md:flex-row align-items-center justify-content-between gap-3 text-sm">
      <div class="font-bold text-900 text-base">Traceability Summary</div>
      <div class="text-600">Projected: <span class="font-semibold text-900">500 pieces</span></div>
      <div class="text-600">Current: <span class="font-semibold text-900">487 pieces</span></div>
      <div class="text-red-600 font-bold">Total Difference: -13 pieces</div>
      <div class="text-600">Current Stage: <span class="font-semibold text-900">Quality Check</span></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'traceability-summary-card'
};
</script>