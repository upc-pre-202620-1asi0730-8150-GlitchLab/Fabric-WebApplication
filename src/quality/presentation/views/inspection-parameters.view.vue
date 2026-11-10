<script setup>
import {onMounted, ref} from "vue";
import {storeToRefs} from "pinia";
import {useI18n} from "vue-i18n";
import {useToast} from "primevue/usetoast";
import {useInspectionParametersStore} from "../../application/inspection-parameters.store.js";
import InspectionParametersForm from "../components/inspection-parameters-form.component.vue";

const {t} = useI18n();
const toast = useToast();
const store = useInspectionParametersStore();
const {pendingRolls, saving} = storeToRefs(store);

const formRef = ref(null);

const notify = (severity, summaryKey, detailKey) => {
  toast.add({severity, summary: t(summaryKey), detail: t(detailKey), life: 4000});
};

onMounted(async () => {
  try {
    await store.loadInspections();
  } catch (error) {
    console.error('Error loading inspections:', error);
    notify('error', 'qualityInspector.parameters.messages.errorTitle', 'qualityInspector.parameters.messages.loadError');
  }
});

const save = async ({inspectionId, ...parameters}) => {
  try {
    await store.saveParameters(inspectionId, parameters);
    notify('success', 'qualityInspector.parameters.messages.savedTitle', 'qualityInspector.parameters.messages.saved');
    formRef.value?.reset();
  } catch (error) {
    console.error('Error saving parameters:', error);
    notify('error', 'qualityInspector.parameters.messages.errorTitle', 'qualityInspector.parameters.messages.saveError');
  }
};
</script>

<template>
  <section class="inspector-page">
    <header class="inspector-page-header">
      <h1>{{ t('qualityInspector.parameters.title') }}</h1>
      <p>{{ t('qualityInspector.parameters.subtitle') }}</p>
    </header>

    <inspection-parameters-form ref="formRef" :rolls="pendingRolls" :saving="saving" @save="save"/>
  </section>
</template>
