<script setup>

import {useI18n} from "vue-i18n";
import LanguageSwitcher from "./language-switcher.vue";

const { t } = useI18n();

const navItems = [
  {to: "/dashboard", icon: "pi pi-home", labelKey: "sidebar.dashboard"},
  {to: "/production-batches", icon: "pi pi-box", labelKey: "sidebar.productionBatches"},
  {to: "/quality", icon: "pi pi-verified", labelKey: "sidebar.quality"},
  {to: "/machinery", icon: "pi pi-cog", labelKey: "sidebar.machinery"},
  {to: "/alerts", icon: "pi pi-bell", labelKey: "sidebar.alerts"}
];
</script>

<template>
  <div class="sidebar" aria-label="main-navigation">
    <div class="sidebar__brand">
      <span class="sidebar__logo-mark" aria-hidden="true">
        <i class="pi pi-th-large"></i>
      </span>
      <span class="sidebar__brand-name">{{ t('sidebar.companyName').toUpperCase() }}</span>
    </div>


  <nav class="sidebar__nav">
    <router-link
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="sidebar__link"
        active-class="sidebar__link--active"
    >
      <i :class="item.icon" aria-hidden="true"></i>
      <span>{{ t(item.labelKey) }}</span>
    </router-link>
  </nav>

  <div class="sidebar__footer">
    <language-switcher/>
    <div class="sidebar__profile">
      <span class="sidebar__avatar" aria-hidden="true">UN</span>
      <div class="sidebar__profile-text">
        <span class="sidebar__profile-name">User Name</span>
        <button type="button" class="sidebar__profile-link">{{ t('sidebar.viewProfile') }}</button>
      </div>
    </div>
    <button type="button" class="sidebar__logout">{{ t('sidebar.logOut') }}</button>
  </div>
  </div>
</template>

<style scoped>
.sidebar {
  position: sticky;        /* nuevo */
  top: 0;                  /* nuevo */
  align-self: flex-start;  /* nuevo, imprescindible dentro de un flex */
  flex-shrink: 0;          /* nuevo */
  width: 16rem;
  height: 100vh;
  overflow-y: auto;        /* nuevo */
  display: flex;
  flex-direction: column;
  background: #f5f6fa;     /* antes #ffffff */
  border-right: 1px solid #e5e5e0;
  padding: 1.5rem 1rem;
  box-sizing: border-box;
}
.sidebar__brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0 0.5rem 1.5rem;
}

.sidebar__logo-mark {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.5rem;
  background: #43521f;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
}

.sidebar__brand-name {
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #2b2b26;
}

.sidebar__nav {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.sidebar__link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.65rem 0.75rem;
  border-radius: 0.5rem;
  color: #5c5c54;
  text-decoration: none;
  font-size: 0.925rem;
}

.sidebar__link:not(.sidebar__link--active):hover {
  background: #f3f2ec;
}

.sidebar__link--active {
  background: #43521f;
  color: #ffffff;
}

.sidebar__footer {
  border-top: 1px solid #e5e5e0;
  padding-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.sidebar__profile {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.sidebar__avatar {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  background: #eceadd;
  color: #43521f;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 600;
  flex-shrink: 0;
}

.sidebar__profile-text {
  display: flex;
  flex-direction: column;
}

.sidebar__profile-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #2b2b26;
}

.sidebar__profile-link,
.sidebar__logout {
  background: none;
  border: none;
  padding: 0;
  font-size: 0.8rem;
  color: #5c5c54;
  text-align: left;
  cursor: pointer;
}

.sidebar__logout {
  padding: 0.5rem 0.75rem;
}

.sidebar__logout:hover {
  color: #43521f;
}
</style>