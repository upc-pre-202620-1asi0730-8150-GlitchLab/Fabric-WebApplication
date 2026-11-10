<script setup>

import {useI18n} from "vue-i18n";
import LanguageSwitcher from "./language-switcher.vue";

const { t } = useI18n();
const emit = defineEmits(['logout']);

defineProps({
  navItems: {type: Array, default: () => []}
});
</script>

<template>
  <div class="app-sidebar" aria-label="main-navigation">
    <div class="app-sidebar-brand">
      <span class="app-sidebar-logo-mark" aria-hidden="true">
        <i class="pi pi-th-large"></i>
      </span>
      <span class="app-sidebar-brand-name">{{ t('sidebar.companyName').toUpperCase() }}</span>
    </div>


  <nav class="app-sidebar-nav">
    <router-link
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="app-sidebar-link"
        active-class="app-sidebar-link-active"
    >
      <i :class="item.icon" aria-hidden="true"></i>
      <span>{{ t(item.labelKey) }}</span>
    </router-link>
  </nav>

  <div class="app-sidebar-footer">
    <language-switcher/>
    <div class="app-sidebar-profile">
      <span class="app-sidebar-avatar" aria-hidden="true">UN</span>
      <div class="app-sidebar-profile-text">
        <span class="app-sidebar-profile-name">User Name</span>
        <button type="button" class="app-sidebar-profile-link">{{ t('sidebar.viewProfile') }}</button>
      </div>
    </div>
    <button type="button" class="app-sidebar-logout" @click="emit('logout')">{{ t('sidebar.logOut') }}</button>
  </div>
  </div>
</template>
