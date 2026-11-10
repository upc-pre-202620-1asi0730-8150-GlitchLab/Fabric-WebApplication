<script setup>
import {useI18n} from "vue-i18n";
import {useRoute} from "vue-router";

const {t} = useI18n();
const route = useRoute();
</script>

<template>
  <section class="inspector-page">
    <header class="inspector-page-header">
      <h1>{{ t(route.meta.titleKey) }}</h1>
      <p>{{ t('qualityInspector.placeholder') }}</p>
    </header>
  </section>
</template>
