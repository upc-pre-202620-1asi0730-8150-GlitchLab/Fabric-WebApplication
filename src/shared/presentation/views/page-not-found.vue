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
    <i class="pi pi-exclamation-triangle not-found__icon" aria-hidden="true"></i>
    <h1>{{ t('notFound.title') }}</h1>
    <p>{{ t('notFound.message', {path: route.fullPath}) }}</p>
    <pv-button :label="t('notFound.backButton')" icon="pi pi-home" @click="goToDashboard"/>
  </section>
</template>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
  margin: 0;
  box-sizing: border-box;
  color: #5c5c54;
  background: #fafaf7;
}

.not-found__icon {
  font-size: 2.5rem;
  color: #a85c32;
  margin-bottom: 1rem;
}

.not-found h1 {
  margin-bottom: 0.5rem;
}

.not-found p {
  margin-bottom: 1.5rem;
}
</style>