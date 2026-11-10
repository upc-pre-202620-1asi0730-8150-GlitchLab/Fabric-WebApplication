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
    <div class="role-selection-language">
      <language-switcher/>
    </div>

    <header class="role-selection-header">
      <span class="role-selection-logo" aria-hidden="true">
        <i class="pi pi-th-large"></i>
      </span>
      <h1>{{ t('identityAccess.roleSelection.title') }}</h1>
      <p>{{ t('identityAccess.roleSelection.subtitle') }}</p>
    </header>

    <div class="role-selection-cards">
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
          <div class="role-card-body">
            <i :class="option.icon" class="role-card-icon" aria-hidden="true"></i>
            <span class="role-card-label">{{ t(option.labelKey) }}</span>
          </div>
        </template>
      </pv-card>
    </div>
  </section>
</template>
