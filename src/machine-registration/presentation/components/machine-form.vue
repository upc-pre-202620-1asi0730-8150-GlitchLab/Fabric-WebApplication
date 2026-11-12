<script setup>
import {useI18n} from "vue-i18n";
import {useRouter} from "vue-router";
import {computed, onMounted, ref} from "vue";
import useMachineRegistrationStore from "../../application/machine.store.js";
import {Machine} from "../../domain/model/machine.entity.js";
import {MACHINE_TYPES} from "../../domain/model/machine-type.js";

const {t} = useI18n();
const router = useRouter();
const store = useMachineRegistrationStore();

onMounted(() => {
  if (!store.machinesLoaded) store.fetchMachines();
});

const typeOptions = MACHINE_TYPES.map(mt => ({label: t(mt.labelKey), value: mt.value}));

const form = ref({code: '', type: null, location: ''});

const submitted = ref(false);
const typeInvalid = computed(() => submitted.value && !form.value.type);
const codeInvalid = computed(() => submitted.value && !form.value.code.trim());
const locationInvalid = computed(() => submitted.value && !form.value.location.trim());

const saveMachine = async () => {
  submitted.value = true;
  if (!form.value.code.trim() || !form.value.type || !form.value.location.trim()) return;

  const machine = new Machine({
    code: form.value.code.trim(),
    type: form.value.type,
    location: form.value.location.trim(),
    acquiredDate: new Date().toISOString()
  });
  try {
    await store.addMachine(machine);
    navigateBack();
  } catch {
  }
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
        <label for="code">{{ t('machinery.form.code') }}</label>
        <pv-input-text id="code" v-model="form.code" maxlength="30" class="w-full" :invalid="codeInvalid"/>
        <small v-if="codeInvalid" class="text-red-500">{{ t('machinery.form.errors.codeRequired') }}</small>
      </div>
      <div class="field mb-3">
        <label for="type">{{ t('machinery.form.type') }}</label>
        <pv-select id="type" v-model="form.type" :options="typeOptions" option-label="label" option-value="value"
                   class="w-full" :invalid="typeInvalid"/>
        <small v-if="typeInvalid" class="text-red-500">{{ t('machinery.form.errors.typeRequired') }}</small>
      </div>
      <div class="field mb-3">
        <label for="location">{{ t('machinery.form.location') }}</label>
        <pv-input-text id="location" v-model="form.location" maxlength="100" class="w-full" :invalid="locationInvalid"/>
        <small v-if="locationInvalid" class="text-red-500">{{ t('machinery.form.errors.locationRequired') }}</small>
      </div>

      <p v-if="codeInvalid || typeInvalid || locationInvalid" class="text-red-500 mb-3">
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