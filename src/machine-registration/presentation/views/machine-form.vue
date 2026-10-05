<script setup>
import {useI18n} from "vue-i18n";
import {useRouter} from "vue-router";
import {ref} from "vue";
import useMachineRegistrationStore from "../../application/machine.store.js";
import {Machine} from "../../domain/model/machine.entity.js";
import {MACHINE_TYPES} from "../../domain/model/machine-type.js";

const {t} = useI18n();
const router = useRouter();
const store = useMachineRegistrationStore();

const typeOptions = MACHINE_TYPES.map(mt => ({label: t(mt.labelKey), value: mt.value}));
// Placeholder batch list — replace with a real fetch once production-batches exposes its API.
const batchOptions = ['LOT-020', 'LOT-021', 'LOT-022', 'LOT-023', 'LOT-024', 'LOT-025'];

const form = ref({type: null, batchId: null});

const saveMachine = () => {
  const machine = new Machine({type: form.value.type, batchId: form.value.batchId});
  store.addMachine(machine);
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
                   class="w-full" required/>
      </div>
      <div class="field mb-3">
        <label for="batch">{{ t('machinery.form.batch') }}</label>
        <pv-select id="batch" v-model="form.batchId" :options="batchOptions" class="w-full" required/>
      </div>
      <pv-button :label="t('machinery.form.submit')" icon="pi pi-save" type="submit"/>
      <pv-button :label="t('machinery.form.cancel')" class="ml-2" severity="secondary" @click="navigateBack"/>
    </form>
    <div v-if="store.errors.length" class="text-red-500 mt-3">
      {{ t('errors.occurred') }}: {{ store.errors.map(e => e.message).join(', ') }}
    </div>
  </div>
</template>

<style scoped>
</style>