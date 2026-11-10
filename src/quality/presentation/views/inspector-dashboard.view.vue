<script setup>
import {computed, onMounted} from "vue";
import {storeToRefs} from "pinia";
import {useI18n} from "vue-i18n";
import {useToast} from "primevue/usetoast";
import {useInspectorDashboardStore} from "../../application/inspector-dashboard.store.js";
import {CHART_COLORS} from "../inspector-chart-colors.js";
import InspectionChart from "../components/inspection-chart.component.vue";
import InspectionHistory from "../components/inspection-history.component.vue";

const {t} = useI18n();
const toast = useToast();
const store = useInspectorDashboardStore();
const {inspections, summary, suppliers} = storeToRefs(store);

const I18N = 'qualityInspector.dashboard';

onMounted(async () => {
  try {
    await store.load();
  } catch (error) {
    console.error('Error loading inspections:', error);
    toast.add({severity: 'error', summary: t(`${I18N}.messages.errorTitle`), detail: t(`${I18N}.messages.loadError`), life: 4000});
  }
});

const statCards = computed(() => [
  {key: 'total', icon: 'pi pi-box', value: summary.value.total},
  {key: 'conforming', icon: 'pi pi-check-circle', value: summary.value.conforming},
  {key: 'observed', icon: 'pi pi-exclamation-triangle', value: summary.value.observed},
  {key: 'pendingShrinkage', icon: 'pi pi-clock', value: summary.value.shrinkage.pending}
]);

const resultLabels = computed(() => [t(`${I18N}.status.conforming`), t(`${I18N}.status.observed`)]);
const resultDatasets = computed(() => [{
  data: [summary.value.conforming, summary.value.observed],
  backgroundColor: [CHART_COLORS.positive, CHART_COLORS.negative]
}]);

const supplierLabels = computed(() => summary.value.bySupplier.map((entry) => entry.supplier));
const supplierDatasets = computed(() => [
  {
    label: t(`${I18N}.status.conforming`),
    data: summary.value.bySupplier.map((entry) => entry.conforming),
    backgroundColor: CHART_COLORS.positive
  },
  {
    label: t(`${I18N}.status.observed`),
    data: summary.value.bySupplier.map((entry) => entry.observed),
    backgroundColor: CHART_COLORS.negative
  }
]);
const supplierOptions = {
  scales: {
    x: {stacked: true},
    y: {stacked: true, beginAtZero: true, ticks: {precision: 0}}
  }
};

const shrinkageLabels = computed(() => [
  t(`${I18N}.status.pending`),
  t(`${I18N}.status.approved`),
  t(`${I18N}.status.nonCompliant`)
]);
const shrinkageDatasets = computed(() => [{
  data: [summary.value.shrinkage.pending, summary.value.shrinkage.approved, summary.value.shrinkage.nonCompliant],
  backgroundColor: [CHART_COLORS.neutral, CHART_COLORS.positive, CHART_COLORS.negative]
}]);
</script>

<template>
  <section class="inspector-page inspector-page-wide">
    <header class="inspector-page-header">
      <h1>{{ t(`${I18N}.title`) }}</h1>
      <p>{{ t(`${I18N}.subtitle`) }}</p>
    </header>

    <div class="inspector-stat-grid">
      <article v-for="card in statCards" :key="card.key" class="inspector-stat-card">
        <span class="inspector-stat-icon"><i :class="card.icon" aria-hidden="true"></i></span>
        <div>
          <strong class="inspector-stat-value">{{ card.value }}</strong>
          <span class="inspector-stat-label">{{ t(`${I18N}.stats.${card.key}`) }}</span>
        </div>
      </article>
    </div>

    <p v-if="summary.total === 0" class="inspector-panel inspection-empty">{{ t(`${I18N}.emptyData`) }}</p>

    <div v-else class="inspector-chart-grid">
      <article class="inspector-panel">
        <h2 class="inspector-chart-title">{{ t(`${I18N}.charts.results`) }}</h2>
        <inspection-chart type="doughnut" :labels="resultLabels" :datasets="resultDatasets"/>
      </article>

      <article class="inspector-panel">
        <h2 class="inspector-chart-title">{{ t(`${I18N}.charts.suppliers`) }}</h2>
        <inspection-chart type="bar" :labels="supplierLabels" :datasets="supplierDatasets" :options="supplierOptions"/>
      </article>

      <article class="inspector-panel">
        <h2 class="inspector-chart-title">{{ t(`${I18N}.charts.shrinkage`) }}</h2>
        <inspection-chart type="doughnut" :labels="shrinkageLabels" :datasets="shrinkageDatasets"/>
      </article>
    </div>

    <inspection-history :inspections="inspections" :suppliers="suppliers"/>
  </section>
</template>
