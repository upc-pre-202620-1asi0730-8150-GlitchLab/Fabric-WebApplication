<script setup>
import {useI18n} from "vue-i18n";
import {useRouter} from "vue-router";
import {useSessionStore} from "../../application/session.store.js";

const {t} = useI18n();
const router = useRouter();
const session = useSessionStore();

const logOut = () => {
  session.signOut();
  router.push({name: 'role-selection'});
};
</script>

<template>
  <section class="inspector-home">
    <h1>{{ t('identityAccess.qualityInspectorHome.title') }}</h1>
    <p>{{ t('identityAccess.qualityInspectorHome.comingSoon') }}</p>
    <pv-button :label="t('sidebar.logOut')" icon="pi pi-sign-out" severity="secondary" @click="logOut"/>
  </section>
</template>
