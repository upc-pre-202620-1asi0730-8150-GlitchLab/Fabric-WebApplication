<script setup>
import {useI18n} from "vue-i18n";
import {useRouter} from "vue-router";
import {onMounted} from "vue";
import useMachineRegistrationStore from "../../application/machine.store.js";
import {MACHINE_TYPES} from "../../domain/model/machine-type.js";

const {t} = useI18n();
const router = useRouter();
const store = useMachineRegistrationStore();

onMounted(() => {
  if (!store.machinesLoaded) store.fetchMachines();
});

const navigateToNew = () => {
  router.push({name: 'machine-registration-machine-new'});
};

function typeLabel(type) {
  const match = MACHINE_TYPES.find(mt => mt.value === type);
  return match ? t(match.labelKey) : type;
}
</script>

<template>
  <div class="p-4">
    <h1>{{ t('machinery.title') }}</h1>
    <p>{{ t('machinery.subtitle') }}</p>

    <div class="machinery__stats">
      <pv-card>
        <template #title>{{ t('machinery.stats.total') }}</template>
        <template #content><span class="machinery__stat-value">{{ store.totalMachines }}</span></template>
      </pv-card>
      <pv-card>
        <template #title>{{ t('machinery.stats.operational') }}</template>
        <template #content><span class="machinery__stat-value">{{ store.operationalCount }}</span></template>
      </pv-card>
      <pv-card>
        <template #title>{{ t('machinery.stats.inMaintenance') }}</template>
        <template #content><span class="machinery__stat-value">{{ store.inMaintenanceCount }}</span></template>
      </pv-card>
    </div>

    <pv-data-table :loading="!store.machinesLoaded" :value="store.machines" paginator :rows="5" striped-rows>
      <pv-column field="code" :header="t('machinery.table.machine')" sortable/>
      <pv-column :header="t('machinery.table.type')">
        <template #body="{data}">{{ typeLabel(data.type) }}</template>
      </pv-column>
      <pv-column field="batchId" :header="t('machinery.table.currentBatch')"/>
      <pv-column :header="t('machinery.table.status')">
        <template #body="{data}">
          <pv-tag :severity="data.status === 'operational' ? 'success' : 'warning'"
                  :value="t(`machinery.status.${data.status}`)"/>
        </template>
      </pv-column>
      <pv-column field="currentDowntime" :header="t('machinery.table.currentDowntime')">
        <template #body="{data}">{{ data.currentDowntime ?? '—' }}</template>
      </pv-column>
      <pv-column field="lastFailure" :header="t('machinery.table.lastFailure')">
        <template #body="{data}">{{ data.lastFailure ?? '—' }}</template>
      </pv-column>
    </pv-data-table>

    <pv-button :label="t('machinery.registerButton')" icon="pi pi-plus" class="mt-3" @click="navigateToNew"/>

    <div v-if="store.errors.length" class="text-red-500 mt-3">
      {{ t('errors.occurred') }}: {{ store.errors.map(e => e.message).join(', ') }}
    </div>
  </div>
</template>

<style scoped>
.machinery__stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
  gap: 1rem;
  margin: 1.5rem 0;
}

.machinery__stat-value {
  font-size: 1.75rem;
  font-weight: 700;
}
</style>