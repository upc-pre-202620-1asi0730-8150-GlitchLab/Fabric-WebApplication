<script setup>
import {useI18n} from "vue-i18n";
import {useRouter} from "vue-router";
import {computed, onMounted, onUnmounted, ref, watch} from "vue";
import {FAILURE_CATEGORIES} from "../../domain/model/failure-category.js";
import useMachineRegistrationStore from "../../application/machine.store.js";
import {MACHINE_TYPES} from "../../domain/model/machine-type.js";
import {MACHINE_STATUS, MACHINE_STATUS_SEVERITY} from "../../domain/model/machine-status.js";
import {useConfirm} from "primevue";

const {t} = useI18n();
const router = useRouter();
const store = useMachineRegistrationStore();
const confirm = useConfirm();

const now = ref(Date.now());
let timer;

onMounted(() => {
  if (!store.machinesLoaded) store.fetchMachines();
  timer = setInterval(() => { now.value = Date.now(); }, 1000);
});

onUnmounted(() => clearInterval(timer));

function downtimeLabel(machine) {
  if (machine.downtimeStartedAt) {
    const total = Math.max(0, Math.floor((now.value - new Date(machine.downtimeStartedAt).getTime()) / 1000));
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(Math.floor(total / 3600))}:${pad(Math.floor((total % 3600) / 60))}:${pad(total % 60)}`;
  }
  return machine.currentDowntime ?? '—';
}

function failureLabel(value) {
  if (!value) return '—';
  const match = FAILURE_CATEGORIES.find(f => f.value === value);
  return match ? t(match.labelKey) : value;
}

const menu = ref();
const selectedMachine = ref(null);

const menuItems = computed(() => [
  {
    label: t('machinery.actions.reportBreakdown'),
    icon: 'pi pi-exclamation-triangle',
    disabled: selectedMachine.value?.status !== MACHINE_STATUS.OPERATIONAL,
    command: () => router.push({
      name: 'machine-registration-machine-breakdown',
      params: {id: selectedMachine.value.id}
    })
  },
  {
    label: t('machinery.actions.details'),
    icon: 'pi pi-info-circle',
    command: () => router.push({
      name: 'machine-registration-machine-detail',
      params: {id: selectedMachine.value.id}
    })
  }
]);

const openMenu = (event, machine) => {
  selectedMachine.value = machine;
  menu.value.toggle(event);
};

const navigateToNew = () => {
  router.push({name: 'machine-registration-machine-new'});
};

const confirmDelete = (machine) => {
  confirm.require({
    message: t('machinery.confirmDelete', {id: machine.id}),
    header: t('machinery.deleteHeader'),
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: t('machinery.deleteAccept'),
    rejectLabel: t('machinery.deleteReject'),
    accept: () => {
      store.deleteMachine(machine);
    },
  });
};

function typeLabel(type) {
  const match = MACHINE_TYPES.find(mt => mt.value === type);
  return match ? t(match.labelKey) : type;
}

const search = ref('');
const statusFilter = ref(null);
const typeFilter = ref(null);
const first = ref(0);

const statusOptions = computed(() =>
    Object.values(MACHINE_STATUS).map(value => ({label: t(`machinery.status.${value}`), value}))
);

const typeOptions = computed(() =>
    MACHINE_TYPES.map(mt => ({label: t(mt.labelKey), value: mt.value}))
);

const filteredMachines = computed(() => {
  const term = search.value.trim().toLowerCase();
  return store.machines.filter(m =>
      (!term || String(m.id).toLowerCase().includes(term)) &&
      (!statusFilter.value || m.status === statusFilter.value) &&
      (!typeFilter.value || m.type === typeFilter.value)
  );
});

watch([search, statusFilter, typeFilter], () => { first.value = 0; });
</script>

<template>
  <div class="p-4">
    <h1>{{ t('machinery.title') }}</h1>
    <p>{{ t('machinery.subtitle') }}</p>

    <div class="stats-grid">
      <pv-card>
        <template #title>{{ t('machinery.stats.total') }}</template>
        <template #content><span class="stat-value">{{ store.totalMachines }}</span></template>
      </pv-card>
      <pv-card>
        <template #title>{{ t('machinery.stats.operational') }}</template>
        <template #content><span class="stat-value">{{ store.operationalCount }}</span></template>
      </pv-card>
      <pv-card>
        <template #title>{{ t('machinery.stats.inMaintenance') }}</template>
        <template #content><span class="stat-value">{{ store.inMaintenanceCount }}</span></template>
      </pv-card>
    </div>

    <div class="filters-bar">
      <pv-icon-field class="search-field">
        <pv-input-icon class="pi pi-search"/>
        <pv-input-text v-model="search" :placeholder="t('machinery.filters.searchPlaceholder')" class="w-full"/>
      </pv-icon-field>

      <pv-select v-model="statusFilter" :options="statusOptions" option-label="label" option-value="value"
                 :placeholder="t('machinery.filters.status')" show-clear class="filter-select"/>

      <pv-select v-model="typeFilter" :options="typeOptions" option-label="label" option-value="value"
                 :placeholder="t('machinery.filters.type')" show-clear class="filter-select"/>
    </div>

    <pv-data-table :loading="!store.machinesLoaded" :value="filteredMachines" v-model:first="first"
                   paginator :rows="5" data-key="id"
                   scrollable table-style="min-width: 50rem">
      <template #empty>{{ t('machinery.filters.noResults') }}</template>
      <pv-column field="id" :header="t('machinery.table.machine')" sortable/>
      <pv-column :header="t('machinery.table.type')">
        <template #body="{data}">{{ typeLabel(data.type) }}</template>
      </pv-column>
      <pv-column field="batchId" :header="t('machinery.table.currentBatch')"/>
      <pv-column :header="t('machinery.table.status')">
        <template #body="{data}">
          <pv-tag :severity="MACHINE_STATUS_SEVERITY[data.status]" :value="t(`machinery.status.${data.status}`)"/>
        </template>
      </pv-column>
      <pv-column field="currentDowntime" :header="t('machinery.table.currentDowntime')">
        <template #body="{data}">{{ downtimeLabel(data) }}</template>
      </pv-column>
      <pv-column field="lastFailure" :header="t('machinery.table.lastFailure')">
        <template #body="{data}">{{ failureLabel(data.lastFailure) }}</template>
      </pv-column>
      <pv-column :header="t('machinery.table.actions')">
        <template #body="{data}">
          <pv-button icon="pi pi-ellipsis-v" rounded text severity="secondary"
                     aria-haspopup="true" :aria-label="t('machinery.table.actions')"
                     @click="openMenu($event, data)"/>
          <pv-button icon="pi pi-trash" rounded severity="danger" text @click="confirmDelete(data)"/>
        </template>
      </pv-column>
    </pv-data-table>

    <pv-menu ref="menu" :model="menuItems" popup/>

    <pv-button :label="t('machinery.registerButton')" icon="pi pi-plus" class="mt-3 btn-brand-primary" @click="navigateToNew"/>

    <div v-if="store.errors.length" class="text-red-500 mt-3">
      {{ t('errors.occurred') }}: {{ store.errors.map(e => e.message).join(', ') }}
    </div>
  </div>
</template>

<style scoped>
</style>