<script setup>
import {computed, ref} from "vue";
import {useI18n} from "vue-i18n";
import {filterInspections, sortByDateDescending} from "../../domain/model/inspection-summary.js";
import {
  RESULT_OPTIONS,
  RESULT_STATUS_DISPLAY,
  ROLL_STATUS_DISPLAY,
  SHRINKAGE_STATUS_DISPLAY
} from "../inspection-options.js";

const props = defineProps({
  inspections: {type: Array, default: () => []},
  suppliers: {type: Array, default: () => []}
});

const {t} = useI18n();
const I18N = 'qualityInspector.dashboard.history';

const filters = ref({supplier: null, result: null, rollId: ''});

const resultOptions = computed(() => RESULT_OPTIONS.map(({value, labelKey}) => ({value, label: t(labelKey)})));
const rows = computed(() => sortByDateDescending(filterInspections(props.inspections, filters.value)));

const display = (map, value) => {
  const entry = map[value];
  return {label: entry ? t(entry.labelKey) : value, tone: entry?.tone ?? 'pending'};
};
</script>

<template>
  <section class="inspector-panel">
    <header class="inspector-panel-header">
      <h2>{{ t(`${I18N}.title`) }}</h2>
      <p>{{ t(`${I18N}.subtitle`) }}</p>
    </header>

    <div class="inspection-filters">
      <div class="inspection-field">
        <label for="filter-supplier">{{ t(`${I18N}.filters.supplier`) }}</label>
        <pv-select input-id="filter-supplier" v-model="filters.supplier" :options="suppliers" show-clear
                   :placeholder="t(`${I18N}.placeholders.supplier`)"/>
      </div>

      <div class="inspection-field">
        <label for="filter-result">{{ t(`${I18N}.filters.result`) }}</label>
        <pv-select input-id="filter-result" v-model="filters.result" :options="resultOptions"
                   option-label="label" option-value="value" show-clear
                   :placeholder="t(`${I18N}.placeholders.result`)"/>
      </div>

      <div class="inspection-field">
        <label for="filter-roll">{{ t(`${I18N}.filters.roll`) }}</label>
        <pv-input-text id="filter-roll" v-model="filters.rollId" :placeholder="t(`${I18N}.placeholders.roll`)"/>
      </div>
    </div>

    <pv-data-table :value="rows" data-key="id" paginator :rows="5" scrollable>
      <pv-column field="inspectionDate" :header="t(`${I18N}.columns.date`)"/>
      <pv-column field="rollId" :header="t(`${I18N}.columns.roll`)"/>
      <pv-column field="supplier" :header="t(`${I18N}.columns.supplier`)"/>
      <pv-column field="sample" :header="t(`${I18N}.columns.sample`)"/>
      <pv-column :header="t(`${I18N}.columns.result`)">
        <template #body="{ data }">
          <span class="inspection-result-badge"
                :class="`inspection-result-badge-${display(RESULT_STATUS_DISPLAY, data.initialResult).tone}`">
            {{ display(RESULT_STATUS_DISPLAY, data.initialResult).label }}
          </span>
        </template>
      </pv-column>
      <pv-column :header="t(`${I18N}.columns.shrinkage`)">
        <template #body="{ data }">
          <span class="inspection-result-badge"
                :class="`inspection-result-badge-${display(SHRINKAGE_STATUS_DISPLAY, data.shrinkageTest).tone}`">
            {{ display(SHRINKAGE_STATUS_DISPLAY, data.shrinkageTest).label }}
          </span>
        </template>
      </pv-column>
      <pv-column :header="t(`${I18N}.columns.status`)">
        <template #body="{ data }">
          <span class="inspection-result-badge"
                :class="`inspection-result-badge-${display(ROLL_STATUS_DISPLAY, data.rollStatus).tone}`">
            {{ display(ROLL_STATUS_DISPLAY, data.rollStatus).label }}
          </span>
        </template>
      </pv-column>
      <pv-column field="observation" :header="t(`${I18N}.columns.observation`)"/>
      <template #empty>{{ t(`${I18N}.empty`) }}</template>
    </pv-data-table>
  </section>
</template>
