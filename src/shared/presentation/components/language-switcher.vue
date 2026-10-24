<script setup>
import {useI18n} from "vue-i18n";

/**
 * Presentation component for switching the application's active language.
 */
const {locale, availableLocales} = useI18n();

const changeLocale = (selectedLocale) => {
  if (selectedLocale && availableLocales.includes(selectedLocale) && selectedLocale !== locale.value) {
    locale.value = selectedLocale;
  }
};
</script>

<template>
  <pv-select-button
      :model-value="locale"
      :options="availableLocales"
      :allow-empty="false"
      class="language-switcher"
      @update:model-value="changeLocale"
  >
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