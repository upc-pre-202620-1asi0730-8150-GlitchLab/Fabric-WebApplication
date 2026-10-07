<script setup>
import {computed, onMounted, ref, watch} from "vue";
import {useI18n} from "vue-i18n";
import {useRoute, useRouter} from "vue-router";
import {useToast} from "primevue/usetoast";
import useMachineRegistrationStore from "../../application/machine.store.js";
import {MACHINE_TYPES} from "../../domain/model/machine-type.js";
import {FAILURE_CATEGORIES} from "../../domain/model/failure-category.js";
import {MACHINE_STATUS_SEVERITY} from "../../domain/model/machine-status.js";
import {parseClockTime} from "../../domain/model/time.js";

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
  if (loaded && (!machine.value || machine.value.status !== 'operational')) goBack();
}, {immediate: true});

const form = ref({category: null, stopTime: '', description: ''});
const submitted = ref(false);
const saving = ref(false);

const categoryOptions = computed(() =>
    FAILURE_CATEGORIES.map(c => ({label: t(c.labelKey), value: c.value}))
);
const categoriesHint = computed(() => categoryOptions.value.map(o => o.label).join(' · '));

function typeLabel(type) {
  const match = MACHINE_TYPES.find(mt => mt.value === type);
  return match ? t(match.labelKey) : type;
}

const categoryError = computed(() =>
    submitted.value && !form.value.category ? 'categoryRequired' : null
);

const stopTimeError = computed(() => {
  if (!submitted.value) return null;
  const value = form.value.stopTime.trim();
  if (!value) return 'stopTimeRequired';
  const date = parseClockTime(value);
  if (!date) return 'stopTimeInvalid';
  if (date.getTime() > Date.now()) return 'stopTimeFuture';
  return null;
});

const goBack = () => router.push({name: 'machine-registration-machines'});

async function confirmStop() {
  submitted.value = true;
  if (categoryError.value || stopTimeError.value || !machine.value) return;

  saving.value = true;
  try {
    await store.reportBreakdown(machine.value, {
      category: form.value.category,
      description: form.value.description.trim(),
      stoppedAt: parseClockTime(form.value.stopTime)
    });
    toast.add({
      severity: 'success',
      summary: t('machinery.breakdown.success.title'),
      detail: t('machinery.breakdown.success.detail', {code: machine.value.id}),
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
        <h1>{{ t('machinery.breakdown.title') }}</h1>
        <p>{{ t('machinery.breakdown.subtitle') }}</p>
      </div>
      <router-link :to="{name: 'machine-registration-machines'}" class="page-back-link">
        ← {{ t('machinery.breakdown.back') }}
      </router-link>
    </div>

    <section class="card card-muted">
      <h2>{{ t('machinery.breakdown.info.title') }}</h2>
      <div class="info-grid">
        <div>
          <span class="info-label">{{ t('machinery.breakdown.info.code') }}</span>
          <span class="info-value">{{ machine.id }}</span>
        </div>
        <div>
          <span class="info-label">{{ t('machinery.breakdown.info.type') }}</span>
          <span class="info-value">{{ typeLabel(machine.type) }}</span>
        </div>
        <div>
          <span class="info-label">{{ t('machinery.breakdown.info.batch') }}</span>
          <span class="info-value">{{ machine.batchId }}</span>
        </div>
        <div>
          <span class="info-label">{{ t('machinery.breakdown.info.status') }}</span>
          <pv-tag :severity="MACHINE_STATUS_SEVERITY[machine.status]"
                  :value="t(`machinery.status.${machine.status}`)"/>
        </div>
      </div>
    </section>

    <section class="card">
      <h2>{{ t('machinery.breakdown.details.title') }}</h2>
      <p class="section-subtitle">{{ t('machinery.breakdown.details.subtitle') }}</p>

      <form @submit.prevent="confirmStop" novalidate>
        <div class="fields-grid">
          <div>
            <label for="machine-code">{{ t('machinery.breakdown.fields.machineCode') }} *</label>
            <pv-input-text id="machine-code" :model-value="machine.id" readonly class="w-full"/>
          </div>

          <div>
            <label for="category">{{ t('machinery.breakdown.fields.category') }} *</label>
            <pv-select id="category" v-model="form.category" :options="categoryOptions"
                       option-label="label" option-value="value"
                       :placeholder="t('machinery.breakdown.fields.categoryPlaceholder')"
                       :invalid="!!categoryError" class="w-full"/>
            <small v-if="categoryError" class="text-red-500 field-msg">
              {{ t(`machinery.breakdown.errors.${categoryError}`) }}
            </small>
            <small v-else class="hint-text">{{ categoriesHint }}</small>
          </div>

          <div>
            <label for="stop-time">{{ t('machinery.breakdown.fields.stopTime') }} *</label>
            <pv-input-text id="stop-time" v-model="form.stopTime"
                           :placeholder="t('machinery.breakdown.fields.stopTimePlaceholder')"
                           :invalid="!!stopTimeError" class="w-full"/>
            <small v-if="stopTimeError" class="text-red-500 field-msg">
              {{ t(`machinery.breakdown.errors.${stopTimeError}`) }}
            </small>
          </div>
        </div>

        <div>
          <label for="description">{{ t('machinery.breakdown.fields.description') }}</label>
          <pv-textarea id="description" v-model="form.description" rows="4" class="w-full"
                       :placeholder="t('machinery.breakdown.fields.descriptionPlaceholder')"/>
        </div>

        <div class="footer-row">
          <p class="note-box">{{ t('machinery.breakdown.note') }}</p>
          <div class="actions-row">
            <pv-button type="button" :label="t('machinery.breakdown.cancel')" severity="secondary" outlined
                       @click="goBack"/>
            <pv-button type="submit" :label="t('machinery.breakdown.confirm')" :loading="saving"
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