<script setup>
import {useI18n} from "vue-i18n";
import {useRouter} from "vue-router";
import {computed, onMounted, ref} from "vue";
import useMachineRegistrationStore from "../../application/machine.store.js";
import {http} from "../../../shared/infrastructure/base-api.js";
import {Machine} from "../../domain/model/machine.entity.js";
import {MACHINE_TYPES} from "../../domain/model/machine-type.js";

const {t} = useI18n();
const router = useRouter();
const store = useMachineRegistrationStore();
const batchOptions = ref(['LOT-020', 'LOT-021', 'LOT-022', 'LOT-023', 'LOT-024', 'LOT-025']);

onMounted(async () => {
  if (!store.machinesLoaded) store.fetchMachines();
  try {
    const {data} = await http.get('/batches');
    const codes = [...new Set(data.map(b => b.batchNumber).filter(Boolean))];
    if (codes.length) batchOptions.value = codes;
  } catch (e) {
    console.error('Could not load batches, using defaults', e);
  }
});

const typeOptions = MACHINE_TYPES.map(mt => ({label: t(mt.labelKey), value: mt.value}));

const form = ref({type: null, batchId: null});

const submitted = ref(false);
const typeInvalid = computed(() => submitted.value && !form.value.type);
const batchInvalid = computed(() => submitted.value && !form.value.batchId);

const saveMachine = async () => {
  submitted.value = true;
  if (!form.value.type || !form.value.batchId) return;

  const machine = new Machine({type: form.value.type, batchId: form.value.batchId});
  await store.addMachine(machine);
  navigateBack();
};

const navigateBack = () => {
  router.push({name: 'machine-registration-machines'});
};
</script>

<template>
  <div class="p-4">
    <h1>{{ t('machinery.form.title') }}</h1>
    <form @submit.prevent="saveMachine">
      <div class="field mb-3">
        <label for="type">{{ t('machinery.form.type') }}</label>
        <pv-select id="type" v-model="form.type" :options="typeOptions" option-label="label" option-value="value"
                   class="w-full" :invalid="typeInvalid"/>
        <small v-if="typeInvalid" class="text-red-500">{{ t('machinery.form.errors.typeRequired') }}</small>
      </div>
      <div class="field mb-3">
        <label for="batch">{{ t('machinery.form.batch') }}</label>
        <pv-select id="batch" v-model="form.batchId" :options="batchOptions" class="w-full"
                   :invalid="batchInvalid"/>
        <small v-if="batchInvalid" class="text-red-500">{{ t('machinery.form.errors.batchRequired') }}</small>
      </div>

      <p v-if="typeInvalid || batchInvalid" class="text-red-500 mb-3">
        {{ t('machinery.form.errors.summary') }}
      </p>

      <pv-button :label="t('machinery.form.submit')" icon="pi pi-save" type="submit" class="btn-brand-primary"/>
      <pv-button :label="t('machinery.form.cancel')" class="ml-2" severity="secondary" @click="navigateBack"/>
    </form>
    <div v-if="store.errors.length" class="text-red-500 mt-3">
      {{ t('errors.occurred') }}: {{ store.errors.map(e => e.message).join(', ') }}
    </div>
  </div>
</template>

<style scoped>
</style>