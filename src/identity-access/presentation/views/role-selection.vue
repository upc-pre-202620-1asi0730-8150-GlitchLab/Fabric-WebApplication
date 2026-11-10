<script setup>
import {useI18n} from "vue-i18n";
import {useRouter} from "vue-router";
import LanguageSwitcher from "../../../shared/presentation/components/language-switcher.vue";
import {useSessionStore} from "../../application/session.store.js";
import {ROLE_OPTIONS} from "../role-options.js";

const {t} = useI18n();
const router = useRouter();
const session = useSessionStore();

const signInAs = (option) => {
  session.signIn(option.role);
  router.push({name: option.homeRouteName});
};
</script>

<template>
  <section class="role-selection">
    <div class="role-selection__language">
      <language-switcher/>
    </div>

    <header class="role-selection__header">
      <span class="role-selection__logo" aria-hidden="true">
        <i class="pi pi-th-large"></i>
      </span>
      <h1>{{ t('identityAccess.roleSelection.title') }}</h1>
      <p>{{ t('identityAccess.roleSelection.subtitle') }}</p>
    </header>

    <div class="role-selection__cards">
      <pv-card
          v-for="option in ROLE_OPTIONS"
          :key="option.role"
          class="role-card"
          role="button"
          tabindex="0"
          @click="signInAs(option)"
          @keydown.enter="signInAs(option)"
      >
        <template #content>
          <div class="role-card__body">
            <i :class="option.icon" class="role-card__icon" aria-hidden="true"></i>
            <span class="role-card__label">{{ t(option.labelKey) }}</span>
          </div>
        </template>
      </pv-card>
    </div>
  </section>
</template>

<style scoped>
.role-selection {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  padding: 2rem;
  box-sizing: border-box;
  background: #fafaf7;
}

.role-selection__language {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
}

.role-selection__header {
  text-align: center;
  color: #2b2b26;
}

.role-selection__header h1 {
  margin: 0.75rem 0 0.25rem;
}

.role-selection__header p {
  margin: 0;
  color: #5c5c54;
}

.role-selection__logo {
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  background: #43521f;
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
}

.role-selection__cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem;
}

.role-card {
  width: 18rem;
  cursor: pointer;
  border: 1px solid #e5e5e0;
  transition: border-color 0.15s, transform 0.15s;
}

.role-card:hover,
.role-card:focus-visible {
  border-color: #43521f;
  transform: translateY(-2px);
  outline: none;
}

.role-card__body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  text-align: center;
}

.role-card__icon {
  font-size: 2.5rem;
  color: #43521f;
}

.role-card__label {
  font-weight: 600;
  color: #2b2b26;
}
</style>
