<script setup>
import {useI18n} from "vue-i18n";

/**
 * Presentation component for switching the application's active language.
 */
const {locale, availableLocales} = useI18n();
</script>

<template>
  <pv-select-button v-model="locale" :options="availableLocales" class="language-switcher">
    <template #option="slotProps">
      <span>{{ slotProps.option.toUpperCase() }}</span>
    </template>
  </pv-select-button>
</template>

<style scoped>
.language-switcher {
  align-self: flex-start;
}
</style>