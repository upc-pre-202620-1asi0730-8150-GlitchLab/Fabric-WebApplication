<script setup>
import {onMounted, ref} from "vue";
import {storeToRefs} from "pinia";
import {useI18n} from "vue-i18n";
import {useToast} from "primevue/usetoast";
import {useShrinkageTestStore} from "../../application/shrinkage-test.store.js";
import {SHRINKAGE_RESULT} from "../../domain/model/shrinkage-test.js";
import ShrinkageTestForm from "../components/shrinkage-test-form.component.vue";

const {t} = useI18n();
const toast = useToast();
const store = useShrinkageTestStore();
const {pendingRolls, saving} = storeToRefs(store);

const formRef = ref(null);
const I18N = 'qualityInspector.shrinkageTest.messages';

const notify = (severity, summaryKey, detailKey) => {
  toast.add({severity, summary: t(summaryKey), detail: t(detailKey), life: 4000});
};

onMounted(async () => {
  try {
    await store.load();
  } catch (error) {
    console.error('Error loading shrinkage data:', error);
    notify('error', `${I18N}.errorTitle`, `${I18N}.loadError`);
  }
});

const save = async ({inspectionId, ...test}) => {
  try {
    const updated = await store.saveTest(inspectionId, test);
    const approved = updated.shrinkageTest === SHRINKAGE_RESULT.APPROVED;
    notify(approved ? 'success' : 'warn', `${I18N}.savedTitle`, approved ? `${I18N}.approved` : `${I18N}.nonCompliant`);
    formRef.value?.reset();
  } catch (error) {
    console.error('Error saving shrinkage test:', error);
    notify('error', `${I18N}.errorTitle`, `${I18N}.saveError`);
  }
};
</script>

<template>
  <section class="inspector-page">
    <header class="inspector-page-header">
      <h1>{{ t('qualityInspector.shrinkageTest.title') }}</h1>
      <p>{{ t('qualityInspector.shrinkageTest.subtitle') }}</p>
    </header>

    <shrinkage-test-form ref="formRef" :rolls="pendingRolls" :saving="saving" @save="save"/>
  </section>
</template>
