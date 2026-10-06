<script setup>
import {computed, onMounted} from "vue";
import {useI18n} from "vue-i18n";
import {useRoute, useRouter} from "vue-router";
import useMachineRegistrationStore from "../../application/machine.store.js";
import {MACHINE_TYPES} from "../../domain/model/machine-type.js";
import {MACHINE_STATUS, MACHINE_STATUS_SEVERITY} from "../../domain/model/machine-status.js";

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

function goToBreakdown() {
  router.push({name: 'machine-registration-machine-breakdown', params: {id: machine.value.id}});
}

function goToRegisterMaintenance() {
  router.push({name: 'machine-registration-machine-maintenance-new', params: {id: machine.value.id}});
}
</script>

<template>
  <div v-if="machine" class="p-4">
    <div class="detail__header">
      <div>
        <h1>{{ t('machinery.detail.title') }}</h1>
        <p>{{ t('machinery.detail.subtitle') }}</p>
      </div>
      <router-link :to="{name: 'machine-registration-machines'}" class="detail__back">
        ← {{ t('machinery.detail.back') }}
      </router-link>
    </div>

    <section class="detail__card">
      <h2>{{ machine.id }} — {{ typeLabel(machine.type) }}</h2>
      <div class="detail__info-grid">
        <div>
          <span class="detail__info-label">{{ t('machinery.detail.info.status') }}</span>
          <pv-tag :severity="MACHINE_STATUS_SEVERITY[machine.status]" :value="t(`machinery.status.${machine.status}`)"/>
        </div>
        <div>
          <span class="detail__info-label">{{ t('machinery.detail.info.batch') }}</span>
          <span class="detail__info-value">{{ machine.batchId }}</span>
        </div>
        <div v-if="machine.downtimeStartedAt">
          <span class="detail__info-label">{{ t('machinery.detail.info.stopStarted') }}</span>
          <span class="detail__info-value">{{ new Date(machine.downtimeStartedAt).toLocaleTimeString() }}</span>
        </div>
        <div>
          <span class="detail__info-label">{{ t('machinery.detail.info.currentDowntime') }}</span>
          <span class="detail__info-value">{{ machine.currentDowntime ?? '—' }}</span>
        </div>
        <div>
          <span class="detail__info-label">{{ t('machinery.detail.info.lastFailure') }}</span>
          <span class="detail__info-value">{{ machine.lastFailure ?? '—' }}</span>
        </div>
      </div>
    </section>

    <div class="detail__tabs">
      <pv-button :label="t('machinery.detail.tabs.operation')"
                 :outlined="activeTab !== 'operation'"
                 :class="{'btn-brand-primary': activeTab === 'operation'}"
                 @click="setTab('operation')"/>
      <pv-button :label="t('machinery.detail.tabs.history')"
                 :outlined="activeTab !== 'history'"
                 :class="{'btn-brand-primary': activeTab === 'history'}"
                 @click="setTab('history')"/>
    </div>

    <section v-if="activeTab === 'operation'" class="detail__grid">
      <div class="detail__card">
        <h2>{{ t('machinery.detail.operation.title') }}</h2>
        <p class="detail__subtitle">{{ t('machinery.detail.operation.subtitle') }}</p>

        <template v-if="machine.status === MACHINE_STATUS.OPERATIONAL">
          <p class="detail__hint">{{ t('machinery.detail.operation.alreadyOperational') }}</p>
        </template>
        <template v-else>
          <machine-resume-form :machine="machine"/>
        </template>
      </div>

      <div class="detail__card">
        <h2>{{ t('machinery.detail.downtime.title') }}</h2>
        <p class="detail__subtitle">{{ t('machinery.detail.downtime.subtitle') }}</p>
        <table class="detail__table">
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
        <p class="detail__total">{{ t('machinery.detail.downtime.total') }}: {{ totalDowntimeMinutes }} min</p>
      </div>
    </section>

    <section v-else class="detail__card">
      <div class="detail__history-header">
        <div>
          <h2>{{ t('machinery.detail.history.title') }}</h2>
          <p class="detail__subtitle">{{ t('machinery.detail.history.subtitle') }}</p>
        </div>
        <pv-button :label="t('machinery.detail.history.register')" icon="pi pi-plus"
                   class="btn-brand-primary" @click="goToRegisterMaintenance"/>
      </div>
      <table class="detail__table">
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
.detail__header { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; margin-bottom: 1.5rem; }
.detail__back { text-decoration: none; font-size: 0.9rem; }
.detail__card { background: #ffffff; border: 1px solid #e5e5e0; border-radius: 1rem; padding: 1.25rem 1.5rem; margin-bottom: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
.detail__info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr)); gap: 1rem; margin-top: 0.75rem; }
.detail__info-label { display: block; font-size: 0.75rem; margin-bottom: 0.2rem; }
.detail__info-value { font-weight: 600; }
.detail__tabs { display: flex; gap: 0.75rem; margin-bottom: 1.5rem; }
.detail__grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr)); gap: 1.5rem; }
.detail__subtitle { font-size: 0.85rem; margin: 0 0 1rem; }
.detail__table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
.detail__table th { text-align: left; font-size: 0.75rem; text-transform: uppercase; padding: 0.5rem 0.25rem; border-bottom: 1px solid #e5e5e0; }
.detail__table td { padding: 0.6rem 0.25rem; border-bottom: 1px solid #f0efe9; }
.detail__total { text-align: right; font-weight: 700; margin-top: 0.75rem; }
.detail__history-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 1rem; }
.detail__hint { font-size: 0.9rem; }
</style>