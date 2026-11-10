<script setup>
import {useI18n} from "vue-i18n";
import {useRoute, useRouter} from "vue-router";

const {t} = useI18n();
const route = useRoute();
const router = useRouter();

const goToDashboard = () => {
  router.push('/dashboard');
};
</script>

<template>
  <section class="not-found" role="alert">
    <i class="pi pi-exclamation-triangle not-found-icon" aria-hidden="true"></i>
    <h1>{{ t('notFound.title') }}</h1>
    <p>{{ t('notFound.message', {path: route.fullPath}) }}</p>
    <pv-button :label="t('notFound.backButton')" icon="pi pi-home" @click="goToDashboard"/>
  </section>
</template>
