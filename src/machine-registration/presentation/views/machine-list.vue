<script setup>
import {useI18n} from "vue-i18n";
import {useRouter} from "vue-router";
import {computed, onMounted, onUnmounted, ref, watch} from "vue";
import {FAILURE_CATEGORIES} from "../../domain/model/failure-category.js";
import useMachineRegistrationStore from "../../application/machine.store.js";
import {MACHINE_TYPES} from "../../domain/model/machine-type.js";
import {useConfirm} from "primevue";

const {t} = useI18n();
const router = useRouter();
const store = useMachineRegistrationStore();
const confirm = useConfirm();

// ---- Cronómetro de inactividad ----
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
  return match ? t(match.labelKey) : value;   // los datos viejos son texto plano
}

// ---- Menú de acciones (⋮) y detalles ----
const menu = ref();
const selectedMachine = ref(null);
const detailsVisible = ref(false);

const menuItems = computed(() => [
  {
    label: t('machinery.actions.reportBreakdown'),
    icon: 'pi pi-exclamation-triangle',
    disabled: selectedMachine.value?.status === 'in-maintenance',
    command: () => router.push({
      name: 'machine-registration-machine-breakdown',
      params: {id: selectedMachine.value.id}
    })
  },
  {
    label: t('machinery.actions.details'),
    icon: 'pi pi-info-circle',
    command: () => { detailsVisible.value = true; }
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
    message: t('machinery.confirmDelete', {code: machine.code}),
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

// ---- Filtros ----
const search = ref('');
const statusFilter = ref(null);
const typeFilter = ref(null);
const first = ref(0);

const statusOptions = computed(() => [
  {label: t('machinery.status.operational'), value: 'operational'},
  {label: t('machinery.status.in-maintenance'), value: 'in-maintenance'}
]);

const typeOptions = computed(() =>
    MACHINE_TYPES.map(mt => ({label: t(mt.labelKey), value: mt.value}))
);

const filteredMachines = computed(() => {
  const term = search.value.trim().toLowerCase();
  return store.machines.filter(m =>
      (!term || String(m.code).toLowerCase().includes(term)) &&
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

    <div class="machinery__filters">
      <pv-icon-field class="machinery__search">
        <pv-input-icon class="pi pi-search"/>
        <pv-input-text v-model="search" :placeholder="t('machinery.filters.searchPlaceholder')" class="w-full"/>
      </pv-icon-field>

      <pv-select v-model="statusFilter" :options="statusOptions" option-label="label" option-value="value"
                 :placeholder="t('machinery.filters.status')" show-clear class="machinery__select"/>

      <pv-select v-model="typeFilter" :options="typeOptions" option-label="label" option-value="value"
                 :placeholder="t('machinery.filters.type')" show-clear class="machinery__select"/>
    </div>

    <pv-data-table :loading="!store.machinesLoaded" :value="filteredMachines" v-model:first="first"
                   paginator :rows="5" data-key="id"
                   scrollable table-style="min-width: 50rem" class="machinery__table">
      <template #empty>{{ t('machinery.filters.noResults') }}</template>
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

    <pv-dialog v-model:visible="detailsVisible" modal :header="t('machinery.details.title')"
               :style="{width: '30rem'}" :breakpoints="{'576px': '92vw'}">
      <dl v-if="selectedMachine" class="machinery__details">
        <div>
          <dt>{{ t('machinery.table.machine') }}</dt>
          <dd>{{ selectedMachine.code }}</dd>
        </div>
        <div>
          <dt>{{ t('machinery.table.type') }}</dt>
          <dd>{{ typeLabel(selectedMachine.type) }}</dd>
        </div>
        <div>
          <dt>{{ t('machinery.table.currentBatch') }}</dt>
          <dd>{{ selectedMachine.batchId }}</dd>
        </div>
        <div>
          <dt>{{ t('machinery.table.status') }}</dt>
          <dd>
            <pv-tag :severity="selectedMachine.status === 'operational' ? 'success' : 'warning'"
                    :value="t(`machinery.status.${selectedMachine.status}`)"/>
          </dd>
        </div>
        <div>
          <dt>{{ t('machinery.table.currentDowntime') }}</dt>
          <dd>{{ downtimeLabel(selectedMachine) }}</dd>
        </div>
        <div>
          <dt>{{ t('machinery.table.lastFailure') }}</dt>
          <dd>{{ failureLabel(selectedMachine.lastFailure) }}</dd>
        </div>
        <div class="machinery__details-full">
          <dt>{{ t('machinery.details.description') }}</dt>
          <dd>{{ selectedMachine.failureDescription || '—' }}</dd>
        </div>
      </dl>
    </pv-dialog>

    <pv-button :label="t('machinery.registerButton')" icon="pi pi-plus" class="mt-3 register-btn" @click="navigateToNew"/>

    <div v-if="store.errors.length" class="text-red-500 mt-3">
      {{ t('errors.occurred') }}: {{ store.errors.map(e => e.message).join(', ') }}
    </div>
  </div>
</template>

<style scoped>

.machinery__details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin: 0;
}

.machinery__details dt {
  font-size: 0.75rem;
}

.machinery__details dd {
  margin: 0.2rem 0 0;
  font-weight: 600;
}

.machinery__details-full {
  grid-column: 1 / -1;
}

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

.register-btn {
  background: #43521f;
  border-color: #43521f;
  color: #ffffff;
}

.register-btn:enabled:hover {
  background: #36421a;
  border-color: #36421a;
  color: #ffffff;
}

.register-btn:enabled:active {
  background: #2c3615;
  border-color: #2c3615;
}

.machinery__filters {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.machinery__search {
  flex: 1 1 16rem;
  max-width: 24rem;
}

.machinery__select {
  flex: 0 1 12rem;
  min-width: 10rem;
}

.machinery__filters :deep(.p-inputtext),
.machinery__filters :deep(.p-select) {
  background: #ffffff;

  border-radius: 0.75rem;
}
</style>