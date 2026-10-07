<script setup>
import {computed, onMounted, ref, watch} from "vue";
import {useI18n} from "vue-i18n";
import {useRoute, useRouter} from "vue-router";
import {useToast} from "primevue/usetoast";
import useMachineRegistrationStore from "../../application/machine.store.js";
import {MAINTENANCE_TYPES} from "../../domain/model/maintenance-type.js";

const {t} = useI18n();
const route = useRoute();
const router = useRouter();
const toast = useToast();
const store = useMachineRegistrationStore();

const machine = computed(() => store.getMachineById(route.params.id));

onMounted(() => {
  if (!store.machinesLoaded) store.fetchMachines();
});

watch(() => store.machinesLoaded, (loaded) => {
  if (loaded && !machine.value) goBack();
}, {immediate: true});

const form = ref({
  date: new Date().toISOString().slice(0, 10),
  maintenanceType: null,
  interventionPerformed: '',
  partsReplaced: '',
  technician: ''
});
const submitted = ref(false);
const saving = ref(false);

const maintenanceTypeOptions = computed(() =>
    MAINTENANCE_TYPES.map(m => ({label: t(m.labelKey), value: m.value}))
);

const maintenanceTypeError = computed(() =>
    submitted.value && !form.value.maintenanceType ? 'maintenanceTypeRequired' : null
);
const interventionError = computed(() =>
    submitted.value && !form.value.interventionPerformed.trim() ? 'interventionRequired' : null
);
const technicianError = computed(() =>
    submitted.value && !form.value.technician.trim() ? 'technicianRequired' : null
);

const goBack = () => router.push({
  name: 'machine-registration-machine-detail',
  params: {id: route.params.id},
  query: {tab: 'history'}
});

async function confirmRegister() {
  submitted.value = true;
  if (maintenanceTypeError.value || interventionError.value || technicianError.value || !machine.value) return;

  saving.value = true;
  try {
    await store.registerMaintenance(machine.value.id, {
      date: form.value.date,
      maintenanceType: form.value.maintenanceType,
      interventionPerformed: form.value.interventionPerformed.trim(),
      partsReplaced: form.value.partsReplaced.trim(),
      technician: form.value.technician.trim()
    });
    toast.add({
      severity: 'success',
      summary: t('machinery.detail.maintenance.success.title'),
      detail: t('machinery.detail.maintenance.success.detail', {code: machine.value.id}),
      life: 4000
    });
    goBack();
  } catch {

  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <div v-if="machine" class="p-4">
    <div class="page-header">
      <div>
        <h1>{{ t('machinery.detail.maintenance.title') }}</h1>
        <p>{{ t('machinery.detail.maintenance.subtitle') }}</p>
      </div>
      <router-link :to="{name: 'machine-registration-machine-detail', params: {id: route.params.id}, query: {tab: 'history'}}">
        ← {{ t('machinery.detail.maintenance.back') }}
      </router-link>
    </div>

    <section class="card">
      <form @submit.prevent="confirmRegister" novalidate>
        <div class="fields-grid">
          <div>
            <label for="date">{{ t('machinery.detail.maintenance.fields.date') }} *</label>
            <pv-input-text id="date" v-model="form.date" type="date" class="w-full"/>
          </div>

          <div>
            <label for="maintenance-type">{{ t('machinery.detail.maintenance.fields.type') }} *</label>
            <pv-select id="maintenance-type" v-model="form.maintenanceType" :options="maintenanceTypeOptions"
                       option-label="label" option-value="value"
                       :placeholder="t('machinery.detail.maintenance.fields.typePlaceholder')"
                       :invalid="!!maintenanceTypeError" class="w-full"/>
            <small v-if="maintenanceTypeError" class="text-red-500">
              {{ t(`machinery.detail.maintenance.errors.${maintenanceTypeError}`) }}
            </small>
          </div>

          <div>
            <label for="technician">{{ t('machinery.detail.maintenance.fields.technician') }} *</label>
            <pv-input-text id="technician" v-model="form.technician"
                           :placeholder="t('machinery.detail.maintenance.fields.technicianPlaceholder')"
                           :invalid="!!technicianError" class="w-full"/>
            <small v-if="technicianError" class="text-red-500">
              {{ t(`machinery.detail.maintenance.errors.${technicianError}`) }}
            </small>
          </div>

          <div>
            <label for="parts">{{ t('machinery.detail.maintenance.fields.parts') }}</label>
            <pv-input-text id="parts" v-model="form.partsReplaced"
                           :placeholder="t('machinery.detail.maintenance.fields.partsPlaceholder')" class="w-full"/>
          </div>
        </div>

        <div>
          <label for="intervention">{{ t('machinery.detail.maintenance.fields.intervention') }} *</label>
          <pv-textarea id="intervention" v-model="form.interventionPerformed" rows="4" class="w-full"
                       :invalid="!!interventionError"
                       :placeholder="t('machinery.detail.maintenance.fields.interventionPlaceholder')"/>
          <small v-if="interventionError" class="text-red-500">
            {{ t(`machinery.detail.maintenance.errors.${interventionError}`) }}
          </small>
        </div>

        <div class="footer-row">
          <div class="actions-row">
            <pv-button type="button" :label="t('machinery.detail.maintenance.cancel')" severity="secondary" outlined
                       @click="goBack"/>
            <pv-button type="submit" :label="t('machinery.detail.maintenance.submit')" :loading="saving"
                       class="btn-brand-primary"/>
          </div>
        </div>
      </form>
    </section>

    <div v-if="store.errors.length" class="text-red-500 mt-3">
      {{ t('errors.occurred') }}: {{ store.errors.map(e => e.message).join(', ') }}
    </div>
  </div>
</template>

<style scoped>
</style>