<script setup>
import {computed, onMounted, ref, watch} from "vue";
import {useI18n} from "vue-i18n";
import {useRoute, useRouter} from "vue-router";
import {useToast} from "primevue/usetoast";
import useMachineRegistrationStore from "../../application/machine.store.js";
import {MACHINE_TYPES} from "../../domain/model/machine-type.js";
import {FAILURE_CATEGORIES} from "../../domain/model/failure-category.js";

const {t} = useI18n();
const route = useRoute();
const router = useRouter();
const toast = useToast();
const store = useMachineRegistrationStore();

const machine = computed(() => store.getMachineById(route.params.id));

onMounted(() => {
  if (!store.machinesLoaded) store.fetchMachines();
});

// Si la máquina no existe o ya está en mantenimiento, no hay nada que reportar.
watch(() => store.machinesLoaded, (loaded) => {
  if (loaded && (!machine.value || machine.value.status === 'in-maintenance')) goBack();
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

/**
 * Converts "10:35 AM" or "14:35" into a Date for today. Returns null if invalid.
 */
function parseStopTime(value) {
  const match = value.trim().match(/^(\d{1,2}):([0-5]\d)\s*(AM|PM)?$/i);
  if (!match) return null;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const meridiem = match[3]?.toUpperCase();
  if (meridiem) {
    if (hours < 1 || hours > 12) return null;
    if (meridiem === 'PM' && hours !== 12) hours += 12;
    if (meridiem === 'AM' && hours === 12) hours = 0;
  } else if (hours > 23) {
    return null;
  }
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

// ---- Validaciones (devuelven la clave i18n del error, o null) ----
const categoryError = computed(() =>
    submitted.value && !form.value.category ? 'categoryRequired' : null
);

const stopTimeError = computed(() => {
  if (!submitted.value) return null;
  const value = form.value.stopTime.trim();
  if (!value) return 'stopTimeRequired';
  const date = parseStopTime(value);
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
      stoppedAt: parseStopTime(form.value.stopTime)
    });
    toast.add({
      severity: 'success',
      summary: t('machinery.breakdown.success.title'),
      detail: t('machinery.breakdown.success.detail', {code: machine.value.code}),
      life: 4000
    });
    goBack();
  } catch {
    // el error ya quedó guardado en store.errors y se muestra abajo
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <div v-if="machine" class="p-4">
    <div class="breakdown__header">
      <div>
        <h1>{{ t('machinery.breakdown.title') }}</h1>
        <p>{{ t('machinery.breakdown.subtitle') }}</p>
      </div>
      <router-link :to="{name: 'machine-registration-machines'}" class="breakdown__back">
        ← {{ t('machinery.breakdown.back') }}
      </router-link>
    </div>

    <section class="breakdown__card breakdown__card--info">
      <h2>{{ t('machinery.breakdown.info.title') }}</h2>
      <div class="breakdown__info-grid">
        <div>
          <span class="breakdown__info-label">{{ t('machinery.breakdown.info.code') }}</span>
          <span class="breakdown__info-value">{{ machine.code }}</span>
        </div>
        <div>
          <span class="breakdown__info-label">{{ t('machinery.breakdown.info.type') }}</span>
          <span class="breakdown__info-value">{{ typeLabel(machine.type) }}</span>
        </div>
        <div>
          <span class="breakdown__info-label">{{ t('machinery.breakdown.info.batch') }}</span>
          <span class="breakdown__info-value">{{ machine.batchId }}</span>
        </div>
        <div>
          <span class="breakdown__info-label">{{ t('machinery.breakdown.info.status') }}</span>
          <pv-tag :severity="machine.status === 'operational' ? 'success' : 'warning'"
                  :value="t(`machinery.status.${machine.status}`)"/>
        </div>
      </div>
    </section>

    <section class="breakdown__card">
      <h2>{{ t('machinery.breakdown.details.title') }}</h2>
      <p class="breakdown__subtitle">{{ t('machinery.breakdown.details.subtitle') }}</p>

      <form @submit.prevent="confirmStop" novalidate>
        <div class="breakdown__fields">
          <div>
            <label for="machine-code">{{ t('machinery.breakdown.fields.machineCode') }} *</label>
            <pv-input-text id="machine-code" :model-value="machine.code" readonly
                           class="w-full breakdown__readonly"/>
          </div>

          <div>
            <label for="category">{{ t('machinery.breakdown.fields.category') }} *</label>
            <pv-select id="category" v-model="form.category" :options="categoryOptions"
                       option-label="label" option-value="value"
                       :placeholder="t('machinery.breakdown.fields.categoryPlaceholder')"
                       :invalid="!!categoryError" class="w-full"/>
            <small v-if="categoryError" class="text-red-500 breakdown__msg">
              {{ t(`machinery.breakdown.errors.${categoryError}`) }}
            </small>
            <small v-else class="breakdown__hint">{{ categoriesHint }}</small>
          </div>

          <div>
            <label for="stop-time">{{ t('machinery.breakdown.fields.stopTime') }} *</label>
            <pv-input-text id="stop-time" v-model="form.stopTime"
                           :placeholder="t('machinery.breakdown.fields.stopTimePlaceholder')"
                           :invalid="!!stopTimeError" class="w-full"/>
            <small v-if="stopTimeError" class="text-red-500 breakdown__msg">
              {{ t(`machinery.breakdown.errors.${stopTimeError}`) }}
            </small>
          </div>
        </div>

        <div>
          <label for="description">{{ t('machinery.breakdown.fields.description') }}</label>
          <pv-textarea id="description" v-model="form.description" rows="4" class="w-full"
                       :placeholder="t('machinery.breakdown.fields.descriptionPlaceholder')"/>
        </div>

        <div class="breakdown__footer">
          <p class="breakdown__note">{{ t('machinery.breakdown.note') }}</p>
          <div class="breakdown__actions">
            <pv-button type="button" :label="t('machinery.breakdown.cancel')" severity="secondary" outlined
                       @click="goBack"/>
            <pv-button type="submit" :label="t('machinery.breakdown.confirm')" :loading="saving"
                       class="confirm-btn"/>
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
.breakdown__header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.breakdown__back {
  text-decoration: none;
  font-size: 0.9rem;
}


.breakdown__card {
  border-radius: 1rem;
  padding: 1.25rem 1.5rem;
  margin-bottom: 1.5rem;
}


.breakdown__card h2 {
  margin: 0 0 0.25rem;
  font-size: 1.1rem;
}

.breakdown__subtitle {
  margin: 0;
  font-size: 0.85rem;
}

.breakdown__info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
  gap: 1rem;
  margin-top: 0.75rem;
}

.breakdown__info-label {
  display: block;
  font-size: 0.75rem;
  margin-bottom: 0.2rem;
}

.breakdown__info-value {
  font-weight: 600;
}

.breakdown__fields {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
  gap: 1.25rem;
  margin: 1.25rem 0;
}

label {
  display: block;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 0.4rem;
}

.breakdown__hint,
.breakdown__msg {
  display: block;
  margin-top: 0.4rem;
  font-size: 0.75rem;
}

.breakdown__footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1.25rem;
}

.breakdown__note {
  flex: 1 1 18rem;
  margin: 0;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  font-size: 0.8rem;
}

.breakdown__actions {
  display: flex;
  gap: 0.75rem;
}

.confirm-btn {
  background: #43521f;
  border-color: #43521f;
  color: #ffffff;
}

.confirm-btn:enabled:hover {
  background: #36421a;
  border-color: #36421a;
  color: #ffffff;
}

@media (max-width: 576px) {
  .breakdown__actions {
    width: 100%;
  }

  .breakdown__actions > * {
    flex: 1;
  }
}
</style>