<script setup>
import {computed, ref} from "vue";
import {useI18n} from "vue-i18n";
import {useToast} from "primevue/usetoast";
import useMachineRegistrationStore from "../../application/machine.store.js";
import {parseClockTime} from "../../domain/model/time.js";

const props = defineProps({
  machine: {type: Object, required: true}
});

const {t} = useI18n();
const toast = useToast();
const store = useMachineRegistrationStore();

const resumedAt = ref('');
const submitted = ref(false);
const saving = ref(false);

const resumedAtError = computed(() => {
  if (!submitted.value) return null;
  const value = resumedAt.value.trim();
  if (!value) return 'resumedAtRequired';
  const date = parseClockTime(value);
  if (!date) return 'resumedAtInvalid';
  if (date.getTime() > Date.now()) return 'resumedAtFuture';
  return null;
});

async function confirmResume() {
  submitted.value = true;
  if (resumedAtError.value) return;

  saving.value = true;
  try {
    await store.resumeOperation(props.machine, {resumedAt: parseClockTime(resumedAt.value)});
    toast.add({
      severity: 'success',
      summary: t('machinery.detail.resume.success.title'),
      detail: t('machinery.detail.resume.success.detail', {code: props.machine.id}),
      life: 4000
    });
    resumedAt.value = '';
    submitted.value = false;
  } catch {

  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <form @submit.prevent="confirmResume" novalidate>
    <div>
      <label for="resumed-at">{{ t('machinery.detail.resume.field') }} *</label>
      <pv-input-text id="resumed-at" v-model="resumedAt"
                     :placeholder="t('machinery.detail.resume.placeholder')"
                     :invalid="!!resumedAtError" class="w-full"/>
      <small v-if="resumedAtError" class="text-red-500">
        {{ t(`machinery.detail.resume.errors.${resumedAtError}`) }}
      </small>
    </div>
    <pv-button type="submit" :label="t('machinery.detail.resume.confirm')" :loading="saving"
               class="btn-brand-primary mt-3"/>
  </form>
</template>

<style/>