<script setup>
import {computed, onMounted} from "vue";
import {useI18n} from "vue-i18n";
import {useRoute, useRouter} from "vue-router";
import useMachineRegistrationStore from "../../application/machine.store.js";
import {MACHINE_TYPES} from "../../domain/model/machine-type.js";
import {MACHINE_STATUS, MACHINE_STATUS_SEVERITY} from "../../domain/model/machine-status.js";
import MachineResumeForm from "../components/machine-resume-form.vue";

const {t} = useI18n();
const route = useRoute();
const router = useRouter();
const store = useMachineRegistrationStore();

const machine = computed(() => store.getMachineById(route.params.id));
const activeTab = computed(() => route.query.tab === 'history' ? 'history' : 'operation');

onMounted(() => {
  if (!store.machinesLoaded) store.fetchMachines();
  store.fetchStopEvents();
  store.fetchMaintenanceRecords();
});

const stopEvents = computed(() => machine.value ? store.getStopEventsForMachine(machine.value.id).value : []);
const maintenanceRecords = computed(() => machine.value ? store.getMaintenanceRecordsForMachine(machine.value.id).value : []);

const totalDowntimeMinutes = computed(() =>
    stopEvents.value.reduce((sum, e) => sum + (e.durationMinutes ?? 0), 0)
);

function typeLabel(type) {
  const match = MACHINE_TYPES.find(mt => mt.value === type);
  return match ? t(match.labelKey) : type;
}

function setTab(tab) {
  router.replace({query: {tab}});
}

function goToRegisterMaintenance() {
  router.push({name: 'machine-registration-machine-maintenance-new', params: {id: machine.value.id}});
}
</script>

<template>
  <div v-if="machine" class="p-4">
    <div class="page-header">
      <div>
        <h1>{{ t('machinery.detail.title') }}</h1>
        <p>{{ t('machinery.detail.subtitle') }}</p>
      </div>
      <router-link :to="{name: 'machine-registration-machines'}" class="page-back-link">
        ← {{ t('machinery.detail.back') }}
      </router-link>
    </div>

    <section class="card">
      <h2>{{ machine.id }} — {{ typeLabel(machine.type) }}</h2>
      <div class="info-grid">
        <div>
          <span class="info-label">{{ t('machinery.detail.info.status') }}</span>
          <pv-tag :severity="MACHINE_STATUS_SEVERITY[machine.status]" :value="t(`machinery.status.${machine.status}`)"/>
        </div>
        <div>
          <span class="info-label">{{ t('machinery.detail.info.batch') }}</span>
          <span class="info-value">{{ machine.batchId }}</span>
        </div>
        <div v-if="machine.downtimeStartedAt">
          <span class="info-label">{{ t('machinery.detail.info.stopStarted') }}</span>
          <span class="info-value">{{ new Date(machine.downtimeStartedAt).toLocaleTimeString() }}</span>
        </div>
        <div>
          <span class="info-label">{{ t('machinery.detail.info.currentDowntime') }}</span>
          <span class="info-value">{{ machine.currentDowntime ?? '—' }}</span>
        </div>
        <div>
          <span class="info-label">{{ t('machinery.detail.info.lastFailure') }}</span>
          <span class="info-value">{{ machine.lastFailure ?? '—' }}</span>
        </div>
      </div>
    </section>

    <div class="tabs-row">
      <pv-button :label="t('machinery.detail.tabs.operation')"
                 :outlined="activeTab !== 'operation'"
                 :class="{'btn-brand-primary': activeTab === 'operation'}"
                 @click="setTab('operation')"/>
      <pv-button :label="t('machinery.detail.tabs.history')"
                 :outlined="activeTab !== 'history'"
                 :class="{'btn-brand-primary': activeTab === 'history'}"
                 @click="setTab('history')"/>
    </div>

    <section v-if="activeTab === 'operation'" class="cards-grid">
      <div class="card">
        <h2>{{ t('machinery.detail.operation.title') }}</h2>
        <p class="section-subtitle">{{ t('machinery.detail.operation.subtitle') }}</p>

        <p v-if="machine.status === MACHINE_STATUS.OPERATIONAL" class="hint-text">
          {{ t('machinery.detail.operation.alreadyOperational') }}
        </p>
        <machine-resume-form v-else :machine="machine"/>
      </div>

      <div class="card">
        <h2>{{ t('machinery.detail.downtime.title') }}</h2>
        <p class="section-subtitle">{{ t('machinery.detail.downtime.subtitle') }}</p>
        <table class="data-table">
          <thead>
          <tr>
            <th>{{ t('machinery.detail.downtime.date') }}</th>
            <th>{{ t('machinery.detail.downtime.cause') }}</th>
            <th>{{ t('machinery.detail.downtime.stop') }}</th>
            <th>{{ t('machinery.detail.downtime.resume') }}</th>
            <th>{{ t('machinery.detail.downtime.time') }}</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="event in stopEvents" :key="event.id">
            <td>{{ new Date(event.stoppedAt).toLocaleDateString() }}</td>
            <td>{{ event.cause }}</td>
            <td>{{ new Date(event.stoppedAt).toLocaleTimeString() }}</td>
            <td>{{ event.resumedAt ? new Date(event.resumedAt).toLocaleTimeString() : '—' }}</td>
            <td>{{ event.durationMinutes ?? '—' }}</td>
          </tr>
          </tbody>
        </table>
        <p class="total-row">{{ t('machinery.detail.downtime.total') }}: {{ totalDowntimeMinutes }} min</p>
      </div>
    </section>

    <section v-else class="card">
      <div class="section-row">
        <div>
          <h2>{{ t('machinery.detail.history.title') }}</h2>
          <p class="section-subtitle">{{ t('machinery.detail.history.subtitle') }}</p>
        </div>
        <pv-button :label="t('machinery.detail.history.register')" icon="pi pi-plus"
                   class="btn-brand-primary" @click="goToRegisterMaintenance"/>
      </div>
      <table class="data-table">
        <thead>
        <tr>
          <th>{{ t('machinery.detail.history.date') }}</th>
          <th>{{ t('machinery.detail.history.type') }}</th>
          <th>{{ t('machinery.detail.history.intervention') }}</th>
          <th>{{ t('machinery.detail.history.parts') }}</th>
          <th>{{ t('machinery.detail.history.technician') }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="record in maintenanceRecords" :key="record.id">
          <td>{{ record.date }}</td>
          <td>{{ t(`machinery.maintenanceTypes.${record.maintenanceType}`) }}</td>
          <td>{{ record.interventionPerformed }}</td>
          <td>{{ record.partsReplaced || '—' }}</td>
          <td>{{ record.technician }}</td>
        </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<style scoped>
</style>