<script setup>
import {onMounted, ref} from "vue";
import {storeToRefs} from "pinia";
import {useI18n} from "vue-i18n";
import {useToast} from "primevue/usetoast";
import {useFabricInspectionStore} from "../../application/fabric-inspection.store.js";
import NewRollInspectionForm from "../components/new-roll-inspection-form.component.vue";

const {t} = useI18n();
const toast = useToast();
const store = useFabricInspectionStore();
const {suppliers, samples, saving} = storeToRefs(store);

const formRef = ref(null);

const notify = (severity, summaryKey, detailKey) => {
  toast.add({severity, summary: t(summaryKey), detail: t(detailKey), life: 4000});
};

onMounted(async () => {
  try {
    await store.loadCatalogs();
  } catch (error) {
    console.error('Error loading catalogs:', error);
    notify('error', 'qualityInspector.newInspection.messages.errorTitle', 'qualityInspector.newInspection.messages.loadCatalogsError');
  }
});

const save = async (data) => {
  try {
    await store.register(data);
    notify('success', 'qualityInspector.newInspection.messages.savedTitle', 'qualityInspector.newInspection.messages.saved');
    formRef.value?.reset();
  } catch (error) {
    console.error('Error saving inspection:', error);
    notify('error', 'qualityInspector.newInspection.messages.errorTitle', 'qualityInspector.newInspection.messages.saveError');
  }
};
</script>

<template>
  <section class="inspector-page">
    <header class="inspector-page-header">
      <h1>{{ t('qualityInspector.newInspection.title') }}</h1>
      <p>{{ t('qualityInspector.newInspection.subtitle') }}</p>
    </header>

    <new-roll-inspection-form
        ref="formRef"
        :suppliers="suppliers"
        :samples="samples"
        :saving="saving"
        @save="save"/>
  </section>
</template>
